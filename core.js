(function (root, factory) {
  const core = factory();
  if (typeof module === 'object' && module.exports) module.exports = core;
  else root.RiverBingoCore = core;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const VERSION = 2;
  const STORAGE_KEY = 'aarc-river-bingo:v2';
  const LEGACY_KEY = 'aarc-river-bingo:v1';
  const MAX_BACKUP_BYTES = 2 * 1024 * 1024;
  const LEGACY_IDS = Object.freeze(['canada-goose', 'mallard', 'wood-duck', 'mute-swan', 'great-blue-heron', 'green-heron', 'great-egret', 'belted-kingfisher', 'osprey', 'bald-eagle', 'red-tailed-hawk', 'turkey-vulture', 'baltimore-oriole', 'tree-swallow', 'chimney-swift', 'red-winged-blackbird', 'american-beaver', 'muskrat', 'white-tailed-deer', 'raccoon', 'common-map-turtle', 'painted-turtle', 'spiny-softshell-turtle', 'smallmouth-bass', 'jumping-fish']);
  const SIZE = 5;
  const has = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const safeId = value => typeof value === 'string' && /^[a-z0-9-]{1,100}$/i.test(value);
  const lines = [];
  for (let row = 0; row < SIZE; row++) lines.push(Object.freeze({ id: `row-${row + 1}`, label: `Row ${row + 1}`, cells: Object.freeze(Array.from({ length: SIZE }, (_, col) => row * SIZE + col)) }));
  for (let col = 0; col < SIZE; col++) lines.push(Object.freeze({ id: `column-${col + 1}`, label: `Column ${col + 1}`, cells: Object.freeze(Array.from({ length: SIZE }, (_, row) => row * SIZE + col)) }));
  lines.push(Object.freeze({ id: 'diagonal-down', label: 'Downward diagonal', cells: Object.freeze([0, 6, 12, 18, 24]) }));
  lines.push(Object.freeze({ id: 'diagonal-up', label: 'Upward diagonal', cells: Object.freeze([4, 8, 12, 16, 20]) }));
  Object.freeze(lines);

  function isTimestamp(value) {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
  }
  function validIds(ids, minimum = 25) {
    return Array.isArray(ids) && ids.length >= minimum && new Set(ids).size === ids.length && ids.every(id => typeof id === 'string' && /^[a-z][a-z0-9-]*$/.test(id));
  }
  function validOrder(order, ids) {
    return validIds(order) && order.length === 25 && order.every(id => ids.includes(id));
  }
  function uniqueId(prefix) {
    const suffix = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
    return `${prefix}-${suffix}`;
  }
  function shuffle(values, random = Math.random) {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const sample = random();
      if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new RangeError('Random samples must be in [0, 1).');
      const j = Math.floor(sample * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function createState(drawIds, { random = Math.random, now = new Date().toISOString(), id = uniqueId('argo'), journal = [], revision = 0 } = {}) {
    if (!validIds(drawIds)) throw new TypeError('A draw pool needs at least 25 distinct animal IDs.');
    if (!isTimestamp(now) || !safeId(id)) throw new TypeError('Invalid card date or ID.');
    return { version: VERSION, id, createdAt: now, pool: 'daylight-v2', revision, order: shuffle(drawIds, random).slice(0, 25), journal: journal.map(record => ({ ...record })) };
  }
  function sightings(state) {
    return Object.fromEntries(state.journal.filter(record => record.roundId === state.id && state.order.includes(record.animalId)).map(record => [record.animalId, record.observedAt]));
  }
  function restoreState(serialized, ids, drawIds = ids) {
    if (!validIds(ids) || !validIds(drawIds)) throw new TypeError('Invalid animal catalog or draw pool.');
    try {
      if (typeof serialized !== 'string' || serialized.length > MAX_BACKUP_BYTES - 1024) return null;
      const value = JSON.parse(serialized);
      if (!value || value.version !== VERSION || !safeId(value.id) || !isTimestamp(value.createdAt) || !Number.isSafeInteger(value.revision) || value.revision < 0) return null;
      if (!['daylight-v2', 'legacy-v1'].includes(value.pool)) return null;
      const allowed = value.pool === 'legacy-v1' ? LEGACY_IDS : drawIds;
      if (!validOrder(value.order, allowed) || !value.order.every(id => ids.includes(id))) return null;
      if (!Array.isArray(value.journal) || value.journal.length > 10000) return null;
      const recordIds = new Set(), pairs = new Set(), journal = [];
      for (const record of value.journal) {
        if (!record || !safeId(record.id) || !safeId(record.roundId) || !ids.includes(record.animalId) || !isTimestamp(record.observedAt)) return null;
        const pair = `${record.roundId}/${record.animalId}`;
        if (recordIds.has(record.id) || pairs.has(pair)) return null;
        recordIds.add(record.id); pairs.add(pair);
        journal.push({ id: record.id, roundId: record.roundId, animalId: record.animalId, observedAt: record.observedAt });
      }
      return { version: VERSION, id: value.id, createdAt: value.createdAt, pool: value.pool, revision: value.revision, order: [...value.order], journal };
    } catch (_) { return null; }
  }
  function migrateLegacy(serialized) {
    try {
      if (typeof serialized !== 'string' || serialized.length > MAX_BACKUP_BYTES) return null;
      const value = JSON.parse(serialized);
      if (!value || value.version !== 1 || !safeId(value.id) || !isTimestamp(value.createdAt) || !validOrder(value.order, LEGACY_IDS)) return null;
      if (!value.sightings || typeof value.sightings !== 'object' || Array.isArray(value.sightings)) return null;
      const journal = [];
      for (const id of LEGACY_IDS) {
        if (!has(value.sightings, id)) continue;
        if (!isTimestamp(value.sightings[id])) return null;
        journal.push({ id: `legacy-${id}`, roundId: value.id, animalId: id, observedAt: value.sightings[id] });
      }
      return { version: VERSION, id: value.id, createdAt: value.createdAt, pool: 'legacy-v1', revision: 0, order: [...value.order], journal };
    } catch (_) { return null; }
  }
  function recordSightings(state, observations, ids) {
    if (!Array.isArray(observations) || !observations.length || new Set(observations.map(record => record.animalId)).size !== observations.length) throw new TypeError('Choose distinct sightings.');
    const journal = state.journal.map(record => ({ ...record }));
    for (const observation of observations) {
      if (!ids.includes(observation.animalId)) throw new RangeError('Unknown animal.');
      if (!isTimestamp(observation.observedAt)) throw new TypeError('Invalid sighting date.');
      const record = journal.find(item => item.roundId === state.id && item.animalId === observation.animalId);
      if (record) throw new RangeError('This animal already has a sighting this round. Open that record to correct it.');
      journal.push({ id: uniqueId('sighting'), roundId: state.id, animalId: observation.animalId, observedAt: observation.observedAt });
    }
    if (journal.length > 10000) throw new RangeError('The journal is full. Save a backup, then remove older records before adding more.');
    return { ...state, revision: state.revision + 1, journal };
  }
  function updateSighting(state, recordId, timestamp) {
    if (!state.journal.some(record => record.id === recordId)) throw new RangeError('Unknown sighting.');
    if (timestamp !== null && !isTimestamp(timestamp)) throw new TypeError('Invalid sighting date.');
    const journal = timestamp === null ? state.journal.filter(record => record.id !== recordId) : state.journal.map(record => record.id === recordId ? { ...record, observedAt: timestamp } : { ...record });
    return { ...state, revision: state.revision + 1, journal };
  }
  function winningLines(state) {
    const marks = sightings(state);
    return lines.filter(line => line.cells.every(index => has(marks, state.order[index])));
  }
  function newWinningLines(previous, current) {
    const before = new Set(previous.id === current.id ? winningLines(previous).map(line => line.id) : []);
    return winningLines(current).filter(line => !before.has(line.id));
  }
  function closestLine(state) {
    const marks = sightings(state);
    return lines.map(line => ({ ...line, remaining: line.cells.filter(index => !has(marks, state.order[index])).length })).sort((a, b) => a.remaining - b.remaining)[0];
  }
  function exportBackup(state, now = new Date().toISOString()) {
    if (!isTimestamp(now)) throw new TypeError('Invalid backup date.');
    return JSON.stringify({ format: 'aarc-river-bingo', version: VERSION, exportedAt: now, state });
  }
  function readBackup(serialized, ids, drawIds = ids) {
    try {
      if (typeof serialized !== 'string' || serialized.length > MAX_BACKUP_BYTES) return null;
      const backup = JSON.parse(serialized);
      if (!backup || backup.format !== 'aarc-river-bingo' || backup.version !== VERSION || !isTimestamp(backup.exportedAt)) return null;
      const state = restoreState(JSON.stringify(backup.state), ids, drawIds);
      return state ? { exportedAt: backup.exportedAt, state } : null;
    } catch (_) { return null; }
  }
  function cardCode(state) {
    return `AARC2:${state.pool}:${state.order.join(',')}`;
  }
  function readCardCode(code, ids, drawIds = ids) {
    if (typeof code !== 'string' || code.length > 2000) return null;
    const [format, pool, raw, extra] = code.trim().split(':');
    if (format !== 'AARC2' || !['daylight-v2', 'legacy-v1'].includes(pool) || extra !== undefined || !raw) return null;
    const order = raw.split(',');
    return validOrder(order, pool === 'legacy-v1' ? LEGACY_IDS : drawIds) && order.every(id => ids.includes(id)) ? { pool, order } : null;
  }
  return Object.freeze({ VERSION, STORAGE_KEY, LEGACY_KEY, LEGACY_IDS, MAX_BACKUP_BYTES, SIZE, lines, isTimestamp, shuffle, createState, restoreState, migrateLegacy, sightings, recordSightings, updateSighting, winningLines, newWinningLines, closestLine, exportBackup, readBackup, cardCode, readCardCode });
});
