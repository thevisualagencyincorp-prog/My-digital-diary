/* My Digital Diary — app logic */
'use strict';

/* ════════════════════════════════════
   PIN LOCK
═══════════════════════════════════════ */
const PIN_HASH_KEY    = 'diary_pin_hash';
const SESSION_KEY     = 'diary_unlocked';
const PIN_LENGTH      = 4;

const lockScreen  = document.getElementById('lock-screen');
const pinForm     = document.getElementById('pin-form');
const pinInput    = document.getElementById('pin-input');
const pinDots     = document.querySelectorAll('.pin-dot');
const pinKeys     = document.querySelectorAll('.pin-key[data-digit]');
const pinClear    = document.getElementById('pin-clear');
const pinDel      = document.getElementById('pin-del');
const lockSubtitle = document.getElementById('lock-subtitle');
const lockError   = document.getElementById('lock-error');

let pinBuffer = '';
let isSettingPin = false;
let pendingPin   = '';   // first entry when creating a new PIN

function bufToHex(buf) {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function hexToBuf(hex) {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < arr.length; i++) arr[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return arr.buffer;
}

async function hashPin(pin, saltHex) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', enc.encode(pin), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: hexToBuf(saltHex), iterations: 200000 },
    keyMaterial, 256
  );
  return bufToHex(bits);
}

function randomSaltHex() {
  const salt = new Uint8Array(16);
  crypto.getRandomValues(salt);
  return bufToHex(salt.buffer);
}

function updatePinDots() {
  pinDots.forEach((dot, i) => {
    dot.classList.toggle('filled', i < pinBuffer.length);
    dot.classList.remove('error');
  });
}

function showPinError(msg) {
  lockError.textContent = msg;
  lockError.classList.remove('hidden');
  pinDots.forEach(d => d.classList.add('error'));
  setTimeout(() => {
    lockError.classList.add('hidden');
    pinDots.forEach(d => d.classList.remove('error'));
    pinBuffer = '';
    updatePinDots();
  }, 1200);
}

async function handlePinSubmit() {
  if (pinBuffer.length < PIN_LENGTH) return;
  const entered = pinBuffer;
  pinBuffer = '';
  updatePinDots();

  const storedRaw = localStorage.getItem(PIN_HASH_KEY);

  if (!storedRaw) {
    // First-time setup
    if (!isSettingPin) {
      isSettingPin = true;
      pendingPin   = entered;
      lockSubtitle.textContent = 'Confirm your new PIN';
    } else {
      if (entered !== pendingPin) {
        isSettingPin = false;
        pendingPin   = '';
        lockSubtitle.textContent = 'Create a 4-digit PIN';
        showPinError("PINs didn't match — try again");
      } else {
        const saltHex = randomSaltHex();
        const hash    = await hashPin(entered, saltHex);
        localStorage.setItem(PIN_HASH_KEY, JSON.stringify({ hash, salt: saltHex }));
        unlockDiary();
      }
    }
  } else {
    // Verify PIN
    const { hash: storedHash, salt: saltHex } = JSON.parse(storedRaw);
    const hash = await hashPin(entered, saltHex);
    if (hash === storedHash) {
      unlockDiary();
    } else {
      showPinError('Incorrect PIN');
    }
  }
}

function unlockDiary() {
  sessionStorage.setItem(SESSION_KEY, '1');
  lockScreen.classList.add('hidden');
  lockScreen.setAttribute('aria-hidden', 'true');
  document.getElementById('btn-new-entry').focus();
}

function appendPinDigit(digit) {
  if (pinBuffer.length >= PIN_LENGTH) return;
  pinBuffer += digit;
  updatePinDots();
  if (pinBuffer.length === PIN_LENGTH) handlePinSubmit();
}

