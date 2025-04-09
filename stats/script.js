document.addEventListener('DOMContentLoaded', () => {
  // Инициализация Telegram WebApp
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();

  // Применяем цветовую схему от Telegram
  document.documentElement.style.setProperty('--text-color', tg.themeParams.text_color || '#ffffff');
  document.documentElement.style.setProperty('--bg-color', tg.themeParams.bg_color || '#18222d');
  document.documentElement.style.setProperty('--text-light', tg.themeParams.hint_color || '#999999');
  document.documentElement.style.setProperty('--accent-color', tg.themeParams.button_color || '#50A8EB');
  document.documentElement.style.setProperty('--dark-bg', tg.themeParams.secondary_bg_color || '#242f3d');
  document.documentElement.style.setProperty('--border-color', tg.themeParams.hint_color || '#999999');

  // Названия месяцев
  const months = ['янв.', 'февр.', 'март', 'апр.', 'май', 'июнь', 'июль', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'];
  const shortMonths = ['Я', 'Ф', 'М', 'А', 'М', 'И', 'И', 'А', 'С', 'О', 'Н', 'Д'];

  // Временные данные для демонстрации
  window.mockData = {
    'week': generateMockData(7, 3000),
    'month': generateMockData(30, 3000),
    '6month': generateMockData(24, 3000),
    'year': generateMockData(12, 3000)
  };

  // Текущий выбранный период
  let currentPeriod = 'week';

  // Обработчики для кнопок периода
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
  const trendLine = document.querySelector('.trend-line');
  const chartContainer = document.querySelector('.stats-chart-container');
  
  // Обработчик для кнопки тренда
  trendButton.addEventListener('click', () => {
    isTrendVisible = !isTrendVisible;
    updateTrendVisibility();
  });

  function updateTrendVisibility() {
    trendLine.style.opacity = isTrendVisible ? '1' : '0';
    chartContainer.classList.toggle('trend-active', isTrendVisible);
    trendButton.classList.toggle('active', isTrendVisible);
  }

  // Функция для генерации тестовых данных
  function generateMockData(count, maxValue) {
    const data = [];
    for (let i = 0; i < count; i++) {
      // 20% шанс на пустой день
      if (Math.random() > 0.8) {
        data.push(0);
      } else {
        // Генерируем значения в диапазоне 800-3000 калорий
        data.push(Math.floor(Math.random() * 2200) + 800);
      }
    }
    return data;
  }

  // Функция форматирования даты периода
  function formatPeriodDate(period) {
    const now = new Date();
    let start, end;
    
    switch(period) {
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

  // Функция получения подписей для периода
  function getLabelsForPeriod(period) {
    const now = new Date();
    
    switch(period) {
      case 'week':
        return Array.from({length: 7}, (_, i) => {
          const date = new Date(now);
          date.setDate(now.getDate() - (6 - i));
          return date.getDate().toString();
        });
      
      case 'month': {
        const labels = new Array(30).fill('');
        const start = new Date(now);
        start.setDate(now.getDate() - 29);
        
        // Показываем метки через равные интервалы
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
        const labels = new Array(24).fill('');
        const monthLabels = ['нояб.', 'дек.', 'янв.', 'февр.', 'март', 'апр.'];
        
        // Распределяем метки под группами из 4-х столбцов
        monthLabels.forEach((month, i) => {
          const position = i * 4;
          labels[position] = month;
        });
        return labels;
      }
      
      case 'year':
        return shortMonths;
    }
  }

  // Функция обновления графика
  function updateChart(period) {
    const data = window.mockData[period];
    const chartContainer = document.querySelector('.stats-chart');
    const maxValue = Math.max(...data);
    const labels = getLabelsForPeriod(period);
    
    // Очищаем контейнер
    chartContainer.innerHTML = '';
    
    // Добавляем столбцы
    data.forEach((value, index) => {
      const bar = document.createElement('div');
      bar.className = 'chart-bar' + (value === 0 ? ' empty' : '');
      const height = value === 0 ? 4 : (value / maxValue * 100);
      bar.style.height = `${height}%`;
      
      if (period === '6month' && index % 4 === 0 && index > 0) {
        bar.style.marginLeft = '8px';
      }
      
      chartContainer.appendChild(bar);
    });

    // Обновляем подписи
    const labelsContainer = document.querySelector('.chart-labels');
    labelsContainer.setAttribute('data-period', period);
    labelsContainer.innerHTML = labels.map(label => `<span>${label || ''}</span>`).join('');

    // Обновляем средние значения и период, исключая пустые дни
    const nonEmptyDays = data.filter(value => value > 0);
    const average = nonEmptyDays.length > 0 
      ? Math.round(nonEmptyDays.reduce((a, b) => a + b, 0) / nonEmptyDays.length)
      : 0;
    
    document.querySelector('.stats-value').textContent = `${average} ккал`;
    document.querySelector('.stats-label:last-child').textContent = formatPeriodDate(period);

    // Обновляем значения сетки с учетом реальных значений калорий
    const gridStep = Math.ceil(maxValue / 3 / 100) * 100; // Округляем до сотен
    const gridValues = document.querySelectorAll('.grid-value');
    gridValues[0].textContent = (gridStep * 3).toString();
    gridValues[1].textContent = (gridStep * 2).toString();
    gridValues[2].textContent = gridStep.toString();
    gridValues[3].textContent = '0';

    // Обновляем линию тренда
    const trendValue = document.querySelector('.trend-value');
    trendValue.textContent = `${average} ккал`;
    trendLine.style.bottom = `${(average / maxValue * 100)}%`;
    
    // Обновляем видимость тренда с текущим состоянием
    updateTrendVisibility();
  }

  // Инициализация графика
  updateChart(currentPeriod);
}); 