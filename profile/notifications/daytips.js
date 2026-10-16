(function () {
  'use strict';

  const tg = window.Telegram?.WebApp;

  const API_BASE_URL = window.CaloriesMiniAppConfig.apiBaseUrl;
  const REQUEST_TIMEOUT_MS = 15000;

  const TRANSLATIONS = {
    ru: {
      note: 'Иногда днём бот подсказывает, как добрать белок.',
      saveError: 'Не удалось сохранить. Попробуйте ещё раз.'
    },
    en: {
      note: 'Now and then during the day the bot suggests how to get more protein.',
      saveError: "Couldn't save. Please try again."
    }
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
    card: document.getElementById('daytips-card'),
    toggle: document.getElementById('daytips-toggle'),
    note: document.getElementById('daytips-note'),
    error: document.getElementById('daytips-error')
  };

  if (!els.card || !els.toggle) return;

  let enabled = true;
  let loaded = false;
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
    if (!loaded) return;
    els.card.hidden = false;
    els.toggle.checked = enabled;
    els.toggle.disabled = saving;
    els.note.textContent = STR.note;
  }

  async function persist(nextEnabled) {
    const prev = enabled;
    enabled = nextEnabled;
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
          dayTipsEnabled: nextEnabled
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      let body = null;
      try {
        body = await response.json();
      } catch (_) {
        body = null;
      }
      if (body && typeof body.dayTipsEnabled === 'boolean') {
        enabled = body.dayTipsEnabled;
      }
    } catch (error) {
      console.error('Failed to save day tips setting', error);
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
      render();
      return;
    }
    persist(els.toggle.checked);
  });

  document.addEventListener('profile:loaded', (event) => {
    const detail = event.detail || {};
    const profile = detail.profile || detail;
    setLocale(detail.locale || profile?.locale);
    if (typeof profile?.dayTipsEnabled !== 'boolean') return;
    enabled = profile.dayTipsEnabled;
    loaded = true;
    render();
  });
})();
