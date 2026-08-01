/*
  Уведомления — подстраница Профиля.

  Собирает только каркас: тема, язык, загрузка профиля и событие
  `profile:loaded`. Сами карточки рисуют reminders.js (POST /api/reminders) и
  digest.js (POST /api/settings) — те же модули, что раньше жили на Профиле,
  поэтому разметка карточек и модалок перенесена сюда без изменений.
*/
const tg = window.Telegram?.WebApp;

tg?.ready();
tg?.expand();

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

// Токены темы — копия из profile/script.js: каждая страница мини-аппа
// раскрашивает себя сама (общего модуля темы в проекте нет).
function applyTheme(themeParams = {}, colorScheme = tg?.colorScheme) {
  const root = document.documentElement;
  const isLight = colorScheme === 'light';

  const background = isLight ? (themeParams.bg_color || '#ffffff') : '#1c1c1e';
  const secondaryBackground = isLight ? (themeParams.secondary_bg_color || '#f3f4f6') : '#2c2c2e';
  const textColor = themeParams.text_color || (isLight ? '#1f2933' : '#ffffff');
  const hintColor = themeParams.hint_color || (isLight ? '#6b7a8c' : '#a0a0a0');
  const accentColor = '#ff6422';
  const accentContrast = '#ffffff';
  const destructiveColor = themeParams.destructive_text_color || '#ff5c5c';

  root.style.setProperty('--bg-color', background);
  root.style.setProperty('--card-bg', secondaryBackground);
  root.style.setProperty('--card-elevated-bg', isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.04)');
  root.style.setProperty('--text-color', textColor);
  root.style.setProperty('--text-secondary', hintColor);
  root.style.setProperty('--accent-color', accentColor);
  root.style.setProperty('--accent-contrast', accentContrast);
  root.style.setProperty('--destructive-color', destructiveColor);
  root.style.setProperty('--track-color', isLight ? '#d6dae0' : '#48484a');
  root.style.setProperty('--separator-color', isLight ? 'rgba(15, 23, 42, 0.1)' : 'rgba(255, 255, 255, 0.08)');
  root.style.setProperty('--border-color', isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.06)');
  root.style.setProperty('--shadow-soft', isLight ? '0 4px 14px rgba(15, 23, 42, 0.12)' : '0 6px 16px rgba(0, 0, 0, 0.18)');
}

if (tg) {
  applyTheme(tg.themeParams, tg.colorScheme);
  tg.onEvent('themeChanged', () => applyTheme(tg.themeParams, tg.colorScheme));
}

const API_BASE_URL =
  window.CaloriesMiniAppConfig?.apiBaseUrl ||
  'https://caloriesai.duckdns.org';

const REQUEST_TIMEOUT_MS = 15000;

// Паритет только RU+EN, как на остальных экранах.
const translations = {
  ru: {
    pageTitle: 'Уведомления',
    backLabel: 'Профиль',
    statusLoading: 'Загружаем настройки…',
    loadError: 'Не удалось загрузить настройки. Попробуйте позже.',
    cardReminders: 'Напоминания',
    cardDigest: 'Еженедельный отчёт',
    digestToggleLabel: 'Присылать раз в неделю',
    digestNote: 'Итоги недели: калории, дни в цели и прогресс.',
    navHistory: 'История',
    navStats: 'Статистика',
    navProfile: 'Профиль'
  },
  en: {
    pageTitle: 'Notifications',
    backLabel: 'Profile',
    statusLoading: 'Loading settings…',
    loadError: "Couldn't load settings. Please try again later.",
    cardReminders: 'Reminders',
    cardDigest: 'Weekly digest',
    digestToggleLabel: 'Send once a week',
    digestNote: 'Weekly summary: calories, days on goal, and progress.',
    navHistory: 'History',
    navStats: 'Stats',
    navProfile: 'Profile'
  }
};

const els = {
  status: document.getElementById('profile-status'),
  body: document.getElementById('profile-body'),
  back: document.getElementById('back-btn')
};

function getInitDataString() {
  return tg?.initData || window.Telegram?.WebApp?.initData || '';
}

const urlLangParam = new URLSearchParams(window.location.search || '').get('lang');
let profileLocale = null;

function normalizeLocale(value) {
  if (!value) return null;
  const code = String(value).toLowerCase().split(/[-_]/)[0];
  if (!code) return null;
  return code === 'ru' ? 'ru' : 'en';
}

// Приоритет источников языка — как на Профиле:
//   ?lang= → /api/profile.locale → tg language_code → дефолт (en).
function resolveLocale() {
  return (
    normalizeLocale(urlLangParam) ||
    normalizeLocale(profileLocale) ||
    normalizeLocale(tg?.initDataUnsafe?.user?.language_code) ||
    'en'
  );
}

function t() {
  return translations[resolveLocale()] || translations.en;
}

function withLang(href) {
  const url = new URL(href, window.location.href);
  url.searchParams.set('lang', resolveLocale());
  return url.pathname + url.search + url.hash;
}

function applyStaticI18n() {
  const s = t();
  document.documentElement.lang = resolveLocale();
  document.title = s.pageTitle;
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.getAttribute('data-i18n');
    if (key && Object.prototype.hasOwnProperty.call(s, key)) {
      node.textContent = s[key];
    }
  });
}

function applyNavLang() {
  ['nav-history', 'nav-stats', 'nav-profile'].forEach((id) => {
    const link = document.getElementById(id);
    if (!link) return;
    link.setAttribute('href', withLang(link.getAttribute('href')));
  });
}

// Нижняя навигация — переход через location.replace, чтобы webview не копил
// историю вкладок (как на Профиле, Истории и Статистике).
function setupNavClickInterception() {
  ['nav-history', 'nav-stats', 'nav-profile'].forEach((id) => {
    const link = document.getElementById(id);
    if (!link) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.replace(link.getAttribute('href'));
    });
  });
}

// Это подстраница Профиля, поэтому «назад» ведёт на Профиль: и своей кнопкой
// в шапке, и системной кнопкой Telegram.
function goBackToProfile() {
  window.location.replace(withLang('../index.html'));
}

function setupBack() {
  els.back?.addEventListener('click', goBackToProfile);
  if (tg?.BackButton) {
    try {
      tg.BackButton.show();
      tg.BackButton.onClick(goBackToProfile);
    } catch (_) { /* noop */ }
  }
}

function render(profile) {
  profileLocale = profile?.locale || null;
  applyStaticI18n();
  applyNavLang();
  els.status.hidden = true;
  els.body.hidden = false;
  // Карточки рисуют reminders.js и digest.js — им нужен полный профиль
  // и резолвнутая локаль.
  document.dispatchEvent(
    new CustomEvent('profile:loaded', {
      detail: { profile, locale: resolveLocale() }
    })
  );
}

function showError() {
  els.status.textContent = t().loadError;
  els.status.hidden = false;
  els.body.hidden = true;
}

async function loadProfile() {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify({ initData: getInitDataString() }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    render(await response.json());
  } catch (error) {
    console.error('Failed to load notification settings', error);
    showError();
  } finally {
    window.clearTimeout(timeout);
  }
}

applyStaticI18n();
applyNavLang();
setupNavClickInterception();
setupBack();
loadProfile();