// Keypad button clicks
pinKeys.forEach(btn => {
  btn.addEventListener('click', () => appendPinDigit(btn.dataset.digit));
});
pinDel.addEventListener('click', () => {
  pinBuffer = pinBuffer.slice(0, -1);
  updatePinDots();
});
pinClear.addEventListener('click', () => {
  pinBuffer = '';
  updatePinDots();
});

// Physical keyboard support
document.addEventListener('keydown', e => {
  if (lockScreen.classList.contains('hidden')) return;
  if (/^[0-9]$/.test(e.key)) { appendPinDigit(e.key); return; }
  if (e.key === 'Backspace') { pinBuffer = pinBuffer.slice(0, -1); updatePinDots(); }
  if (e.key === 'Escape')    { pinBuffer = ''; updatePinDots(); }
});

function initLock() {
  const alreadyUnlocked = sessionStorage.getItem(SESSION_KEY) === '1';
  if (alreadyUnlocked) { return; }

  const hasPin = !!localStorage.getItem(PIN_HASH_KEY);
  lockSubtitle.textContent = hasPin ? 'Enter your 4-digit PIN' : 'Create a 4-digit PIN';
  lockScreen.classList.remove('hidden');
  lockScreen.removeAttribute('aria-hidden');
}

initLock();

/* ── CONSTANTS ── */
const STORAGE_KEY = 'digital_diary_entries';
const MOOD_LABELS = {
  happy:    '😊 Happy',
  neutral:  '😐 Neutral',
  sad:      '😢 Sad',
  excited:  '🤩 Excited',
  anxious:  '😰 Anxious',
  grateful: '🙏 Grateful',
};
const MOOD_EMOJI = {
  happy:    '😊',
  neutral:  '😐',
  sad:      '😢',
  excited:  '🤩',
  anxious:  '😰',
  grateful: '🙏',
};

/* ── DOM REFS ── */
const viewHome   = document.getElementById('view-home');
const viewEditor = document.getElementById('view-editor');
const viewReader = document.getElementById('view-reader');

const entryList  = document.getElementById('entry-list');
const emptyState = document.getElementById('empty-state');

const searchInput  = document.getElementById('search-input');
const moodFilter   = document.getElementById('mood-filter');

const btnNewEntry  = document.getElementById('btn-new-entry');
const btnEmptyNew  = document.getElementById('btn-empty-new');
const btnHome      = document.getElementById('btn-home');
const btnBack      = document.getElementById('btn-back');
const btnBackReader = document.getElementById('btn-back-reader');
const btnEditReader = document.getElementById('btn-edit-reader');

const entryForm    = document.getElementById('entry-form');
const entryId      = document.getElementById('entry-id');
const entryDate    = document.getElementById('entry-date');
const entryMood    = document.getElementById('entry-mood');
const entryTitle   = document.getElementById('entry-title');
const entryTags    = document.getElementById('entry-tags');
const entryBody    = document.getElementById('entry-body');
const wordCount    = document.getElementById('word-count');
const editorLabel  = document.getElementById('editor-label');

const btnSave      = document.getElementById('btn-save');
const btnDelete    = document.getElementById('btn-delete');

const readerContent = document.getElementById('reader-content');

const toast           = document.getElementById('toast');
const dialogOverlay   = document.getElementById('dialog-overlay');
const dialogMsg       = document.getElementById('dialog-msg');
const dialogCancel    = document.getElementById('dialog-cancel');
const dialogConfirm   = document.getElementById('dialog-confirm');

/* ── STATE ── */
let entries     = [];
let activeEntry = null;   // id currently open in reader
let toastTimer  = null;

/* ════════════════════════════════════
   STORAGE
═══════════════════════════════════════ */
function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    entries = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(entries)) entries = [];
  } catch {
    entries = [];
  }
}

function saveEntries() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (err) {
    showToast('Could not save — storage full or unavailable.', true);
  }
}

