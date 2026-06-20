/*
  Напоминания (#42) — карточка управления слотами напоминаний в Профиле.

  Данные приходят из общего запроса /api/profile (script.js диспатчит событие
  `profile:loaded` с полным профилем). Слоты лежат в profile.reminders:
    [{ time: "HH:mm", type: "EVENING" | "DAYTIME" }]

  Сохранение — POST {apiBaseUrl}/api/reminders с телом
    { initData, reminders: [{time, type}] }
  REPLACE-семантика: шлём полный новый список. Эндпоинт делается параллельно
  (caloriesv2#568); если 404 — мягко деградируем (откатываем локальное состояние
  и показываем сообщение), реальный вызов оставляем.

  Лимиты на клиенте (бэкенд дублирует): ≤1 EVENING, ≤3 DAYTIME.
*/
(function () {
  'use strict';

  const tg = window.Telegram?.WebApp;

  const API_BASE_URL =
    window.CaloriesMiniAppConfig?.apiBaseUrl || 'https://caloriesai.duckdns.org';
  const REQUEST_TIMEOUT_MS = 15000;

  const LIMITS = { EVENING: 1, DAYTIME: 3 };

  // Паритет RU+EN: ru → ru, всё остальное → en. Локаль приходит из script.js
  // (событие profile:loaded), плюс читаем ?lang= для рендера до загрузки.
  const TRANSLATIONS = {
    ru: {
      cardEmpty: 'Пока нет напоминаний. Добавьте первое.',
      note: 'Вечерний отчёт приходит один раз в день. Дневных напоминаний — до трёх.',
      typeEvening: 'Полный отчёт',
      typeDaytime: 'Напоминание',
      typeEveningHint: 'Вечерний итог дня',
      typeDaytimeHint: 'Подсказка в течение дня',
      deleteLabel: 'Удалить напоминание',
      addLabel: 'Добавить напоминание',
      modalTitle: 'Новое напоминание',
      modalDescription: 'Выберите время и тип напоминания.',
      modalTimeLabel: 'Время',
      modalTypeLabel: 'Тип',
      typeAriaLabel: 'Тип напоминания',
      cancel: 'Отмена',
      add: 'Добавить',
      confirmTitle: 'Удалить напоминание?',
      delete: 'Удалить',
      confirmDelete: (time) => `Удалить напоминание ${time}?`,
      eveningTaken: 'Вечерний отчёт можно добавить только один раз в день.',
      daytimeFull: 'Дневных напоминаний можно не больше трёх.',
      needTime: 'Укажите время напоминания.',
      needType: 'Выберите тип напоминания.',
      duplicate: 'Такое напоминание уже есть.',
      saveError: 'Не удалось сохранить. Попробуйте ещё раз.',
      unavailable: 'Напоминания пока недоступны. Попробуйте позже.'
    },
    en: {
      cardEmpty: 'No reminders yet. Add your first one.',
      note: 'The full report arrives once a day. Up to three daytime reminders.',
      typeEvening: 'Full report',
      typeDaytime: 'Reminder',
      typeEveningHint: 'Evening summary of the day',
      typeDaytimeHint: 'A nudge during the day',
      deleteLabel: 'Delete reminder',
      addLabel: 'Add reminder',
      modalTitle: 'New reminder',
      modalDescription: 'Choose a time and reminder type.',
      modalTimeLabel: 'Time',
      modalTypeLabel: 'Type',
      typeAriaLabel: 'Reminder type',
      cancel: 'Cancel',
      add: 'Add',
      confirmTitle: 'Delete reminder?',
      delete: 'Delete',
      confirmDelete: (time) => `Delete reminder ${time}?`,
      eveningTaken: 'The full report can be added only once a day.',
      daytimeFull: 'You can have at most three daytime reminders.',
      needTime: 'Enter a reminder time.',
      needType: 'Choose a reminder type.',
      duplicate: 'This reminder already exists.',
      saveError: "Couldn't save. Please try again.",
      unavailable: 'Reminders are not available yet. Please try again later.'
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
  // До прихода profile:loaded используем ?lang= или язык аккаунта Telegram.
  let locale =
    urlLang ||
    normalizeLocale(tg?.initDataUnsafe?.user?.language_code) ||
    'en';
  let STR = TRANSLATIONS[locale];

  function confirmDeleteText(item) {
    return STR.confirmDelete(item.time);
  }

  // Свапаем статичные лейблы напоминаний (RU в HTML по умолчанию) на текущую
  // локаль. data-rem-i18n="key" меняет textContent, data-rem-i18n-attr=
  // "attr:key" меняет атрибут (напр. aria-label).
  function applyI18n() {
    document.querySelectorAll('[data-rem-i18n]').forEach((node) => {
      const key = node.getAttribute('data-rem-i18n');
      const value = STR[key];
      if (typeof value === 'string') node.textContent = value;
    });
    document.querySelectorAll('[data-rem-i18n-attr]').forEach((node) => {
      const spec = node.getAttribute('data-rem-i18n-attr') || '';
      const [attr, key] = spec.split(':');
      const value = STR[key];
      if (attr && typeof value === 'string') node.setAttribute(attr, value);
    });
  }

  // Применяем локаль, пришедшую из script.js (язык аккаунта/URL). Если она
  // отличается от текущей — пересобираем строки и перерисовываем карточку.
  function setLocale(next) {
    const normalized = normalizeLocale(next);
    if (!normalized || normalized === locale) return;
    locale = normalized;
    STR = TRANSLATIONS[locale];
    applyI18n();
    render();
    refreshTypeAvailability();
  }

  const TRASH_SVG =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3a1 1 0 0 0-.94.66L7.38 5H5a1 1 0 0 0 0 2h.17l.76 11.07A2 2 0 0 0 7.92 20h8.16a2 2 0 0 0 1.99-1.93L18.83 7H19a1 1 0 1 0 0-2h-2.38l-.68-1.34A1 1 0 0 0 15 3z"/></svg>';

  const els = {
    card: document.getElementById('reminders-card'),
    list: document.getElementById('reminders-list'),
    empty: document.getElementById('reminders-empty'),
    add: document.getElementById('reminders-add'),
    error: document.getElementById('reminders-error'),
    modal: document.getElementById('reminders-modal'),
    modalForm: document.getElementById('reminders-modal-form'),
    modalTime: document.getElementById('reminders-modal-time'),
    modalTypes: document.getElementById('reminders-modal-types'),
    modalError: document.getElementById('reminders-modal-error'),
    modalSubmit: null,
    confirm: document.getElementById('reminders-confirm'),
    confirmText: document.getElementById('reminders-confirm-text')
  };

  if (!els.card) return; // каркас без карточки — нечего инициализировать

  els.modalSubmit = els.modal?.querySelector('[data-action="submit"]') || null;

  // ── состояние ──────────────────────────────────────────────────
  /** @type {{time:string, type:'EVENING'|'DAYTIME'}[]} */
  let reminders = [];
  let selectedType = null;
  let saving = false;
  let pendingDelete = null;
  const hideTimers = new Map();

  // ── утилиты ────────────────────────────────────────────────────
  function getInitDataString() {
    return tg?.initData || window.Telegram?.WebApp?.initData || '';
  }

  function normalizeTime(value) {
    if (typeof value !== 'string') return null;
    const m = value.trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!m) return null;
    const h = Number(m[1]);
    const min = Number(m[2]);
    if (!Number.isInteger(h) || !Number.isInteger(min)) return null;
    if (h < 0 || h > 23 || min < 0 || min > 59) return null;
    return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
  }

  function normalizeType(value) {
    const t = String(value || '').toUpperCase();
    return t === 'EVENING' || t === 'DAYTIME' ? t : null;
  }

  function sanitize(list) {
    if (!Array.isArray(list)) return [];
    const out = [];
    for (const item of list) {
      const time = normalizeTime(item?.time);
      const type = normalizeType(item?.type);
      if (!time || !type) continue;
      out.push({ time, type });
    }
    return out;
  }

  function countByType(type) {
    return reminders.filter((r) => r.type === type).length;
  }

  function canAdd(type) {
    return countByType(type) < (LIMITS[type] || 0);
  }

  function sortReminders(list) {
    // EVENING вперёд, затем по времени.
    return [...list].sort((a, b) => {
      if (a.type !== b.type) return a.type === 'EVENING' ? -1 : 1;
      return a.time.localeCompare(b.time);
    });
  }

  function chipClass(type) {
    return type === 'EVENING' ? 'reminder__chip--evening' : 'reminder__chip--daytime';
  }

  function chipText(type) {
    return type === 'EVENING' ? STR.typeEvening : STR.typeDaytime;
  }

  // ── рендер ──────────────────────────────────────────────────────
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
    els.list.innerHTML = '';

    const sorted = sortReminders(reminders);
    sorted.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'reminder';

      const time = document.createElement('span');
      time.className = 'reminder__time';
      time.textContent = item.time;

      const chip = document.createElement('span');
      chip.className = `reminder__chip ${chipClass(item.type)}`;
      chip.textContent = chipText(item.type);

      const spacer = document.createElement('span');
      spacer.className = 'reminder__spacer';

      const del = document.createElement('button');
      del.type = 'button';
      del.className = 'reminder__del';
      del.setAttribute('aria-label', STR.deleteLabel);
      del.innerHTML = TRASH_SVG;
      del.addEventListener('click', () => handleDelete(item));

      row.append(time, chip, spacer, del);
      els.list.appendChild(row);
    });

    els.empty.hidden = reminders.length > 0;

    // Кнопка «Добавить» недоступна, если оба типа исчерпаны.
    const anyAvailable = canAdd('EVENING') || canAdd('DAYTIME');
    els.add.disabled = !anyAvailable;
  }

  // ── модалка ─────────────────────────────────────────────────────
  function setSelectedType(type) {
    selectedType = type;
    const buttons = els.modalTypes.querySelectorAll('.reminders-type');
    buttons.forEach((btn) => {
      const isSel = btn.dataset.type === type;
      btn.classList.toggle('reminders-type--active', isSel);
      btn.setAttribute('aria-checked', isSel ? 'true' : 'false');
    });
  }

  function refreshTypeAvailability() {
    const buttons = els.modalTypes.querySelectorAll('.reminders-type');
    buttons.forEach((btn) => {
      const type = btn.dataset.type;
      const available = canAdd(type);
      btn.disabled = !available;
      btn.classList.toggle('reminders-type--disabled', !available);
    });
  }

  function clearModalError() {
    els.modalError.hidden = true;
    els.modalError.textContent = '';
  }

  function showModalError(message) {
    els.modalError.textContent = message;
    els.modalError.hidden = false;
  }

  function clearHideTimer(modal) {
    const pending = hideTimers.get(modal);
    if (pending) {
      window.clearTimeout(pending.timer);
      modal.removeEventListener('transitionend', pending.onEnd);
      hideTimers.delete(modal);
    }
  }

  function showModal(modal) {
    clearHideTimer(modal);
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => modal.classList.add('modal--visible'));
    });
  }

  function hideModal(modal) {
    clearHideTimer(modal);
    modal.classList.remove('modal--visible');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    const finalize = () => {
      modal.hidden = true;
      clearHideTimer(modal);
    };
    const onEnd = (event) => {
      if (event.target === modal) finalize();
    };
    const timer = window.setTimeout(finalize, 300);
    hideTimers.set(modal, { timer, onEnd });
    modal.addEventListener('transitionend', onEnd);
  }

  function openModal() {
    clearError();
    clearModalError();
    selectedType = null;
    setSelectedType(null);
    refreshTypeAvailability();

    // Предвыбираем первый доступный тип для удобства.
    if (canAdd('DAYTIME')) setSelectedType('DAYTIME');
    else if (canAdd('EVENING')) setSelectedType('EVENING');

    els.modalTime.value = '';
    showModal(els.modal);
  }

  function closeModal() {
    hideModal(els.modal);
  }

  function setBusy(busy) {
    saving = busy;
    els.modal.classList.toggle('modal--busy', busy);
  }

  // ── действия ────────────────────────────────────────────────────
  function handleAddClick() {
    if (els.add.disabled) return;
    openModal();
  }

  function handleModalSubmit(event) {
    event.preventDefault();
    if (saving) return;
    clearModalError();

    const time = normalizeTime(els.modalTime.value);
    if (!time) {
      showModalError(STR.needTime);
      return;
    }
    const type = normalizeType(selectedType);
    if (!type) {
      showModalError(STR.needType);
      return;
    }
    if (!canAdd(type)) {
      showModalError(type === 'EVENING' ? STR.eveningTaken : STR.daytimeFull);
      return;
    }
    const exists = reminders.some((r) => r.type === type && r.time === time);
    if (exists) {
      showModalError(STR.duplicate);
      return;
    }

    const next = sortReminders([...reminders, { time, type }]);
    persist(next, { onError: () => showModalError(STR.saveError) }).then((ok) => {
      if (ok) closeModal();
    });
  }

  function handleDelete(item) {
    if (saving) return;
    clearError();
    openConfirm(item);
  }

  function openConfirm(item) {
    pendingDelete = item;
    els.confirmText.textContent = confirmDeleteText(item);
    showModal(els.confirm);
  }

  function closeConfirm() {
    pendingDelete = null;
    hideModal(els.confirm);
  }

  function confirmDelete() {
    const item = pendingDelete;
    if (!item || saving) return;
    closeConfirm();
    triggerHaptic();
    const next = reminders.filter((r) => !(r.type === item.type && r.time === item.time));
    persist(next, { onError: () => showError(STR.saveError) });
  }

  function triggerHaptic() {
    try {
      tg?.HapticFeedback?.notificationOccurred?.('warning');
    } catch (_) {
      void 0;
    }
  }

  // ── сохранение (REPLACE) ────────────────────────────────────────
  async function persist(next, { onError } = {}) {
    const prev = reminders;
    // Оптимистично применяем — UI ощущается мгновенным.
    reminders = next;
    render();
    refreshTypeAvailability();
    setBusy(true);

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${API_BASE_URL}/api/reminders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        mode: 'cors',
        body: JSON.stringify({
          initData: getInitDataString(),
          reminders: next.map((r) => ({ time: r.time, type: r.type }))
        }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Если бэкенд вернул канонический список — используем его.
      let body = null;
      try {
        body = await response.json();
      } catch (_) {
        body = null;
      }
      if (body && Array.isArray(body.reminders)) {
        reminders = sortReminders(sanitize(body.reminders));
        render();
        refreshTypeAvailability();
      }
      return true;
    } catch (error) {
      console.error('Failed to save reminders', error);
      // Откатываем оптимистичное изменение.
      reminders = prev;
      render();
      refreshTypeAvailability();
      if (typeof onError === 'function') onError(error);
      else showError(STR.saveError);
      return false;
    } finally {
      window.clearTimeout(timeout);
      setBusy(false);
    }
  }

  // ── инициализация ───────────────────────────────────────────────
  function init(profile) {
    reminders = sortReminders(sanitize(profile?.reminders));
    render();
  }

  // Слушаем профиль из script.js (общий запрос /api/profile). Деталь события —
  // { profile, locale }; locale — уже резолвнутая (?lang= → profile.locale → tg).
  document.addEventListener('profile:loaded', (event) => {
    const detail = event.detail || {};
    const profile = detail.profile || detail;
    setLocale(detail.locale || profile?.locale);
    init(profile);
  });

  // Применяем локаль из ?lang=/Telegram сразу, до загрузки профиля.
  applyI18n();

  // Привязка обработчиков модалки / кнопок.
  els.add.addEventListener('click', handleAddClick);
  els.modalForm.addEventListener('submit', handleModalSubmit);

  els.modalTypes.addEventListener('click', (event) => {
    const btn = event.target.closest('.reminders-type');
    if (!btn || btn.disabled) return;
    setSelectedType(btn.dataset.type);
    clearModalError();
  });

  els.modal.addEventListener('click', (event) => {
    if (event.target === els.modal || event.target.closest('[data-action="cancel"]')) {
      if (!saving) closeModal();
    }
  });

  els.confirm.addEventListener('click', (event) => {
    if (saving) return;
    if (event.target.closest('[data-action="confirm"]')) {
      confirmDelete();
      return;
    }
    if (event.target === els.confirm || event.target.closest('[data-action="cancel"]')) {
      closeConfirm();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || saving) return;
    if (!els.confirm.hidden) closeConfirm();
    else if (!els.modal.hidden) closeModal();
  });
})();
