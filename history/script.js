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

const mockHistory = [
  {
    id: '2024-06-20',
    date: '2024-06-20',
    meals: [
      {
        id: 'breakfast-1',
        title: 'Завтрак',
        time: '08:15',
        macros: { protein: 28, fat: 18, carbs: 42 },
        dishes: [
          { name: 'Овсяная каша с ягодами', calories: 260 },
          { name: 'Греческий йогурт', calories: 110 }
        ]
      },
      {
        id: 'lunch-1',
        title: 'Обед',
        time: '13:05',
        macros: { protein: 36, fat: 22, carbs: 48 },
        dishes: [
          { name: 'Куриное филе на гриле', calories: 220 },
          { name: 'Киноа с овощами', calories: 180 },
          { name: 'Салат из огурцов', calories: 40 }
        ]
      },
      {
        id: 'snack-1',
        title: 'Перекус',
        time: '17:40',
        macros: { protein: 14, fat: 9, carbs: 25 },
        dishes: [
          { name: 'Протеиновый батончик', calories: 190 }
        ]
      }
    ]
  },
  {
    id: '2024-06-19',
    date: '2024-06-19',
    meals: [
      {
        id: 'breakfast-2',
        title: 'Завтрак',
        time: '07:55',
        macros: { protein: 24, fat: 16, carbs: 38 },
        dishes: [
          { name: 'Омлет с овощами', calories: 220 },
          { name: 'Тост из цельнозернового хлеба', calories: 90 }
        ]
      },
      {
        id: 'lunch-2',
        title: 'Обед',
        time: '12:40',
        macros: { protein: 32, fat: 18, carbs: 52 },
        dishes: [
          { name: 'Треска на пару', calories: 210 },
          { name: 'Булгур с зеленью', calories: 160 },
          { name: 'Тыквенный суп-пюре', calories: 120 }
        ]
      },
      {
        id: 'dinner-2',
        title: 'Ужин',
        time: '19:30',
        macros: { protein: 26, fat: 14, carbs: 30 },
        dishes: [
          { name: 'Индейка запечённая', calories: 240 },
          { name: 'Тушёные овощи', calories: 130 }
        ]
      }
    ]
  },
  {
    id: '2024-06-18',
    date: '2024-06-18',
    meals: [
      {
        id: 'breakfast-3',
        title: 'Завтрак',
        time: '08:05',
        macros: { protein: 22, fat: 12, carbs: 44 },
        dishes: [
          { name: 'Гранола с молоком', calories: 280 },
          { name: 'Яблоко', calories: 80 }
        ]
      },
      {
        id: 'lunch-3',
        title: 'Обед',
        time: '12:55',
        macros: { protein: 34, fat: 20, carbs: 56 },
        dishes: [
          { name: 'Лосось на пару', calories: 260 },
          { name: 'Картофельное пюре', calories: 190 },
          { name: 'Салат из шпината', calories: 60 }
        ]
      },
      {
        id: 'dinner-3',
        title: 'Ужин',
        time: '20:10',
        macros: { protein: 20, fat: 11, carbs: 28 },
        dishes: [
          { name: 'Тофу с рисовой лапшой', calories: 310 }
        ]
      }
    ]
  },
  {
    id: '2024-06-17',
    date: '2024-06-17',
    meals: [
      {
        id: 'breakfast-4',
        title: 'Завтрак',
        time: '07:45',
        macros: { protein: 18, fat: 10, carbs: 42 },
        dishes: [
          { name: 'Тост с авокадо', calories: 230 },
          { name: 'Кофе с молоком', calories: 60 }
        ]
      },
      {
        id: 'lunch-4',
        title: 'Обед',
        time: '13:25',
        macros: { protein: 30, fat: 19, carbs: 50 },
        dishes: [
          { name: 'Говяжьи тефтели', calories: 240 },
          { name: 'Рис басмати', calories: 170 },
          { name: 'Овощной салат', calories: 70 }
        ]
      },
      {
        id: 'dinner-4',
        title: 'Ужин',
        time: '19:45',
        macros: { protein: 24, fat: 15, carbs: 22 },
        dishes: [
          { name: 'Тунец с овощами-гриль', calories: 280 }
        ]
      }
    ]
  }
];

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

const numberFormatter = new Intl.NumberFormat('ru-RU', {
  maximumFractionDigits: 0
});

const MACRO_CALORIES = {
  protein: 4,
  fat: 9,
  carbs: 4
};

let selectedDayId = mockHistory[0]?.id ?? null;

function renderDaySelector() {
  daySelectorList.innerHTML = '';

  const days = mockHistory
    .slice()
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!selectedDayId && days.length > 0) {
    selectedDayId = days[0].id;
  }

  days.forEach((day) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'day-card';
    card.dataset.dayId = day.id;

    const date = new Date(day.date);
    const formattedDate = dayFormatter.format(date).replace('.', '');
    const weekday = capitalize(weekdayFormatter.format(date));

    card.innerHTML = `
      <span class="day-card__date">${formattedDate}</span>
      <span class="day-card__weekday">${weekday}</span>
      <span class="day-card__total">${getDayCalories(day)} ккал</span>
    `;

    if (day.id === selectedDayId) {
      card.classList.add('day-card--active');
      card.setAttribute('aria-selected', 'true');
    } else {
      card.setAttribute('aria-selected', 'false');
    }

    card.addEventListener('click', (event) => {
      // Предотвращаем обработку клика, если это был свайп
      if (suppressNextDayCardClick) {
        suppressNextDayCardClick = false;
        if (suppressClickResetTimer !== null) {
          clearTimeout(suppressClickResetTimer);
          suppressClickResetTimer = null;
        }
        return;
      }
      selectedDayId = day.id;
      updateSelection();
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    });

    daySelectorList.append(card);
  });

  scheduleNavStateUpdate();
}

