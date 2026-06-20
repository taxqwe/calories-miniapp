const tg = window.Telegram?.WebApp;

tg?.ready();
tg?.expand();

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

function applyTheme(themeParams = {}, colorScheme = tg?.colorScheme) {
  const root = document.documentElement;
  const isLight = colorScheme === 'light';

  // В тёмной теме поверхности задаём хардкодом, как в разделе Statistics,
  // чтобы не зависеть от themeParams.bg_color (у некоторых тем = #000000).
  // В светлой теме поведение прежнее: фон из themeParams или светлые дефолты.
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

// ── строки (RU + EN) ──────────────────────────────────────────────
// Паритет только RU+EN: ru → ru, всё остальное → en (по решению владельца).
const translations = {
  ru: {
    pageTitle: 'Профиль',
    subtitleFallback: 'Ваш профиль',
    statusLoading: 'Загружаем профиль…',
    cardTier: 'Тариф',
    cardNorm: 'Норма и цель',
    cardReminders: 'Напоминания',
    rowLanguage: 'Язык',
    navHistory: 'История',
    navStats: 'Статистика',
    navProfile: 'Профиль',
    tierPremium: 'Premium',
    tierBasic: 'Базовый',
    tierActiveUntil: 'активен до',
    goalDeficit: 'Цель: дефицит',
    goalSurplus: 'Цель: профицит',
    normEdit: 'Изменить расчёт',
    normCalc: 'Рассчитать норму',
    normEmpty: 'Норма ещё не рассчитана. Рассчитайте дневную норму калорий.',
    loadError: 'Не удалось загрузить профиль. Попробуйте позже.',
    unit: 'ккал/день',
    expend: 'дневной расход',
    kcal: 'ккал'
  },
  en: {
    pageTitle: 'Profile',
    subtitleFallback: 'Your profile',
    statusLoading: 'Loading profile…',
    cardTier: 'Plan',
    cardNorm: 'Norm & goal',
    cardReminders: 'Reminders',
    rowLanguage: 'Language',
    navHistory: 'History',
    navStats: 'Stats',
    navProfile: 'Profile',
    tierPremium: 'Premium',
    tierBasic: 'Basic',
    tierActiveUntil: 'active until',
    goalDeficit: 'Goal: deficit',
    goalSurplus: 'Goal: surplus',
    normEdit: 'Edit calculation',
    normCalc: 'Calculate norm',
    normEmpty: 'Norm not calculated yet. Calculate your daily calorie norm.',
    loadError: "Couldn't load profile. Please try again later.",
    unit: 'kcal/day',
    expend: 'daily expenditure',
    kcal: 'kcal'
  }
};

const LANG_NAMES = {
  ru: 'Русский',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  pt: 'Português',
  uk: 'Українська'
};

// ── элементы ──────────────────────────────────────────────────────
const els = {
  subtitle: document.getElementById('profile-subtitle'),
  status: document.getElementById('profile-status'),
  body: document.getElementById('profile-body'),
  tierBadge: document.getElementById('tier-badge'),
  tierBadgeIcon: document.getElementById('tier-badge-icon'),
  tierBadgeText: document.getElementById('tier-badge-text'),
  tierMeta: document.getElementById('tier-meta'),
  tierExpires: document.getElementById('tier-expires'),
  normValue: document.getElementById('norm-value'),
  normMeta: document.getElementById('norm-meta'),
  normTdee: document.getElementById('norm-tdee'),
  goalChip: document.getElementById('goal-chip'),
  normEmpty: document.getElementById('norm-empty'),
  normEditLink: document.getElementById('norm-edit-link'),
  normEditLabel: document.getElementById('norm-edit-label'),
  languageValue: document.getElementById('language-value')
};

const PREMIUM_STAR_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8z"/></svg>';

// ── утилиты ───────────────────────────────────────────────────────
function getInitDataString() {
  return tg?.initData || window.Telegram?.WebApp?.initData || '';
}

// Локаль форматирования чисел/дат: ru → ru-RU, en → en-US.
function intlLocale() {
  return resolveLocale() === 'ru' ? 'ru-RU' : 'en-US';
}

function formatNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.round(n).toLocaleString(intlLocale());
}

