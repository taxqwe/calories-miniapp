document.addEventListener('DOMContentLoaded', () => {
  // Инициализация Telegram WebApp
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();

  // Получаем параметры темы Telegram (если заданы)
  const theme = tg.themeParams || {};

  // Устанавливаем системные переменные, беря значения из параметров темы Telegram,
  // если они доступны, или используя значения по умолчанию для тёмного стиля.
  document.documentElement.style.setProperty('--text-color', theme.text_color || '#ffffff');
  document.documentElement.style.setProperty('--text-light', theme.hint_color || '#999999');

  // Сохраняем наши акцентные цвета:
  // Наш синий
  document.documentElement.style.setProperty('--accent-color', '#2196F3');
  document.documentElement.style.setProperty('--our-blue', '#2196F3');
  // Наш оранжевый, введём новую переменную для оранжевого акцента:
  document.documentElement.style.setProperty('--orange-accent', '#FF6422');

  // Остальные переменные оставляем без изменений:
  document.documentElement.style.setProperty('--border-color', '#5e5e5e');
  document.documentElement.style.setProperty('--chart-secondary', '#48484a');

  // Различаем общие и внутренние фоны в зависимости от цветовой схемы Telegram:
  if (tg.colorScheme === 'dark') {
    // Для тёмной темы фон элементов делаем отличным от общего фона
    document.documentElement.style.setProperty('--card-bg', '#2c2c2e');
    document.documentElement.style.setProperty('--bg-color', '#1c1c1e');
    // Для полоски предыдущего периода задаём цвет, который будет хорошо виден на тёмном фоне
    document.documentElement.style.setProperty('--prev-bar-color', 'rgba(255, 255, 255, 0.3)');
  } else {
    // В светлой теме фон элементов можно сделать отличным от основного фона
    document.documentElement.style.setProperty('--card-bg', theme.secondary_bg_color || '#f0f0f0');
    // Для полоски предыдущего периода выбираем более тёмное значение, чтобы оно было видно на светлом фоне
    document.documentElement.style.setProperty('--prev-bar-color', 'rgba(0, 0, 0, 0.3)');
  }

  // Для совместимости указываем значение для --dark-bg, но лучше вместо него использовать --card-bg
  document.documentElement.style.setProperty('--dark-bg', document.documentElement.style.getPropertyValue('--card-bg'));

  // Названия месяцев
  const months = ['янв.', 'февр.', 'март', 'апр.', 'май', 'июнь', 'июль', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'];
  const shortMonths = ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'];

  // Моковые данные с параметрами bmr и tdee
  function generateMockData(count) {
    const data = [];
    // Стартовая дата – (count-1) дней назад (так, чтобы последний элемент соответствовал сегодня)
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - (count - 1));
    for (let i = 0; i < count; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const calories = Math.random() > 0.8 ? 0 : Math.floor(Math.random() * 2200) + 800;
      data.push({ date: currentDate, calories: calories });
    }
    return data;
  }

  // Получение реальных данных с сервера
  async function fetchUserStats() {
    try {
      const initData = tg.initData;
      // Получаем userId из initDataUnsafe
      const userId = tg.initDataUnsafe?.user?.id;

      const response = await fetch('https://calories-bot.duckdns.org:8443/api/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Source-App': 'Calories-Stats'
        },
        mode: 'cors',
        body: JSON.stringify({
          initData: initData,
          userId: userId
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка ответа сервера:', response.status, errorText);
        throw new Error('Ошибка получения данных');
      }

      const responseData = await response.json();
      console.log('Получены данные от сервера:', responseData);

      // Преобразуем данные из Map<String, Int> в массив объектов {date, calories}
      const caloriesMap = responseData.calories;
      const tdee = responseData.tdee;

      const formattedData = [];
      // Рассчитываем даты за последние 730 дней для полного набора данных
      let startDate = new Date();
      startDate.setDate(startDate.getDate() - 729);

      for (let i = 0; i < 730; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        // Форматируем дату в формат yyyy-MM-dd для поиска в полученных данных
        const dateKey = currentDate.toISOString().split('T')[0];
        const calories = caloriesMap[dateKey] || 0;

        formattedData.push({ date: currentDate, calories: calories });
      }

      window.allData = formattedData;

      // Если TDEE известен, используем его, иначе оставляем значение по умолчанию
      if (tdee) {
        window.userTDEE = tdee;
      }

      // Обновляем график после получения данных
      updateChart(currentPeriod);

      return true;
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
      // В случае ошибки используем моковые данные
      window.allData = generateMockData(730);
      updateChart(currentPeriod);
      return false;
    }
  }

  // Инициализируем данные моковыми на случай ошибки
  window.allData = generateMockData(730);
  window.userTDEE = 2200; // Значение по умолчанию

  // Загружаем реальные данные
  fetchUserStats();

  // Функция для получения данных за неделю (последние 7 дней)
  function getWeekData() {
    return window.allData.slice(-7);  // возвращаем массив объектов
  }

  // Функция для получения данных за месяц (последние 30 дней)
  function getMonthData() {
    return window.allData.slice(-30);
  }

  // Функция для получения данных за 6 месяцев (последние 180 дней),
  // группируя по неделям (7-дневные группы) – возвращает массив чисел
  function getSixMonthData() {
    const rawData = window.allData.slice(-180);
    const aggregated = [];
    for (let i = 0; i < rawData.length; i += 7) {
      const group = rawData.slice(i, i + 7);
      const nonEmpty = group.filter(item => item.calories > 0).map(item => item.calories);
      const avg = nonEmpty.length ? Math.round(nonEmpty.reduce((a, b) => a + b, 0) / nonEmpty.length) : 0;
      aggregated.push(avg);
    }
    return aggregated;
  }

  // Функция для получения данных за год (последние 365 дней),
  // группируя по месяцам – возвращает массив чисел
  function getYearData() {
    const now = new Date();
    
    // Создаем дату начала первого полного месяца год назад
    // Если сейчас апрель 2025, то нам нужны данные с мая 2024
    const startDate = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
    
    // Фильтруем данные, оставляя только те, что после startDate
    const filteredData = window.allData.filter(item => item.date >= startDate);
    
    // Создаем объект для группировки по месяцам
    const groups = {};
    
    // Заполняем группы для всех 12 месяцев (некоторые могут остаться пустыми)
    for (let i = 0; i < 12; i++) {
      const currentMonth = (startDate.getMonth() + i) % 12;
      const currentYear = startDate.getFullYear() + Math.floor((startDate.getMonth() + i) / 12);
      const monthKey = `${currentYear}-${currentMonth}`;
      groups[monthKey] = [];
    }
    
    // Распределяем данные по соответствующим месяцам
    filteredData.forEach(item => {
      const m = item.date.getMonth();
      const y = item.date.getFullYear();
      const monthKey = `${y}-${m}`;
      if (groups[monthKey]) {
        groups[monthKey].push(item.calories);
      }
    });
    
    // Преобразуем группы в массив средних значений
    const aggregated = [];
    
    // Проходим по всем месяцам от startDate
    for (let i = 0; i < 12; i++) {
      const currentMonth = (startDate.getMonth() + i) % 12;
      const currentYear = startDate.getFullYear() + Math.floor((startDate.getMonth() + i) / 12);
      const monthKey = `${currentYear}-${currentMonth}`;
      
      const group = groups[monthKey] || [];
      const nonEmpty = group.filter(v => v > 0);
      const avg = nonEmpty.length ? Math.round(nonEmpty.reduce((a, b) => a + b, 0) / nonEmpty.length) : 0;
      aggregated.push(avg);
    }
    
    return aggregated;
  }

  window.getWeekData = getWeekData;
  window.getMonthData = getMonthData;
  window.getSixMonthData = getSixMonthData;
  window.getYearData = getYearData;

  let currentPeriod = 'week';
  const periodButtons = document.querySelectorAll('.period-button');
  periodButtons.forEach(button => {
    button.addEventListener('click', () => {
      periodButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      currentPeriod = button.dataset.period;
      updateChart(currentPeriod);
    });
  });

  let isTrendVisible = false;
  const trendButton = document.querySelector('.trend-button');

  // Создаем контейнер для тренд-линий и сами линии
  const statsChartContainer = document.querySelector('.stats-chart-container');
  const trendContainer = document.createElement('div');
  trendContainer.className = 'trend-container';
  statsChartContainer.appendChild(trendContainer);

  // Создаем только линию для среднего (average) – оранжевая, подпись по правому краю
  const averageLine = document.createElement('div');
  averageLine.className = 'trend-line average-line';
  const averageValue = document.createElement('span');
  averageValue.className = 'trend-value average-value';
  averageLine.appendChild(averageValue);
  trendContainer.appendChild(averageLine);

  trendButton.addEventListener('click', () => {
    isTrendVisible = !isTrendVisible;
    updateTrendVisibility();
  });

  function updateTrendVisibility() {
    averageLine.style.opacity = isTrendVisible ? '1' : '0';
    statsChartContainer.classList.toggle('trend-active', isTrendVisible);
    trendButton.classList.toggle('active', isTrendVisible);
  }

  function formatPeriodDate(period) {
    const now = new Date();
    let start;
    switch (period) {
      case 'week':
        start = new Date(now);
        start.setDate(now.getDate() - 7);
        return `${start.getDate()} ${months[start.getMonth()]} — ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}г.`;
      case 'month':
        start = new Date(now);
        start.setDate(now.getDate() - 30);
        return `${start.getDate()} ${months[start.getMonth()]} — ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}г.`;
      case '6month':
        start = new Date(now);
        start.setMonth(now.getMonth() - 6);
        return `14 окт. ${start.getFullYear()} — 13 апр. ${now.getFullYear()}г.`;
      case 'year':
        start = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
        return `${months[start.getMonth()]} ${start.getFullYear()} — ${months[now.getMonth()]} ${now.getFullYear()}г.`;
    }
  }

  // Функция, возвращающая массив дат – начало каждой 7-дневной группы для 6 месяцев
  function getSixMonthIntervals() {
    const rawData = window.allData.slice(-180); // последние 180 дней
    const intervals = [];
    for (let i = 0; i < rawData.length; i += 7) {
      intervals.push(rawData[i].date); // берем дату первого дня группы
    }
    return intervals;
  }
  window.getSixMonthIntervals = getSixMonthIntervals;


  function getLabelsForPeriod(period) {
    const now = new Date();
    switch (period) {
      case 'week':
        return Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now);
          date.setDate(now.getDate() - (6 - i));
          return date.getDate().toString();
        });
      case 'month': {
        // Получаем данные за последний месяц (30 дней)
        const monthData = window.getMonthData(); // массив объектов { date, calories }
        // Инициализируем массив подписей длиной 30 с пустыми значениями
        const labels = new Array(monthData.length).fill('');
        // Для каждого дня, если дата — понедельник (getDay() === 1), записываем номер дня
        monthData.forEach((item, index) => {
          const date = new Date(item.date);
          if (date.getDay() === 1) { // понедельник
            labels[index] = date.getDate().toString();
          }
        });
        return labels;
      }
      case '6month': {
        const intervals = getSixMonthIntervals(); // массив дат начала каждой недели
        const labels = [];
        for (let i = 0; i < intervals.length; i++) {
          // Если это первая группа или месяц изменился по сравнению с предыдущей группы,
          // подпишем данную группу коротким названием месяца
          if (i === 0 || intervals[i].getMonth() !== intervals[i - 1].getMonth()) {
            const monthName = intervals[i].toLocaleDateString('ru-RU', { month: 'short' });
            labels.push(monthName);
          } else {
            labels.push('');
          }
        }
        return labels;
      }
      case 'year': {
        const rawData = window.allData.slice(-365);
        if (!rawData.length) return [];

        // Берем последнюю дату (конец периода)
        const endDate = rawData[rawData.length - 1].date;
        const labels = [];
        for (let i = 11; i >= 0; i--) {
          const d = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
          const monthName = d.toLocaleDateString('ru-RU', { month: 'narrow' });
          labels.push(monthName);
        }
        return labels;
      }
      default:
        return Array.from({ length: 7 }, (_, i) => {
          const date = new Date(now);
          date.setDate(now.getDate() - (6 - i));
          return date.getDate().toString();
        });
    }
  }


  function updateChart(period) {
    let data;
    if (period === 'week') {
      data = getWeekData().map(item => item.calories); // преобразуем объекты в числа
    } else if (period === 'month') {
      data = getMonthData().map(item => item.calories);
    } else if (period === '6month') {
      data = getSixMonthData(); // уже числа
    } else if (period === 'year') {
      data = getYearData();
    }

    const TDEE = window.userTDEE || 2200; // используем TDEE из реальных данных или дефолтное значение
    const maxValue = Math.max(...data, TDEE);
    const labels = getLabelsForPeriod(period, data.length);
    
    const chartContainerElem = document.querySelector('.stats-chart');
    if (chartContainerElem) {
      chartContainerElem.innerHTML = '';
  
      data.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'chart-bar' + (value === 0 ? ' empty' : '');
        const height = value === 0 ? 4 : (value / maxValue * 100);
        bar.style.height = `${height}%`;
        
        // Добавляем атрибут с информацией о калориях для столбца
        bar.setAttribute('data-calories', value);
        // Для разных периодов добавляем дополнительную информацию
        if (period === 'week' || period === 'month') {
          // Для недели и месяца - это калории за день
          bar.setAttribute('data-type', 'day');
          // Добавляем дату для каждого столбца
          const dateObj = period === 'week' ? 
            getWeekData()[index].date : 
            getMonthData()[index].date;
          bar.setAttribute('data-date', dateObj.toISOString());
        } else if (period === '6month') {
          // Для 6 месяцев - это средние калории за неделю
          bar.setAttribute('data-type', 'week');
          // Получаем дату начала недели
          const rawData = window.allData.slice(-180);
          const weekIndex = Math.floor(index * 7);
          if (weekIndex < rawData.length) {
            bar.setAttribute('data-date', rawData[weekIndex].date.toISOString());
          }
        } else if (period === 'year') {
          // Для года - это средние калории за месяц
          bar.setAttribute('data-type', 'month');
          // Вычисляем дату начала месяца
          const now = new Date();
          const startDate = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
          const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + index, 1);
          bar.setAttribute('data-date', monthDate.toISOString());
        }
        
        // Остальной код функции startPress и cancelPress
        let pressTimer;
  
        function startPress(e) {
          if (e.type === 'mousedown' && e.button !== 0) return;
          pressTimer = setTimeout(() => {
            // Пустая функция - не вызываем showInfo
          }, 250); // Уменьшаем задержку с 500 до 250 мс
        }
  
        function cancelPress() {
          clearTimeout(pressTimer);
          // Пустая функция - не вызываем hideInfo
        }
  
        bar.addEventListener('touchstart', startPress);
        bar.addEventListener('touchend', cancelPress);
        bar.addEventListener('touchmove', cancelPress);
  
        bar.addEventListener('mousedown', startPress);
        bar.addEventListener('mouseup', cancelPress);
        bar.addEventListener('mouseleave', cancelPress);
  
        chartContainerElem.appendChild(bar);
      });
    }

    const labelsContainer = document.querySelector('.chart-labels');
    labelsContainer.setAttribute('data-period', period);
    labelsContainer.innerHTML = labels.map(label => `<span>${label || ''}</span>`).join('');

    const nonEmptyDays = data.filter(value => value > 0);
    const average = nonEmptyDays.length ? Math.round(nonEmptyDays.reduce((a, b) => a + b, 0) / nonEmptyDays.length) : 0;
    document.querySelector('.stats-value').textContent = `${average} ккал`;
    document.querySelector('.stats-label:last-child').textContent = formatPeriodDate(period);

    const gridStep = Math.ceil(maxValue / 3 / 100) * 100;
    const gridMax = gridStep * 3; // Максимальное значение шкалы графика
    const gridValues = document.querySelectorAll('.grid-value');
    gridValues[0].textContent = gridMax.toString();
    gridValues[1].textContent = (gridStep * 2).toString();
    gridValues[2].textContent = gridStep.toString();
    gridValues[3].textContent = '0';

    if (averageLine) {
      averageLine.style.bottom = `${(average / gridMax * 100)}%`; // Используем gridMax вместо maxValue
    }
    
    if (averageValue) {
      averageValue.textContent = `${average} ккал`;
    }

    updateTrendVisibility();

    // Обновляем блоки коллекций в зависимости от выбранного периода
    let rawData;
    if (period === 'week') {
      rawData = getWeekData();
    } else if (period === 'month') {
      rawData = getMonthData();
    } else if (period === '6month') {
      // Для 6 месяцев нам нужны не просто числа, а объекты с датами
      rawData = window.allData.slice(-180);
      // Группируем по неделям для блока активности
      const weekData = [];
      for (let i = 0; i < rawData.length; i += 7) {
        const group = rawData.slice(i, i + 7);
        const nonEmpty = group.filter(item => item.calories > 0);
        const avg = nonEmpty.length ? Math.round(nonEmpty.reduce((a, b) => a + b.calories, 0) / nonEmpty.length) : 0;
        // Берем первую дату из группы как ключевую для недели
        if (group.length > 0) {
          weekData.push({ date: group[0].date, calories: avg });
        }
      }
      rawData = weekData;
    } else if (period === 'year') {
      const now = new Date(); // апрель 2025
      // вместо (год-1, тот же месяц), берем (год-1, месяц+1), чтобы сдвинуться
      // 1 мая 2024 => тогда через 12 шагов i=11 получим 1 апреля 2025
      const startDate = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
      // т.е. 1 мая 2024

      const rawYearData = window.allData.filter(item => item.date >= startDate);

      const monthData = [];
      for (let i = 0; i < 12; i++) {
        const currentMonthDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + i,
          1
        );
        const group = rawYearData.filter(item =>
          item.date.getFullYear() === currentMonthDate.getFullYear() &&
          item.date.getMonth() === currentMonthDate.getMonth()
        );

        const nonEmpty = group.filter(item => item.calories > 0);
        const avg = nonEmpty.length
          ? Math.round(nonEmpty.reduce((sum, item) => sum + item.calories, 0) / nonEmpty.length)
          : 0;

        monthData.push({ date: currentMonthDate, calories: avg });
      }

      // Присваиваем результат в rawData, чтобы дальше его рисовать
      rawData = monthData;
    }


    // Проверяем, доступна ли функция updateCollections
    if (typeof window.updateCollections === 'function') {
      window.updateCollections(rawData, TDEE);
    }
  }

  updateChart(currentPeriod);

  // Инициализируем блоки коллекций после того, как все функции доступны
  if (typeof window.updateCollections === 'function') {
    window.updateCollections(getWeekData(), 2200);
  }
});
