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
  const accentColor = themeParams.button_color || '#2ea6ff';
  const accentContrast = themeParams.button_text_color || '#ffffff';
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
  currentDayRequestToken: null
};

const REQUEST_TIMEOUT_MS = 20000;

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
      let errorMessage = `Request failed with status ${response.status}`;
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
let navStateFrame = null;
let suppressNextDayCardClick = false;
let suppressClickResetTimer = null;
const DAY_SELECTOR_TOUCH_DRAG_THRESHOLD = 24;

const daySelectorDragState = {
  pointerId: null,
  startX: 0,
  startScrollLeft: 0,
  moved: false,
  pointerType: null
};

const dayFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: '2-digit',
  month: 'short'
});

const weekdayFormatter = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'short'
});

const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit',
  minute: '2-digit'
});

const numberFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 0
});

const MACRO_CALORIES = {
  protein: 4,
  fat: 9,
  carbs: 4
};

function renderDaySelector() {
  daySelectorList.innerHTML = '';

  if (historyState.isFetchingDays) {
    renderDaySelectorStatus('Загрузка...');
    scheduleNavStateUpdate();
    return;
  }

  if (historyState.fetchDaysError) {
    renderDaySelectorStatus(historyState.fetchDaysError);
    scheduleNavStateUpdate();
    return;
  }

  if (!historyState.days.length) {
    renderDaySelectorStatus('Нет данных');
    scheduleNavStateUpdate();
    return;
  }

  const sortedDays = historyState.days.slice().sort((a, b) => new Date(b) - new Date(a));

  sortedDays.forEach((date) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'day-card';
    card.dataset.dayId = date;

    const jsDate = new Date(`${date}T00:00:00`);
    const formattedDate = dayFormatter.format(jsDate).replace('.', '');
    const weekday = capitalize(weekdayFormatter.format(jsDate));

    const caloriesValue = getCachedDayCalories(date);
    const caloriesText = caloriesValue != null ? `${numberFormatter.format(caloriesValue)} ккал` : '—';

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
    renderMealsStatus('Выберите день, чтобы посмотреть приёмы пищи');
    return;
  }

  if (historyState.loadingDayId === dayId && !historyState.dayDetails.has(dayId)) {
    setSummaryFromTotals();
    renderMealsStatus('Загрузка...', 'meals__status');
    return;
  }

  if (historyState.fetchDayError && !historyState.dayDetails.has(dayId)) {
    setSummaryFromTotals();
    renderMealsStatus(historyState.fetchDayError, 'meals__status');
    return;
  }

  const day = historyState.dayDetails.get(dayId);

  if (!day) {
    setSummaryFromTotals();
    renderMealsStatus('Нет данных');
    return;
  }

  setSummaryFromTotals(day.totals);

  if (!day.meals.length) {
    renderMealsStatus('Нет данных за этот день');
    return;
  }

  const mealTemplate = document.getElementById('meal-item-template');
  const dishTemplate = document.getElementById('dish-item-template');

  day.meals
    .slice()
    .sort((a, b) => (a.timestamp ?? 0) - (b.timestamp ?? 0))
    .forEach((meal) => {
      const mealNode = mealTemplate.content.firstElementChild.cloneNode(true);
      const mealContent = mealNode.querySelector('.meal__content');
      mealNode.dataset.id = meal.mealId != null ? String(meal.mealId) : meal.timestamp != null ? String(meal.timestamp) : '';

      mealContent.querySelector('.meal__time').textContent = formatMealTime(meal.timestamp);

      const mealCalories = safeNumber(meal.totals?.calories);
      mealContent.querySelector('.meal__calories').textContent = `${numberFormatter.format(mealCalories)} ккал`;
      const mealBreakdown = formatMacroBreakdown(meal.totals);
      mealContent.querySelector('.meal__macros').textContent = mealBreakdown.macrosLine;
      mealContent.querySelector('.meal__ratios').textContent = mealBreakdown.ratiosLine;

      const dishesList = mealContent.querySelector('.meal__dishes');
      (meal.dishes || []).forEach((dish) => {
        const dishNode = dishTemplate.content.firstElementChild.cloneNode(true);
        dishNode.querySelector('.dish__name').textContent = dish.name ?? '';
        dishNode.querySelector('.dish__calories').textContent = `${numberFormatter.format(safeNumber(dish.calories))} ккал`;
        dishesList.append(dishNode);
      });

      mealsList.append(mealNode);
      setupSwipeInteraction(mealNode, () => deleteMeal(day.date, meal.mealId));
    });
}

function setSummaryFromTotals(totals = {}) {
  const calories = safeNumber(totals.calories);
  mealsCalories.textContent = `${numberFormatter.format(calories)} ккал`;

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
    return;
  }

  historyState.loadingDayId = dayId;
  historyState.fetchDayError = null;
  renderMeals();

  const requestToken = Symbol('dayRequest');
  historyState.currentDayRequestToken = requestToken;

  try {
    const response = await callHistoryApi('/api/history/day', {
      initData: getInitDataString(),
      date: dayId
    });

    if (historyState.currentDayRequestToken !== requestToken) {
      return;
    }

    const normalizedDay = normalizeDayDetailsResponse(response, dayId);
    historyState.dayDetails.set(dayId, normalizedDay);
    historyState.fetchDayError = null;
  } catch (error) {
    if (historyState.currentDayRequestToken === requestToken) {
      historyState.fetchDayError = error.message || 'Не удалось загрузить данные';
    }
    console.error('Failed to fetch day details', error);
  } finally {
    if (historyState.currentDayRequestToken === requestToken) {
      historyState.currentDayRequestToken = null;
      historyState.loadingDayId = null;
    }

    renderMeals();
    renderDaySelector();
  }
}

