const tg = window.Telegram?.WebApp;

tg?.ready();
tg?.expand();

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

    card.addEventListener('click', () => {
      selectedDayId = day.id;
      updateSelection();
    });

    daySelectorList.append(card);
  });
}

function updateSelection() {
  Array.from(daySelectorList.children).forEach((card) => {
    const isActive = card.dataset.dayId === selectedDayId;
    card.classList.toggle('day-card--active', isActive);
    card.setAttribute('aria-selected', String(isActive));
  });

  renderMeals();
}

function renderMeals() {
  mealsList.innerHTML = '';
  const day = mockHistory.find((item) => item.id === selectedDayId);

  if (!day || day.meals.length === 0) {
    mealsCalories.textContent = '0 ккал';
    mealsMacros.textContent = 'Б 0 г • Ж 0 г • У 0 г';
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
  mealsMacros.textContent = `Б ${totals.protein} г • Ж ${totals.fat} г • У ${totals.carbs} г`;

  const mealTemplate = document.getElementById('meal-item-template');
  const dishTemplate = document.getElementById('dish-item-template');

  day.meals.forEach((meal) => {
    const mealNode = mealTemplate.content.firstElementChild.cloneNode(true);
    const mealContent = mealNode.querySelector('.meal__content');
    mealNode.dataset.id = meal.id;

    mealContent.querySelector('.meal__title').textContent = meal.title;
    mealContent.querySelector('.meal__time').textContent = meal.time;

    const totalCalories = meal.dishes.reduce((sum, dish) => sum + dish.calories, 0);
    mealContent.querySelector('.meal__calories').textContent = `${totalCalories} ккал`;
    mealContent.querySelector('.meal__macros').textContent = `Б ${meal.macros.protein} г • Ж ${meal.macros.fat} г • У ${meal.macros.carbs} г`;

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

function setupSwipeInteraction(mealElement, onDelete) {
  const swipeContainer = mealElement.querySelector('.meal__swipe');
  const deleteButton = mealElement.querySelector('.meal__delete');

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

  const pointerDown = (event) => {
    if (!event.isPrimary) return;
    actionWidth = getActionWidth();
    maxOffset = -actionWidth;
    isOpen = mealElement.classList.contains('meal--open');
    isDragging = true;
    startX = event.clientX;
    mealElement.setPointerCapture(event.pointerId);
    swipeContainer.style.transition = 'none';
  };

  const pointerMove = (event) => {
    if (!isDragging) return;
    const delta = event.clientX - startX;
    const baseOffset = isOpen ? maxOffset : 0;
    currentOffset = clamp(baseOffset + delta, maxOffset, 0);
    swipeContainer.style.transform = `translateX(${currentOffset}px)`;
  };

  const pointerUp = (event) => {
    if (!isDragging) return;
    isDragging = false;
    mealElement.releasePointerCapture(event.pointerId);
    swipeContainer.style.transition = '';
    const shouldOpen = currentOffset < maxOffset / 2;
    isOpen = shouldOpen;
    mealElement.classList.toggle('meal--open', shouldOpen);
    swipeContainer.style.transform = shouldOpen ? `translateX(${maxOffset}px)` : '';
  };

  const pointerCancel = () => {
    if (!isDragging) return;
    isDragging = false;
    swipeContainer.style.transition = '';
    mealElement.classList.toggle('meal--open', isOpen);
    swipeContainer.style.transform = isOpen ? `translateX(${maxOffset}px)` : '';
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

const navButtons = document.querySelectorAll('.day-selector__nav');
navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const direction = button.classList.contains('day-selector__nav--next') ? 1 : -1;
    const scrollAmount = daySelectorList.clientWidth * 0.8;
    daySelectorList.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
  });
});
