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

  const background = themeParams.bg_color || (isLight ? '#ffffff' : '#1c1c1e');
  const secondaryBackground = themeParams.secondary_bg_color || (isLight ? '#f3f4f6' : '#2c2c2e');
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

// ── строки (ru-first) ─────────────────────────────────────────────
const STR = {
  subtitleFallback: 'Ваш профиль',
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

function formatNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ');
}

function formatDate(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  try {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (error) {
    return null;
  }
}

function languageName(locale) {
  if (!locale) return null;
  const code = String(locale).toLowerCase().split(/[-_]/)[0];
  return LANG_NAMES[code] || locale;
}

function setSubtitle() {
  const user = tg?.initDataUnsafe?.user;
  const parts = [];
  if (user?.first_name) parts.push(user.first_name);
  if (user?.username) parts.push('@' + user.username);
  els.subtitle.textContent = parts.length ? parts.join(' · ') : STR.subtitleFallback;
}

// ── рендер ────────────────────────────────────────────────────────
function renderTier(subscription) {
  const tier = subscription?.tier;
  const isPremium = tier && tier !== 'BASIC';
  if (isPremium) {
    els.tierBadge.classList.remove('tier__badge--basic');
    els.tierBadgeIcon.innerHTML = PREMIUM_STAR_SVG;
    els.tierBadgeText.textContent = STR.tierPremium;
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
    els.tierBadgeText.textContent = STR.tierBasic;
    els.tierMeta.hidden = true;
  }
}

function renderNorm(norm, goal) {
  const tdee = formatNumber(norm?.tdee);
  // Целевые калории: пользовательское значение, иначе расход (tdee).
  const target =
    goal && Number.isFinite(Number(goal.customCalories))
      ? formatNumber(goal.customCalories)
      : tdee;
  const hasNorm = Boolean(norm && tdee);

  if (hasNorm) {
    els.normValue.innerHTML = `${target} <span class="unit">${STR.unit}</span>`;
    els.normTdee.textContent = `${tdee} ${STR.kcal}`;
    els.normMeta.hidden = false;
    els.normEmpty.hidden = true;

    if (goal?.type === 'deficit' || goal?.type === 'surplus') {
      const label = goal.type === 'deficit' ? STR.goalDeficit : STR.goalSurplus;
      const diff =
        Number.isFinite(Number(goal.customCalories)) && Number.isFinite(Number(norm?.tdee))
          ? Number(goal.customCalories) - Number(norm.tdee)
          : null;
      const sign = diff != null ? (diff > 0 ? ' +' : ' ') + formatNumber(diff) : '';
      els.goalChip.textContent = `${label}${sign}`;
      els.goalChip.hidden = false;
    } else {
      els.goalChip.hidden = true;
    }

    els.normEditLabel.textContent = STR.normEdit;
    els.normEditLink.setAttribute('href', '../bmr/index.html?mode=edit');
  } else {
    // Норма ещё не рассчитана — ведём на первичный расчёт.
    els.normValue.innerHTML = `— <span class="unit">${STR.unit}</span>`;
    els.normMeta.hidden = true;
    els.goalChip.hidden = true;
    els.normEmpty.hidden = false;
    els.normEditLabel.textContent = STR.normCalc;
    els.normEditLink.setAttribute('href', '../bmr/');
  }
}

function renderMisc(locale) {
  els.languageValue.textContent = languageName(locale) || '—';
}

function render(profile) {
  renderTier(profile?.subscription);
  renderNorm(profile?.norm, profile?.goal);
  renderMisc(profile?.locale);
  els.status.hidden = true;
  els.body.hidden = false;
}

function showError() {
  els.status.textContent = STR.loadError;
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

setSubtitle();
loadProfile();
