(function () {
  'use strict';
  const animals = window.RiverBingoAnimals;
  const core = window.RiverBingoCore;
  const facts = window.RiverBingoFacts;
  const byId = new Map(animals.map(animal => [animal.id, animal]));
  const ids = animals.map(animal => animal.id);
  const drawIds = animals.filter(animal => animal.bingoEligible).map(animal => animal.id);
  const cardIds = animals.filter(animal => animal.bingoEligible || animal.previouslyBingoEligible).map(animal => animal.id);
  const raptorGuides = [
    ...animals.filter(animal => animal.silhouette),
    {
      id: 'coopers-hawk', name: 'Cooper’s Hawk',
      silhouette: {
        image: 'assets/guides/raptors/coopers-hawk.png',
        wingspanCm: [62, 90], referenceSpanCm: 76,
        outline: 'Short, rounded wings and a long, rounded tail.',
        flight: 'Several quick wingbeats, then a glide.'
      }
    }
  ];
  const $ = id => document.getElementById(id);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const serialize = value => JSON.stringify(value);
  let state, storageSnapshot = null, memoryOnly = false, storageBlocked = false;
  let currentView = 'bingo', toastTimer;
  let stopFireworks = () => {};
  let selectedAnimal, selectedCardId, formIndex = 0, pendingCard, pendingRestore;
  let changeQueue = Promise.resolve();
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
  }
  function showDialog(id) {
    const dialog = $(id);
    if (dialog.open) return;
    const active = document.activeElement;
    returnFocus.set(dialog, { element: active, animal: active.dataset.animal, container: active.closest('#bingo-board, #guide-results')?.id });
    dialog.showModal();
    dialog.querySelector('.dialog-body').scrollTop = 0;
    const first = dialog.querySelector('button, input, textarea');
    if (first) first.focus({ preventScroll: true });
  }
  document.querySelectorAll('dialog').forEach(dialog => {
    const close = dialog.querySelector('[data-close].close-button') || element('button', 'close-button', '×');
    close.dataset.close = '';
    if (!close.hasAttribute('aria-label')) close.setAttribute('aria-label', 'Close');
    const body = element('div', 'dialog-body');
    body.append(...[...dialog.childNodes].filter(node => node !== close));
    const toolbar = element('div', 'dialog-toolbar');
    toolbar.append(close);
    dialog.replaceChildren(toolbar, body);
    let startedOutside = false;
    const outside = event => {
      const bounds = dialog.getBoundingClientRect();
      return event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
    };
    dialog.addEventListener('pointerdown', event => { startedOutside = event.button === 0 && outside(event); });
    dialog.addEventListener('click', event => {
      if (startedOutside && event.target === dialog && outside(event)) dialog.close();
      startedOutside = false;
    });
    dialog.addEventListener('close', () => {
      const previous = returnFocus.get(dialog);
      if (!previous) return;
      let target = previous.element;
      if (!target.isConnected && previous.container) {
        const container = $(previous.container);
        target = [...container.querySelectorAll('button')].find(button => button.dataset.animal === previous.animal);
        if (!target) target = container.closest('dialog')?.querySelector('button') || document.querySelector(`[data-view="${currentView}"]`);
      }
      if (target && target.isConnected && !target.closest('[hidden]') && (!target.closest('dialog') || target.closest('dialog').open)) target.focus({ preventScroll: true });
    });
  });
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
    try {
      const raw = localStorage.getItem(core.STORAGE_KEY);
      if (raw === storageSnapshot) return false;
      storageSnapshot = raw;
      const latest = raw && core.restoreState(raw, ids, cardIds);
      if (!latest) { storageBlocked = true; throw new Error('Saved progress changed or was cleared. Reload before saving, or choose Play in this tab.'); }
      state = latest;
      return true;
    } catch (error) {
      storageBlocked = true; notice(error.message || 'Saved progress is unavailable.');
      throw error;
    }
  }
  function saveCard() {
    if (memoryOnly) {
      $('save-status').textContent = 'Playing in this tab';
      return true;
    }
    try {
      if (storageBlocked) throw new Error('Storage needs attention');
      const saved = serialize(state);
      localStorage.setItem(core.STORAGE_KEY, saved);
      storageSnapshot = saved;
      $('storage-notice').hidden = true;
      $('save-status').textContent = 'Card saved on this device';
      return true;
    } catch (_) {
      $('save-status').textContent = 'Changes could not be saved';
      notice('Your card could not be saved. Retry, or choose to play in this tab.');
      return false;
    }
  }
  function changeCard(change, cardId = state.id, expected = null) {
    const operation = changeQueue.then(() => withStorageLock(() => {
      readStoredChange();
      if (state.id !== cardId || (expected !== null && serialize(state) !== expected)) {
        render();
        tell('The card changed in another tab. Try again on this card.');
        return false;
      }
      const previous = state, candidate = change(state);
      if (!core.restoreState(serialize(candidate), ids, cardIds)) throw new Error('That card could not be updated.');
      state = candidate;
      if (!saveCard()) { state = previous; render(); return false; }
      stopFireworks();
      render();
      if (core.newWinningLines(previous, state).length) { celebrate(); tell('Bingo!'); }
      return true;
    })).catch(error => { tell(error.message); return false; });
    changeQueue = operation;
    return operation;
  }
  function toggleSpotted(id, cardId = state.id) {
    return changeCard(current => core.toggleSpotted(current, id), cardId);
  }
  function bindTileGestures(tile, id) {
    let holdTimer, pointerId, startX, startY, suppressClick = false;
    const clearHold = () => { clearTimeout(holdTimer); holdTimer = null; };
    tile.addEventListener('pointerdown', event => {
      if (!event.isPrimary || event.button !== 0) return;
      clearHold();
      pointerId = event.pointerId; startX = event.clientX; startY = event.clientY; suppressClick = false;
      tile.setPointerCapture(pointerId);
      holdTimer = setTimeout(() => {
        holdTimer = null; suppressClick = true;
        tile.focus({ preventScroll: true });
        openAnimal(id);
      }, 500);
    });
    tile.addEventListener('pointermove', event => {
      if (event.pointerId !== pointerId) return;
      if (Math.hypot(event.clientX - startX, event.clientY - startY) > 10) { clearHold(); suppressClick = true; }
    });
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) tile.addEventListener(type, event => {
      if (event.pointerId !== pointerId) return;
      clearHold();
      if (type === 'pointercancel') suppressClick = true;
    });
    tile.addEventListener('contextmenu', event => { event.preventDefault(); clearHold(); suppressClick = true; if (!$('animal-dialog').open) openAnimal(id); });
    tile.addEventListener('keydown', event => {
      if (event.key === 'F10' && event.shiftKey) { event.preventDefault(); openAnimal(id); }
    });
    tile.addEventListener('click', event => {
      if (suppressClick && event.detail !== 0) { suppressClick = false; return; }
      suppressClick = false;
      toggleSpotted(id);
    });
  }
  function initialize() {
    let raw = null, previous = null;
    try {
      raw = localStorage.getItem(core.STORAGE_KEY);
      if (!raw) previous = localStorage.getItem(core.PREVIOUS_KEY) || localStorage.getItem(core.LEGACY_KEY);
    } catch (_) { storageBlocked = true; }
    storageSnapshot = raw;
    state = raw ? core.restoreState(raw, ids, cardIds) : previous ? core.migratePrevious(previous, ids, cardIds) : null;
    if (!state) {
      state = core.createState(drawIds);
      if (raw || previous) storageBlocked = true;
    }
    const shared = readCardLink();
    if (shared) {
      if (!raw && !previous && !storageBlocked) { state = sharedState(shared, state.revision + 1); clearCardLink(); }
      else pendingCard = { shared, cardId: state.id };
    }
    saveCard();
    render();
    if (pendingCard) showNewCard(pendingCard.shared);
  }
  function imageFor(animal, form = animal.forms[0], large = false, lazy = true) {
    // Vary direction by animal, keeping it consistent across views and reloads.
    let directionHash = 0;
    for (const character of animal.id) directionHash = Math.imul(directionHash, 31) + character.charCodeAt(0);
    const img = element('img', directionHash & 1 ? 'is-mirrored' : '');
    img.src = form.thumbnail;
    if (large) { img.srcset = `${form.thumbnail} 640w, ${form.image} 1200w`; img.sizes = '(max-width: 540px) calc(100vw - 16px), 800px'; }
    img.alt = `${animal.name} — ${form.label}`;
    img.width = 640; img.height = 640;
    img.loading = lazy ? 'lazy' : 'eager'; img.decoding = 'async';
    return img;
  }
  function statusFor(animal) {
    const labels = [state.order.includes(animal.id) ? 'On this card' : 'Not on this card'];
    if (state.spotted.includes(animal.id)) labels.push('Spotted');
    return labels.join(' · ');
  }
  function render() {
    const marks = core.sightings(state), wins = core.winningLines(state);
    const count = Object.keys(marks).length;
    const winningIds = new Set(wins.flatMap(line => line.cells.map(index => state.order[index])));
    $('bingo-banner').hidden = wins.length === 0;
    $('bingo-banner').textContent = count === 25 ? 'Full card! A river full of discoveries.' : `Bingo! ${wins.map(line => line.label).join(' · ')}`;
    const focusedTile = document.activeElement.closest('#bingo-board .animal-tile')?.dataset.animal;
    $('bingo-board').replaceChildren(...state.order.map((id, index) => {
      const animal = byId.get(id), spotted = marks[id];
      const tile = element('button', `animal-tile${spotted ? ' is-spotted' : ''}${winningIds.has(id) ? ' in-bingo' : ''}`);
      tile.dataset.animal = id; tile.setAttribute('aria-pressed', String(Boolean(spotted)));
      tile.setAttribute('aria-describedby', 'card-instructions');
      tile.setAttribute('aria-keyshortcuts', 'Shift+F10');
      tile.setAttribute('aria-label', `${animal.name}. Row ${Math.floor(index / 5) + 1}, column ${index % 5 + 1}. ${spotted ? 'Spotted' : 'Not yet spotted'}.`);
      const img = imageFor(animal, animal.forms[0], false, false); img.alt = '';
      tile.append(img, element('span', 'tile-name', animal.name));
      if (spotted) tile.append(element('span', 'tile-state', winningIds.has(id) ? '★' : '✓'));
      bindTileGestures(tile, id);
      return tile;
    }));
    if (focusedTile && !document.querySelector('dialog[open]')) $('bingo-board').querySelector(`[data-animal="${focusedTile}"]`)?.focus({ preventScroll: true });
    if (currentView === 'animals') renderCatalog();
    if ($('animal-dialog').open) updateAnimalAction();
  }
  function navigate(view) {
    viewScroll.set(currentView, window.scrollY);
    currentView = view;
    for (const name of ['bingo', 'animals', 'surprise']) $(`view-${name}`).hidden = view !== name;
    document.querySelectorAll('[data-view]').forEach(button => { if (button.dataset.view === view) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current'); });
    if (view === 'animals') renderCatalog();
    if (view === 'surprise') nextFact();
    $(`${view === 'bingo' ? 'bingo' : view}-title`).focus({ preventScroll: true });
    window.scrollTo(0, viewScroll.get(view) || 0);
  }
  function catalogCard(animal) {
    const spotted = state.spotted.includes(animal.id);
    const article = element('article', `guide-item${spotted ? ' is-selected' : ''}`), button = element('button');
    button.dataset.animal = animal.id;
    button.append(imageFor(animal), element('h3', '', animal.name), element('p', '', animal.cue), element('small', '', statusFor(animal)));
    button.addEventListener('click', () => openAnimal(animal.id)); article.append(button);
    if (!state.order.includes(animal.id)) return article;
    const mark = element('button', 'outline-button spot-button', spotted ? '✓ Spotted' : 'Mark spotted');
    mark.dataset.animal = animal.id;
    mark.setAttribute('aria-label', `${spotted ? 'Unmark' : 'Mark'} ${animal.name} as spotted`);
    mark.setAttribute('aria-pressed', String(spotted));
    mark.addEventListener('click', async () => {
      mark.disabled = true;
      try {
        await toggleSpotted(animal.id);
        $('guide-results').querySelector(`.spot-button[data-animal="${animal.id}"]`)?.focus({ preventScroll: true });
      } finally { mark.disabled = false; }
    });
    article.append(mark);
    return article;
  }
  function renderCatalog() {
    const query = $('guide-search').value.trim().toLowerCase(), group = $('guide-group').value;
    const filtered = animals.filter(animal => (group === 'All' || animal.group === group) && (!$('card-filter').checked || state.order.includes(animal.id)) && `${animal.name} ${animal.scientific} ${(animal.aliases || []).join(' ')} ${animal.cue} ${animal.look}`.toLowerCase().includes(query));
    $('guide-count').textContent = `${filtered.length} ${filtered.length === 1 ? 'entry' : 'entries'}`;
    $('guide-empty').hidden = filtered.length !== 0;
    $('guide-results').replaceChildren(...filtered.map(animal => catalogCard(animal)));
  }
  function updateAnimalAction() {
    const onCard = state.order.includes(selectedAnimal.id), spotted = state.spotted.includes(selectedAnimal.id);
    $('animal-status').textContent = statusFor(selectedAnimal);
    $('animal-spot-button').hidden = !onCard;
    $('animal-spot-button').textContent = spotted ? 'Undo spotted' : 'Mark spotted';
    $('animal-spot-button').setAttribute('aria-pressed', String(spotted));
  }
  function openAnimal(id) {
    selectedAnimal = byId.get(id);
    selectedCardId = state.id;
    formIndex = 0;
    $('animal-name').textContent = selectedAnimal.name;
    $('animal-scientific').textContent = selectedAnimal.scientific;
    $('animal-status').textContent = statusFor(selectedAnimal);
    $('animal-cue').textContent = selectedAnimal.cue;
    $('animal-look').textContent = selectedAnimal.look;
    $('animal-flight-guide').hidden = !selectedAnimal.silhouette;
    const cautions = [];
    if (id === 'jumping-fish') cautions.push('Spot a fish leaping out of the water, rather than just a splash.');
    $('animal-caution').textContent = cautions.join(' '); $('animal-caution').hidden = cautions.length === 0;
    $('animal-facts').replaceChildren(...facts.filter(fact => fact.animalId === id).map(fact => {
      const item = element('li');
      item.append(element('p', '', fact.text));
      return item;
    }));
    updateAnimalAction();
    renderForms(); showDialog('animal-dialog'); $('animal-dialog').querySelector('.dialog-body').scrollTop = 0;
  }
  function openRaptorGuide() {
    const largestSpan = Math.max(...raptorGuides.map(animal => animal.silhouette.referenceSpanCm));
    $('raptor-grid').replaceChildren(...raptorGuides.map(animal => {
      const guide = animal.silhouette;
      const card = element('article', 'raptor-card');
      card.dataset.raptor = animal.id;
      const art = element('div', 'raptor-art');
      const image = element('img');
      image.src = guide.image;
      image.alt = `${animal.name} flight outline: ${guide.outline}`;
      image.style.width = `${guide.referenceSpanCm / largestSpan * 100}%`;
      art.append(image);
      const [minimum, maximum] = guide.wingspanCm;
      const metric = minimum === maximum ? `${minimum}` : `${minimum}–${maximum}`;
      const imperial = minimum === maximum ? `${Math.round(minimum / 2.54)}` : `${Math.round(minimum / 2.54)}–${Math.round(maximum / 2.54)}`;
      card.append(art, element('h3', '', animal.name), element('p', 'raptor-span', `Wingspan ${metric} cm · ${imperial} in`), element('p', '', guide.outline), element('p', 'raptor-flight', guide.flight));
      return card;
    }));
    showDialog('raptor-dialog');
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
      const figure = element('figure'); figure.append(imageFor(selectedAnimal, form, true, false));
      if (compare) figure.append(element('figcaption', '', form.label));
      return figure;
    }));
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
  function nextFact() {
    if (!factBag.length) {
      factBag = core.shuffle(facts);
      if (currentFact && factBag[factBag.length - 1].id === currentFact.id) [factBag[0], factBag[factBag.length - 1]] = [factBag[factBag.length - 1], factBag[0]];
    }
    currentFact = factBag.pop();
    const animal = byId.get(currentFact.animalId);
    $('fact-image').replaceChildren(imageFor(animal, animal.forms[0], true, false));
    $('fact-animal').textContent = animal.name; $('fact-text').textContent = currentFact.text;
  }
  function sharedState(shared, revision) {
    return { ...core.createState(drawIds, { revision }), pool: shared.pool, order: [...shared.order] };
  }
  function clearCardLink() {
    const url = new URL(location.href), params = new URLSearchParams(url.hash.slice(1));
    if (!params.has('card')) return;
    params.delete('card'); url.hash = params.toString();
    history.replaceState(history.state, '', url);
  }
  function readCardLink() {
    const params = new URLSearchParams(location.hash.slice(1));
    if (!params.has('card')) return null;
    const shared = core.readCardCode(params.get('card'), ids, cardIds);
    if (!shared) tell('That shared card link couldn’t be read.');
    if (!shared || shared.order.every((id, index) => id === state.order[index])) {
      clearCardLink();
      return null;
    }
    return shared;
  }
  function openCardLink() {
    const operation = changeQueue.then(() => withStorageLock(() => {
      const updated = readStoredChange(), shared = readCardLink();
      if (!shared) { if (updated) render(); return; }
      if (updated) render();
      showNewCard(shared);
    })).catch(error => tell(error.message));
    changeQueue = operation;
    return operation;
  }
  function showNewCard(shared = null) {
    pendingCard = { shared, cardId: state.id };
    $('reset-title').textContent = shared ? 'Play this bingo card?' : 'New bingo card?';
    $('reset-description').textContent = 'Your current marks will be cleared.';
    $('confirm-reset').textContent = shared ? 'Play this card' : 'New card';
    showDialog('reset-dialog');
  }
  async function shareCard() {
    const url = new URL(location.href); url.search = ''; url.hash = new URLSearchParams({ card: core.cardCode(state) }).toString();
    if (navigator.share) {
      try { await navigator.share({ title: 'Huron River Wildlife Bingo', text: 'Play the same card and spot your own wildlife.', url: url.href }); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(url.href); tell('Card link copied.'); }
    catch (_) { window.prompt('Copy this card link:', url.href); }
  }
  async function downloadBackup() {
    await changeQueue;
    const backup = { format: 'aarc-river-bingo', version: core.VERSION, state };
    const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }));
    const link = element('a'); link.href = url; link.download = 'river-bingo-backup.json';
    $('help-dialog').querySelector('.dialog-body').append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function clearBackupReview() {
    pendingRestore = null;
    $('backup-review').hidden = true;
    $('backup-status').textContent = '';
  }
  async function previewBackup(file) {
    clearBackupReview();
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { $('backup-status').textContent = 'Choose a bingo backup smaller than 2 MB.'; return; }
    try {
      const value = JSON.parse(await file.text());
      if (value?.format !== undefined && (value.format !== 'aarc-river-bingo' || ![1, 2, core.VERSION].includes(value.version) || value.version !== value.state?.version)) throw new Error('Invalid backup version');
      const raw = serialize(value?.format === 'aarc-river-bingo' ? value.state : value);
      const restored = core.restoreState(raw, ids, cardIds) || core.migratePrevious(raw, ids, cardIds);
      if (!restored) throw new Error('Invalid backup');
      pendingRestore = { state: restored, cardId: state.id, snapshot: serialize(state) };
      const count = restored.spotted.length;
      $('backup-preview').textContent = `Restore this card with ${count} marked ${count === 1 ? 'square' : 'squares'}? This replaces your current card and marks.`;
      $('backup-review').hidden = false;
    } catch (_) { $('backup-status').textContent = 'That file isn’t a valid bingo backup.'; }
  }

  document.querySelectorAll('[data-view],[data-go]').forEach(button => button.addEventListener('click', () => navigate(button.dataset.view || button.dataset.go)));
  $('bingo-home-link').addEventListener('click', event => { event.preventDefault(); navigate('bingo'); window.scrollTo(0, 0); });
  $('big-pictures').addEventListener('click', () => { $('card-filter').checked = true; $('guide-search').value = ''; $('guide-group').value = 'All'; navigate('animals'); });
  $('guide-search').addEventListener('input', renderCatalog); $('guide-group').addEventListener('change', renderCatalog); $('card-filter').addEventListener('change', renderCatalog);
  $('retry-storage').addEventListener('click', () => {
    if (storageBlocked) { tell('Saved data is unavailable or unreadable. Save a backup before clearing browser data, or play in this tab.'); return; }
    changeQueue = changeQueue.then(() => withStorageLock(() => {
      if (readStoredChange()) render();
      saveCard();
    })).catch(error => tell(error.message));
  });
  $('memory-mode').addEventListener('click', () => {
    memoryOnly = true; $('storage-notice').hidden = true; saveCard();
    tell('Playing in this tab. Save a backup to keep your marks.');
  });
  $('help-button').addEventListener('click', () => showDialog('help-dialog'));
  $('save-backup').addEventListener('click', downloadBackup);
  $('backup-file').addEventListener('change', event => { const file = event.target.files[0]; event.target.value = ''; previewBackup(file); });
  $('cancel-backup').addEventListener('click', clearBackupReview);
  $('help-dialog').addEventListener('close', clearBackupReview);
  $('restore-backup').addEventListener('click', async () => {
    const button = $('restore-backup'), backup = pendingRestore;
    if (!backup || button.disabled) return;
    button.disabled = true;
    try {
      const restored = await changeCard(current => ({ ...backup.state, revision: current.revision + 1 }), backup.cardId, backup.snapshot);
      clearBackupReview();
      if (restored) { $('help-dialog').close(); navigate('bingo'); window.scrollTo(0, 0); tell('Backup restored.'); }
      else $('backup-status').textContent = 'Your card changed. Choose the backup again to review it.';
    } finally { button.disabled = false; }
  });
  document.querySelectorAll('[data-external-name]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    $('external-link-title').textContent = `Visit ${link.dataset.externalName}?`;
    $('external-link-confirm').href = link.href;
    $('external-link-confirm').textContent = `Leave for ${link.dataset.externalName}`;
    showDialog('external-link-dialog');
  }));
  $('raptor-guide-button').addEventListener('click', openRaptorGuide);
  $('animal-flight-guide').addEventListener('click', openRaptorGuide);
  $('animal-spot-button').addEventListener('click', async () => {
    const button = $('animal-spot-button');
    if (button.disabled || button.hidden) return;
    button.disabled = true;
    try { if (await toggleSpotted(selectedAnimal.id, selectedCardId)) $('animal-dialog').close(); }
    finally { button.disabled = false; }
  });
  $('share-card').addEventListener('click', shareCard);
  $('new-card-button').addEventListener('click', () => {
    showNewCard();
  });
  $('reset-dialog').addEventListener('close', () => {
    if (pendingCard?.shared) clearCardLink();
    pendingCard = null;
  });
  $('confirm-reset').addEventListener('click', async () => {
    if (!pendingCard || $('confirm-reset').disabled) return;
    const choice = pendingCard;
    $('confirm-reset').disabled = true;
    try {
      const changed = await changeCard(current => choice.shared ? sharedState(choice.shared, current.revision + 1) : core.createState(drawIds, { revision: current.revision + 1 }), choice.cardId);
      if (changed) $('reset-dialog').close();
      if (changed) { navigate('bingo'); window.scrollTo(0, 0); tell('New card ready.'); }
    } finally { $('confirm-reset').disabled = false; }
  });
  window.addEventListener('storage', async event => {
    if (event.key !== core.STORAGE_KEY && event.key !== null) return;
    try { await withStorageLock(() => { if (readStoredChange()) { stopFireworks(); render(); } }); }
    catch (error) { tell(error.message); }
  });
  window.addEventListener('hashchange', () => {
    if (new URLSearchParams(location.hash.slice(1)).has('card')) openCardLink();
  });
  $('next-fact').addEventListener('click', nextFact); $('fact-detail').addEventListener('click', () => openAnimal(currentFact.animalId));
  $('print-button').addEventListener('click', async () => {
    $('print-button').disabled = true;
    try { await Promise.all([...$('bingo-board').querySelectorAll('img')].map(img => { img.loading = 'eager'; if (img.complete && !img.naturalWidth) img.src = img.getAttribute('src'); return img.decode(); })); window.print(); }
    catch (_) { tell('A picture could not load. Try Print card again.'); }
    finally { $('print-button').disabled = false; }
  });
  withStorageLock(initialize);
})();