async function loadAvailableDays() {
  historyState.isFetchingDays = true;
  historyState.fetchDaysError = null;
  renderDaySelector();

  try {
    const response = await callHistoryApi('/api/history/days', {
      initData: getInitDataString(),
      timezone: getUserTimezone()
    });

    const days = Array.isArray(response?.days) ? response.days : [];
    historyState.days = days;

    const allowedDays = new Set(days);
    Array.from(historyState.dayDetails.keys()).forEach((day) => {
      if (!allowedDays.has(day)) {
        historyState.dayDetails.delete(day);
      }
    });

    if (!days.includes(historyState.selectedDayId || '')) {
      historyState.selectedDayId = days[0] || null;
    }
  } catch (error) {
    historyState.fetchDaysError = error.message || 'Не удалось загрузить список дней';
    historyState.days = [];
    historyState.selectedDayId = null;
    console.error('Failed to load history days', error);
  } finally {
    historyState.isFetchingDays = false;
    renderDaySelector();

    if (historyState.selectedDayId) {
      ensureDayDetails(historyState.selectedDayId);
    } else {
      renderMeals();
    }
  }
}

function initializeHistory() {
  historyState.isFetchingDays = true;
  renderDaySelector();
  renderMeals();
  loadAvailableDays();
}

function getCachedDayCalories(dayId) {
  const details = historyState.dayDetails.get(dayId);
  if (!details) return null;
  const calories = safeNumber(details?.totals?.calories);
  return Number.isFinite(calories) ? calories : null;
}

function formatMealTime(timestamp) {
  if (!Number.isFinite(Number(timestamp))) {
    return '—';
  }

  try {
    return timeFormatter.format(new Date(Number(timestamp) * 1000));
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
    tg?.showAlert?.('Не удалось удалить приём пищи');
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
  const meals = Array.isArray(payload?.meals) ? payload.meals.map(normalizeMeal) : [];

  return {
    date: payload?.date || fallbackDate,
    totals: normalizedTotals,
    meals
  };
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

function normalizeMeal(meal = {}) {
  return {
    mealId: meal.mealId ?? meal.id ?? null,
    timestamp: meal.timestamp != null ? Number(meal.timestamp) : null,
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

  const macrosLine = [
    `🥚 ${numberFormatter.format(proteinValue)} г`,
    `🧈 ${numberFormatter.format(fatValue)} г`,
    `🍞 ${numberFormatter.format(carbsValue)} г`
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

  const getActionWidth = () => {
    const width = deleteButton.getBoundingClientRect().width;
    return Number.isFinite(width) && width > 0 ? width : 72;
  };

  let actionWidth = getActionWidth();
  let maxOffset = -actionWidth;
  let startX = 0;
  let currentOffset = mealElement.classList.contains('meal--open') ? maxOffset : 0;
  let isDragging = false;
  let isOpen = mealElement.classList.contains('meal--open');
  let activePointerId = null;

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

  const pointerDown = (event) => {
    if (!event.isPrimary) return;

    actionWidth = getActionWidth();
    maxOffset = -actionWidth;
    isOpen = mealElement.classList.contains('meal--open');
    isDragging = true;
    startX = event.clientX;
    activePointerId = event.pointerId;
    mealElement.style.setProperty('--action-width', `${actionWidth}px`);

    setTransitionsEnabled(false);
    applyOffset(isOpen ? maxOffset : 0);

    swipeContainer.setPointerCapture(event.pointerId);
  };

  const pointerMove = (event) => {
    if (!isDragging) return;
    const delta = event.clientX - startX;
    const baseOffset = isOpen ? maxOffset : 0;
    const nextOffset = clamp(baseOffset + delta, maxOffset, 0);
    applyOffset(nextOffset);
  };

  const settle = (shouldOpen) => {
    isOpen = shouldOpen;
    mealElement.classList.toggle('meal--open', shouldOpen);
    setTransitionsEnabled(true);
    applyOffset(shouldOpen ? maxOffset : 0);
  };

  const releasePointer = (pointerId) => {
    if (pointerId == null) return;
    try {
      swipeContainer.releasePointerCapture(pointerId);
    } catch (error) {
      // Pointer already released, ignore.
    }
  };

  const pointerUp = (event) => {
    if (!isDragging) return;
    isDragging = false;
    releasePointer(event.pointerId);

    const shouldOpen = currentOffset < maxOffset / 2;
    settle(shouldOpen);
    activePointerId = null;
  };

  const pointerCancel = () => {
    if (!isDragging) return;
    isDragging = false;
    releasePointer(activePointerId);
    settle(isOpen);
    activePointerId = null;
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
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

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
