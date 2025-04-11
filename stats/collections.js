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

  function createCollectionWeekChart(calorieArray, average, originalData = null) {
    const maxVal = Math.max(...calorieArray);
    const barsHtml = calorieArray.map(value => {
      const height = value === 0 ? 4 : (value / maxVal * 100);
      return `<div class="mini-chart-bar" style="height: ${height}%"></div>`;
    }).join('');

    let labelsHtml;
    // Для недели отображаем короткие названия дней недели
    labelsHtml = originalData.map(obj => {
      let shortDay = obj.date.toLocaleDateString('ru-RU', { weekday: 'short' });
      shortDay = shortDay.charAt(0).toUpperCase() + shortDay.slice(1);
      return `<span>${shortDay}</span>`;
    }).join('');

    return `
      <div class="mini-chart-container">
        <div class="mini-chart-label">Средн.<br>Килокалории</div>
        <div class="mini-chart-value">${formatNumber(average)}<span>ккал</span></div>
        <div class="mini-chart">
          <div class="mini-chart-trend" style="bottom: ${maxVal ? (average / maxVal * 100) : 0}%"></div>
          <div class="mini-chart-bars">${barsHtml}</div>
          <div class="mini-chart-labels">
            ${labelsHtml}
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
        <div class="mini-chart-label">TDEE Порог</div>
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
          <div class="period-bar current" style="width: ${currentBarWidth}%"><span class="period-bar-label">${currentLabel}</span></div>
          <div class="period-label"></div>
        </div>
        <div class="collection-period">
          <div class="period-value">${formatNumber(previousValue)}<span>ккал в день</span></div>
          <div class="period-bar previous" style="width: ${previousBarWidth}%"><span class="period-bar-label">${previousLabel}</span></div>
          <div class="period-label"></div>
        </div>
      </div>
    `;
  }

  // Функция для построения статического блока (последние 7 дней)
  function buildStaticBlock(data) {
    // Всегда используем данные за последние 7 дней
    const weekData = getWeekData();
    // Преобразуем в массив числовых значений
    const numericValues = weekData.map(item => item.calories);
    const nonEmpty = numericValues.filter(v => v > 0);
    const avg = nonEmpty.length ? Math.round(nonEmpty.reduce((a, b) => a + b, 0) / nonEmpty.length) : 0;

    // Для статического блока всегда используем текст для недельного периода
    const periodText = `В среднем за последние 7 дней (без учёта дней с 0 ккал) Вы потребляли по ${formatNumber(avg)} ккал в день.`;

    return `
      <div class="collection-card">
        <div class="collection-header">
          ${createFireIcon()}
          <span class="collection-title">Средние калории (последние 7 дней)</span>
        </div>
        <div class="collection-text">
          ${periodText}
        </div>
        ${createCollectionWeekChart(numericValues, avg, weekData)}
      </div>
    `;
  }

  // Вспомогательная функция для получения названия периода
  function getPeriodTitle(period) {
    switch (period) {
      case 'week': return 'последние 7 дней';
      case 'month': return 'последний месяц';
      case '6month': return 'последние 6 месяцев';
      case 'year': return 'последний год';
      default: return 'последние 7 дней';
    }
  }

  // Функция для построения блока "Калории активности"
  function buildActiveBlock(data, tdee, unitName) {
    // data – массив объектов; преобразуем в массив чисел
    const numericValues = data.map(item => item.calories);
    const countAbove = numericValues.filter(v => v > tdee).length;

    // Определяем текущий период
    const currentPeriod = document.querySelector('.period-button.active').dataset.period;

    // Выбираем подходящий текст и данные для миниграфика в зависимости от периода
    let chartData = numericValues;
    let average = 0;

    switch (currentPeriod) {
      case 'week':
        // Для недели показываем ежедневные данные (как сейчас)
        average = numericValues.filter(v => v > 0).length ?
          Math.round(numericValues.filter(v => v > 0).reduce((a, b) => a + b, 0) / numericValues.filter(v => v > 0).length) : 0;
        break;

      case 'month':
        // Для месяца показываем ежедневные данные, но расчет среднего без учета дней с 0
        average = numericValues.filter(v => v > 0).length ?
          Math.round(numericValues.filter(v => v > 0).reduce((a, b) => a + b, 0) / numericValues.filter(v => v > 0).length) : 0;
        break;

      case '6month':
        // Для 6 месяцев группируем по неделям
        average = numericValues.filter(v => v > 0).length ?
          Math.round(numericValues.filter(v => v > 0).reduce((a, b) => a + b, 0) / numericValues.filter(v => v > 0).length) : 0;
        // В данном случае numericValues это уже средние значения за недели
        break;

      case 'year':
        // Для года группируем по месяцам
        average = numericValues.filter(v => v > 0).length ?
          Math.round(numericValues.filter(v => v > 0).reduce((a, b) => a + b, 0) / numericValues.filter(v => v > 0).length) : 0;
        // В данном случае numericValues это уже средние значения за месяцы
        break;
    }

    return `
      <div class="collection-card">
        <div class="collection-header">
          ${createFireIcon()}
          <span class="collection-title">Калории активности</span>
        </div>
        <div class="collection-text">
          За выбранный период, из ${numericValues.length} ${unitName}, в <strong>${countAbove}</strong> ${unitName} среднее потребление калорий превышало TDEE (${tdee} ккал).
        </div>
        ${createTdeeMiniChart(numericValues, tdee)}
      </div>
    `;
  }

  // Функция для построения блока сравнения за месяц
  function buildMonthComparisonBlock() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();  // 0 = январь, 11 = декабрь

    // Границы для текущего месяца
    const currentStart = new Date(currentYear, currentMonth, 1);
    const currentEnd = new Date(currentYear, currentMonth + 1, 1);

    // Границы для предыдущего месяца
    let prevYear = currentYear, prevMonth = currentMonth - 1;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear = currentYear - 1;
    }
    const prevStart = new Date(prevYear, prevMonth, 1);
    const prevEnd = new Date(prevYear, prevMonth + 1, 1);

    // Отбираем данные, попадающие в диапазон (>= start и < end)
    const currentMonthData = window.allData.filter(item => item.date >= currentStart && item.date < currentEnd);
    const prevMonthData = window.allData.filter(item => item.date >= prevStart && item.date < prevEnd);

    // Рассчитываем среднее (игнорируя дни с 0 ккал)
    const currentValues = currentMonthData.filter(item => item.calories > 0).map(item => item.calories);
    const prevValues = prevMonthData.filter(item => item.calories > 0).map(item => item.calories);
    const currentAvg = currentValues.length ? Math.round(currentValues.reduce((a, b) => a + b, 0) / currentValues.length) : 0;
    const prevAvg = prevValues.length ? Math.round(prevValues.reduce((a, b) => a + b, 0) / prevValues.length) : 0;

    // Получаем подписи для месяцев, используя полное название месяца
    const currentMonthLabel = currentStart.toLocaleDateString('ru-RU', { month: 'long' });
    const prevMonthLabel = prevStart.toLocaleDateString('ru-RU', { month: 'long' });
    // Приводим первую букву к верхнему регистру
    const formattedCurrentLabel = currentMonthLabel.charAt(0).toUpperCase() + currentMonthLabel.slice(1);
    const formattedPrevLabel = prevMonthLabel.charAt(0).toUpperCase() + prevMonthLabel.slice(1);

    return createComparisonBlock(
      "За текущий календарный месяц среднее потребление калорий по дням ниже, чем в предыдущем месяце.",
      currentAvg,
      prevAvg,
      formattedCurrentLabel,
      formattedPrevLabel,
      "Сравнение калорий за месяц"
    );
  }

  function buildYearComparisonBlock() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const previousYear = currentYear - 1;

    // Фильтруем данные для текущего года
    const currentYearData = window.allData.filter(item => item.date.getFullYear() === currentYear);
    // Фильтруем данные для предыдущего года
    const previousYearData = window.allData.filter(item => item.date.getFullYear() === previousYear);

    // Вычисляем среднее значение за текущий год (игнорируя дни с 0 калориями)
    const currentValues = currentYearData.filter(item => item.calories > 0).map(item => item.calories);
    const currentAvg = currentValues.length ? Math.round(currentValues.reduce((sum, v) => sum + v, 0) / currentValues.length) : 0;

    // Вычисляем среднее значение за предыдущий год
    const previousValues = previousYearData.filter(item => item.calories > 0).map(item => item.calories);
    const previousAvg = previousValues.length ? Math.round(previousValues.reduce((sum, v) => sum + v, 0) / previousValues.length) : 0;

    // Для календарного разделения используем сами года как метки
    const currentYearLabel = String(currentYear);
    const previousYearLabel = String(previousYear);

    return createComparisonBlock(
      "В этом году среднее потребление калорий меньше, чем в прошлом году.",
      currentAvg,
      previousAvg,
      currentYearLabel,
      previousYearLabel,
      "Сравнение калорий за год"
    );
  }

  // Основная функция обновления инфо-блоков, объединяющая результаты всех блоков
  // Теперь эта функция лишь инициализирует все блоки при загрузке и обновляет только блок активности при переключении вкладок
  function updateCollections(data, tdee) {
    // data – массив объектов вида { date, calories }
    // Преобразуем данные в массив числовых значений для блоков, которым нужны только числа
    const numericValues = data.map(item => item.calories);

    // Определяем единицу измерения в зависимости от периода
    const currentPeriod = document.querySelector('.period-button.active')?.dataset.period || 'week';
    let unitName = 'дней';
    if (currentPeriod === '6month') unitName = 'недель';
    if (currentPeriod === 'year') unitName = 'месяцев';

    // Получаем блок "Калории активности", если он уже существует
    const activeBlockElement = document.querySelector('.active-calories-block');

    // Создаем только блок активности
    const activeBlock = buildActiveBlock(data, tdee, unitName);

    if (activeBlockElement) {
      // Если блок активности уже существует, просто заменяем его содержимое
      activeBlockElement.outerHTML = activeBlock;
    } else {
      // При первом вызове создаем все блоки
      const staticBlockHtml = buildStaticBlock(getWeekData());
      const monthComparison = buildMonthComparisonBlock();
      const yearComparison = buildYearComparisonBlock();

      collectionsContainer.innerHTML = staticBlockHtml + activeBlock + monthComparison + yearComparison;

      // Добавляем классы для идентификации блоков
      const blocks = collectionsContainer.querySelectorAll('.collection-card');
      if (blocks.length >= 1) blocks[0].classList.add('static-calories-block');
      if (blocks.length >= 2) blocks[1].classList.add('active-calories-block');
    }
  }

  // Экспортируем функцию updateCollections в глобальную область видимости
  window.updateCollections = updateCollections;

  // Не вызываем здесь инициализацию, а перенесем ее в script.js
  // updateCollections(getWeekData(), 2200);
});
