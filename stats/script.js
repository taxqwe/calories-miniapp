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

  // Моковые данные с параметрами bmr и tdee
  function generateMockData(count, maxValue) {
    const data = [];
    for (let i = 0; i < count; i++) {
      if (Math.random() > 0.8) {
        data.push(0);
      } else {
        data.push(Math.floor(Math.random() * 2200) + 800);
      }
    }
    return data;
  }
  window.mockData = {
    'week': {
      data: generateMockData(7, 3000),
      bmr: 1500,
      tdee: 2200
    },
    'month': {
      data: generateMockData(30, 3000),
      bmr: 1500,
      tdee: 2200
    },
    '6month': {
      data: generateMockData(24, 3000),
      bmr: 1500,
      tdee: 2200
    },
    'year': {
      data: generateMockData(12, 3000),
      bmr: 1500,
      tdee: 2200
    }
  };

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

  // Средняя линия (average) – оранжевая, подпись по правому краю
  const averageLine = document.createElement('div');
  averageLine.className = 'trend-line average-line';
  const averageValue = document.createElement('span');
  averageValue.className = 'trend-value average-value';
  averageLine.appendChild(averageValue);
  trendContainer.appendChild(averageLine);

  // BMR линия – зелёная, подпись по левому краю
  const bmrLine = document.createElement('div');
  bmrLine.className = 'trend-line bmr-line';
  const bmrValue = document.createElement('span');
  bmrValue.className = 'trend-value bmr-value';
  bmrLine.appendChild(bmrValue);
  trendContainer.appendChild(bmrLine);

  // TDEE линия – синяя, подпись по левому краю
  const tdeeLine = document.createElement('div');
  tdeeLine.className = 'trend-line tdee-line';
  const tdeeValue = document.createElement('span');
  tdeeValue.className = 'trend-value tdee-value';
  tdeeLine.appendChild(tdeeValue);
  trendContainer.appendChild(tdeeLine);

  trendButton.addEventListener('click', () => {
    isTrendVisible = !isTrendVisible;
    updateTrendVisibility();
  });

  function updateTrendVisibility() {
    [averageLine, bmrLine, tdeeLine].forEach(line => {
      line.style.opacity = isTrendVisible ? '1' : '0';
    });
    statsChartContainer.classList.toggle('trend-active', isTrendVisible);
    trendButton.classList.toggle('active', isTrendVisible);
  }

  function formatPeriodDate(period) {
    const now = new Date();
    let start;
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

  function updateChart(period) {
    const periodData = window.mockData[period];
    const data = periodData.data;
    const maxValue = Math.max(...data, periodData.bmr, periodData.tdee);
    const labels = getLabelsForPeriod(period);
    const chartContainerElem = document.querySelector('.stats-chart');
    chartContainerElem.innerHTML = '';
    
    data.forEach((value, index) => {
      const bar = document.createElement('div');
      bar.className = 'chart-bar' + (value === 0 ? ' empty' : '');
      const height = value === 0 ? 4 : (value / maxValue * 100);
      bar.style.height = `${height}%`;
      if (period === '6month' && index % 4 === 0 && index > 0) {
        bar.style.marginLeft = '8px';
      }
      chartContainerElem.appendChild(bar);
    });
    
    const labelsContainer = document.querySelector('.chart-labels');
    labelsContainer.setAttribute('data-period', period);
    labelsContainer.innerHTML = labels.map(label => `<span>${label || ''}</span>`).join('');
    
    const nonEmptyDays = data.filter(value => value > 0);
    const average = nonEmptyDays.length > 0 ? Math.round(nonEmptyDays.reduce((a, b) => a + b, 0) / nonEmptyDays.length) : 0;
    document.querySelector('.stats-value').textContent = `${average} ккал`;
    document.querySelector('.stats-label:last-child').textContent = formatPeriodDate(period);
    
    const gridStep = Math.ceil(maxValue / 3 / 100) * 100;
    const gridValues = document.querySelectorAll('.grid-value');
    gridValues[0].textContent = (gridStep * 3).toString();
    gridValues[1].textContent = (gridStep * 2).toString();
    gridValues[2].textContent = gridStep.toString();
    gridValues[3].textContent = '0';
    
    // Обновляем линии тренда:
    // Средняя линия
    averageLine.style.bottom = `${(average / maxValue * 100)}%`;
    averageValue.textContent = `${average} ккал`;
    
    // BMR линия
    bmrLine.style.bottom = `${(periodData.bmr / maxValue * 100)}%`;
    bmrValue.textContent = `BMR: ${periodData.bmr} ккал`;
    
    // TDEE линия
    tdeeLine.style.bottom = `${(periodData.tdee / maxValue * 100)}%`;
    tdeeValue.textContent = `TDEE: ${periodData.tdee} ккал`;
    
    updateTrendVisibility();
  }

  updateChart(currentPeriod);
});
