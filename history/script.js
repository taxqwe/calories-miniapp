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

const API_BASE_URL = window.__CALORIES_HISTORY_API_BASE__ || 'https://calories-bot.duckdns.org:8443';

const historyState = {
  days: [],
  dayDetails: new Map(),
  selectedDayId: null,
  loadingDayId: null,
  isFetchingDays: false,
  fetchDaysError: null,
  fetchDayError: null,
  currentDayRequestToken: null,
  initialDayId: null,
  swipeHintPlayed: false
};

const defaultLocalization = {
  locale: 'en-US',
  loading: 'Loading...',
  pageTitle: 'History',
  pageSubtitle: 'Select a day to view meals',
  mealsTitle: 'Meals',
  daySelectorAriaLabel: 'Select day',
  prevDaysAriaLabel: 'Previous days',
  nextDaysAriaLabel: 'Next days',
  addButton: 'Add',
  addModalTitle: 'Add Calories',
  addModalDescription: 'Specify how many calories to add to the selected day.',
  addModalPlaceholder: 'For example, 250',
  addModalCancel: 'Cancel',
  addModalSubmit: 'Add',
  addModalSubmitBusy: 'Adding…',
  addModalDayLabel: 'Selected day: {day}',
  addModalCurrent: 'Current total: {value} {unit}',
  addModalCurrentZero: 'Current total: 0 {unit}',
  selectDayFirst: 'Select a day first',
  invalidCalories: 'Enter a positive calorie amount',
  addCaloriesError: 'Failed to add calories',
  invalidAddData: 'Invalid data for adding calories',
  userNotFound: 'Unable to identify the user',
  httpErrorStatus: 'Error {status}',
  daySelectorLoading: 'Loading...',
  daySelectorEmpty: 'No data',
  mealsSelectPrompt: 'Select a day to view meals',
  mealsLoading: 'Loading...',
  mealsNoData: 'No data',
  mealsNoDataDay: 'No data for this day',
  deleteMealError: 'Failed to delete the meal',
  loadDaysError: 'Failed to load days list',
  loadDayError: 'Failed to load day data',
  caloriesUnit: 'kcal',
  gramsUnit: 'g',
  deleteMealAriaLabel: 'Delete meal'
};

const i18n = Object.assign({}, defaultLocalization, window.historyLocalization || {});
const CURRENT_LOCALE = typeof i18n.locale === 'string' && i18n.locale.length > 0 ? i18n.locale : defaultLocalization.locale;

const LOADING_OVERLAY_ID = 'loading-overlay';

function setLoadingOverlayVisible(visible, message = i18n.loading) {
  let overlay = document.getElementById(LOADING_OVERLAY_ID);

  if (visible) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = LOADING_OVERLAY_ID;
      overlay.innerHTML = `
        <div id="loading-spinner">
          <div class="spinner"></div>
          <div class="spinner-text">${message}</div>
        </div>
      `;
      document.body.append(overlay);
    } else {
      const textNode = overlay.querySelector('.spinner-text');
      if (textNode) {
        textNode.textContent = message;
      }
    }
  } else if (overlay) {
    overlay.remove();
  }
}

function isGlobalLoadingActive() {
  return historyState.isFetchingDays || historyState.loadingDayId != null;
}

function updateLoadingOverlay() {
  setLoadingOverlayVisible(isGlobalLoadingActive());
}

function formatMessage(template, params = {}) {
  if (typeof template !== 'string' || template.length === 0) {
    return '';
  }
  return template.replace(/\{(\w+)\}/g, (_, key) => (params[key] != null ? String(params[key]) : ''));
}

const numberFormatter = new Intl.NumberFormat(CURRENT_LOCALE, {
  maximumFractionDigits: 0
});

function formatCalories(value) {
  const numericValue = Number(value);
  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
  return `${numberFormatter.format(safeValue)} ${i18n.caloriesUnit}`;
}

const REQUEST_TIMEOUT_MS = 20000;
const USER_TIMEZONE = getUserTimezone();

let timeFormatter = createTimeFormatter(USER_TIMEZONE);

function getInitDataString() {
  return tg?.initData || window.Telegram?.WebApp?.initData || '';
}

function getUserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch (error) {
    console.error('Failed to resolve timezone', error);
    return 'UTC';
  }
}

async function callHistoryApi(path, body, { method = 'POST' } = {}) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      mode: 'cors',
      body: method === 'GET' ? undefined : JSON.stringify(body),
      signal: controller.signal
    });

    if (response.status === 204) {
      return null;
    }

    if (!response.ok) {
      let errorMessage = formatMessage(i18n.httpErrorStatus, { status: response.status });
      try {
        const errorBody = await response.json();
        errorMessage = errorBody?.error?.message || errorMessage;
      } catch (parseError) {
        // no-op: keep default message
      }
      throw new Error(errorMessage);
    }

    if (response.headers.get('content-length') === '0') {
      return null;
    }

    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

const daySelectorList = document.querySelector('.day-selector__list');
const mealsList = document.querySelector('.meals__list');
const mealsCalories = document.querySelector('.meals__calories');
const mealsMacros = document.querySelector('.meals__macros');
const mealsRatios = document.querySelector('.meals__ratios');
const navPrevButton = document.querySelector('.day-selector__nav--prev');
const navNextButton = document.querySelector('.day-selector__nav--next');
const addButton = document.querySelector('.add-button');
const addModal = document.querySelector('.add-modal');
const addModalForm = addModal?.querySelector('.add-modal__form');
const addCaloriesInput = addModal?.querySelector('.add-modal__input');
const addModalError = addModal?.querySelector('.add-modal__error');
const addModalDayInfo = addModal?.querySelector('.add-modal__day');
const addModalCurrentInfo = addModal?.querySelector('.add-modal__current');
const addModalCancelButton = addModal?.querySelector('[data-action="cancel"]');
const addModalSubmitButton = addModal?.querySelector('button[type="submit"]');
let navStateFrame = null;
let suppressNextDayCardClick = false;
let suppressClickResetTimer = null;
const DAY_SELECTOR_TOUCH_DRAG_THRESHOLD = 24;
let swipeHintTimeoutId = null;

let addModalPreviousFocus = null;
let isAddModalBusy = false;
let cachedChatId = null;

const daySelectorDragState = {
  pointerId: null,
  startX: 0,
  startScrollLeft: 0,
  moved: false,
  pointerType: null
};