/* ════════════════════════════════════
   UTILITIES
═══════════════════════════════════════ */
function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function formatDate(iso) {
  if (!iso) return '';
  // parse as local date to avoid timezone shift
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

function todayISO() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function countWords(text) {
  return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
}

function parseTags(raw) {
  return raw
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(t => t.length > 0 && t.length <= 40);
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ════════════════════════════════════
   TOAST
═══════════════════════════════════════ */
function showToast(msg, isError = false) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.remove('hidden');
  toast.style.borderColor = isError ? '#ff4d4d' : 'var(--accent)';
  toast.style.color        = isError ? '#ff4d4d' : 'var(--accent)';
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2800);
}

/* ════════════════════════════════════
   VIEW ROUTER
═══════════════════════════════════════ */
function showView(name) {
  viewHome.classList.toggle('hidden',   name !== 'home');
  viewEditor.classList.toggle('hidden', name !== 'editor');
  viewReader.classList.toggle('hidden', name !== 'reader');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ════════════════════════════════════
   RENDER — HOME
═══════════════════════════════════════ */
function renderHome() {
  const query = searchInput.value.trim().toLowerCase();
  const mood  = moodFilter.value;

  const filtered = entries.filter(e => {
    const matchesMood  = !mood || e.mood === mood;
    const matchesQuery = !query
      || e.title.toLowerCase().includes(query)
      || e.body.toLowerCase().includes(query)
      || (e.tags || []).some(t => t.includes(query));
    return matchesMood && matchesQuery;
  });

  // Sort newest first
  const sorted = [...filtered].sort((a, b) => {
    if (b.date !== a.date) return b.date.localeCompare(a.date);
    return b.createdAt - a.createdAt;
  });

  entryList.innerHTML = '';

  if (sorted.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  sorted.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'entry-card';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${entry.title}, ${formatDate(entry.date)}`);

    const tagsHtml = (entry.tags || [])
      .map(t => `<span class="tag">${escapeHtml(t)}</span>`)
      .join('');

    card.innerHTML = `
      <div class="card-meta">
        <span class="card-date">${escapeHtml(formatDate(entry.date))}</span>
        <span class="card-mood" title="${MOOD_LABELS[entry.mood] || ''}">${MOOD_EMOJI[entry.mood] || ''}</span>
      </div>
      <h2 class="card-title">${escapeHtml(entry.title)}</h2>
      <p class="card-excerpt">${escapeHtml(entry.body.slice(0, 160))}</p>
      ${tagsHtml ? `<div class="card-tags">${tagsHtml}</div>` : ''}
    `;

    card.addEventListener('click', () => openReader(entry.id));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openReader(entry.id); }
    });
    entryList.appendChild(card);
  });
}

/* ════════════════════════════════════
   EDITOR
═══════════════════════════════════════ */
function openEditor(id = null) {
  entryForm.reset();
  wordCount.textContent = '0 words';

  if (id) {
    const entry = entries.find(e => e.id === id);
    if (!entry) return;
    entryId.value    = entry.id;
    entryDate.value  = entry.date;
    entryMood.value  = entry.mood;
    entryTitle.value = entry.title;
    entryTags.value  = (entry.tags || []).join(', ');
    entryBody.value  = entry.body;
    wordCount.textContent = `${countWords(entry.body)} words`;
    editorLabel.textContent = 'Edit Entry';
    btnDelete.classList.remove('hidden');
  } else {
    entryId.value   = '';
    entryDate.value = todayISO();
    editorLabel.textContent = 'New Entry';
    btnDelete.classList.add('hidden');
  }

  showView('editor');
  entryTitle.focus();
}

function saveEntry(e) {
  e.preventDefault();

  const title = entryTitle.value.trim();
  const body  = entryBody.value.trim();
  const date  = entryDate.value;

  if (!title) { showToast('Please add a title.', true); entryTitle.focus(); return; }
  if (!body)  { showToast('Please write something.', true); entryBody.focus(); return; }
  if (!date)  { showToast('Please pick a date.', true); entryDate.focus(); return; }

  const id = entryId.value;
  const tags = parseTags(entryTags.value);

  if (id) {
    const idx = entries.findIndex(e => e.id === id);
    if (idx !== -1) {
      entries[idx] = { ...entries[idx], title, body, date, mood: entryMood.value, tags, updatedAt: Date.now() };
      showToast('Entry updated ✓');
    }
  } else {
    const newEntry = {
      id: generateId(),
      title,
      body,
      date,
      mood: entryMood.value,
      tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    entries.unshift(newEntry);
    showToast('Entry saved ✓');
  }

  saveEntries();
  renderHome();
  showView('home');
}

/* ════════════════════════════════════
   READER
═══════════════════════════════════════ */
function openReader(id) {
  const entry = entries.find(e => e.id === id);
  if (!entry) return;
  activeEntry = id;

  const tagsHtml = (entry.tags || [])
    .map(t => `<span class="tag">${escapeHtml(t)}</span>`)
    .join('');

  readerContent.innerHTML = `
    <div class="reader-meta">
      <span class="reader-mood" title="${MOOD_LABELS[entry.mood] || ''}">${MOOD_EMOJI[entry.mood] || ''}</span>
      <span>${escapeHtml(formatDate(entry.date))}</span>
      ${entry.updatedAt !== entry.createdAt
        ? `<span>· edited</span>`
        : ''}
    </div>
    <h1 class="reader-title">${escapeHtml(entry.title)}</h1>
    ${tagsHtml ? `<div class="reader-tags">${tagsHtml}</div>` : ''}
    <hr class="reader-divider">
    <p class="reader-body">${escapeHtml(entry.body)}</p>
  `;

  showView('reader');
}

/* ════════════════════════════════════
   DELETE
═══════════════════════════════════════ */
function confirmDelete() {
  dialogOverlay.classList.remove('hidden');
  dialogConfirm.focus();
}

function deleteEntry() {
  if (!entryId.value && !activeEntry) return;
  const id = entryId.value || activeEntry;
  entries = entries.filter(e => e.id !== id);
  saveEntries();
  renderHome();
  dialogOverlay.classList.add('hidden');
  showView('home');
  showToast('Entry deleted.');
}

/* ════════════════════════════════════
   WORD COUNT (live)
═══════════════════════════════════════ */
entryBody.addEventListener('input', () => {
  const n = countWords(entryBody.value);
  wordCount.textContent = `${n} word${n !== 1 ? 's' : ''}`;
});

/* ════════════════════════════════════
   EVENT BINDINGS
═══════════════════════════════════════ */
btnNewEntry.addEventListener('click',  () => openEditor());
btnEmptyNew.addEventListener('click',  () => openEditor());
btnHome.addEventListener('click', e  => { e.preventDefault(); showView('home'); renderHome(); });
btnBack.addEventListener('click',      () => { showView('home'); renderHome(); });
btnBackReader.addEventListener('click',() => { activeEntry = null; showView('home'); renderHome(); });
btnEditReader.addEventListener('click',() => { if (activeEntry) openEditor(activeEntry); });

entryForm.addEventListener('submit', saveEntry);
btnDelete.addEventListener('click',  confirmDelete);

searchInput.addEventListener('input', renderHome);
moodFilter.addEventListener('change', renderHome);

dialogCancel.addEventListener('click',  () => dialogOverlay.classList.add('hidden'));
dialogConfirm.addEventListener('click', deleteEntry);

// Close dialog on overlay click
dialogOverlay.addEventListener('click', e => {
  if (e.target === dialogOverlay) dialogOverlay.classList.add('hidden');
});

// Keyboard: close dialog on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !dialogOverlay.classList.contains('hidden')) {
    dialogOverlay.classList.add('hidden');
  }
});

/* ════════════════════════════════════
   INIT
═══════════════════════════════════════ */
loadEntries();
renderHome();

// Show empty state immediately if no entries yet
if (entries.length === 0) {
  emptyState.classList.remove('hidden');
}
