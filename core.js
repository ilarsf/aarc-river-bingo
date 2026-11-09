(function (root, factory) {
  const core = factory();
  if (typeof module === 'object' && module.exports) module.exports = core;
  else root.RiverBingoCore = core;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const VERSION = 3;
  const STORAGE_KEY = 'aarc-river-bingo:v3';
  const PREVIOUS_KEY = 'aarc-river-bingo:v2';
  const LEGACY_KEY = 'aarc-river-bingo:v1';
  const MAX_STATE_BYTES = 2 * 1024 * 1024;
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
  function validCard(value, ids, cardIds) {
    const allowed = value.pool === 'legacy-v1' ? LEGACY_IDS : value.pool === 'daylight-v2' ? cardIds : null;
    return safeId(value.id) && allowed && validOrder(value.order, allowed) && value.order.every(id => ids.includes(id));
  }
  function validRevision(revision) {
    return Number.isSafeInteger(revision) && revision >= 0;
  }
  function uniqueId(prefix) {
    const suffix = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Math.random().toString(36).slice(2, 12)}-${Math.random().toString(36).slice(2, 12)}`;
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
  function createState(drawIds, { random = Math.random, id = uniqueId('argo'), revision = 0 } = {}) {
    if (!validIds(drawIds)) throw new TypeError('A draw pool needs at least 25 distinct animal IDs.');
    if (!safeId(id) || !validRevision(revision)) throw new TypeError('Invalid card ID or revision.');
    return { version: VERSION, id, pool: 'daylight-v2', revision, order: shuffle(drawIds, random).slice(0, 25), spotted: [] };
  }
  function sightings(state) {
    return Object.fromEntries(state.spotted.map(id => [id, true]));
  }
  function restoreState(serialized, ids, cardIds = ids) {
    if (!validIds(ids) || !validIds(cardIds)) throw new TypeError('Invalid animal catalog or card pool.');
    try {
      if (typeof serialized !== 'string' || serialized.length > MAX_STATE_BYTES) return null;
      const value = JSON.parse(serialized);
      if (!value || value.version !== VERSION || !validCard(value, ids, cardIds) || !validRevision(value.revision)) return null;
      if (!Array.isArray(value.spotted) || new Set(value.spotted).size !== value.spotted.length || !value.spotted.every(id => value.order.includes(id))) return null;
      return { version: VERSION, id: value.id, pool: value.pool, revision: value.revision, order: [...value.order], spotted: [...value.spotted] };
    } catch (_) { return null; }
  }
  function migratePrevious(serialized, ids, cardIds = ids) {
    if (!validIds(ids) || !validIds(cardIds)) throw new TypeError('Invalid animal catalog or card pool.');
    try {
      if (typeof serialized !== 'string' || serialized.length > MAX_STATE_BYTES) return null;
      const value = JSON.parse(serialized);
      if (!value || !isTimestamp(value.createdAt)) return null;
      if (value.version === 1) {
        const card = { ...value, pool: 'legacy-v1' };
        if (!validCard(card, ids, cardIds) || !value.sightings || typeof value.sightings !== 'object' || Array.isArray(value.sightings)) return null;
        const spotted = Object.keys(value.sightings);
        if (!spotted.every(id => value.order.includes(id) && isTimestamp(value.sightings[id]))) return null;
        return { version: VERSION, id: value.id, pool: 'legacy-v1', revision: 0, order: [...value.order], spotted };
      }
      if (value.version !== 2 || !validCard(value, ids, cardIds) || !validRevision(value.revision)) return null;
      if (!Array.isArray(value.journal) || value.journal.length > 10000) return null;
      const recordIds = new Set(), pairs = new Set(), spotted = [];
      for (const record of value.journal) {
        if (!record || !safeId(record.id) || !safeId(record.roundId) || !ids.includes(record.animalId) || !isTimestamp(record.observedAt)) return null;
        const pair = `${record.roundId}/${record.animalId}`;
        if (recordIds.has(record.id) || pairs.has(pair)) return null;
        recordIds.add(record.id); pairs.add(pair);
        if (record.roundId === value.id && value.order.includes(record.animalId)) spotted.push(record.animalId);
      }
      return { version: VERSION, id: value.id, pool: value.pool, revision: value.revision, order: [...value.order], spotted };
    } catch (_) { return null; }
  }
  function toggleSpotted(state, animalId) {
    if (!state.order.includes(animalId)) throw new RangeError('This animal is not on the bingo card.');
    if (!validRevision(state.revision + 1)) throw new RangeError('Invalid card revision.');
    const spotted = state.spotted.includes(animalId) ? state.spotted.filter(id => id !== animalId) : [...state.spotted, animalId];
    return { ...state, revision: state.revision + 1, spotted };
  }
  function winningLines(state) {
    const marks = sightings(state);
    return lines.filter(line => line.cells.every(index => has(marks, state.order[index])));
  }
  function newWinningLines(previous, current) {
    const before = new Set(previous.id === current.id ? winningLines(previous).map(line => line.id) : []);
    return winningLines(current).filter(line => !before.has(line.id));
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
  return Object.freeze({ VERSION, STORAGE_KEY, PREVIOUS_KEY, LEGACY_KEY, LEGACY_IDS, SIZE, lines, shuffle, createState, restoreState, migratePrevious, sightings, toggleSpotted, winningLines, newWinningLines, cardCode, readCardCode });
});
