/*
  Показ БЖУ (проценты или граммы) — переключатель на странице «Уведомления».
  Живёт здесь, потому что управляет строкой БЖУ в закреплённом сообщении бота —
  постоянном уведомлении, которое и настраивают на этом экране.

  Состояние приходит из общего запроса /api/profile (script.js диспатчит
  событие `profile:loaded`): поле profile.macrosDisplayMode ('PERCENT' | 'GRAMS',
  по умолчанию 'PERCENT').

  Сохранение — POST {apiBaseUrl}/api/settings с телом
    { initData, macrosDisplayMode: 'PERCENT' | 'GRAMS' }
  Ответ (если есть) — { macrosDisplayMode } — используем как канонический.
  Оптимистично применяем выбор, при ошибке откатываем и показываем текст.
*/
(function () {
  'use strict';

  const tg = window.Telegram?.WebApp;

  const API_BASE_URL =
    window.CaloriesMiniAppConfig?.apiBaseUrl || 'https://caloriesai.duckdns.org';
  const REQUEST_TIMEOUT_MS = 15000;

  const MODES = ['PERCENT', 'GRAMS'];
  const DEFAULT_MODE = 'PERCENT';

  // Динамические строки (ошибка сохранения). Статичные лейблы карточки берёт
  // script.js через data-i18n. Паритет RU+EN: ru → ru, всё остальное → en.
  const TRANSLATIONS = {
    ru: { saveError: 'Не удалось сохранить. Попробуйте ещё раз.' },
    en: { saveError: "Couldn't save. Please try again." }
  };

  function normalizeLocale(value) {
    if (!value) return null;
    const code = String(value).toLowerCase().split(/[-_]/)[0];
    if (!code) return null;
    return code === 'ru' ? 'ru' : 'en';
  }

  const urlLang = normalizeLocale(
    new URLSearchParams(window.location.search || '').get('lang')
  );
  let locale =
    urlLang ||
    normalizeLocale(tg?.initDataUnsafe?.user?.language_code) ||
    'en';
  let STR = TRANSLATIONS[locale];

  function setLocale(next) {
    const normalized = normalizeLocale(next);
    if (!normalized || normalized === locale) return;
    locale = normalized;
    STR = TRANSLATIONS[locale];
  }

  const els = {
    card: document.getElementById('macros-card'),
    options: document.getElementById('macros-options'),
    error: document.getElementById('macros-error')
  };

  if (!els.card || !els.options) return; // каркас без карточки — нечего инициализировать

  const buttons = Array.from(els.options.querySelectorAll('[data-mode]'));
  if (!buttons.length) return;

  // ── состояние ──────────────────────────────────────────────────
  let mode = DEFAULT_MODE;
  let saving = false;

  // Неизвестное значение с бэкенда не должно снимать выделение со всех кнопок.
  function normalizeMode(value) {
    const upper = String(value || '').trim().toUpperCase();
    return MODES.includes(upper) ? upper : DEFAULT_MODE;
  }

  function getInitDataString() {
    return tg?.initData || window.Telegram?.WebApp?.initData || '';
  }

  function clearError() {
    els.error.hidden = true;
    els.error.textContent = '';
  }

  function showError(message) {
    els.error.textContent = message;
    els.error.hidden = false;
  }

  function render() {
    els.card.hidden = false;
    buttons.forEach((button) => {
      const selected = button.dataset.mode === mode;
      button.classList.toggle('segmented__option--active', selected);
      button.setAttribute('aria-checked', selected ? 'true' : 'false');
      button.disabled = saving;
    });
  }

  // ── сохранение ──────────────────────────────────────────────────
  async function persist(next) {
    const prev = mode;
    // Оптимистично применяем — UI ощущается мгновенным.
    mode = next;
    saving = true;
    render();
    clearError();

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        mode: 'cors',
        body: JSON.stringify({
          initData: getInitDataString(),
          macrosDisplayMode: next
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Если бэкенд вернул канонический режим — используем его.
      let body = null;
      try {
        body = await response.json();
      } catch (_) {
        body = null;
      }
      if (body && typeof body.macrosDisplayMode === 'string') {
        mode = normalizeMode(body.macrosDisplayMode);
      }
    } catch (error) {
      console.error('Failed to save macros display mode', error);
      // Откатываем оптимистичное изменение.
      mode = prev;
      showError(STR.saveError);
    } finally {
      window.clearTimeout(timeout);
      saving = false;
      render();
    }
  }

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      if (saving) return;
      const next = normalizeMode(button.dataset.mode);
      if (next === mode) return;
      persist(next);
    });
  });

  // ── инициализация ───────────────────────────────────────────────
  function init(profile) {
    // Старый бэкенд без поля не должен выглядеть как «ничего не выбрано».
    mode = normalizeMode(profile?.macrosDisplayMode);
    render();
  }

  document.addEventListener('profile:loaded', (event) => {
    const detail = event.detail || {};
    const profile = detail.profile || detail;
    setLocale(detail.locale || profile?.locale);
    init(profile);
  });
})();
