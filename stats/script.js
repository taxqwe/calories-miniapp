document.addEventListener('DOMContentLoaded', () => {
  // Инициализация Telegram WebApp
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();

  // Применяем цветовую схему от Telegram
  document.documentElement.style.setProperty('--text-color', tg.themeParams.text_color || '#000000');
  document.documentElement.style.setProperty('--bg-color', tg.themeParams.bg_color || '#ffffff');
  document.documentElement.style.setProperty('--text-light', tg.themeParams.hint_color || '#999999');
  document.documentElement.style.setProperty('--accent-color', tg.themeParams.button_color || '#50A8EB');
  document.documentElement.style.setProperty('--light-bg', tg.themeParams.secondary_bg_color || '#f0f0f0');
  document.documentElement.style.setProperty('--border-color', tg.themeParams.hint_color || '#999999');

  // Временные данные для демонстрации
  const mockData = {
    'day': generateMockData(24, 100),
    'week': generateMockData(7, 500),
    'month': generateMockData(30, 1000),
    '6month': generateMockData(180, 1000),
    'year': generateMockData(365, 1000)
  };

  // Текущий выбранный период
  let currentPeriod = 'week';

  // Обработчики для кнопок периода
  const periodButtons = document.querySelectorAll('.period-button');
  periodButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Убираем активный класс у всех кнопок
      periodButtons.forEach(btn => btn.classList.remove('active'));
      // Добавляем активный класс текущей кнопке
      button.classList.add('active');
      // Обновляем период и перерисовываем график
      currentPeriod = button.dataset.period;
      updateChart(currentPeriod);
    });
  });

  // Функция для генерации тестовых данных
  function generateMockData(count, maxValue) {
    const data = [];
    for (let i = 0; i < count; i++) {
      // Генерируем случайное значение от 0 до maxValue
      // С 20% вероятностью генерируем 0 для создания пропусков в данных
      data.push(Math.random() > 0.2 ? Math.floor(Math.random() * maxValue) : 0);
    }
    return data;
  }

  // Функция обновления графика
  function updateChart(period) {
    const data = mockData[period];
    const chartContainer = document.querySelector('.stats-chart');
    const maxValue = Math.max(...data);
    
    // Очищаем контейнер
    chartContainer.innerHTML = '';
    
    // Добавляем столбцы
    data.forEach(value => {
      const bar = document.createElement('div');
      bar.className = 'chart-bar' + (value === 0 ? ' empty' : '');
      // Высота столбца пропорциональна значению
      const height = value === 0 ? 4 : (value / maxValue * 100);
      bar.style.height = `${height}%`;
      chartContainer.appendChild(bar);
    });

    // Обновляем средние значения
    const average = Math.round(data.reduce((a, b) => a + b, 0) / data.length);
    document.querySelector('.stats-value').textContent = `${average} ккал`;
  }

  // Инициализация графика
  updateChart(currentPeriod);
}); 