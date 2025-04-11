document.addEventListener('DOMContentLoaded', () => {
  // Инициализация Telegram WebApp
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();

  // Применяем цветовую схему от Telegram
  // Замените на свои цвета, пример:
  document.documentElement.style.setProperty('--text-color', '#ffffff');
  document.documentElement.style.setProperty('--bg-color', '#1c1c1e');
  document.documentElement.style.setProperty('--text-light', '#999999');
  document.documentElement.style.setProperty('--accent-color', '#2196F3'); // "наш" синий
  document.documentElement.style.setProperty('--dark-bg', '#2c2c2e');
  document.documentElement.style.setProperty('--border-color', '#5e5e5e');
  document.documentElement.style.setProperty('--our-blue', '#2196F3'); // "наш" синий
  document.documentElement.style.setProperty('--chart-secondary', '#48484a');


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
        start = new Date(now);
        start.setFullYear(now.getFullYear() - 1);
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
        const labels = new Array(30).fill('');
        const start = new Date(now);
        start.setDate(now.getDate() - 29);
        const dates = [11, 18, 25, 1, 8];
        dates.forEach(date => {
          const index = labels.findIndex((_, i) => {
            const currentDate = new Date(start);
            currentDate.setDate(start.getDate() + i);
            return currentDate.getDate() === date;
          });
          if (index !== -1) {
            labels[index] = date.toString();
          }
        });
        return labels;
      }
      case '6month': {
        const intervals = getSixMonthIntervals(); // массив дат начала каждой недели
        const labels = [];
        for (let i = 0; i < intervals.length; i++) {
          // Если это первая группа или месяц изменился по сравнению с предыдущей группой,
          // то подпишем данную группу коротким названием месяца.
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

        // Берём ПОСЛЕДНЮЮ дату (конец периода)
        const endDate = rawData[rawData.length - 1].date;
        
        let labels = [];
        for (let i = 11; i >= 0; i--) {
          const d = new Date(endDate.getFullYear(), endDate.getMonth() - i, 1);
          // Используем, например, короткое название "апр."
          const monthName = d.toLocaleDateString('ru-RU', { month: 'narrow' });
          labels.push(monthName);
        }

        // Получили массив в обратном порядке (от самого старого к самому новому).
        // Если хотим, чтобы метки шли слева-направо по времени, разворачиваем массив:
        
        return labels;
      }
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
    chartContainerElem.innerHTML = '';

    data.forEach(value => {
      const bar = document.createElement('div');
      bar.className = 'chart-bar' + (value === 0 ? ' empty' : '');
      const height = value === 0 ? 4 : (value / maxValue * 100);
      bar.style.height = `${height}%`;
      // Больше не добавляем marginLeft – столбцы идут непрерывно
      chartContainerElem.appendChild(bar);
    });

    const labelsContainer = document.querySelector('.chart-labels');
    labelsContainer.setAttribute('data-period', period);
    labelsContainer.innerHTML = labels.map(label => `<span>${label || ''}</span>`).join('');

    const nonEmptyDays = data.filter(value => value > 0);
    const average = nonEmptyDays.length ? Math.round(nonEmptyDays.reduce((a, b) => a + b, 0) / nonEmptyDays.length) : 0;
    document.querySelector('.stats-value').textContent = `${average} ккал`;
    document.querySelector('.stats-label:last-child').textContent = formatPeriodDate(period);

    const gridStep = Math.ceil(maxValue / 3 / 100) * 100;
    const gridValues = document.querySelectorAll('.grid-value');
    gridValues[0].textContent = (gridStep * 3).toString();
    gridValues[1].textContent = (gridStep * 2).toString();
    gridValues[2].textContent = gridStep.toString();
    gridValues[3].textContent = '0';

    averageLine.style.bottom = `${(average / maxValue * 100)}%`;
    averageValue.textContent = `${average} ккал`;

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
