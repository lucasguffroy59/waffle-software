// ─── i18n ────────────────────────────────────────────────────

const SUPPORTED = ['fr', 'en'];
const FALLBACK   = 'en';

let translations = {};
let currentLang  = FALLBACK;

async function loadTranslations() {
  const res  = await fetch('i18n.json');
  translations = await res.json();
}

function detectLang() {
  const saved = localStorage.getItem('lang');
  if (saved && SUPPORTED.includes(saved)) return saved;

  const browser = (navigator.language || navigator.userLanguage || '').slice(0, 2).toLowerCase();
  return SUPPORTED.includes(browser) ? browser : FALLBACK;
}

function get(lang, key) {
  const parts = key.split('.');
  let node = translations[lang];
  for (const part of parts) {
    if (node == null) return null;
    node = node[part];
  }
  return node ?? null;
}

function t(key) {
  return get(currentLang, key) ?? get(FALLBACK, key) ?? key;
}

function applyTranslations() {
  document.documentElement.lang = currentLang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key   = el.getAttribute('data-i18n');
    const value = t(key);
    if (value !== null) el.textContent = value;
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
}

function setLang(lang) {
  if (!SUPPORTED.includes(lang)) return;
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyTranslations();
}

// ─── Init ────────────────────────────────────────────────────

document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => setLang(btn.dataset.lang));
});

loadTranslations().then(() => {
  currentLang = detectLang();
  applyTranslations();
});
