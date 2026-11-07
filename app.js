(function () {
  'use strict';
  const animals = window.RiverBingoAnimals;
  const core = window.RiverBingoCore;
  const graph = window.RiverBingoIdentification;
  const facts = window.RiverBingoFacts;
  const byId = new Map(animals.map(animal => [animal.id, animal]));
  const ids = animals.map(animal => animal.id);
  const drawIds = animals.filter(animal => animal.bingoEligible).map(animal => animal.id);
  const $ = id => document.getElementById(id);
  const fullDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  const shortDate = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' });
  const shortTime = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const serialize = value => JSON.stringify(value);
  let state, storageSnapshot = null, memoryOnly = false, needsInitialSave = false;
  let currentView = 'bingo', showNextLine = false, toastTimer;
  let stopFireworks = () => {};
  let selectedAnimal, selectedRecord, detailSnapshot, originalInput, originalISO;
  let formIndex = 0, review, resetSnapshot, restorePreview, crewPreview;
  let draftRound = null;
  const draft = new Map();
  let idHistory = [{ node: graph.start }];
  let factBag = [], currentFact;
  const returnFocus = new WeakMap();
  const viewScroll = new Map();

  function element(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function tell(message) {
    clearTimeout(toastTimer);
    $('toast').textContent = message;
    $('toast').hidden = false;
    toastTimer = setTimeout(() => { $('toast').hidden = true; }, 5500);
  }
  function notice(message) {
    $('storage-message').textContent = message;
    $('storage-notice').hidden = false;
    $('save-status').textContent = memoryOnly ? 'Only in this tab · save a backup' : 'Progress needs attention';
  }
  function showDialog(id) {
    const dialog = $(id);
    if (dialog.open) return;
    const active = document.activeElement;
    returnFocus.set(dialog, { element: active, animal: active.dataset.animal, record: active.dataset.record, container: active.closest('#bingo-board, #guide-results, #id-candidates, #journal-records, #recent-sightings')?.id });
    dialog.showModal();
    const first = dialog.querySelector('button, input, textarea');
    if (first) first.focus({ preventScroll: true });
  }
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('close', () => {
    const previous = returnFocus.get(dialog);
    if (!previous) return;
    let target = previous.element;
    if (!target.isConnected && previous.container) {
      const container = $(previous.container);
      target = [...container.querySelectorAll('button')].find(button => previous.record ? button.dataset.record === previous.record : button.dataset.animal === previous.animal);
      if (!target) target = container.closest('dialog')?.querySelector('button') || document.querySelector(`[data-view="${currentView}"]`);
    }
    if (target && target.isConnected && !target.closest('[hidden]') && (!target.closest('dialog') || target.closest('dialog').open)) target.focus({ preventScroll: true });
  }));
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button, input, select, textarea, a[href], summary, [tabindex]')].filter(node => {
      const closedDetails = node.closest('details:not([open])');
      return !node.disabled && node.tabIndex >= 0 && node.getClientRects().length && (!closedDetails || node === closedDetails.querySelector('summary'));
    });
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }));
  document.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));

  async function withStorageLock(operation) {
    let started = false;
    if (!memoryOnly && navigator.locks && navigator.locks.request) {
      try { return await navigator.locks.request(core.STORAGE_KEY, () => { started = true; return operation(); }); }
      catch (error) { if (started) throw error; }
    }
    return operation();
  }
  function readStoredChange() {
    if (memoryOnly) return false;
    let raw;
    try { raw = localStorage.getItem(core.STORAGE_KEY); }
    catch (_) { throw new Error('Browser storage is unavailable. Continue in this tab to save here, then download a backup.'); }
    if (raw === storageSnapshot) return false;
    storageSnapshot = raw;
    const latest = raw && core.restoreState(raw, ids, drawIds);
    if (latest) {
      if (latest.id !== state.id) showNextLine = false;
      state = latest;
      needsInitialSave = false;
      render();
    }
    notice(latest ? 'Progress changed in another tab. Review your selections again before saving.' : 'Browser progress was removed or became unreadable. This tab still has its card. Save a backup before continuing.');
    return true;
  }
  async function commit(candidate, expected) {
    return withStorageLock(() => {
      try {
        if (!core.restoreState(serialize(candidate), ids, drawIds)) throw new Error('This change exceeds the journal limits or is invalid. Save a backup and remove older records before adding more.');
        if (readStoredChange() || serialize(state) !== expected) throw new Error('Progress changed. Close this review and review the current card before saving again.');
        if (!memoryOnly) {
          localStorage.setItem(core.STORAGE_KEY, serialize(candidate));
          storageSnapshot = serialize(candidate);
        }
        stopFireworks();
        state = candidate;
        needsInitialSave = false;
        if (!memoryOnly) { $('storage-notice').hidden = true; $('save-status').textContent = 'Saved on this device'; }
        render();
        return true;
      } catch (error) {
        notice(/Progress changed|journal limits/.test(error.message) ? error.message : 'Could not save. Your card and draft are unchanged. Retry Save, or choose Continue in this tab and save again. Keep a backup file.');
        return false;
      }
    });
  }
  function initialize() {
    let raw = null, legacy = null, canRead = true;
    try { raw = localStorage.getItem(core.STORAGE_KEY); if (!raw) legacy = localStorage.getItem(core.LEGACY_KEY); }
    catch (_) { canRead = false; }
    storageSnapshot = raw;
    state = raw ? core.restoreState(raw, ids, drawIds) : legacy ? core.migrateLegacy(legacy) : null;
    if (!state) {
      state = core.createState(drawIds);
      if (raw || legacy) notice('Saved data could not be read. It has been left in storage. You can load a backup or use this fresh card.');
    }
    needsInitialSave = !raw && !(legacy && !core.migrateLegacy(legacy));
    if (needsInitialSave && canRead) {
      try {
        localStorage.setItem(core.STORAGE_KEY, serialize(state));
        storageSnapshot = serialize(state);
        needsInitialSave = false;
      } catch (_) { notice('This card could not be saved. Retry saving or choose Continue in this tab. Download a backup to keep your progress.'); }
    }
    if (!canRead) notice('Browser storage is unavailable. Choose Continue in this tab and download a backup to keep progress.');
    render(); renderIdentification();
    try {
      const code = new URLSearchParams(location.hash.slice(1)).get('card');
      if (code) previewCrew(code);
    } catch (_) { tell('That shared card link could not be read.'); }
  }
  function imageFor(animal, form = animal.forms[0], large = false, lazy = true) {
    const img = element('img');
    img.src = form.thumbnail;
    if (large) { img.srcset = `${form.thumbnail} 640w, ${form.image} 1200w`; img.sizes = '(max-width: 540px) calc(100vw - 16px), 800px'; }
    img.alt = `${animal.name} — ${form.label}. Generated recognition illustration.`;
    img.width = 640; img.height = 640;
    img.loading = lazy ? 'lazy' : 'eager'; img.decoding = 'async';
    return img;
  }
  function recordFor(animalId) { return state.journal.find(record => record.roundId === state.id && record.animalId === animalId); }
  function statusFor(animal) {
    const labels = [state.order.includes(animal.id) ? 'On this card' : 'Not on this card'];
    if (recordFor(animal.id)) labels.push('Spotted this round');
    if (state.journal.some(record => record.animalId === animal.id && record.roundId !== state.id)) labels.push('Seen before');
    return labels.join(' · ');
  }
  function render() {
    const marks = core.sightings(state), wins = core.winningLines(state), closest = core.closestLine(state);
    const count = Object.keys(marks).length;
    const winningIds = new Set(wins.flatMap(line => line.cells.map(index => state.order[index])));
    $('spotted-count').textContent = count;
    $('bingo-count').textContent = `${wins.length} ${wins.length === 1 ? 'bingo' : 'bingos'}`;
    $('sighting-progress').value = count;
    $('progress-message').textContent = count === 25 ? 'Full card! All 25 spotted.' : `${closest.remaining} to ${closest.remaining === 1 ? 'go' : 'spot'} on your closest line.`;
    $('card-description').textContent = state.pool === 'legacy-v1' ? 'Your original card is preserved. Every square still counts.' : '25 daylight entries. Five in a line makes bingo.';
    $('bingo-banner').hidden = wins.length === 0;
    $('bingo-banner').textContent = count === 25 ? 'Full card! A river full of discoveries.' : `Bingo! ${wins.map(line => line.label).join(' · ')}`;
    $('next-bingo-button').hidden = count === 25;
    const next = core.lines.map(line => ({ ...line, missing: line.cells.filter(index => !marks[state.order[index]]) })).filter(line => line.missing.length).sort((a, b) => a.missing.length - b.missing.length)[0];
    $('next-bingo-button').setAttribute('aria-pressed', String(showNextLine));
    $('next-line-hint').hidden = !showNextLine || !next;
    if (next) $('next-line-hint').textContent = `${next.label}: ${next.missing.map(index => byId.get(state.order[index]).name).join(', ')} still to spot.`;
    $('bingo-board').replaceChildren(...state.order.map((id, index) => {
      const animal = byId.get(id), spotted = marks[id];
      const tile = element('button', `animal-tile${spotted ? ' is-spotted' : ''}${winningIds.has(id) ? ' in-bingo' : ''}${showNextLine && next && next.cells.includes(index) ? ' is-next' : ''}`);
      tile.dataset.animal = id; tile.setAttribute('aria-pressed', String(Boolean(spotted)));
      tile.setAttribute('aria-label', `${animal.name}. Row ${Math.floor(index / 5) + 1}, column ${index % 5 + 1}. ${spotted ? `Spotted ${fullDate.format(new Date(spotted))}` : 'Not yet spotted'}.${showNextLine && next && next.cells.includes(index) ? ' On highlighted next line.' : ''}`);
      const img = imageFor(animal, animal.forms[0], false, false); img.alt = '';
      tile.append(img, element('span', 'tile-name', animal.name));
      const tileStatus = element('span', 'tile-state', spotted ? winningIds.has(id) ? '★ Bingo' : '✓ Spotted' : showNextLine && next && next.cells.includes(index) ? '→ Next' : 'To spot');
      tile.append(tileStatus);
      if (spotted) {
        const time = element('time', 'tile-time', `${shortDate.format(new Date(spotted))} · ${shortTime.format(new Date(spotted))}`); time.dateTime = spotted;
        tile.append(time);
      } else tile.append(element('span', 'tile-time', 'Tap to look'));
      tile.addEventListener('click', () => openAnimal(id));
      return tile;
    }));
    const records = [...state.journal].sort((a, b) => Date.parse(b.observedAt) - Date.parse(a.observedAt));
    $('journal-summary').textContent = records.length ? `${records.length} saved ${records.length === 1 ? 'sighting' : 'sightings'} across your rounds.` : 'Your first discovery is waiting.';
    $('recent-sightings').replaceChildren(...records.slice(0, 4).map(record => recordItem(record)));
    const discovered = new Set(records.map(record => record.animalId));
    const milestones = [];
    if (animals.some(animal => animal.group === 'Turtles' && discovered.has(animal.id))) milestones.push('First turtle discovered');
    if (animals.filter(animal => animal.group === 'Birds' && discovered.has(animal.id)).length >= 5) milestones.push('Five bird species discovered');
    for (const group of ['Birds', 'Mammals', 'Turtles', 'Amphibians', 'Fish']) if (animals.filter(animal => animal.group === group).every(animal => discovered.has(animal.id))) milestones.push(`All ${group.toLowerCase()} in the catalog discovered`);
    $('milestones').textContent = milestones.length ? `Collection: ${milestones.join(' · ')}.` : `${discovered.size} of 41 catalog entries discovered.`;
    if (currentView === 'animals') renderCatalog();
    renderDraft();
    if ($('journal-dialog').open) renderJournal();
    if (memoryOnly) $('save-status').textContent = 'Only in this tab · save a backup';
    updateShareButton();
  }
  function recordItem(record) {
    const animal = byId.get(record.animalId), li = element('li'), button = element('button');
    button.dataset.record = record.id;
    const img = imageFor(animal); img.alt = '';
    const text = element('span');
    const time = element('time', '', fullDate.format(new Date(record.observedAt))); time.dateTime = record.observedAt;
    text.append(element('strong', '', animal.name), time, element('small', '', record.roundId === state.id ? 'This round' : 'Previous round'));
    button.append(img, text); button.addEventListener('click', () => openAnimal(animal.id, record.id));
    li.append(button); return li;
  }
  function renderJournal() { $('journal-records').replaceChildren(...[...state.journal].sort((a, b) => Date.parse(b.observedAt) - Date.parse(a.observedAt)).map(recordItem)); }
  function navigate(view) {
    viewScroll.set(currentView, window.scrollY);
    currentView = view;
    for (const name of ['bingo', 'animals', 'identify', 'surprise']) $(`view-${name}`).hidden = view !== name;
    document.querySelectorAll('[data-view]').forEach(button => { if (button.dataset.view === view) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current'); });
    if (view === 'animals') renderCatalog();
    if (view === 'surprise' && !currentFact) nextFact();
    $(`${view === 'bingo' ? 'bingo' : view}-title`).focus({ preventScroll: true });
    window.scrollTo(0, viewScroll.get(view) || 0);
  }
  function catalogCard(animal, allowSelect) {
    const article = element('article', `guide-item${draft.has(animal.id) ? ' is-selected' : ''}`), button = element('button');
    button.dataset.animal = animal.id;
    button.append(imageFor(animal), element('h3', '', animal.name), element('p', '', animal.cue), element('small', '', statusFor(animal)));
    button.addEventListener('click', () => openAnimal(animal.id)); article.append(button);
    if (allowSelect) {
      const label = element('label', 'check-label'), input = element('input'); input.type = 'checkbox'; input.checked = draft.has(animal.id); input.disabled = Boolean(recordFor(animal.id));
      input.addEventListener('change', () => {
        if (input.checked) {
          if (draft.size && draftRound !== state.id) { input.checked = false; tell('These selections belong to an older card. Clear them before selecting for this card.'); return; }
          draftRound = state.id; draft.set(animal.id, new Date().toISOString());
        } else { draft.delete(animal.id); if (!draft.size) draftRound = null; }
        article.classList.toggle('is-selected', input.checked);
        label.lastChild.textContent = input.checked ? 'Selected · review to save' : 'Select sighting';
        renderDraft();
      });
      label.append(input, document.createTextNode(recordFor(animal.id) ? 'Saved · open to correct' : draft.has(animal.id) ? 'Selected · review to save' : 'Select sighting')); article.append(label);
    }
    return article;
  }
  function renderCatalog() {
    const query = $('guide-search').value.trim().toLowerCase(), group = $('guide-group').value;
    const filtered = animals.filter(animal => (group === 'All' || animal.group === group) && (!$('card-filter').checked || state.order.includes(animal.id)) && `${animal.name} ${animal.scientific} ${(animal.aliases || []).join(' ')} ${animal.cue} ${animal.look}`.toLowerCase().includes(query));
    $('guide-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'entry' : 'entries'}`;
    $('guide-empty').hidden = filtered.length !== 0;
    $('guide-results').replaceChildren(...filtered.map(animal => catalogCard(animal, true)));
  }
  function renderDraft() {
    $('draft-bar').hidden = draft.size === 0;
    $('draft-count').textContent = `${draft.size} to save${draft.size && draftRound !== state.id ? ' · from an older card' : ''}`;
  }
  function localInputDate(date) {
    const pad = value => String(value).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  function openAnimal(id, recordId) {
    selectedAnimal = byId.get(id);
    selectedRecord = recordId ? state.journal.find(record => record.id === recordId) : recordFor(id);
    detailSnapshot = serialize(state); formIndex = 0;
    $('animal-name').textContent = selectedAnimal.name;
    $('animal-scientific').textContent = selectedAnimal.scientific;
    $('animal-status').textContent = statusFor(selectedAnimal);
    $('animal-cue').textContent = selectedAnimal.cue;
    $('animal-look').textContent = selectedAnimal.look;
    $('animal-illustration').textContent = 'Generated recognition art. Field marks may be simplified or hidden; not independently certified identification material.';
    const cautions = [];
    if (!state.order.includes(id)) cautions.push('Not on your card. You can still save this sighting.');
    if (id === 'jumping-fish') cautions.push('See a fish actually leave the water. A splash alone is insufficient. The Common Carp illustration does not identify every leaping fish.');
    if (id === 'smallmouth-bass') cautions.push('A brief splash is not enough to identify Smallmouth Bass. Use a clear view of its body and jaw.');
    if (selectedRecord && selectedRecord.roundId !== state.id) cautions.push('You are editing a previous-round sighting. It will not mark this card.');
    $('animal-caution').textContent = cautions.join(' '); $('animal-caution').hidden = cautions.length === 0;
    const iso = selectedRecord ? selectedRecord.observedAt : draft.get(id) || new Date().toISOString();
    originalISO = iso; originalInput = localInputDate(new Date(iso));
    $('sighting-time').value = originalInput;
    $('sighting-time').max = localInputDate(new Date());
    $('sighting-error').hidden = true;
    $('save-sighting').textContent = selectedRecord ? 'Review date correction' : 'I spotted it · Review';
    $('remove-sighting').hidden = !selectedRecord;
    const source = $('animal-source'); source.hidden = !selectedAnimal.source;
    if (selectedAnimal.source) source.href = selectedAnimal.source; else source.removeAttribute('href');
    $('animal-evidence').replaceChildren(...selectedAnimal.occurrence.map(record => {
      const p = element('p'); p.append(element('strong', '', record.scope), document.createTextNode(` — ${record.claim} (${record.date}). `));
      if (record.url) { const link = element('a', '', record.title); link.href = record.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; p.append(link); }
      p.append(element('small', '', ` ${record.locator}`)); return p;
    }));
    $('animal-dialog').querySelector('details').open = false;
    renderForms(); showDialog('animal-dialog'); $('animal-dialog').scrollTop = 0;
  }
  function renderForms() {
    const forms = selectedAnimal.forms;
    const options = forms.map(form => form.label);
    if (forms.length > 1) options.push('Compare');
    $('form-tabs').replaceChildren(...options.map((label, index) => {
      const button = element('button', '', label); button.id = `form-tab-${index}`; button.setAttribute('role', 'tab'); button.setAttribute('aria-selected', String(index === formIndex)); button.setAttribute('aria-controls', 'animal-art'); button.tabIndex = index === formIndex ? 0 : -1;
      button.addEventListener('click', () => { formIndex = index; renderForms(); $(`form-tab-${index}`).focus({ preventScroll: true }); });
      button.addEventListener('keydown', event => {
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % options.length;
        else if (event.key === 'ArrowLeft') next = (index - 1 + options.length) % options.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = options.length - 1;
        else return;
        event.preventDefault(); formIndex = next; renderForms(); $(`form-tab-${next}`).focus({ preventScroll: true });
      });
      return button;
    }));
    const compare = formIndex === forms.length;
    $('animal-art').classList.toggle('compare', compare);
    $('animal-art').setAttribute('aria-labelledby', `form-tab-${formIndex}`);
    $('animal-art').replaceChildren(...(compare ? forms : [forms[formIndex]]).map(form => {
      const figure = element('figure'); figure.append(imageFor(selectedAnimal, form, true, false), element('figcaption', '', `${form.label}. ${form.description}`)); return figure;
    }));
  }
  function readSightingTime() {
    const value = $('sighting-time').value;
    const date = value === originalInput ? new Date(originalISO) : new Date(value);
    if (!value || !Number.isFinite(date.getTime()) || date.getTime() > Date.now() + 60000 || (value !== originalInput && localInputDate(date) !== value)) return null;
    return date.toISOString();
  }
  function openReview(action) {
    if (action.type === 'batch' && action.observations.some(item => recordFor(item.animalId))) {
      tell('A selected animal was already saved. Clear selections and open its saved record to correct it.');
      return;
    }
    review = { ...action, expected: serialize(state), roundId: state.id };
    $('review-title').textContent = action.type === 'remove' ? 'Remove this sighting?' : action.type === 'correct' ? 'Save this date correction?' : 'Save these sightings?';
    $('confirm-save').textContent = action.type === 'remove' ? 'Remove sighting' : 'Save sightings';
    $('review-list').replaceChildren(...action.observations.map(observation => {
      const item = element('div'), animal = byId.get(observation.animalId);
      const time = element('time', '', fullDate.format(new Date(observation.observedAt))); time.dateTime = observation.observedAt;
      item.append(element('strong', '', animal.name), time);
      if (!state.order.includes(animal.id)) item.append(element('small', '', 'Not on your card. You can still save this sighting.'));
      return item;
    }));
    $('review-error').hidden = true; showDialog('review-dialog');
  }
  function celebrate() {
    stopFireworks();
    if (reducedMotion.matches) return;
    const canvas = $('fireworks');
    const context = typeof CanvasRenderingContext2D !== 'undefined' ? canvas.getContext('2d') : null;
    $('celebration-title').textContent = Object.keys(core.sightings(state)).length === 25 ? 'FULL CARD!' : 'BINGO!';
    $('celebration-detail').textContent = `${core.winningLines(state).length} ${core.winningLines(state).length === 1 ? 'line complete' : 'lines complete'}`;
    $('celebration').hidden = false;
    if (!context) { setTimeout(() => { $('celebration').hidden = true; }, 3500); return; }
    canvas.hidden = false;
    const fullCard = Object.keys(core.sightings(state)).length === 25;
    const launchDuration = fullCard ? 10500 : 7500;
    const colors = ['#3B428C', '#E0403B', '#6678ef', '#b82430', '#969ff5'];
    const rockets = [], sparks = [];
    let width, height, frame, previous = performance.now(), started = previous, nextLaunch = 0;
    function resize() {
      width = innerWidth; height = innerHeight;
      const scale = Math.min(devicePixelRatio || 1, 2);
      canvas.width = width * scale; canvas.height = height * scale;
      context.setTransform(scale, 0, 0, scale, 0, 0);
    }
    function explode(rocket) {
      const count = fullCard ? 140 : 100;
      for (let index = 0; index < count; index++) {
        const angle = index / count * Math.PI * 2 + Math.random() * .06;
        const speed = (index % 3 === 0 ? 65 : 120 + Math.random() * 160) * Math.min(width / 500, 1.5);
        sparks.push({ x: rocket.targetX, y: rocket.targetY, previousX: rocket.targetX, previousY: rocket.targetY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, age: 0, life: 1.3 + Math.random() * 1.8, color: index % 5 ? rocket.color : colors[(rocket.colorIndex + 1) % colors.length], size: 1.4 + Math.random() * 1.5 });
      }
      if (sparks.length > 1800) sparks.splice(0, sparks.length - 1800);
    }
    function draw(time) {
      if (reducedMotion.matches) { stopFireworks(); return; }
      const dt = Math.min((time - previous) / 1000, .04), elapsed = time - started;
      previous = time;
      context.clearRect(0, 0, width, height);
      if (elapsed >= nextLaunch && elapsed < launchDuration) {
        const number = elapsed < 1000 || elapsed > launchDuration - 1400 ? 3 : 1;
        for (let index = 0; index < number; index++) {
          const colorIndex = Math.floor(Math.random() * colors.length);
          rockets.push({ startX: width * (.15 + Math.random() * .7), targetX: width * (.1 + Math.random() * .8), targetY: height * (.12 + Math.random() * .4), age: 0, flight: .6 + Math.random() * .5, color: colors[colorIndex], colorIndex, trail: [] });
        }
        nextLaunch = elapsed + (fullCard ? 140 : 190);
      }
      for (let index = rockets.length - 1; index >= 0; index--) {
        const rocket = rockets[index]; rocket.age += dt;
        const fraction = Math.min(rocket.age / rocket.flight, 1), eased = 1 - (1 - fraction) ** 2;
        const x = rocket.startX + (rocket.targetX - rocket.startX) * fraction, y = height + 10 + (rocket.targetY - height - 10) * eased;
        rocket.trail.push({ x, y }); if (rocket.trail.length > 9) rocket.trail.shift();
        context.strokeStyle = rocket.color; context.lineWidth = 2.5; context.beginPath();
        rocket.trail.forEach((point, trailIndex) => trailIndex ? context.lineTo(point.x, point.y) : context.moveTo(point.x, point.y)); context.stroke();
        context.fillStyle = rocket.color; context.beginPath(); context.arc(x, y, 3, 0, Math.PI * 2); context.fill();
        if (fraction === 1) { explode(rocket); rockets.splice(index, 1); }
      }
      for (let index = sparks.length - 1; index >= 0; index--) {
        const spark = sparks[index]; spark.age += dt;
        if (spark.age > spark.life) { sparks.splice(index, 1); continue; }
        spark.previousX = spark.x; spark.previousY = spark.y;
        spark.vx *= Math.pow(.72, dt); spark.vy += 58 * dt;
        spark.x += spark.vx * dt; spark.y += spark.vy * dt;
        context.globalAlpha = Math.min(1, (1 - spark.age / spark.life) * 1.5);
        context.strokeStyle = spark.color; context.lineWidth = spark.size;
        context.beginPath(); context.moveTo(spark.previousX - spark.vx * .035, spark.previousY - spark.vy * .035); context.lineTo(spark.x, spark.y); context.stroke();
      }
      context.globalAlpha = 1;
      if (elapsed > 3300) $('celebration').hidden = true;
      if (elapsed > launchDuration && !rockets.length && !sparks.length) { stopFireworks(); return; }
      frame = requestAnimationFrame(draw);
    }
    stopFireworks = () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); context.clearRect(0, 0, width, height); canvas.hidden = true; $('celebration').hidden = true; };
    resize(); window.addEventListener('resize', resize); frame = requestAnimationFrame(draw);
  }
  function renderIdentification() {
    const current = idHistory[idHistory.length - 1];
    $('id-path').textContent = idHistory.slice(1).map(step => step.label).join(' → ');
    $('id-answers').replaceChildren(); $('id-candidates').replaceChildren();
    $('id-back').disabled = idHistory.length === 1;
    $('id-note').hidden = true;
    if (current.node) {
      const node = graph.nodes[current.node]; $('id-question').textContent = node.question;
      $('id-answers').append(...node.answers.filter(answer => !/^(Not sure|None of these)/i.test(answer.label)).map(answer => {
        const button = element('button', 'outline-button', answer.label);
        button.addEventListener('click', () => { idHistory.push(answer.next ? { node: answer.next, label: answer.label } : { candidates: answer.candidates || [], note: answer.note, label: answer.label }); renderIdentification(); focusIdentification(); }); return button;
      }));
      if (node.note || node.references) {
        $('id-note').hidden = false; $('id-note').textContent = node.note || '';
        for (const reference of node.references || []) { const link = element('a', '', ` ${reference.title} ↗`); link.href = reference.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; $('id-note').append(link); }
      }
    } else {
      $('id-question').textContent = current.candidates.length ? 'Compare these candidates' : 'Not enough detail to identify it';
      $('id-candidates').append(...current.candidates.map(id => catalogCard(byId.get(id), false)));
      $('id-note').hidden = false;
      $('id-note').textContent = current.note || 'These are possibilities. Check the positive field marks and references. Other local species may fit; no sighting has been recorded.';
    }
  }
  function focusIdentification() {
    $('id-question').tabIndex = -1;
    $('id-question').focus({ preventScroll: true });
    $('id-question').scrollIntoView({ block: 'nearest' });
  }
  function nextFact() {
    if (!factBag.length) {
      factBag = core.shuffle(facts);
      if (currentFact && factBag[factBag.length - 1].id === currentFact.id) [factBag[0], factBag[factBag.length - 1]] = [factBag[factBag.length - 1], factBag[0]];
    }
    currentFact = factBag.pop();
    const animal = byId.get(currentFact.animalId);
    $('fact-image').replaceChildren(imageFor(animal, animal.forms[0], true, false));
    $('fact-animal').textContent = animal.name; $('fact-text').textContent = currentFact.text;
    $('fact-context').textContent = currentFact.context; $('fact-source').href = currentFact.source; $('fact-source').textContent = `${currentFact.title} ↗`;
  }
  function backupFile() { return new File([core.exportBackup(state)], `aarc-bingo-${new Date().toISOString().slice(0, 10)}.json`, { type: 'application/json' }); }
  function downloadBackup() {
    const file = backupFile(), url = URL.createObjectURL(file), link = element('a'); link.href = url; link.download = file.name; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    tell('Backup download requested. Keep the JSON file outside this browser.');
  }
  function updateShareButton() {
    try { const file = backupFile(); $('share-progress').hidden = !(navigator.share && navigator.canShare && navigator.canShare({ files: [file] })); }
    catch (_) { $('share-progress').hidden = true; }
  }
  async function previewBackup(file) {
    if (!file || file.size > core.MAX_BACKUP_BYTES) { tell('Choose a bingo JSON backup smaller than 2 MB. Your progress is unchanged.'); return; }
    try {
      const backup = core.readBackup(await file.text(), ids, drawIds);
      if (!backup) { tell('That backup is invalid or uses an unsupported version. Your progress is unchanged.'); return; }
      restorePreview = { ...backup, expected: serialize(state) };
      const p = element('p', '', `Backup made ${fullDate.format(new Date(backup.exportedAt))}. ${backup.state.journal.length} sightings; ${Object.keys(core.sightings(backup.state)).length}/25 on that card.`);
      const list = element('ol'); list.append(...backup.state.order.map(id => element('li', '', byId.get(id).name)));
      $('restore-preview').replaceChildren(p, list); $('restore-error').hidden = true;
      showDialog('restore-dialog');
    } catch (_) { tell('That file could not be read. Your progress is unchanged.'); }
  }
  function previewCrew(code) {
    const parsed = core.readCardCode(code, ids, drawIds);
    if (!parsed) { $('crew-error').textContent = 'That card code is invalid or uses an unsupported version.'; $('crew-error').hidden = false; return; }
    crewPreview = { ...parsed, expected: serialize(state) };
    $('crew-preview').replaceChildren(...parsed.order.map(id => element('li', '', byId.get(id).name)));
    showDialog('crew-confirm-dialog');
  }
  function gameURL() { const url = new URL(location.href); url.hash = ''; url.search = ''; return url; }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); tell('Copied. Ready to share with your crew.'); }
    catch (_) { $('crew-code').value = text; $('crew-code').focus(); $('crew-code').select(); tell('Select and copy the text in the card box.'); }
  }

  document.querySelectorAll('[data-view],[data-go]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.view || button.dataset.go)));
  $('big-pictures').addEventListener('click', () => { $('card-filter').checked = true; $('guide-search').value = ''; $('guide-group').value = 'All'; navigate('animals'); });
  $('guide-search').addEventListener('input', renderCatalog); $('guide-group').addEventListener('change', renderCatalog); $('card-filter').addEventListener('change', renderCatalog);
  $('next-bingo-button').addEventListener('click', () => { showNextLine = !showNextLine; render(); $('next-bingo-button').focus(); });
  $('journal-button').addEventListener('click', () => { renderJournal(); showDialog('journal-dialog'); });
  $('help-button').addEventListener('click', () => showDialog('help-dialog'));
  $('sighting-form').addEventListener('submit', event => {
    event.preventDefault();
    const observedAt = readSightingTime();
    if (!observedAt) { $('sighting-error').textContent = 'Choose a valid local time that is not in the future. A time skipped by daylight saving cannot be used.'; $('sighting-error').hidden = false; $('sighting-time').focus(); return; }
    if (serialize(state) !== detailSnapshot) { $('sighting-error').textContent = 'Progress changed. Close and reopen this animal before saving.'; $('sighting-error').hidden = false; return; }
    if (selectedRecord) openReview({ type: 'correct', recordId: selectedRecord.id, observations: [{ animalId: selectedAnimal.id, observedAt }] });
    else {
      if (draft.size && draftRound !== state.id) { $('sighting-error').textContent = 'Clear selections from the older card before saving for this round.'; $('sighting-error').hidden = false; return; }
      draftRound = state.id; draft.set(selectedAnimal.id, observedAt); renderDraft();
      openReview({ type: 'batch', observations: [...draft].map(([animalId, time]) => ({ animalId, observedAt: time })) });
    }
  });
  $('remove-sighting').addEventListener('click', () => {
    if (serialize(state) !== detailSnapshot) { tell('Progress changed. Close and reopen this sighting first.'); return; }
    openReview({ type: 'remove', recordId: selectedRecord.id, observations: [{ animalId: selectedAnimal.id, observedAt: selectedRecord.observedAt }] });
  });
  $('review-batch').addEventListener('click', () => {
    if (draftRound !== state.id) { tell('These selections belong to an older card. Clear them before saving on this card.'); return; }
    if ([...draft.keys()].some(id => recordFor(id))) { tell('A selected animal was already saved in another tab. Clear and review your selections.'); return; }
    openReview({ type: 'batch', observations: [...draft].map(([animalId, observedAt]) => ({ animalId, observedAt })) });
  });
  $('confirm-save').addEventListener('click', async () => {
    const action = review; if (!action || $('confirm-save').disabled) return;
    $('confirm-save').disabled = true;
    try {
      const previous = state;
      if (serialize(state) !== action.expected || state.id !== action.roundId) { $('review-error').textContent = 'Progress changed. Cancel and review the current card again.'; $('review-error').hidden = false; return; }
      const candidate = action.type === 'batch' ? core.recordSightings(state, action.observations, ids) : core.updateSighting(state, action.recordId, action.type === 'remove' ? null : action.observations[0].observedAt);
      if (!await commit(candidate, action.expected)) { $('review-error').textContent = 'Nothing was saved. Check the storage notice, then retry or cancel and review again.'; $('review-error').hidden = false; return; }
      if (action.type === 'batch') { for (const item of action.observations) draft.delete(item.animalId); if (!draft.size) draftRound = null; }
      renderDraft(); if (currentView === 'animals') renderCatalog();
      $('review-dialog').close(); if ($('animal-dialog').open) $('animal-dialog').close();
      const wins = core.newWinningLines(previous, state);
      if (wins.length) { celebrate(); tell(`Bingo! ${wins.map(line => line.label).join(' and ')} complete.`); }
      else tell(action.type === 'remove' ? 'Sighting removed. Your card has been recalculated.' : action.type === 'correct' ? 'Sighting date corrected.' : `${action.observations.length} ${action.observations.length === 1 ? 'sighting' : 'sightings'} saved.`);
    } catch (error) {
      $('review-error').textContent = error.message;
      $('review-error').hidden = false;
    } finally { $('confirm-save').disabled = false; }
  });
  $('discard-draft').addEventListener('click', () => showDialog('discard-dialog'));
  $('confirm-discard').addEventListener('click', () => { draft.clear(); draftRound = null; renderDraft(); if (currentView === 'animals') renderCatalog(); $('discard-dialog').close(); });
  $('new-card-button').addEventListener('click', () => { resetSnapshot = serialize(state); $('reset-draft-note').hidden = draft.size === 0; showDialog('reset-dialog'); });
  $('confirm-reset').addEventListener('click', async () => {
    if ($('confirm-reset').disabled) return; $('confirm-reset').disabled = true;
    try {
      const candidate = core.createState(drawIds, { journal: state.journal, revision: state.revision + 1 });
      if (!await commit(candidate, resetSnapshot)) { tell('No new card was started. Review current progress and storage.'); return; }
      draft.clear(); draftRound = null; showNextLine = false; render(); $('reset-dialog').close(); tell('Your daylight card is ready. The journal stays with you.');
    } finally { $('confirm-reset').disabled = false; }
  });
  $('retry-storage').addEventListener('click', async () => {
    if (memoryOnly) { tell('This tab is in temporary mode. Download a backup to keep its progress.'); return; }
    if (await commit(state, serialize(state))) tell('Current progress saved. Review and save any pending selections.');
  });
  $('memory-mode').addEventListener('click', () => { memoryOnly = true; notice('You chose to continue in this tab. Progress is temporary. Review and save pending sightings, then download a backup.'); render(); });
  window.addEventListener('storage', async event => {
    if (event.key !== core.STORAGE_KEY && event.key !== null) return;
    try { if (event.storageArea && event.storageArea !== localStorage) return; await withStorageLock(() => { if (readStoredChange()) tell('Progress changed in another tab. Draft selections have been kept for review.'); }); }
    catch (_) { notice('Storage is unavailable. Keep this tab open and save a backup.'); }
  });
  $('id-back').addEventListener('click', () => { if (idHistory.length > 1) idHistory.pop(); renderIdentification(); focusIdentification(); });
  for (const id of ['id-unsure', 'id-none']) $(id).addEventListener('click', () => { idHistory.push({ candidates: [], label: id === 'id-unsure' ? 'Not sure' : 'None of these', note: 'Other local species are possible. Leave this unresolved, or go back and compare the visible marks. No sighting has been saved.' }); renderIdentification(); focusIdentification(); });
  $('id-restart').addEventListener('click', () => { idHistory = [{ node: graph.start }]; renderIdentification(); focusIdentification(); });
  $('next-fact').addEventListener('click', nextFact); $('fact-detail').addEventListener('click', () => openAnimal(currentFact.animalId));
  document.querySelectorAll('.backup-trigger').forEach(button => button.addEventListener('click', downloadBackup));
  $('backup-input').addEventListener('change', event => { const file = event.target.files[0]; event.target.value = ''; if (file) previewBackup(file); });
  $('confirm-restore').addEventListener('click', async () => {
    if (!restorePreview || $('confirm-restore').disabled) return;
    if (serialize(state) === serialize(restorePreview.state)) { $('restore-dialog').close(); tell('This backup already matches your progress. Nothing changed.'); return; }
    $('confirm-restore').disabled = true;
    try {
      if (!await commit(restorePreview.state, restorePreview.expected)) { $('restore-error').textContent = 'Restore did not change your progress. Check storage or reopen the backup preview.'; $('restore-error').hidden = false; return; }
      draft.clear(); draftRound = null; showNextLine = false; render(); $('restore-dialog').close(); tell('Backup restored. Card order and original sighting times recovered.');
    } finally { $('confirm-restore').disabled = false; }
  });
  $('email-progress').addEventListener('click', () => {
    const body = `My Huron River Wildlife Bingo progress: ${Object.keys(core.sightings(state)).length}/25 spotted, ${core.winningLines(state).length} bingos; ${state.journal.length} journal sightings.\n\nPlay: ${gameURL().href}\n\nTo send a restorable backup, use Save backup in the game and attach the downloaded JSON file here. This message does not contain the backup.`;
    location.href = `mailto:?subject=${encodeURIComponent('Huron River Wildlife Bingo progress')}&body=${encodeURIComponent(body)}`;
    tell('Mail composer requested. Download a backup and attach it manually for recovery.');
  });
  $('share-progress').addEventListener('click', async () => {
    const file = backupFile();
    try {
      if (!navigator.canShare || !navigator.canShare({ files: [file] })) { downloadBackup(); return; }
      await navigator.share({ files: [file], title: 'Huron River Wildlife Bingo backup' });
    } catch (error) { if (error.name !== 'AbortError') { tell('File sharing is unavailable. Use Save backup and attach the file manually.'); } }
  });
  $('crew-button').addEventListener('click', () => { $('crew-code').value = core.cardCode(state); $('crew-error').hidden = true; showDialog('crew-dialog'); });
  $('copy-code').addEventListener('click', () => copyText(core.cardCode(state)));
  $('copy-card-link').addEventListener('click', () => { const url = gameURL(); url.hash = new URLSearchParams({ card: core.cardCode(state) }).toString(); copyText(url.href); });
  $('preview-code').addEventListener('click', () => previewCrew($('crew-code').value));
  $('confirm-code').addEventListener('click', async () => {
    if (!crewPreview || $('confirm-code').disabled) return; $('confirm-code').disabled = true;
    try {
      const candidate = { ...core.createState(drawIds, { journal: state.journal, revision: state.revision + 1 }), pool: crewPreview.pool, order: [...crewPreview.order] };
      if (!await commit(candidate, crewPreview.expected)) { tell('The crew card was not started. Reopen its preview after checking progress.'); return; }
      draft.clear(); draftRound = null; showNextLine = false; render(); $('crew-confirm-dialog').close(); if ($('crew-dialog').open) $('crew-dialog').close(); navigate('bingo'); tell('Same squares, fresh sightings. Your crew card is ready.');
    } finally { $('confirm-code').disabled = false; }
  });
  $('print-button').addEventListener('click', async () => {
    $('print-button').disabled = true;
    try { await Promise.all([...$('bingo-board').querySelectorAll('img')].map(img => { img.loading = 'eager'; if (img.complete && !img.naturalWidth) img.src = img.getAttribute('src'); return img.decode(); })); window.print(); }
    catch (_) { tell('A picture could not load. Try Print card again.'); }
    finally { $('print-button').disabled = false; }
  });
  initialize();
})();
