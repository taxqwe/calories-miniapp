document.addEventListener('DOMContentLoaded', () => {
  const collectionsContainer = document.querySelector('.stats-collections');

  function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  function createFireIcon() {
    return `<svg class="collection-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.5,0.67s0.74,2.65,0.74,4.8c0,2.06-1.35,3.73-3.41,3.73c-2.07,0-3.63-1.67-3.63-3.73l0.03-0.36 C5.21,7.51,4,10.62,4,14c0,4.42,3.58,8,8,8s8-3.58,8-8C20,8.61,17.41,3.8,13.5,0.67z M12,20c-3.31,0-6-2.69-6-6 c0-1.53,0.3-3.04,0.86-4.43c1.01,1.01,2.41,1.63,3.97,1.63c2.66,0,4.75-1.83,5.28-4.43C17.34,8.97,18,11.44,18,14 C18,17.31,15.31,20,12,20z" fill="currentColor"/>
    </svg>`;
  }

  function createMiniChart(data, average) {
    const bars = data.map(value => {
      const height = value === 0 ? 4 : (value / Math.max(...data) * 100);
      return `<div class="mini-chart-bar" style="height: ${height}%"></div>`;
    }).join('');

    const currentPeriod = document.querySelector('.period-button.active').dataset.period;
    let labels;

    // Определяем метки для разных периодов (так же как в createTdeeMiniChart)
    switch (currentPeriod) {
      case 'week':
        labels = '<span>Ч</span><span>П</span><span>С</span><span>В</span><span>П</span><span>В</span><span>С</span>';
        break;
      case 'month':
        labels = '<span>1</span><span>8</span><span>15</span><span>22</span><span>29</span><span></span><span></span>';
        break;
      case '6month':
        labels = '<span>Н</span><span>Д</span><span>Я</span><span>Ф</span><span>М</span><span>А</span><span></span>';
        break;
      case 'year':
        labels = '<span>Я</span><span>Ф</span><span>М</span><span>А</span><span>М</span><span>И</span><span>И</span>';
        break;
      default:
        labels = '<span>Ч</span><span>П</span><span>С</span><span>В</span><span>П</span><span>В</span><span>С</span>';
    }

    return `
      <div class="mini-chart-container">
        <div class="mini-chart-label">Средн.<br>Килокалории</div>
        <div class="mini-chart-value">${formatNumber(average)}<span>ккал</span></div>
        <div class="mini-chart">
          <div class="mini-chart-trend" style="bottom: ${(average / Math.max(...data) * 100)}%"></div>
          <div class="mini-chart-bars">${bars}</div>
          <div class="mini-chart-labels">
            ${labels}
          </div>
        </div>
      </div>
    `;
  }

  function createTdeeMiniChart(data, tdee) {
    const maxValue = Math.max(...data, tdee);
    const bars = data.map(value => {
      const height = value === 0 ? 4 : (value / maxValue * 100);
      const excessClass = value > tdee ? ' excess' : '';
      return `<div class="mini-chart-bar${excessClass}" style="height: ${height}%"></div>`;
    }).join('');

    const currentPeriod = document.querySelector('.period-button.active').dataset.period;
    let labels;

    // Определяем метки для разных периодов
    switch (currentPeriod) {
      case 'week':
        labels = '<span>Ч</span><span>П</span><span>С</span><span>В</span><span>П</span><span>В</span><span>С</span>';
        break;
      case 'month':
        labels = '<span>1</span><span>8</span><span>15</span><span>22</span><span>29</span><span></span><span></span>';
        break;
      case '6month':
        labels = '<span>Н</span><span>Д</span><span>Я</span><span>Ф</span><span>М</span><span>А</span><span></span>';
        break;
      case 'year':
        labels = '<span>Я</span><span>Ф</span><span>М</span><span>А</span><span>М</span><span>И</span><span>И</span>';
        break;
      default:
        labels = '<span>Ч</span><span>П</span><span>С</span><span>В</span><span>П</span><span>В</span><span>С</span>';
    }

    return `
      <div class="mini-chart-container">
        <div class="mini-chart-label">TDEE<br>Порог</div>
        <div class="mini-chart-value">${formatNumber(tdee)}<span>ккал</span></div>
        <div class="mini-chart">
          <div class="mini-chart-trend" style="bottom: ${(tdee / maxValue * 100)}%"></div>
          <div class="mini-chart-bars">${bars}</div>
          <div class="mini-chart-labels">
            ${labels}
          </div>
        </div>
      </div>
    `;
  }

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

  // Функция для построения статического блока (последние 7 дней)
  function buildStaticBlock(calorieValues) {
    const nonEmpty = calorieValues.filter(v => v > 0);
    const avg = nonEmpty.length ? Math.round(nonEmpty.reduce((a, b) => a + b, 0) / nonEmpty.length) : 0;
    return `
    <div class="collection-card">
      <div class="collection-header">
        ${createFireIcon()}
        <span class="collection-title">Средние калории (последние 7 дней)</span>
      </div>
      <div class="collection-text">
        В среднем за последние 7 дней (без учёта дней с 0 ккал) Вы потребляли по ${formatNumber(avg)} ккал в день.
      </div>
      ${createMiniChart(calorieValues, avg)}
    </div>
  `;
  }

  // Функция для построения блока "Калории активности"
  function buildActiveBlock(calorieValues, tdee, unitName) {
    const countAbove = calorieValues.filter(v => v > tdee).length;
    return `
    <div class="collection-card">
      <div class="collection-header">
        ${createFireIcon()}
        <span class="collection-title">Калории активности</span>
      </div>
      <div class="collection-text">
        За выбранный период, из ${calorieValues.length} ${unitName}, в <strong>${countAbove}</strong> ${unitName} среднее потребление калорий превышало TDEE (${tdee} ккал).
      </div>
      ${createTdeeMiniChart(calorieValues, tdee)}
    </div>
  `;
  }

  // Функция для построения блока сравнения за месяц
  function buildMonthComparisonBlock() {
    return createComparisonBlock(
      "В этом месяце среднее потребление калорий снизилось по сравнению с прошлым месяцем.",
      313,
      344,
      "Апрель",
      "Март",
      "Сравнение калорий за месяц"
    );
  }

  // Функция для построения блока сравнения за год
  function buildYearComparisonBlock() {
    return createComparisonBlock(
      "В этом году среднее потребление калорий меньше, чем в прошлом году.",
      313,
      362,
      "2025",
      "2024",
      "Сравнение калорий за год"
    );
  }

  // Основная функция обновления инфо-блоков, объединяющая результаты всех блоков
  function updateCollections(data, tdee) {
    // data – массив объектов вида { date, calories }
    // Преобразуем в массив числовых значений
    const calorieValues = (data[0] && data[0].calories !== undefined) ? data.map(item => item.calories) : data;


    // Определяем единицу измерения в зависимости от периода
    const currentPeriod = document.querySelector('.period-button.active')?.dataset.period || 'week';
    let unitName = 'дней';
    if (currentPeriod === '6month') unitName = 'недель';
    if (currentPeriod === 'year') unitName = 'месяцев';

    const staticBlock = buildStaticBlock(calorieValues);
    const activeBlock = buildActiveBlock(calorieValues, tdee, unitName);
    const monthComparison = buildMonthComparisonBlock();
    const yearComparison = buildYearComparisonBlock();

    collectionsContainer.innerHTML = staticBlock + activeBlock + monthComparison + yearComparison;
  }


  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.target.classList.contains('stats-chart')) {
        const currentPeriod = document.querySelector('.period-button.active').dataset.period;
        const periodData = window.mockData[currentPeriod];
        updateCollections(periodData.data, periodData.tdee);
      }
    });
  });

  observer.observe(document.querySelector('.stats-chart'), { childList: true });
  updateCollections(getWeekData(), 2200);

});