function formatDate(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  try {
    return date.toLocaleDateString(intlLocale(), { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (error) {
    return null;
  }
}

function languageName(locale) {
  if (!locale) return null;
  const code = String(locale).toLowerCase().split(/[-_]/)[0];
  return LANG_NAMES[code] || locale;
}

// Локаль из URL (?lang=) и из профиля (/api/profile.locale).
const urlLangParam = new URLSearchParams(window.location.search || '').get('lang');
let profileLocale = null;

// Нормализуем до 2-букв; паритет RU+EN: ru → ru, всё остальное → en.
function normalizeLocale(value) {
  if (!value) return null;
  const code = String(value).toLowerCase().split(/[-_]/)[0];
  if (!code) return null;
  return code === 'ru' ? 'ru' : 'en';
}

// Приоритет источников языка (как в остальных разделах):
//   ?lang= → /api/profile.locale → tg language_code → дефолт (en).
function resolveLocale() {
  return (
    normalizeLocale(urlLangParam) ||
    normalizeLocale(profileLocale) ||
    normalizeLocale(tg?.initDataUnsafe?.user?.language_code) ||
    'en'
  );
}

// Активный словарь — пересчитывается при каждом обращении к resolveLocale.
function t() {
  return translations[resolveLocale()] || translations.en;
}

function withLang(href) {
  const locale = resolveLocale();
  const url = new URL(href, window.location.href);
  url.searchParams.set('lang', locale);
  return url.pathname + url.search + url.hash;
}

function setSubtitle() {
  const user = tg?.initDataUnsafe?.user;
  const parts = [];
  if (user?.first_name) parts.push(user.first_name);
  if (user?.username) parts.push('@' + user.username);
  els.subtitle.textContent = parts.length ? parts.join(' · ') : t().subtitleFallback;
}

// ── рендер ────────────────────────────────────────────────────────
function renderTier(subscription) {
  const tier = subscription?.tier;
  const isPremium = tier && tier !== 'BASIC';
  if (isPremium) {
    els.tierBadge.classList.remove('tier__badge--basic');
    els.tierBadgeIcon.innerHTML = PREMIUM_STAR_SVG;
    els.tierBadgeText.textContent = t().tierPremium;
    const until = formatDate(subscription?.expiresAt);
    if (until) {
      els.tierExpires.textContent = until;
      els.tierMeta.hidden = false;
    } else {
      els.tierMeta.hidden = true;
    }
  } else {
    els.tierBadge.classList.add('tier__badge--basic');
    els.tierBadgeIcon.innerHTML = '';
    els.tierBadgeText.textContent = t().tierBasic;
    els.tierMeta.hidden = true;
  }
}

const DEFAULT_GOAL_SHIFT = 300;

function renderNorm(norm, goal) {
  const s = t();
  const tdeeValue = Number(norm?.tdee);
  const hasNorm = Number.isFinite(tdeeValue);
  const tdee = formatNumber(tdeeValue);

  if (hasNorm) {
    const hasCustom = Boolean(goal) && goal.customCalories != null && Number.isFinite(Number(goal.customCalories));
    const isDeficit = goal?.type === 'deficit';
    const isSurplus = goal?.type === 'surplus';

    let targetValue = tdeeValue;
    if (hasCustom) {
      targetValue = Number(goal.customCalories);
    } else if (isDeficit) {
      targetValue = tdeeValue - DEFAULT_GOAL_SHIFT;
    } else if (isSurplus) {
      targetValue = tdeeValue + DEFAULT_GOAL_SHIFT;
    }

    els.normValue.innerHTML = `${formatNumber(targetValue)} <span class="unit">${s.unit}</span>`;
    els.normTdee.textContent = `${tdee} ${s.kcal}`;
    // «дневной расход» показываем только когда цель реально сдвигает число (иначе target == tdee и это дубль).
    els.normMeta.hidden = targetValue === tdeeValue;
    els.normEmpty.hidden = true;

    if (isDeficit || isSurplus) {
      const label = isDeficit ? s.goalDeficit : s.goalSurplus;
      const diff = targetValue - tdeeValue;
      if (diff !== 0) {
        const sign = diff > 0 ? '+' : '−';
        els.goalChip.textContent = `${label} ${sign}${formatNumber(Math.abs(diff))}`;
      } else {
        els.goalChip.textContent = label;
      }
      els.goalChip.hidden = false;
    } else {
      els.goalChip.hidden = true;
    }

    els.normEditLabel.textContent = s.normEdit;
    els.normEditLink.setAttribute('href', withLang('../bmr/index.html?mode=edit'));
  } else {
    // Норма ещё не рассчитана — ведём на первичный расчёт.
    els.normValue.innerHTML = `— <span class="unit">${s.unit}</span>`;
    els.normMeta.hidden = true;
    els.goalChip.hidden = true;
    els.normEmpty.hidden = false;
    els.normEditLabel.textContent = s.normCalc;
    els.normEditLink.setAttribute('href', withLang('../bmr/'));
  }
}

function renderMisc(locale) {
  els.languageValue.textContent = languageName(locale) || '—';
}

// Статичные лейблы (RU отрисован в HTML до JS) — свапаем на EN при en-локали.
// data-i18n помечает узел, текст которого нужно заменить по ключу словаря.
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

// Пробрасываем текущий ?lang= на все ссылки нижней навигации, чтобы язык
// сохранялся при переходах между разделами.
function applyNavLang() {
  ['nav-history', 'nav-stats', 'nav-profile'].forEach((id) => {
    const link = document.getElementById(id);
    if (!link) return;
    const url = new URL(link.getAttribute('href'), window.location.href);
    url.searchParams.set('lang', resolveLocale());
    link.setAttribute('href', url.pathname + url.search + url.hash);
  });
}

function render(profile) {
  profileLocale = profile?.locale || null;
  // Локаль могла уточниться из профиля (когда ?lang= нет) — перерисуем статику.
  applyStaticI18n();
  applyNavLang();
  renderTier(profile?.subscription);
  renderNorm(profile?.norm, profile?.goal);
  renderMisc(profile?.locale);
  els.status.hidden = true;
  els.body.hidden = false;
  // Передаём профиль модулю напоминаний (reminders.js): полный профиль +
  // резолвнутую локаль, чтобы карточка напоминаний переводилась тем же языком.
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

// ── загрузка ──────────────────────────────────────────────────────
async function loadProfile() {
  const initData = getInitDataString();
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
      body: JSON.stringify({ initData }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const profile = await response.json();
    render(profile);
  } catch (error) {
    console.error('Failed to load profile', error);
    showError();
  } finally {
    window.clearTimeout(timeout);
  }
}

applyStaticI18n();
applyNavLang();
setSubtitle();
loadProfile();