function applyStaticLocalization() {
  document.title = i18n.pageTitle;
  const htmlLang = typeof window.historyLanguage === 'string' && window.historyLanguage.length > 0
    ? window.historyLanguage
    : 'en';
  document.documentElement.setAttribute('lang', htmlLang);

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.getAttribute('data-i18n');
    if (key && i18n[key] != null) {
      element.textContent = i18n[key];
    }
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    const key = element.getAttribute('data-i18n-aria-label');
    if (key && i18n[key] != null) {
      element.setAttribute('aria-label', i18n[key]);
    }
  });

  if (addCaloriesInput) {
    const placeholderKey = addCaloriesInput.getAttribute('data-i18n-placeholder');
    if (placeholderKey && i18n[placeholderKey] != null) {
      addCaloriesInput.setAttribute('placeholder', i18n[placeholderKey]);
    }
  }

  if (addModalSubmitButton) {
    addModalSubmitButton.textContent = i18n.addModalSubmit;
  }

  if (addModalCancelButton) {
    addModalCancelButton.textContent = i18n.addModalCancel;
  }

  if (addButton) {
    addButton.textContent = i18n.addButton;
  }

  if (mealsCalories) {
    mealsCalories.textContent = formatCalories(0);
  }

  if (mealsMacros) {
    const unit = i18n.gramsUnit;
    mealsMacros.textContent = `🥚 0 ${unit} · 🧈 0 ${unit} · 🍞 0 ${unit}`;
  }

  if (mealsRatios) {
    mealsRatios.textContent = '🥧 0/0/0%';
  }
}

applyStaticLocalization();

const dayFormatter = new Intl.DateTimeFormat(CURRENT_LOCALE, {
  day: '2-digit',
  month: 'short',
  timeZone: USER_TIMEZONE
});

const weekdayFormatter = new Intl.DateTimeFormat(CURRENT_LOCALE, {
  weekday: 'short',
  timeZone: USER_TIMEZONE
});

