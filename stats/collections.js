document.addEventListener('DOMContentLoaded', () => {
  const collectionsContainer = document.querySelector('.stats-collections');

  // Функция для форматирования числа с разделителями тысяч
  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  // Функция для создания иконки огня
  function createFireIcon() {
    return `<svg class="collection-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5,0.67s0.74,2.65,0.74,4.8c0,2.06-1.35,3.73-3.41,3.73c-2.07,0-3.63-1.67-3.63-3.73l0.03-0.36 C5.21,7.51,4,10.62,4,14c0,4.42,3.58,8,8,8s8-3.58,8-8C20,8.61,17.41,3.8,13.5,0.67z M12,20c-3.31,0-6-2.69-6-6 c0-1.53,0.3-3.04,0.86-4.43c1.01,1.01,2.41,1.63,3.97,1.63c2.66,0,4.75-1.83,5.28-4.43C17.34,8.97,18,11.44,18,14 C18,17.31,15.31,20,12,20z" fill="currentColor"/>
    </svg>`;
  }

  // Функция для создания мини-графика
  function createMiniChart(data, average) {
    const bars = data.map(value => {
      const height = value === 0 ? 4 : (value / Math.max(...data) * 100);
      return `<div class="mini-chart-bar" style="height: ${height}%"></div>`;
    }).join('');

    return `
      <div class="mini-chart-container">
        <div class="mini-chart-label">Средн.<br>Килокалории</div>
        <div class="mini-chart-value">${formatNumber(average)}<span>ккал</span></div>
        <div class="mini-chart">
          <div class="mini-chart-trend" style="bottom: ${(average / Math.max(...data) * 100)}%"></div>
          <div class="mini-chart-bars">${bars}</div>
          <div class="mini-chart-labels">
            <span>Ч</span><span>П</span><span>С</span><span>В</span><span>П</span><span>В</span><span>С</span>
          </div>
        </div>
      </div>
    `;
  }

  // Функция для создания блока сравнения периодов
  function createComparisonBlock(text, currentValue, previousValue, currentLabel, previousLabel, title) {
    const maxValue = Math.max(currentValue, previousValue);
    const currentBarWidth = (currentValue / maxValue * 100).toFixed(1);
    const previousBarWidth = (previousValue / maxValue * 100).toFixed(1);

    return `
      <div class="collection-card">
        <div class="collection-header">
          ${createFireIcon()}
          <span class="collection-title">${title}</span>
        </div>
        <div class="collection-text">${text}</div>
        <div class="collection-period">
          <div class="period-value">${formatNumber(currentValue)}<span>ккал в день</span></div>
          <div class="period-bar current" style="width: ${currentBarWidth}%"></div>
          <div class="period-label">${currentLabel}</div>
        </div>
        <div class="collection-period">
          <div class="period-value">${formatNumber(previousValue)}<span>ккал в день</span></div>
          <div class="period-bar previous" style="width: ${previousBarWidth}%"></div>
          <div class="period-label">${previousLabel}</div>
        </div>
      </div>
    `;
  }

  // Функция для анализа данных и создания подборок
  function updateCollections(data) {
    collectionsContainer.innerHTML = '';

    const nonEmptyDays = data.filter(value => value > 0);
    const average = Math.round(nonEmptyDays.reduce((a, b) => a + b, 0) / nonEmptyDays.length);

    const html = `
      <div class="collection-card">
        <div class="collection-header">
          ${createFireIcon()}
          <span class="collection-title">Средние калории за неделю</span>
        </div>
        <div class="collection-text">В среднем за последние 7 дней Вы потребляли по ${formatNumber(average)} ккал в день.</div>
        ${createMiniChart(data, average)}
      </div>

      ${createComparisonBlock(
        "В этом месяце среднее потребление калорий снизилось по сравнению с прошлым месяцем.",
        313,
        344,
        "Апрель",
        "Март",
        "Сравнение калорий за месяц"
      )}

      ${createComparisonBlock(
        "В этом году среднее потребление калорий меньше, чем в прошлом году.",
        313,
        362,
        "2025",
        "2024",
        "Сравнение калорий за год"
      )}
    `;

    collectionsContainer.innerHTML = html;
  }

  // Подписываемся на изменения данных
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.target.classList.contains('stats-chart')) {
        // Получаем текущий период из активной кнопки
        const currentPeriod = document.querySelector('.period-button.active').dataset.period;
        // Используем тот же датасет из основного скрипта
        updateCollections(window.mockData[currentPeriod]);
      }
    });
  });

  // Начинаем наблюдение за изменениями в контейнере графика
  observer.observe(document.querySelector('.stats-chart'), {
    childList: true
  });

  // Инициализируем подборки при загрузке
  updateCollections(window.mockData['week']);
}); 