function updateSelection() {
  Array.from(daySelectorList.children).forEach((card) => {
    const isActive = card.dataset.dayId === selectedDayId;
    card.classList.toggle('day-card--active', isActive);
    card.setAttribute('aria-selected', String(isActive));
  });

  renderMeals();
  scheduleNavStateUpdate();
}

function renderMeals() {
  mealsList.innerHTML = '';
  const day = mockHistory.find((item) => item.id === selectedDayId);

  if (!day || day.meals.length === 0) {
    mealsCalories.textContent = '0 ккал';
    const breakdown = formatMacroBreakdown();
    mealsMacros.textContent = breakdown.macrosLine;
    mealsRatios.textContent = breakdown.ratiosLine;
    mealsList.innerHTML = '<p class="meals__empty">Нет данных за этот день</p>';
    return;
  }

  const totals = day.meals.reduce((acc, meal) => {
    const calories = meal.dishes.reduce((sum, dish) => sum + dish.calories, 0);
    acc.calories += calories;
    acc.protein += meal.macros.protein;
    acc.fat += meal.macros.fat;
    acc.carbs += meal.macros.carbs;
    return acc;
  }, { calories: 0, protein: 0, fat: 0, carbs: 0 });

  mealsCalories.textContent = `${numberFormatter.format(totals.calories)} ккал`;
  const totalsBreakdown = formatMacroBreakdown(totals);
  mealsMacros.textContent = totalsBreakdown.macrosLine;
  mealsRatios.textContent = totalsBreakdown.ratiosLine;

  const mealTemplate = document.getElementById('meal-item-template');
  const dishTemplate = document.getElementById('dish-item-template');

  day.meals.forEach((meal) => {
    const mealNode = mealTemplate.content.firstElementChild.cloneNode(true);
    const mealContent = mealNode.querySelector('.meal__content');
    mealNode.dataset.id = meal.id;

    mealContent.querySelector('.meal__time').textContent = meal.time;

    const totalCalories = meal.dishes.reduce((sum, dish) => sum + dish.calories, 0);
    mealContent.querySelector('.meal__calories').textContent = `${totalCalories} ккал`;
    const mealBreakdown = formatMacroBreakdown({
      protein: meal.macros.protein,
      fat: meal.macros.fat,
      carbs: meal.macros.carbs
    });
    mealContent.querySelector('.meal__macros').textContent = mealBreakdown.macrosLine;
    mealContent.querySelector('.meal__ratios').textContent = mealBreakdown.ratiosLine;

    const dishesList = mealContent.querySelector('.meal__dishes');
    meal.dishes.forEach((dish) => {
      const dishNode = dishTemplate.content.firstElementChild.cloneNode(true);
      dishNode.querySelector('.dish__name').textContent = dish.name;
      dishNode.querySelector('.dish__calories').textContent = `${dish.calories} ккал`;
      dishesList.append(dishNode);
    });

    mealsList.append(mealNode);
    setupSwipeInteraction(mealNode, () => deleteMeal(day.id, meal.id));
  });
}

function deleteMeal(dayId, mealId) {
  const day = mockHistory.find((item) => item.id === dayId);
  if (!day) return;

  day.meals = day.meals.filter((meal) => meal.id !== mealId);
  renderMeals();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getDayCalories(day) {
  return numberFormatter.format(
    day.meals.reduce((acc, meal) => acc + meal.dishes.reduce((sum, dish) => sum + dish.calories, 0), 0)
  );
}

function formatMacroBreakdown({ protein = 0, fat = 0, carbs = 0 } = {}) {
  const proteinValue = Number.isFinite(protein) ? protein : 0;
  const fatValue = Number.isFinite(fat) ? fat : 0;
  const carbsValue = Number.isFinite(carbs) ? carbs : 0;

  const caloriesFromProtein = proteinValue * MACRO_CALORIES.protein;
  const caloriesFromFat = fatValue * MACRO_CALORIES.fat;
  const caloriesFromCarbs = carbsValue * MACRO_CALORIES.carbs;
  const caloriesTotal = caloriesFromProtein + caloriesFromFat + caloriesFromCarbs;

  let percentages = [0, 0, 0];

  if (caloriesTotal > 0) {
    const rawPercentages = [caloriesFromProtein, caloriesFromFat, caloriesFromCarbs].map((value) =>
      (value / caloriesTotal) * 100
    );

    const basePercents = rawPercentages.map((value) => Math.floor(value));
    let remainderBudget = 100 - basePercents.reduce((sum, value) => sum + value, 0);

    const remainders = rawPercentages
      .map((value, index) => ({ index, fraction: value - basePercents[index] }))
      .sort((a, b) => b.fraction - a.fraction);

    let pointer = 0;
    while (remainderBudget > 0 && remainders.length > 0) {
      const target = remainders[pointer % remainders.length];
      basePercents[target.index] += 1;
      remainderBudget -= 1;
      pointer += 1;
    }

    percentages = basePercents;
  }

  const macrosLine = [`🥚 ${proteinValue} г`, `🧈 ${fatValue} г`, `🍞 ${carbsValue} г`].join(' · ');
  const ratiosLine = `🥧 ${percentages.join('/')}%`;

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

renderDaySelector();
updateSelection();
scheduleNavStateUpdate();
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