function createTimeFormatter(timeZone) {
  try {
    return new Intl.DateTimeFormat(CURRENT_LOCALE, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone
    });
  } catch (error) {
    console.warn('Failed to create time formatter with timezone', timeZone, error);
    return new Intl.DateTimeFormat(CURRENT_LOCALE, {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

function setupAddCaloriesModal() {
  if (!addButton || !addModal || !addModalForm || !addCaloriesInput || !addModalSubmitButton || !addModalCancelButton) {
    return;
  }

  addButton.addEventListener('click', () => {
    if (!historyState.selectedDayId) {
      tg?.showAlert?.(i18n.selectDayFirst);
      return;
    }

    openAddModal();
  });

  addModal.addEventListener('click', (event) => {
    if (event.target === addModal) {
      closeAddModal();
    }
  });

  addModalCancelButton.addEventListener('click', () => {
    closeAddModal();
  });

  addCaloriesInput.addEventListener('input', () => {
    sanitizeAddCaloriesInput();
    hideAddModalError();
  });

  addModalForm.addEventListener('submit', handleAddModalSubmit);
}

function openAddModal() {
  if (!addModal || !addModalForm || !addCaloriesInput) {
    return;
  }

  const dayId = historyState.selectedDayId;
  if (!dayId) {
    return;
  }

  addModalPreviousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  addModal.hidden = false;
  addModal.setAttribute('aria-hidden', 'false');
  requestAnimationFrame(() => {
    addModal.classList.add('modal--visible');
  });

  document.body.classList.add('modal-open');
  document.addEventListener('keydown', handleAddModalKeydown, true);

  addModalForm.reset();
  sanitizeAddCaloriesInput();
  hideAddModalError();
  setAddModalBusy(false);
  updateAddModalInfo(dayId);

  window.setTimeout(() => {
    addCaloriesInput.focus();
    addCaloriesInput.select?.();
  }, 50);
}

function closeAddModal({ force = false } = {}) {
  if (!addModal) {
    return;
  }

  if (isAddModalBusy && !force) {
    return;
  }

  setAddModalBusy(false);

  addModal.classList.remove('modal--visible');
  addModal.setAttribute('aria-hidden', 'true');
  addModal.hidden = true;

  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', handleAddModalKeydown, true);

  addModalForm?.reset();
  hideAddModalError();

  if (addModalDayInfo) {
    addModalDayInfo.textContent = '';
    addModalDayInfo.hidden = true;
  }

  if (addModalCurrentInfo) {
    addModalCurrentInfo.textContent = '';
    addModalCurrentInfo.hidden = true;
  }

  const focusTarget = addModalPreviousFocus;
  addModalPreviousFocus = null;
  focusTarget?.focus?.();
}

function handleAddModalKeydown(event) {
  if (event.key === 'Escape' || event.key === 'Esc') {
    event.preventDefault();
    closeAddModal();
  }
}

function setAddModalBusy(value) {
  isAddModalBusy = value;

  if (addModal) {
    addModal.classList.toggle('modal--busy', value);
  }

  if (addModalSubmitButton) {
    addModalSubmitButton.disabled = value;
    addModalSubmitButton.textContent = value ? i18n.addModalSubmitBusy : i18n.addModalSubmit;
  }

  if (addModalCancelButton) {
    addModalCancelButton.disabled = value;
  }

  if (addCaloriesInput) {
    addCaloriesInput.disabled = value;
  }
}

function sanitizeAddCaloriesInput() {
  if (!addCaloriesInput) {
    return;
  }

  const raw = addCaloriesInput.value;
  if (raw === '') {
    return;
  }

  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    addCaloriesInput.value = '';
    return;
  }

  addCaloriesInput.value = String(Math.max(1, Math.floor(parsed)));
}

function updateAddModalInfo(dayId) {
  if (!dayId) {
    return;
  }

  if (addModalDayInfo) {
    const formattedDay = formatSelectedDayForModal(dayId);
    addModalDayInfo.textContent = formattedDay ? formatMessage(i18n.addModalDayLabel, { day: formattedDay }) : '';
    addModalDayInfo.hidden = !formattedDay;
  }

  if (addModalCurrentInfo) {
    const currentCalories = getCachedDayCalories(dayId, 0);
    if (Number.isFinite(currentCalories) && currentCalories > 0) {
      addModalCurrentInfo.textContent = formatMessage(i18n.addModalCurrent, {
        value: numberFormatter.format(currentCalories),
        unit: i18n.caloriesUnit
      });
      addModalCurrentInfo.hidden = false;
    } else if (currentCalories === 0) {
      addModalCurrentInfo.textContent = formatMessage(i18n.addModalCurrentZero, {
        unit: i18n.caloriesUnit
      });
      addModalCurrentInfo.hidden = false;
    } else {
      addModalCurrentInfo.textContent = '';
      addModalCurrentInfo.hidden = true;
    }
  }
}

function showAddModalError(message) {
  if (!addModalError) {
    return;
  }

  addModalError.textContent = message || '';
  addModalError.hidden = !message;
}

function hideAddModalError() {
  showAddModalError('');
}

function formatSelectedDayForModal(dayId) {
  if (!dayId) {
    return '';
  }

  try {
    const date = new Date(`${dayId}T00:00:00`);
    const formattedDate = dayFormatter.format(date).replace('.', '');
    const weekday = capitalize(weekdayFormatter.format(date));
    return `${formattedDate}, ${weekday}`;
  } catch (error) {
    console.warn('Failed to format selected day for modal', dayId, error);
    return dayId;
  }
}

async function handleAddModalSubmit(event) {
  event.preventDefault();

  if (!addCaloriesInput) {
    return;
  }

  const dayId = historyState.selectedDayId;
  if (!dayId) {
    showAddModalError(i18n.selectDayFirst);
    return;
  }

  sanitizeAddCaloriesInput();
  const value = Number.parseInt(addCaloriesInput.value, 10);

  if (!Number.isFinite(value) || value <= 0) {
    showAddModalError(i18n.invalidCalories);
    addCaloriesInput.focus();
    return;
  }

  hideAddModalError();
  setAddModalBusy(true);

  try {
    await addCaloriesToDay(dayId, value);
    closeAddModal({ force: true });
  } catch (error) {
    console.error('Failed to add calories', error);
    const message = typeof error?.message === 'string' && error.message.trim().length > 0
      ? error.message
      : i18n.addCaloriesError;
    showAddModalError(message);
  } finally {
    setAddModalBusy(false);
  }
}

async function addCaloriesToDay(dayId, amount) {
  if (!dayId || !Number.isFinite(amount) || amount <= 0) {
    throw new Error(i18n.invalidAddData);
  }

  const currentValue = Number(getCachedDayCalories(dayId, 0)) || 0;
  const newTotal = Math.max(0, currentValue + amount);

  await sendCaloriesAdditionRequest(dayId, amount);

  const dayEntry = historyState.days.find((day) => day.date === dayId);
  if (dayEntry) {
    dayEntry.calories = newTotal;
  }

  historyState.dayDetails.delete(dayId);
  historyState.loadingDayId = dayId;
  historyState.fetchDayError = null;

  renderDaySelector();
  renderMeals();

  ensureDayDetails(dayId).catch((error) => {
    console.error('Failed to refresh day after calories update', error);
  });

  return newTotal;
}

async function sendCaloriesAdditionRequest(dayId, amount) {
  const chatId = resolveChatId();
  if (chatId == null) {
    throw new Error(i18n.userNotFound);
  }

  const response = await fetch(`${API_BASE_URL}/api/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Source-App': 'Calories-History'
    },
    mode: 'cors',
    body: JSON.stringify({
      chatId,
      date: dayId,
      calories: amount,
      initData: getInitDataString()
    })
  });

  if (!response.ok) {
    let message = formatMessage(i18n.httpErrorStatus, { status: response.status });
    try {
      const errorBody = await response.json();
      message = errorBody?.error?.message || message;
    } catch (parseError) {
      // ignore parse errors
    }
    throw new Error(message);
  }
}

function resolveChatId() {
  if (cachedChatId != null) {
    return cachedChatId;
  }

  const unsafeId = tg?.initDataUnsafe?.user?.id;
  if (unsafeId != null) {
    cachedChatId = unsafeId;
    return cachedChatId;
  }

  const initData = getInitDataString();
  if (typeof initData === 'string' && initData.length > 0) {
    try {
      const params = new URLSearchParams(initData);
      const userParam = params.get('user');
      if (userParam) {
        const parsed = JSON.parse(userParam);
        if (parsed?.id != null) {
          const numericId = Number(parsed.id);
          cachedChatId = Number.isFinite(numericId) ? numericId : parsed.id;
          return cachedChatId;
        }
      }
    } catch (error) {
      console.warn('Failed to parse chat id from init data', error);
    }
  }

  return null;
}

function capitalize(value = '') {
  if (typeof value !== 'string' || value.length === 0) {
    return value;
  }
  return value.charAt(0).toUpperCase() + value.slice(1);
}

const MACRO_CALORIES = {
  protein: 4,
  fat: 9,
  carbs: 4
};

function renderDaySelector() {
  daySelectorList.innerHTML = '';

  if (historyState.isFetchingDays) {
    renderDaySelectorStatus(i18n.daySelectorLoading);
    scheduleNavStateUpdate();
    return;
  }

  if (historyState.fetchDaysError) {
    renderDaySelectorStatus(historyState.fetchDaysError);
    scheduleNavStateUpdate();
    return;
  }

  if (!historyState.days.length) {
    renderDaySelectorStatus(i18n.daySelectorEmpty);
    scheduleNavStateUpdate();
    return;
  }

  const sortedDays = historyState.days
    .slice()
    .sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));

  sortedDays.forEach((day) => {
    const date = day.date;
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'day-card';
    card.dataset.dayId = date;

    const jsDate = createDayDate(day);
    let formattedDate = date;
    let weekday = '';

    if (jsDate) {
      try {
        formattedDate = dayFormatter.format(jsDate).replace('.', '');
        weekday = capitalize(weekdayFormatter.format(jsDate));
      } catch (error) {
        console.warn('Failed to format day', date, error);
      }
    }

    const caloriesValue = getCachedDayCalories(date, day.calories);
    const caloriesText = caloriesValue != null ? formatCalories(caloriesValue) : '—';

    card.innerHTML = `
      <span class="day-card__date">${formattedDate}</span>
      <span class="day-card__weekday">${weekday}</span>
      <span class="day-card__total">${caloriesText}</span>
    `;

    const isActive = date === historyState.selectedDayId;
    card.classList.toggle('day-card--active', isActive);
    card.setAttribute('aria-selected', String(isActive));

    card.addEventListener('click', () => {
      if (suppressNextDayCardClick) {
        suppressNextDayCardClick = false;
        if (suppressClickResetTimer !== null) {
          clearTimeout(suppressClickResetTimer);
          suppressClickResetTimer = null;
        }
        return;
      }

      handleDayCardClick(date, card);
    });

    daySelectorList.append(card);
  });

  updateSelectionUI();
  scheduleNavStateUpdate();
}

function renderDaySelectorStatus(message) {
  const status = document.createElement('div');
  status.className = 'day-selector__status';
  status.textContent = message;
  daySelectorList.append(status);
}

function updateSelectionUI() {
  Array.from(daySelectorList.children).forEach((element) => {
    if (!(element instanceof HTMLElement) || !element.dataset?.dayId) {
      return;
    }

    const isActive = element.dataset.dayId === historyState.selectedDayId;
    element.classList.toggle('day-card--active', isActive);
    element.setAttribute('aria-selected', String(isActive));
  });
}

async function handleDayCardClick(dayId, card) {
  try {
    await selectDay(dayId, { scrollTarget: card });
  } catch (error) {
    console.error('Failed to select day', error);
  }
}

async function selectDay(dayId, { scrollTarget } = {}) {
  if (!dayId) return;

  historyState.selectedDayId = dayId;
  historyState.fetchDayError = null;

  updateSelectionUI();

  if (scrollTarget) {
    scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  renderMeals();
  await ensureDayDetails(dayId);
}

function renderMeals() {
  mealsList.innerHTML = '';

  const dayId = historyState.selectedDayId;

  if (!dayId) {
    setSummaryFromTotals();
    renderMealsStatus(i18n.mealsSelectPrompt);
    return;
  }

  if (historyState.loadingDayId === dayId && !historyState.dayDetails.has(dayId)) {
    setSummaryFromTotals(getSummaryFromDayList(dayId));
    renderMealsStatus(i18n.mealsLoading, 'meals__status');
    return;
  }

  if (historyState.fetchDayError && !historyState.dayDetails.has(dayId)) {
    setSummaryFromTotals(getSummaryFromDayList(dayId));
    renderMealsStatus(historyState.fetchDayError, 'meals__status');
    return;
  }

  const day = historyState.dayDetails.get(dayId);

  if (!day) {
    setSummaryFromTotals(getSummaryFromDayList(dayId));
    renderMealsStatus(i18n.mealsNoData);
    return;
  }

  setSummaryFromTotals(day.totals);

  const mealTemplate = document.getElementById('meal-item-template');
  const dishTemplate = document.getElementById('dish-item-template');

  const addMealButton = document.createElement('button');
  addMealButton.className = 'meal meal--add';
  addMealButton.type = 'button';
  addMealButton.innerHTML = `
    <div class="meal__swipe">
      <div class="meal__content meal__content--add">
        <div class="meal__add-icon">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1z"/>
          </svg>
        </div>
      </div>
    </div>
  `;
  addMealButton.addEventListener('click', () => {
    if (!historyState.selectedDayId) {
      tg?.showAlert?.(i18n.selectDayFirst);
      return;
    }
    openAddModal();
  });
  mealsList.append(addMealButton);

  if (!day.meals.length) {
    maybeShowSwipeHint();
    return;
  }

  day.meals
    .slice()
    .sort((a, b) => getMealTimestampMs(b) - getMealTimestampMs(a))
    .forEach((meal) => {
      const mealNode = mealTemplate.content.firstElementChild.cloneNode(true);
      const mealContent = mealNode.querySelector('.meal__content');
      mealNode.dataset.id = meal.mealId != null ? String(meal.mealId) : meal.timestamp != null ? String(meal.timestamp) : '';

      mealContent.querySelector('.meal__time').textContent = formatMealTime(meal);

      const mealCalories = safeNumber(meal.totals?.calories);
      mealContent.querySelector('.meal__calories').textContent = formatCalories(mealCalories);
      const macrosElement = mealContent.querySelector('.meal__macros');
      const ratiosElement = mealContent.querySelector('.meal__ratios');
      const hideBreakdown = shouldHideMealBreakdown(meal);
      if (hideBreakdown) {
        macrosElement.textContent = '';
        ratiosElement.textContent = '';
        macrosElement.style.display = 'none';
        ratiosElement.style.display = 'none';
      } else {
        const mealBreakdown = formatMacroBreakdown(meal.totals);
        macrosElement.textContent = mealBreakdown.macrosLine;
        ratiosElement.textContent = mealBreakdown.ratiosLine;
        macrosElement.style.display = '';
        ratiosElement.style.display = '';
      }

      const dishesList = mealContent.querySelector('.meal__dishes');
      (meal.dishes || []).forEach((dish) => {
        const dishNode = dishTemplate.content.firstElementChild.cloneNode(true);
        dishNode.querySelector('.dish__name').textContent = dish.name ?? '';
        dishNode.querySelector('.dish__calories').textContent = formatCalories(safeNumber(dish.calories));
        dishesList.append(dishNode);
      });

      mealsList.append(mealNode);
      setupSwipeInteraction(mealNode, () => deleteMeal(day.date, meal.mealId));
    });

  maybeShowSwipeHint();
}

function maybeShowSwipeHint() {
  if (historyState.swipeHintPlayed) {
    return;
  }

  if (!historyState.initialDayId || historyState.selectedDayId !== historyState.initialDayId) {
    return;
  }

  if (!mealsList.querySelector('.meal')) {
    return;
  }

  if (swipeHintTimeoutId != null) {
    return;
  }

  swipeHintTimeoutId = window.setTimeout(() => {
    swipeHintTimeoutId = null;

    if (historyState.swipeHintPlayed || historyState.selectedDayId !== historyState.initialDayId) {
      return;
    }

    const firstMeal = mealsList.querySelector('.meal');
    if (!firstMeal) {
      historyState.swipeHintPlayed = true;
      return;
    }

    const playHint = firstMeal.__playSwipeHint;
    if (typeof playHint === 'function') {
      historyState.swipeHintPlayed = true;
      playHint();
    } else {
      historyState.swipeHintPlayed = true;
    }
  }, 480);
}

function shouldHideMealBreakdown(meal) {
  if (!meal) {
    return false;
  }

  const totals = meal.totals || {};
  const hasMacros = ['protein', 'fat', 'carbs'].some((macro) => safeNumber(getMacroValue(totals, macro)) > 0);
  if (hasMacros) {
    return false;
  }

  if (!Array.isArray(meal.dishes)) {
    return true;
  }

  const hasDishes = meal.dishes.some((dish) => {
    if (!dish) {
      return false;
    }

    const name = typeof dish.name === 'string' ? dish.name.trim() : '';
    return name.length > 0 || safeNumber(dish.calories) > 0;
  });

  return !hasDishes;
}

function setSummaryFromTotals(totals = {}) {
  const calories = safeNumber(totals.calories);
  mealsCalories.textContent = formatCalories(calories);

  const breakdown = formatMacroBreakdown(totals);
  mealsMacros.textContent = breakdown.macrosLine;
  mealsRatios.textContent = breakdown.ratiosLine;
}

function renderMealsStatus(message, className = 'meals__empty') {
  const status = document.createElement('p');
  status.className = className;
  status.textContent = message;
  mealsList.append(status);
}

async function ensureDayDetails(dayId) {
  if (!dayId) return;

  if (historyState.dayDetails.has(dayId)) {
    historyState.loadingDayId = null;
    historyState.fetchDayError = null;
    renderMeals();
    renderDaySelector();
    updateLoadingOverlay();
    return;
  }

  historyState.loadingDayId = dayId;
  historyState.fetchDayError = null;
  renderMeals();
  updateLoadingOverlay();

  const requestToken = Symbol('dayRequest');
  historyState.currentDayRequestToken = requestToken;

  try {
    const response = await callHistoryApi('/api/history/day', {
      initData: getInitDataString(),
      date: dayId,
      timezone: USER_TIMEZONE
    });

    if (historyState.currentDayRequestToken !== requestToken) {
      return;
    }

    const normalizedDay = normalizeDayDetailsResponse(response, dayId);
    historyState.dayDetails.set(dayId, normalizedDay);
    historyState.fetchDayError = null;
  } catch (error) {
    if (historyState.currentDayRequestToken === requestToken) {
      historyState.fetchDayError = error.message || i18n.loadDayError;
    }
    console.error('Failed to fetch day details', error);
  } finally {
    if (historyState.currentDayRequestToken === requestToken) {
      historyState.currentDayRequestToken = null;
      historyState.loadingDayId = null;
      updateLoadingOverlay();
    }

    renderMeals();
    renderDaySelector();
  }
}

async function loadAvailableDays() {
  historyState.isFetchingDays = true;
  historyState.fetchDaysError = null;
  updateLoadingOverlay();
  renderDaySelector();

  try {
    const response = await callHistoryApi('/api/history/days', {
      initData: getInitDataString(),
      timezone: USER_TIMEZONE
    });

    const normalizedDays = Array.isArray(response?.days)
      ? response.days.map(normalizeDayListEntry).filter(Boolean)
      : [];

    historyState.days = normalizedDays;
    if (!historyState.initialDayId && normalizedDays.length > 0) {
      historyState.initialDayId = normalizedDays[0].date;
    }

    const dayDates = new Set(normalizedDays.map((item) => item.date));
    Array.from(historyState.dayDetails.keys()).forEach((day) => {
      if (!dayDates.has(day)) {
        historyState.dayDetails.delete(day);
      }
    });

    if (!dayDates.has(historyState.selectedDayId || '')) {
      historyState.selectedDayId = normalizedDays[0]?.date || null;
    }
  } catch (error) {
    historyState.fetchDaysError = error.message || i18n.loadDaysError;
    historyState.days = [];
    historyState.selectedDayId = null;
    console.error('Failed to load history days', error);
  } finally {
    historyState.isFetchingDays = false;
    updateLoadingOverlay();
    renderDaySelector();

    if (!historyState.initialDayId && historyState.selectedDayId) {
      historyState.initialDayId = historyState.selectedDayId;
    }

    if (historyState.selectedDayId) {
      ensureDayDetails(historyState.selectedDayId);
    } else {
      renderMeals();
    }
  }
}

function initializeHistory() {
  historyState.isFetchingDays = true;
  updateLoadingOverlay();
  renderDaySelector();
  renderMeals();
  loadAvailableDays();
}

function getCachedDayCalories(dayId, fallbackCalories = null) {
  const details = historyState.dayDetails.get(dayId);
  if (details) {
    const caloriesValue = Number(details?.totals?.calories);
    if (Number.isFinite(caloriesValue)) {
      return caloriesValue;
    }
  }

  const fallbackValue = Number(fallbackCalories);
  if (Number.isFinite(fallbackValue)) {
    return fallbackValue;
  }

  const listEntry = historyState.days.find((day) => day.date === dayId);
  const listValue = Number(listEntry?.calories);
  if (Number.isFinite(listValue)) {
    return listValue;
  }

  return null;
}

function getSummaryFromDayList(dayId) {
  const entry = historyState.days.find((day) => day.date === dayId);
  if (!entry) {
    return null;
  }

  const caloriesValue = Number(entry.calories);
  if (!Number.isFinite(caloriesValue)) {
    return null;
  }

  return { calories: caloriesValue };
}

function formatMealTime(meal) {
  const timestampMs = getMealTimestampMs(meal);
  if (!Number.isFinite(timestampMs)) {
    return '—';
  }

  try {
    return timeFormatter.format(new Date(timestampMs));
  } catch (error) {
    console.error('Failed to format meal time', error);
    return '—';
  }
}

async function deleteMeal(dayId, mealId) {
  if (!dayId || mealId == null) {
    return;
  }

  try {
    await callHistoryApi('/api/history/day/meal', {
      initData: getInitDataString(),
      mealId
    }, { method: 'DELETE' });

    if (removeMealFromState(dayId, mealId)) {
      renderMeals();
      renderDaySelector();
    }
  } catch (error) {
    console.error('Failed to delete meal', error);
    tg?.showAlert?.(i18n.deleteMealError);
  }
}

function removeMealFromState(dayId, mealId) {
  const day = historyState.dayDetails.get(dayId);

  if (!day) {
    return false;
  }

  const initialLength = day.meals.length;
  day.meals = day.meals.filter((meal) => String(meal.mealId) !== String(mealId));

  if (day.meals.length === initialLength) {
    return false;
  }

  day.totals = recalcDayTotals(day.meals);
  historyState.dayDetails.set(dayId, day);
  return true;
}

function recalcDayTotals(meals) {
  const totals = meals.reduce((acc, meal) => {
    const mealTotals = meal.totals || {};
    acc.calories += safeNumber(mealTotals.calories);
    acc.protein_g += getMacroValue(mealTotals, 'protein');
    acc.fat_g += getMacroValue(mealTotals, 'fat');
    acc.carbs_g += getMacroValue(mealTotals, 'carbs');
    return acc;
  }, { calories: 0, protein_g: 0, fat_g: 0, carbs_g: 0 });

  totals.ratios_percent = calculateRatiosFromMacros(totals);
  return totals;
}

function normalizeDayDetailsResponse(payload, fallbackDate) {
  const normalizedTotals = normalizeTotals(payload?.totals);
  const meals = Array.isArray(payload?.meals)
    ? payload.meals.map((meal, index) => normalizeMeal(meal, index))
    : [];

  return {
    date: payload?.date || fallbackDate,
    totals: normalizedTotals,
    meals
  };
}

function normalizeDayListEntry(day) {
  if (!day) return null;

  const date = typeof day.date === 'string' ? day.date : typeof day === 'string' ? day : null;
  if (!date) {
    return null;
  }

  const parsedTime = Date.parse(`${date}T00:00:00Z`);
  if (Number.isNaN(parsedTime)) {
    return null;
  }

  const caloriesValue = Number(day.calories);
  const calories = Number.isFinite(caloriesValue) ? caloriesValue : null;

  return {
    date,
    calories,
    timestamp: parsedTime
  };
}

function createDayDate(day) {
  if (!day) return null;

  if (Number.isFinite(day.timestamp)) {
    const dateFromTimestamp = new Date(day.timestamp);
    if (!Number.isNaN(dateFromTimestamp.getTime())) {
      return dateFromTimestamp;
    }
  }

  const fallback = typeof day.date === 'string' ? Date.parse(`${day.date}T00:00:00Z`) : NaN;
  if (!Number.isNaN(fallback)) {
    return new Date(fallback);
  }

  return null;
}

function normalizeTotals(totals = {}) {
  const calories = safeNumber(totals.calories);
  const protein = safeNumber(getMacroValue(totals, 'protein'));
  const fat = safeNumber(getMacroValue(totals, 'fat'));
  const carbs = safeNumber(getMacroValue(totals, 'carbs'));

  const ratios = totals.ratios_percent
    ? {
        protein: safeNumber(totals.ratios_percent.protein),
        fat: safeNumber(totals.ratios_percent.fat),
        carbs: safeNumber(totals.ratios_percent.carbs)
      }
    : calculateRatiosFromMacros({ protein_g: protein, fat_g: fat, carbs_g: carbs });

  return {
    calories,
    protein_g: protein,
    fat_g: fat,
    carbs_g: carbs,
    ratios_percent: ratios
  };
}

function normalizeMealTimestamp(value) {
  if (value == null) {
    return { seconds: null, milliseconds: null };
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return { seconds: null, milliseconds: null };
    }

    const milliseconds = value > 1e12 ? value : value * 1000;
    return {
      seconds: milliseconds / 1000,
      milliseconds
    };
  }

  const numericValue = Number(value);
  if (Number.isFinite(numericValue)) {
    const milliseconds = numericValue > 1e12 ? numericValue : numericValue * 1000;
    return {
      seconds: milliseconds / 1000,
      milliseconds
    };
  }

  if (typeof value === 'string') {
    const parsed = Date.parse(value);
    if (!Number.isNaN(parsed)) {
      return {
        seconds: parsed / 1000,
        milliseconds: parsed
      };
    }
  }

  return { seconds: null, milliseconds: null };
}

function getMealTimestampMs(meal) {
  if (!meal) {
    return Number.POSITIVE_INFINITY;
  }

  if (Number.isFinite(meal.timestampMs)) {
    return meal.timestampMs;
  }

  if (Number.isFinite(meal.timestamp)) {
    return meal.timestamp * 1000;
  }

  if (Number.isFinite(meal.order)) {
    return Number.MAX_SAFE_INTEGER / 2 + meal.order;
  }

  return Number.POSITIVE_INFINITY;
}

function normalizeMeal(meal = {}, order = 0) {
  const normalizedTimestamp = normalizeMealTimestamp(meal.timestamp);

  return {
    mealId: meal.mealId ?? meal.id ?? null,
    timestamp: normalizedTimestamp.seconds,
    timestampMs: normalizedTimestamp.milliseconds,
    order,
    totals: normalizeTotals(meal.totals),
    dishes: Array.isArray(meal.dishes) ? meal.dishes.map(normalizeDish) : [],
    date: meal.date
  };
}

function normalizeDish(dish = {}) {
  return {
    id: dish.id ?? null,
    name: dish.name ?? '',
    calories: safeNumber(dish.calories)
  };
}

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function getMacroValue(source = {}, key) {
  if (!source) return 0;
  const direct = source[key];
  if (Number.isFinite(direct)) {
    return direct;
  }
  const gramsKey = `${key}_g`;
  const gramsValue = source[gramsKey];
  if (Number.isFinite(gramsValue)) {
    return gramsValue;
  }
  return 0;
}

function calculateRatiosFromMacros(totals) {
  const caloriesFromProtein = totals.protein_g * MACRO_CALORIES.protein;
  const caloriesFromFat = totals.fat_g * MACRO_CALORIES.fat;
  const caloriesFromCarbs = totals.carbs_g * MACRO_CALORIES.carbs;
  const totalCalories = caloriesFromProtein + caloriesFromFat + caloriesFromCarbs;

  if (totalCalories <= 0) {
    return { protein: 0, fat: 0, carbs: 0 };
  }

  const rawValues = [
    { key: 'protein', calories: caloriesFromProtein },
    { key: 'fat', calories: caloriesFromFat },
    { key: 'carbs', calories: caloriesFromCarbs }
  ];

  const basePercents = rawValues.map((item) => Math.floor((item.calories / totalCalories) * 100));
  let remainderBudget = 100 - basePercents.reduce((sum, value) => sum + value, 0);

  const remainders = rawValues
    .map((item, index) => ({ index, fraction: (item.calories / totalCalories) * 100 - basePercents[index] }))
    .sort((a, b) => b.fraction - a.fraction);

  let pointer = 0;
  while (remainderBudget > 0 && remainders.length > 0) {
    const target = remainders[pointer % remainders.length];
    basePercents[target.index] += 1;
    remainderBudget -= 1;
    pointer += 1;
  }

  return {
    protein: basePercents[0],
    fat: basePercents[1],
    carbs: basePercents[2]
  };
}

function formatMacroBreakdown(source = {}) {
  const proteinValue = getMacroValue(source, 'protein');
  const fatValue = getMacroValue(source, 'fat');
  const carbsValue = getMacroValue(source, 'carbs');

  let percentages;

  if (source?.ratios_percent) {
    percentages = [
      safeNumber(source.ratios_percent.protein),
      safeNumber(source.ratios_percent.fat),
      safeNumber(source.ratios_percent.carbs)
    ];
  } else {
    const calculated = calculateRatiosFromMacros({
      protein_g: proteinValue,
      fat_g: fatValue,
      carbs_g: carbsValue
    });
    percentages = [calculated.protein, calculated.fat, calculated.carbs];
  }

  const normalizedPercentages = percentages.map((value) =>
    Math.round(Math.max(0, Math.min(100, value)))
  );

  const unit = i18n.gramsUnit;
  const macrosLine = [
    `🥚 ${numberFormatter.format(proteinValue)} ${unit}`,
    `🧈 ${numberFormatter.format(fatValue)} ${unit}`,
    `🍞 ${numberFormatter.format(carbsValue)} ${unit}`
  ].join(' · ');
  const ratiosLine = `🥧 ${normalizedPercentages.join('/')}%`;

  return { macrosLine, ratiosLine };
}

function setupSwipeInteraction(mealElement, onDelete) {
  const swipeContainer = mealElement.querySelector('.meal__swipe');
  const swipeContent = mealElement.querySelector('.meal__content');
  const deleteButton = mealElement.querySelector('.meal__delete');

  if (!swipeContainer || !swipeContent || !deleteButton) {
    return;
  }

  const DRAG_ACTIVATION_THRESHOLD_PX = 6;

  deleteButton.setAttribute('aria-label', i18n.deleteMealAriaLabel);

  const getActionWidth = () => {
    const width = deleteButton.getBoundingClientRect().width;
    return Number.isFinite(width) && width > 0 ? width : 72;
  };

  let actionWidth = getActionWidth();
  let maxOffset = -actionWidth;
  let startX = 0;
  let startY = 0;
  let currentOffset = mealElement.classList.contains('meal--open') ? maxOffset : 0;
  let isDragging = false;
  let isOpen = mealElement.classList.contains('meal--open');
  let activePointerId = null;
  let dragMode = null;
  let hasPointerCapture = false;
  let hintForwardTimer = null;
  let hintReturnTimer = null;
  let isHintActive = false;
  const originalMealTouchAction = mealElement.style.touchAction;
  const originalSwipeTouchAction = swipeContainer.style.touchAction;
  const body = document.body;
  let bodyScrollLockApplied = false;
  let bodyPrevOverflow = '';
  let bodyPrevTouchAction = '';
  let bodyTouchMoveHandler = null;

  const setTransitionsEnabled = (enabled) => {
    const value = enabled ? '' : 'none';
    swipeContent.style.transition = value;
    deleteButton.style.transition = value;
  };

  const updateDeleteReveal = (value) => {
    if (actionWidth <= 0) {
      deleteButton.style.transform = 'translateX(100%)';
      deleteButton.style.opacity = '0';
      return;
    }

    const progress = clamp(Math.abs(value) / actionWidth, 0, 1);
    const hiddenPercent = (1 - progress) * 100;
    deleteButton.style.transform = `translateX(${hiddenPercent}%)`;
    deleteButton.style.opacity = `${progress}`;
  };

  const applyOffset = (value) => {
    currentOffset = value;

    if (Math.abs(value) < 0.5) {
      swipeContent.style.transform = '';
    } else {
      swipeContent.style.transform = `translateX(${value}px)`;
    }

    updateDeleteReveal(value);
  };

  mealElement.style.setProperty('--action-width', `${actionWidth}px`);
  applyOffset(currentOffset);
  resetTouchActionOverride();

  function setTouchActionNone() {
    mealElement.style.touchAction = 'none';
    swipeContainer.style.touchAction = 'none';
  }

  function resetTouchActionOverride() {
    mealElement.style.touchAction = originalMealTouchAction;
    swipeContainer.style.touchAction = originalSwipeTouchAction;
  }

  const clearHintTimers = () => {
    if (hintForwardTimer != null) {
      window.clearTimeout(hintForwardTimer);
      hintForwardTimer = null;
    }

    if (hintReturnTimer != null) {
      window.clearTimeout(hintReturnTimer);
      hintReturnTimer = null;
    }
  };

  const cancelHintAnimation = () => {
    if (!isHintActive) {
      clearHintTimers();
      return;
    }

    clearHintTimers();
    mealElement.classList.remove('meal--swipe-hint-active');
    setTransitionsEnabled(true);
    applyOffset(isOpen ? maxOffset : 0);
    isHintActive = false;
    unlockGlobalScroll();
  };

  const playSwipeHint = () => {
    if (isDragging || isOpen || isHintActive) {
      return;
    }

    cancelHintAnimation();

    actionWidth = getActionWidth();
    maxOffset = -actionWidth;
    mealElement.style.setProperty('--action-width', `${actionWidth}px`);

    const targetOffset = maxOffset * 0.85;
    isHintActive = true;
    mealElement.classList.add('meal--swipe-hint-active');
    setTransitionsEnabled(true);
    applyOffset(targetOffset);

    hintForwardTimer = window.setTimeout(() => {
      setTransitionsEnabled(true);
      applyOffset(0);
      hintReturnTimer = window.setTimeout(() => {
        mealElement.classList.remove('meal--swipe-hint-active');
        isHintActive = false;
      }, 280);
    }, 480);
  };

  mealElement.__playSwipeHint = playSwipeHint;
  mealElement.__cancelSwipeHint = cancelHintAnimation;

  function lockGlobalScroll() {
    if (bodyScrollLockApplied) {
      return;
    }
    bodyPrevOverflow = body.style.overflow;
    bodyPrevTouchAction = body.style.touchAction;
    body.style.overflow = 'hidden';
    body.style.touchAction = 'none';
    bodyTouchMoveHandler = (event) => {
      if (event.cancelable) {
        event.preventDefault();
      }
    };
    document.addEventListener('touchmove', bodyTouchMoveHandler, { passive: false });
    bodyScrollLockApplied = true;
  }

  function unlockGlobalScroll() {
    if (!bodyScrollLockApplied) {
      return;
    }
    body.style.overflow = bodyPrevOverflow;
    body.style.touchAction = bodyPrevTouchAction;
    if (bodyTouchMoveHandler) {
      document.removeEventListener('touchmove', bodyTouchMoveHandler);
      bodyTouchMoveHandler = null;
    }
    bodyScrollLockApplied = false;
  }

  const pointerDown = (event) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) {
      return;
    }

    cancelHintAnimation();

    if (deleteButton.contains(event.target)) {
      return;
    }

    actionWidth = getActionWidth();
    maxOffset = -actionWidth;
    isOpen = mealElement.classList.contains('meal--open');
    isDragging = true;
    dragMode = null;
    startX = event.clientX;
    startY = event.clientY;
    activePointerId = event.pointerId;
    hasPointerCapture = false;
    mealElement.style.setProperty('--action-width', `${actionWidth}px`);

    setTransitionsEnabled(false);
    applyOffset(isOpen ? maxOffset : 0);
  };

  const pointerMove = (event) => {
    if (!isDragging || event.pointerId !== activePointerId) {
      return;
    }

    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;

    if (!dragMode) {
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX < DRAG_ACTIVATION_THRESHOLD_PX && absY < DRAG_ACTIVATION_THRESHOLD_PX) {
        return;
      }

      if (absX >= absY) {
        dragMode = 'horizontal';
        setTouchActionNone();
        lockGlobalScroll();
        if (!hasPointerCapture) {
          try {
            mealElement.setPointerCapture(event.pointerId);
            hasPointerCapture = true;
          } catch (error) {
            // Ignore pointer capture failures (e.g. unsupported browsers).
          }
        }
      } else {
        dragMode = 'vertical';
        isDragging = false;
        setTransitionsEnabled(true);
        applyOffset(isOpen ? maxOffset : 0);
        releasePointer(activePointerId);
        activePointerId = null;
        resetTouchActionOverride();
        unlockGlobalScroll();
        return;
      }
    }

    if (dragMode !== 'horizontal') {
      return;
    }

    event.preventDefault();

    const baseOffset = isOpen ? maxOffset : 0;
    const nextOffset = clamp(baseOffset + deltaX, maxOffset, 0);
    applyOffset(nextOffset);
  };

  const settle = (shouldOpen) => {
    isOpen = shouldOpen;
    mealElement.classList.toggle('meal--open', shouldOpen);
    setTransitionsEnabled(true);
    applyOffset(shouldOpen ? maxOffset : 0);
  };

  const releasePointer = (pointerId) => {
    if (!hasPointerCapture || pointerId == null) {
      hasPointerCapture = false;
      return;
    }
    try {
      mealElement.releasePointerCapture(pointerId);
    } catch (error) {
      // Pointer already released, ignore.
    }
    hasPointerCapture = false;
  };

  const pointerUp = (event) => {
    if (!isDragging) return;
    isDragging = false;
    const pointerId = event.pointerId;
    if (dragMode !== 'horizontal') {
      releasePointer(pointerId);
      dragMode = null;
      activePointerId = null;
      setTransitionsEnabled(true);
      applyOffset(isOpen ? maxOffset : 0);
      return;
    }

    releasePointer(event.pointerId);

    const shouldOpen = currentOffset < maxOffset / 2;
    settle(shouldOpen);
    dragMode = null;
    activePointerId = null;
    resetTouchActionOverride();
    unlockGlobalScroll();
  };

  const pointerCancel = () => {
    if (!isDragging) return;
    isDragging = false;
    releasePointer(activePointerId);
    settle(isOpen);
    dragMode = null;
    activePointerId = null;
    resetTouchActionOverride();
    unlockGlobalScroll();
  };

  mealElement.addEventListener('pointerdown', pointerDown);
  mealElement.addEventListener('pointermove', pointerMove);
  mealElement.addEventListener('pointerup', pointerUp);
  mealElement.addEventListener('pointercancel', pointerCancel);

  mealElement.addEventListener('mouseleave', () => {
    if (!isDragging) return;
    pointerCancel();
  });

  deleteButton.addEventListener('click', (event) => {
    event.stopPropagation();
    onDelete();
  });

  deleteButton.addEventListener('pointerdown', (event) => {
    event.stopPropagation();
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

setupAddCaloriesModal();
initializeHistory();
enableDaySelectorDrag();

const navButtons = document.querySelectorAll('.day-selector__nav');
navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const direction = button.classList.contains('day-selector__nav--next') ? 1 : -1;
    const scrollAmount = daySelectorList.clientWidth * 0.8;
    const maxScroll = Math.max(daySelectorList.scrollWidth - daySelectorList.clientWidth, 0);
    const current = daySelectorList.scrollLeft;
    const target = clamp(current + scrollAmount * direction, 0, maxScroll);
    daySelectorList.scrollTo({ left: target, behavior: 'smooth' });
  });
});

daySelectorList.addEventListener('scroll', scheduleNavStateUpdate, { passive: true });
window.addEventListener('resize', scheduleNavStateUpdate);

function scheduleNavStateUpdate() {
  if (navStateFrame !== null) return;
  navStateFrame = requestAnimationFrame(() => {
    navStateFrame = null;
    updateNavState();
  });
}

function updateNavState() {
  if (!navPrevButton || !navNextButton) return;
  const maxScroll = Math.max(daySelectorList.scrollWidth - daySelectorList.clientWidth, 0);
  const current = daySelectorList.scrollLeft;
  const epsilon = 1;
  const hasOverflow = maxScroll > epsilon;

  const disablePrev = !hasOverflow || current <= epsilon;
  const disableNext = !hasOverflow || current >= maxScroll - epsilon;

  navPrevButton.disabled = disablePrev;
  navNextButton.disabled = disableNext;
}

function enableDaySelectorDrag() {
  if (!daySelectorList) return;

  const releasePointer = () => {
    if (daySelectorDragState.pointerId == null) {
      return;
    }

    try {
      daySelectorList.releasePointerCapture(daySelectorDragState.pointerId);
    } catch (error) {
      // Pointer already released, ignore.
    }

    daySelectorList.classList.remove('day-selector__list--dragging');

    if (daySelectorDragState.moved) {
      suppressNextDayCardClick = true;
      if (suppressClickResetTimer !== null) {
        clearTimeout(suppressClickResetTimer);
      }
      suppressClickResetTimer = window.setTimeout(() => {
        suppressNextDayCardClick = false;
        suppressClickResetTimer = null;
      }, 100);
    }

    daySelectorDragState.pointerId = null;
    daySelectorDragState.moved = false;
    daySelectorDragState.pointerType = null;
  };

  daySelectorList.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;

    daySelectorDragState.pointerId = event.pointerId;
    daySelectorDragState.startX = event.clientX;
    daySelectorDragState.startScrollLeft = daySelectorList.scrollLeft;
    daySelectorDragState.moved = false;
    daySelectorDragState.pointerType = typeof event.pointerType === 'string' && event.pointerType.length > 0
      ? event.pointerType
      : 'touch';

    // Для мыши устанавливаем более строгий режим - отключаем перетаскивание
    if (event.pointerType === 'mouse') {
      return;
    }

    daySelectorList.classList.add('day-selector__list--dragging');
    daySelectorList.setPointerCapture(event.pointerId);
  });

  daySelectorList.addEventListener('pointermove', (event) => {
    if (daySelectorDragState.pointerId !== event.pointerId || daySelectorDragState.pointerType === 'mouse') return;

    const delta = event.clientX - daySelectorDragState.startX;
    const maxScroll = Math.max(daySelectorList.scrollWidth - daySelectorList.clientWidth, 0);
    const target = clamp(daySelectorDragState.startScrollLeft - delta, 0, maxScroll);
    const scrollDelta = target - daySelectorDragState.startScrollLeft;

    if (!daySelectorDragState.moved) {
      const shouldTreatAsClick = Math.abs(delta) < DAY_SELECTOR_TOUCH_DRAG_THRESHOLD && Math.abs(scrollDelta) < 1;
      if (shouldTreatAsClick) {
        return;
      }
      daySelectorDragState.moved = true;
    }

    daySelectorList.scrollLeft = target;
    scheduleNavStateUpdate();
    event.preventDefault();
  });

  const endDragHandler = (event) => {
    if (daySelectorDragState.pointerId !== event.pointerId) return;
    releasePointer();
  };

  daySelectorList.addEventListener('pointerup', endDragHandler);
  daySelectorList.addEventListener('pointercancel', endDragHandler);
  daySelectorList.addEventListener('pointerleave', () => {
    if (daySelectorDragState.pointerId == null) return;
    releasePointer();
  });
  daySelectorList.addEventListener('lostpointercapture', releasePointer);
}
