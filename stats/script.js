document.addEventListener('DOMContentLoaded', () => {
  // Инициализация Telegram WebApp
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();

  // Инициализация текстов из локализации
  document.getElementById('period-week').textContent = window.localization.periodButtonWeek;
  document.getElementById('period-month').textContent = window.localization.periodButtonMonth;
  document.getElementById('period-6month').textContent = window.localization.periodButtonSixMonth;
  document.getElementById('period-year').textContent = window.localization.periodButtonYear;
  document.getElementById('daily-average-label').textContent = window.localization.dailyAverageLabel;
  document.getElementById('trend-button').textContent = window.localization.trendButton;

  // Читаем параметры URL
  const urlParams = new URLSearchParams(window.location.search);
  const debugMode = urlParams.get('debug') === 'true';
  // Параметр loading используется для показа спиннера, если он не равен "false"
  const showLoadingOverlay = urlParams.get('loading') !== 'false';

  // Задаем значение текущего периода до вызова updateChart
  let currentPeriod = 'week';

  // Если включён режим debug, сразу подставляем мок данные,
  // иначе инициализируем window.allData пустым массивом.
  if (debugMode) {
    window.allData = generateMockData(730);
    window.userTDEE = 2200; // Значение по умолчанию
  } else {
    window.allData = [];
    window.userTDEE = 0; // Начальное значение
  }

  // Если нужно показать индикатор загрузки, создаём затемнённый оверлей
  if (showLoadingOverlay) {
    const overlay = document.createElement("div");
    overlay.id = "loading-overlay";
    overlay.innerHTML = `
      <div id="loading-spinner">
        <div class="spinner"></div>
        <div class="spinner-text">${window.localization.loading}</div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // Функция для скрытия оверлея загрузки
  function hideLoadingOverlay() {
    const overlay = document.getElementById("loading-overlay");
    if (overlay) overlay.remove();
  }

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
  if (tg.colorScheme === 'light' && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    // В светлой теме фон элементов можно сделать отличным от основного фона
    document.documentElement.style.setProperty('--card-bg', theme.secondary_bg_color || '#f0f0f0');
    // Для полоски предыдущего периода выбираем более тёмное значение, чтобы оно было видно на светлом фоне
    document.documentElement.style.setProperty('--prev-bar-color', 'rgba(0, 0, 0, 0.3)');
  } else {
    // Для тёмной темы фон элементов делаем отличным от общего фона
    document.documentElement.style.setProperty('--card-bg', '#2c2c2e');
    document.documentElement.style.setProperty('--bg-color', '#1c1c1e');
    // Для полоски предыдущего периода задаём цвет, который будет хорошо виден на тёмном фоне
    document.documentElement.style.setProperty('--prev-bar-color', 'rgba(255, 255, 255, 0.3)');
  }

  // Для совместимости указываем значение для --dark-bg, но лучше вместо него использовать --card-bg
  document.documentElement.style.setProperty('--dark-bg', document.documentElement.style.getPropertyValue('--card-bg'));

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

      // Создаем контроллер для возможности отмены запроса
      const controller = new AbortController();
      
      try {
        // Получаем таймзону пользователя
        const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        
        const response = await fetch('https://calories-bot.duckdns.org:8443/api/stats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Source-App': 'Calories-Stats'
          },
          mode: 'cors',
          signal: controller.signal,
          body: JSON.stringify({
            initData: initData,
            userId: userId,
            timezone: userTimezone  // Добавляем таймзону в формате "Europe/Moscow", "Europe/London" и т.д.
          })
        });

        if (!response.ok) {
          console.log('Сервер вернул ошибку:', response.status);
          throw new Error(`Сервер вернул статус ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Получены данные от сервера:', responseData);

        // Преобразуем данные из Map<String, Int> в массив объектов {date, calories}
        const caloriesMap = responseData.calories;
        const tdee = responseData.tdee;

        const formattedData = [];
        // Рассчитываем даты за последние 730 дней для полного набора данных
        let startDate = new Date();
        // Устанавливаем время на полночь в локальной таймзоне
        startDate.setHours(0, 0, 0, 0);
        startDate.setDate(startDate.getDate() - 729);

        for (let i = 0; i < 730; i++) {
          const currentDate = new Date(startDate);
          currentDate.setDate(startDate.getDate() + i);

          // Форматируем дату в формат yyyy-MM-dd для поиска в полученных данных
          // Создаем строку даты с поправкой на таймзону, чтобы правильно сопоставить с данными сервера
          const year = currentDate.getFullYear();
          const month = String(currentDate.getMonth() + 1).padStart(2, '0');
          const day = String(currentDate.getDate()).padStart(2, '0');
          const dateKey = `${year}-${month}-${day}`;
          
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
        
        // Скрываем спиннер после успешной загрузки данных
        if (showLoadingOverlay) hideLoadingOverlay();

        return true;
      } catch (fetchError) {
        // Тихо обрабатываем ошибку fetch и используем моковые данные
        console.log('Не удалось получить данные с сервера, используем моковые данные');
        throw new Error('Сервер недоступен');
      }
    } catch (error) {
      // Не выводим весь объект ошибки в консоль, чтобы не пугать пользователя
      console.log('Ошибка загрузки данных с сервера:', error);
      
      // Не подставляем моковые данные в обычном режиме (debug=false)
      // Оставляем массив пустым или тем, что был ранее установлен
      
      updateChart(currentPeriod);
      
      // Вместо скрытия оверлея - показываем сообщение об ошибке
      if (showLoadingOverlay) {
        const overlay = document.getElementById("loading-overlay");
        if (overlay) {
          overlay.innerHTML = `
            <div class="error-container" style="text-align: center; padding: 20px;">
              <div class="error-text" style="color: #ffffff; font-size: 16px; margin-bottom: 16px;">
                ${window.localization.loadingError}
              </div>
              <button class="retry-button" style="padding: 8px 16px; font-size: 16px; border: none; border-radius: 4px; background-color: #FF6422; color: #ffffff; cursor: pointer;">
                ${window.localization.retryButton}
              </button>
            </div>
          `;
          overlay.querySelector('.retry-button').addEventListener('click', () => {
            // Сначала возвращаем оверлею состояние загрузки
            overlay.innerHTML = `
              <div id="loading-spinner">
                <div class="spinner"></div>
                <div class="spinner-text">${window.localization.loading}</div>
              </div>
            `;
            // Повторный запуск запроса
            fetchUserStats();
          });
        }
      }
      
      return false;
    }
  }

  // Вызов запроса к бекенду выполняется только если debugMode === false
  if (!debugMode) {
    fetchUserStats();
  } else {
    try {
      updateChart(currentPeriod);
    } catch (e) {
      console.error('Ошибка при построении графика в debug-режиме:', e);
    }
    if (showLoadingOverlay) {
      // В режиме отладки спиннер крутится 3 секунды
      setTimeout(() => {
        hideLoadingOverlay();
      }, 3000);
    }
  }

  // Функция для получения данных за неделю (последние 7 дней)
  function getWeekData() {
    // Получаем данные за последние 7 дней, но важно учитывать,
    // что мы хотим полные дни в локальной таймзоне пользователя
    return window.allData.slice(-7);
  }

  // Функция для получения данных за месяц (последние 30 дней)
  function getMonthData() {
    return window.allData.slice(-30);
  }

  // Функция для получения данных за 6 месяцев (последние 180 дней),
  // группируя по неделям (7-дневные группы) – возвращает массив чисел
  function getSixMonthData() {
    // Берем последние 180 дней данных (примерно 6 месяцев)
    const rawData = window.allData.slice(-180);
    const weekCount = 26; // ~6 месяцев
    const groupSize = 7;
    
    const aggregated = [];
    
    for (let i = 0; i < weekCount; i++) {
      // Вычисляем индекс начала группы, идя от конца массива к началу
      const startIndex = Math.max(0, rawData.length - (weekCount - i) * groupSize);
      // Получаем группу дней для текущей недели
      const group = rawData.slice(startIndex, startIndex + groupSize);
      
      // Вычисляем среднее для группы с учетом только ненулевых записей
      if (group.length > 0) {
        const nonEmpty = group.filter(item => item.calories > 0).map(item => item.calories);
        const avg = nonEmpty.length ? Math.round(nonEmpty.reduce((a, b) => a + b, 0) / nonEmpty.length) : 0;
        aggregated.push(avg);
      } else {
        aggregated.push(0);
      }
    }
    
    return aggregated;
  }

  // Функция для получения данных за год (последние 365 дней),
  // группируя по месяцам – возвращает массив чисел
  function getYearData() {
    const now = new Date();
    // Устанавливаем время на полночь в локальной таймзоне
    now.setHours(0, 0, 0, 0);
    
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

  // Функция, возвращающая массив дат – начало каждой 7-дневной группы для 6 месяцев
  function getSixMonthIntervals() {
    // Берем последние 180 дней данных (примерно 6 месяцев)
    const rawData = window.allData.slice(-180);
    const weekCount = 26; // ~6 месяцев
    const groupSize = 7;
    
    const intervals = [];
    
    for (let i = 0; i < weekCount; i++) {
      // Вычисляем индекс начала группы, идя от конца массива к началу
      const startIndex = Math.max(0, rawData.length - (weekCount - i) * groupSize);
      // Получаем группу дней для текущей недели
      const group = rawData.slice(startIndex, startIndex + groupSize);
      
      if (group.length > 0) {
        // Берем первую дату из группы как начало недели
        intervals.push(group[0].date);
      } else {
        // Если группа пуста, создаем расчетную дату
        const now = new Date();
        // Устанавливаем время на полночь в локальной таймзоне
        now.setHours(0, 0, 0, 0);
        const calculatedDate = new Date(now);
        calculatedDate.setDate(now.getDate() - (weekCount - i) * groupSize);
        intervals.push(calculatedDate);
      }
    }
    
    return intervals;
  }
  window.getSixMonthIntervals = getSixMonthIntervals;
  
  // Функция для генерации подписей для 6 месяцев
  function getSixMonthLabels() {
    const now = new Date();
    // Устанавливаем время на полночь в локальной таймзоне
    now.setHours(0, 0, 0, 0);
    const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const labels = [];
    
    for (let i = 0; i < 6; i++) {
      const current = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const monthName = current.toLocaleDateString(window.localization.getLocale(), { month: 'short' });
      labels.push(monthName);
    }
    
    return labels;
  }
  window.getSixMonthLabels = getSixMonthLabels;

  function getLabelsForPeriod(period) {
    // Если нет данных, возвращаем пустой массив
    if (!window.allData || window.allData.length === 0) {
      return [];
    }
    
    const now = new Date();
    // Устанавливаем время на полночь в локальной таймзоне
    now.setHours(0, 0, 0, 0);
    
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
        
        // Получаем массив названий месяцев
        const monthLabels = getSixMonthLabels();
        let currentMonthIndex = 0;
        
        for (let i = 0; i < intervals.length; i++) {
          // Если это первая группа или месяц изменился по сравнению с предыдущей группы,
          // подпишем данную группу коротким названием месяца
          if (i === 0 || intervals[i].getMonth() !== intervals[i - 1].getMonth()) {
            const monthName = intervals[i].toLocaleDateString(window.localization.getLocale(), { month: 'short' });
            labels.push(monthName);
          } else {
            labels.push('');
          }
        }
        return labels;
      }
      case 'year': {
        const now = new Date();
        // Создаем дату начала первого полного месяца год назад (как в getYearData)
        const startDate = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
        
        const labels = [];
        for (let i = 0; i < 12; i++) {
          const currentMonth = (startDate.getMonth() + i) % 12;
          const currentYear = startDate.getFullYear() + Math.floor((startDate.getMonth() + i) / 12);
          const d = new Date(currentYear, currentMonth, 1);
          const monthName = d.toLocaleDateString(window.localization.getLocale(), { month: 'narrow' });
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
    let data = [];
    
    // Если данные еще не загружены, используем пустой массив
    if (window.allData && window.allData.length > 0) {
      if (period === 'week') {
        data = getWeekData().map(item => item.calories); // преобразуем объекты в числа
      } else if (period === 'month') {
        data = getMonthData().map(item => item.calories);
      } else if (period === '6month') {
        data = getSixMonthData(); // уже числа
      } else if (period === 'year') {
        data = getYearData();
      }
    }

    const TDEE = window.userTDEE || 0; // используем TDEE из реальных данных или 0
    // Если нет данных или все нули, используем минимальное значение для графика
    const maxValue = data.length > 0 ? Math.max(...data, TDEE, 100) : 100; // минимум 100 для пустого графика
    const labels = getLabelsForPeriod(period, data.length);
    
    // Шкала графика - используем минимум 300 для пустого графика
    const gridMax = data.length > 0 ? Math.ceil(maxValue / 3 / 100) * 100 * 3 : 300;
    
    const chartContainerElem = document.querySelector('.stats-chart');
    if (chartContainerElem) {
      chartContainerElem.innerHTML = '';
  
      // Если данных нет, создаем пустые столбцы
      const dataLength = data.length || 7; // по умолчанию 7 для недели
      
      for (let i = 0; i < dataLength; i++) {
        const value = data[i] || 0;
        const bar = document.createElement('div');
        bar.className = 'chart-bar' + (value === 0 ? ' empty' : '');
        const height = value === 0 ? 4 : (value / gridMax * 100);
        bar.style.height = `${height}%`;
        
        // Добавляем атрибут с информацией о калориях для столбца
        bar.setAttribute('data-calories', value);
        
        // Для разных периодов добавляем дополнительную информацию
        if (period === 'week' || period === 'month') {
          // Для недели и месяца - это калории за день
          bar.setAttribute('data-type', 'day');
          // Добавляем дату для каждого столбца если она есть
          if (window.allData && window.allData.length > 0) {
            const dateObj = period === 'week' ? 
              getWeekData()[i]?.date : 
              getMonthData()[i]?.date;
            if (dateObj) {
              bar.setAttribute('data-date', dateObj.toISOString());
            }
          }
        } else if (period === '6month') {
          // Для 6 месяцев - это средние калории за неделю
          bar.setAttribute('data-type', 'week');
          // Получаем дату начала недели если она есть
          if (window.allData && window.allData.length > 0) {
            const rawData = window.allData.slice(-180);
            const weekIndex = Math.floor(i * 7);
            if (weekIndex < rawData.length) {
              bar.setAttribute('data-date', rawData[weekIndex].date.toISOString());
            }
          }
        } else if (period === 'year') {
          // Для года - это средние калории за месяц
          bar.setAttribute('data-type', 'month');
          // Вычисляем дату начала месяца
          if (window.allData && window.allData.length > 0) {
            const now = new Date();
            // Устанавливаем время на полночь в локальной таймзоне
            now.setHours(0, 0, 0, 0);
            const startDate = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
            const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
            bar.setAttribute('data-date', monthDate.toISOString());
          }
        }
        
        // Остальной код функции startPress и cancelPress
        let pressTimer;
  
        function startPress(e) {
          if (e.type === 'mousedown' && e.button !== 0) return;
          pressTimer = setTimeout(() => {
            // Пустая функция - не вызываем showInfo
          }, 100); 
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
      }
    }

    const labelsContainer = document.querySelector('.chart-labels');
    labelsContainer.setAttribute('data-period', period);
    labelsContainer.innerHTML = labels.map(label => `<span>${label || ''}</span>`).join('');

    // Рассчитываем среднее значение только для ненулевых дней
    const nonEmptyDays = data.filter(value => value > 0);
    const average = nonEmptyDays.length ? Math.round(nonEmptyDays.reduce((a, b) => a + b, 0) / nonEmptyDays.length) : 0;
    document.querySelector('.stats-value').textContent = `${parseInt(average).toLocaleString(window.localization.getLocale())} ${window.localization.kilocalories}`;
    document.querySelector('.stats-label:last-child').textContent = formatPeriodDate(period);

    // Удаляем дублирование вычисления gridMax
    const gridStep = gridMax / 3;
    const gridValues = document.querySelectorAll('.grid-value');
    gridValues[0].textContent = gridMax.toString();
    gridValues[1].textContent = (gridStep * 2).toString();
    gridValues[2].textContent = gridStep.toString();
    gridValues[3].textContent = '0';

    if (averageLine) {
      // Используем процент от gridMax, но не меньше 1%
      const percent = average > 0 ? Math.max((average / gridMax * 100), 1) : 0;
      averageLine.style.bottom = `${percent}%`;
    }
    
    if (averageValue) {
      averageValue.textContent = `${average} ${window.localization.kilocalories}`;
    }

    updateTrendVisibility();

    // Обновляем блоки коллекций в зависимости от выбранного периода
    let rawData = [];
    
    // Если данные загружены, формируем данные для соответствующего периода
    if (window.allData && window.allData.length > 0) {
      if (period === 'week') {
        rawData = getWeekData();
      } else if (period === 'month') {
        rawData = getMonthData();
      } else if (period === '6month') {
        // Для 6 месяцев нам нужны не просто числа, а объекты с датами
        rawData = window.allData.slice(-180);
        
        // Используем ту же логику, что и в getSixMonthData() и getSixMonthIntervals()
        // для обеспечения согласованности данных
        const weekData = [];
        const weekCount = 26;
        const groupSize = 7;
        
        for (let i = 0; i < weekCount; i++) {
          // Вычисляем индекс начала группы, идя от конца массива к началу
          const startIndex = Math.max(0, rawData.length - (weekCount - i) * groupSize);
          // Получаем группу дней для текущей недели
          const group = rawData.slice(startIndex, startIndex + groupSize);
          
          // Проверяем, что группа не пустая перед обработкой
          if (group.length > 0) {
            const nonEmpty = group.filter(item => item.calories > 0);
            const avg = nonEmpty.length ? Math.round(nonEmpty.reduce((a, b) => a + b.calories, 0) / nonEmpty.length) : 0;
            // Берем первую дату из группы как ключевую для недели
            weekData.push({ date: group[0].date, calories: avg });
          } else {
            // Если данных нет, создаем запись с нулевым значением и расчетной датой
            const lastDate = rawData.length > 0 ? rawData[rawData.length - 1].date : new Date();
            const calculatedDate = new Date(lastDate);
            // Устанавливаем время на полночь в локальной таймзоне
            calculatedDate.setHours(0, 0, 0, 0);
            const daysToSubtract = (weekCount - i) * groupSize;
            calculatedDate.setDate(calculatedDate.getDate() - daysToSubtract);
            weekData.push({ date: calculatedDate, calories: 0 });
          }
        }
        
        rawData = weekData;
      } else if (period === 'year') {
        const now = new Date();
        // Устанавливаем время на полночь в локальной таймзоне
        now.setHours(0, 0, 0, 0);
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
    }

    // Проверяем, доступна ли функция updateCollections
    if (typeof window.updateCollections === 'function') {
      window.updateCollections(rawData, TDEE);
    }
  }

  // Не вызываем инициализацию блоков коллекций отдельно,
  // так как она выполняется внутри updateChart
  
  // Вызываем функцию построения графика, которая также обновит блоки коллекций
  updateChart(currentPeriod);
});
