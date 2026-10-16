(function () {
  'use strict';

  const tg = window.Telegram?.WebApp;

  const API_BASE_URL = window.CaloriesMiniAppConfig.apiBaseUrl;
  const REQUEST_TIMEOUT_MS = 15000;

  const TRANSLATIONS = {
    ru: {
      note: 'Напомним в 12:00 по вашему времени, если к полудню нет записей о еде. Не приходит, если вы настроили свои дневные напоминания.',
      noteMasterOff: "Включите «Присылать напоминания» выше, чтобы получать дневное напоминание.",
      saveError: 'Не удалось сохранить. Попробуйте ещё раз.'
    },
    en: {
      note: "We'll nudge you at 12:00 your local time if you haven't logged any food by noon. Not sent if you set up your own daytime reminders.",
      noteMasterOff: 'Turn on "Send reminders" above to get the daytime reminder.',
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
    card: document.getElementById('daytime-card'),
    toggle: document.getElementById('daytime-toggle'),
    note: document.getElementById('daytime-note'),
    error: document.getElementById('daytime-error')
  };

  if (!els.card || !els.toggle) return;

  let optOut = false;
  let masterEnabled = true;
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
    els.toggle.checked = masterEnabled && !optOut;
    els.toggle.disabled = saving || !masterEnabled;
    els.note.textContent = masterEnabled ? STR.note : STR.noteMasterOff;
  }

  async function persist(nextOptOut) {
    const prev = optOut;
    optOut = nextOptOut;
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
          daytimeReminderOptOut: nextOptOut
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
      if (body && typeof body.daytimeReminderOptOut === 'boolean') {
        optOut = body.daytimeReminderOptOut;
      }
    } catch (error) {
      console.error('Failed to save daytime reminder setting', error);
      optOut = prev;
      showError(STR.saveError);
    } finally {
      window.clearTimeout(timeout);
      saving = false;
      render();
    }
  }

  els.toggle.addEventListener('change', () => {
    if (saving || !masterEnabled) {
      render();
      return;
    }
    persist(!els.toggle.checked);
  });

  document.addEventListener('reminders:master', (event) => {
    masterEnabled = event.detail?.enabled !== false;
    render();
  });

  document.addEventListener('profile:loaded', (event) => {
    const detail = event.detail || {};
    const profile = detail.profile || detail;
    setLocale(detail.locale || profile?.locale);
    if (typeof profile?.daytimeReminderOptOut !== 'boolean') return;
    optOut = profile.daytimeReminderOptOut;
    masterEnabled = profile?.remindersEnabled !== false;
    loaded = true;
    render();
  });
})();
