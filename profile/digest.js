/*
  Еженедельный отчёт (weekly digest) — тумблер в Профиле.

  Состояние приходит из общего запроса /api/profile (script.js диспатчит
  событие `profile:loaded`): поле profile.weeklyDigestEnabled (по умолчанию true).

  Сохранение — POST {apiBaseUrl}/api/settings с телом
    { initData, weeklyDigestEnabled: boolean }
  Ответ (если есть) — { weeklyDigestEnabled } — используем как канонический.
  Оптимистично применяем переключение, при ошибке откатываем и показываем текст.
*/
(function () {
  'use strict';

  const tg = window.Telegram?.WebApp;

  const API_BASE_URL =
    window.CaloriesMiniAppConfig?.apiBaseUrl || 'https://caloriesai.duckdns.org';
  const REQUEST_TIMEOUT_MS = 15000;

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
    card: document.getElementById('digest-card'),
    toggle: document.getElementById('digest-toggle'),
    error: document.getElementById('digest-error')
  };

  if (!els.card || !els.toggle) return; // каркас без карточки — нечего инициализировать

  // ── состояние ──────────────────────────────────────────────────
  let enabled = true;
  let saving = false;

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
    els.toggle.checked = enabled;
    els.toggle.disabled = saving;
  }

  // ── сохранение ──────────────────────────────────────────────────
  async function persist(next) {
    const prev = enabled;
    // Оптимистично применяем — UI ощущается мгновенным.
    enabled = next;
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
          weeklyDigestEnabled: next
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Если бэкенд вернул канонический флаг — используем его.
      let body = null;
      try {
        body = await response.json();
      } catch (_) {
        body = null;
      }
      if (body && typeof body.weeklyDigestEnabled === 'boolean') {
        enabled = body.weeklyDigestEnabled;
      }
    } catch (error) {
      console.error('Failed to save weekly digest setting', error);
      // Откатываем оптимистичное изменение.
      enabled = prev;
      showError(STR.saveError);
    } finally {
      window.clearTimeout(timeout);
      saving = false;
      render();
    }
  }

  els.toggle.addEventListener('change', () => {
    if (saving) {
      // Пока идёт сохранение — игнорируем и возвращаем визуальное состояние.
      els.toggle.checked = enabled;
      return;
    }
    persist(els.toggle.checked);
  });

  // ── инициализация ───────────────────────────────────────────────
  function init(profile) {
    // Дефолт true: старый бэкенд без поля не должен выглядеть выключенным.
    enabled = profile?.weeklyDigestEnabled !== false;
    render();
  }

  document.addEventListener('profile:loaded', (event) => {
    const detail = event.detail || {};
    const profile = detail.profile || detail;
    setLocale(detail.locale || profile?.locale);
    init(profile);
  });
})();
