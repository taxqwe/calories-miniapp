document.addEventListener('DOMContentLoaded', () => {
  const collectionsContainer = document.querySelector('.stats-collections');

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
      let shortDay = obj.date.toLocaleDateString(window.localization.getLocale(), { weekday: 'short' });
      shortDay = shortDay.charAt(0).toUpperCase() + shortDay.slice(1);
      return `<span>${shortDay}</span>`;
    }).join('');

    return `
      <div class="mini-chart-container">
        <div class="mini-chart-label">${window.localization.averageLabel}</div>
        <div class="mini-chart-value">${formatNumber(average)}<span>${window.localization.kilocalories}</span></div>
        <div class="mini-chart">
          <div class="mini-chart-trend" style="bottom: ${maxVal === 0 ? 20 : (20 + (average / maxVal * 80))}%"></div>
          <div class="mini-chart-bars">${barsHtml}</div>
          <div class="mini-chart-labels">
            ${labelsHtml}
          </div>
        </div>
      </div>
    `;
  }

  function createTdeeMiniChart(data, tdee) {
    // data – массив чисел
    const hasValidTdee = tdee && tdee > 0;
    const maxValue = hasValidTdee ? Math.max(...data, tdee) : Math.max(...data);
    const safeMaxValue = maxValue === 0 ? 1 : maxValue; // Предотвращаем деление на ноль

    const bars = data.map(value => {
      const height = value === 0 ? 4 : (value / safeMaxValue * 100);
      // Добавляем класс excess только если TDEE валидный и значение его превышает
      const excessClass = hasValidTdee && value > tdee ? ' excess' : '';
      return `<div class="mini-chart-bar${excessClass}" style="height: ${height}%"></div>`;
    }).join('');

    const currentPeriod = document.querySelector('.period-button.active').dataset.period;
    let labels = '';

    switch (currentPeriod) {
      case 'week':
        {
          // Для недели получаем оригинальные данные с датами
          const weekData = window.getWeekData(); // вернёт массив объектов { date, calories }
          labels = weekData.map(item => {
            const date = new Date(item.date);
            let shortDay = date.toLocaleDateString(window.localization.getLocale(), { weekday: 'short' });
            // Делаем первую букву заглавной
            shortDay = shortDay.charAt(0).toUpperCase() + shortDay.slice(1);
            return `<span>${shortDay}</span>`;
          }).join('');
        }
        break;
      case 'month':
      {
        // Получаем оригинальные данные за месяц (30 дней)
        const monthData = window.getMonthData(); // массив объектов { date, calories }
        // Создаем массив длины 30 с пустыми span-элементами
        const labelsArray = monthData.map(() => '<span></span>');
        // Для каждого дня проверяем, является ли он понедельником (getDay() === 1)
        monthData.forEach((item, index) => {
          const date = new Date(item.date);
          if (date.getDay() === 1) { // понедельник
            const day = date.getDate();
            labelsArray[index] = `<span>${day}</span>`;
          }
        });
        // Объединяем массив в одну строку
        labels = labelsArray.join('');
      }
      break;
      case '6month':
        {
          const intervals = window.getSixMonthIntervals(); // массив дат начала каждой недели
          let lastMonth = null;
          labels = intervals.map(date => {
            const month = date.getMonth();
            const monthName = date.toLocaleDateString(window.localization.getLocale(), { month: 'short' });
            if (lastMonth === null || month !== lastMonth) {
              lastMonth = month;
              return `<span>${monthName}</span>`;
            } else {
              return `<span></span>`;
            }
          }).join('');
        }
        break;
      case 'year':
        {
          const now = new Date();
          let labelsArray = [];
          for (let i = 11; i >= 0; i--) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = monthDate.toLocaleDateString(window.localization.getLocale(), { month: 'short' });
            labelsArray.push(monthName);
          }
          labels = labelsArray.map((label, idx) => {
            if ((labelsArray.length - 1 - idx) % 2 === 0) {
              return `<span>${label}</span>`;
            } else {
              return `<span></span>`;
            }
          }).join('');
        }
        break;
      default:
        // Default case shouldn't normally happen with period buttons, but provide a fallback
        labels = data.map(() => `<span></span>`).join('');
    }

    // Отображаем TDEE линию и значения только если TDEE валидный
    const tdeeLabelHtml = hasValidTdee ? `
      <div class="mini-chart-label">${window.localization.tdeeThreshold}</div>
      <div class="mini-chart-value">${formatNumber(tdee)}<span>${window.localization.kilocalories}</span></div>
    ` : `
      <div class="mini-chart-label"></div>
      <div class="mini-chart-value"></div>
    `; // Пустые дивы для сохранения структуры
    const tdeeTrendHtml = hasValidTdee ? `
      <div class="mini-chart-trend" style="bottom: ${safeMaxValue === 0 ? 4 : (4 + (tdee / safeMaxValue * 96))}%"></div>
    ` : '';

    return `
      <div class="mini-chart-container">
        ${tdeeLabelHtml}
        <div class="mini-chart">
          ${tdeeTrendHtml}
          <div class="mini-chart-bars">${bars}</div>
          <div class="mini-chart-labels" style="grid-template-columns: repeat(${data.length}, 1fr);">
            ${labels}
          </div>
        </div>
      </div>
    `;
  }

  function createComparisonBlock(text, currentValue, previousValue, currentLabel, previousLabel, title) {
    const hasPrevData = previousValue !== null && previousValue !== 0;
    const hasCurrentData = currentValue !== null && currentValue !== 0;

    // При отсутствии данных берем 1, чтобы получить вычислимую ширину
    const safeCurrentValue = hasCurrentData ? currentValue : 1;
    const safePreviousValue = hasPrevData ? previousValue : 1;

    const maxValue = Math.max(safeCurrentValue, safePreviousValue);

    // Вычисляем процент без учета минимума
    const currentBarRaw = safeCurrentValue / maxValue * 100;
    const previousBarRaw = safePreviousValue / maxValue * 100;

    // Минимальный процент (значение можно подогнать под дизайн)
    const MIN_BAR_PERCENT = 20;

    // Если данные есть – используем вычисленный процент, но не меньше MIN_BAR_PERCENT,
    // если данных нет, то просто возьмем MIN_BAR_PERCENT для отображения полоски
    const displayedCurrentBarWidth = hasCurrentData
      ? (currentBarRaw < MIN_BAR_PERCENT ? MIN_BAR_PERCENT : currentBarRaw).toFixed(1)
      : MIN_BAR_PERCENT;
    const displayedPreviousBarWidth = hasPrevData
      ? (previousBarRaw < MIN_BAR_PERCENT ? MIN_BAR_PERCENT : previousBarRaw).toFixed(1)
      : MIN_BAR_PERCENT;

    return `
      <div class="collection-card">
        <div class="collection-header">
          ${createFireIcon()}
          <span class="collection-title">${title}</span>
        </div>
        <div class="collection-text">${text}</div>

        <div class="collection-period">
          <div class="period-value">
            ${hasCurrentData ? formatNumber(currentValue) : window.localization.noData}
            <span>${hasCurrentData ? window.localization.dailyKcalLabel : ''}</span>
          </div>
          <div class="period-bar current" style="width: ${displayedCurrentBarWidth}%">
            <span class="period-bar-label">${currentLabel}</span>
          </div>
        </div>

        <div class="collection-period">
          <div class="period-value">
            ${hasPrevData ? formatNumber(previousValue) : window.localization.noData}
            <span>${hasPrevData ? window.localization.dailyKcalLabel : ''}</span>
          </div>
          <div class="period-bar previous" style="width: ${displayedPreviousBarWidth}%">
            <span class="period-bar-label">${previousLabel}</span>
          </div>
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
    const periodText = window.localization.textStaticCalories.replace("{value}", formatNumber(avg));

    return `
      <div class="collection-card">
        <div class="collection-header">
          ${createFireIcon()}
          <span class="collection-title">${window.localization.titleStaticCalories}</span>
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
      case 'week': return window.localization.periodButtonWeek.toLowerCase();
      case 'month': return window.localization.periodButtonMonth.toLowerCase();
      case '6month': return window.localization.periodButtonSixMonth.toLowerCase();
      case 'year': return window.localization.periodButtonYear.toLowerCase();
      default: return window.localization.periodButtonWeek.toLowerCase();
    }
  }

  // Функция для построения блока "Калории активности"
  function buildActiveBlock(data, tdee) {
    // data – массив объектов; преобразуем в массив чисел
    const numericValues = data.map(item => item.calories);
    const hasValidTdee = tdee && tdee > 0;
    const countAbove = hasValidTdee ? numericValues.filter(v => v > tdee).length : 0;

    // Определяем текущий период
    const currentPeriod = document.querySelector('.period-button.active').dataset.period;

    // Выбираем подходящий текст и данные для миниграфика в зависимости от периода
    let chartData = numericValues;
    let average = 0; // Average calculation remains the same, based on non-zero entries

    const nonZeroValues = numericValues.filter(v => v > 0);
    average = nonZeroValues.length ? Math.round(nonZeroValues.reduce((a, b) => a + b, 0) / nonZeroValues.length) : 0;

    // Получаем правильную форму слова в зависимости от периода и числа
    let countAndUnit = '', aboveAndUnit = '';
    let blockText = '';

    if (hasValidTdee) {
      switch (currentPeriod) {
        case 'week':
        case 'month':
          // Для недели и месяца используем "день/дня/дней"
          countAndUnit = `${numericValues.length} ${window.localization.pluralizeDays(numericValues.length)}`;
          aboveAndUnit = `${countAbove} ${window.localization.pluralizeDays(countAbove)}`;
          break;
        case '6month':
          // Для 6 месяцев используем "неделя/недели/недель"
          countAndUnit = `${numericValues.length} ${window.localization.pluralizeWeeks(numericValues.length)}`;
          aboveAndUnit = `${countAbove} ${window.localization.pluralizeWeeks(countAbove)}`;
          break;
        case 'year':
          // Для года используем "месяц/месяца/месяцев"
          countAndUnit = `${numericValues.length} ${window.localization.pluralizeMonths(numericValues.length)}`;
          aboveAndUnit = `${countAbove} ${window.localization.pluralizeMonths(countAbove)}`;
          break;
      }
      blockText = window.localization.textActiveCalories
        .replace("{countAndUnit}", countAndUnit)
        .replace("{aboveAndUnit}", aboveAndUnit)
        .replace("{tdee}", formatNumber(tdee)); // Используем форматированный TDEE
    } else {
      // Если TDEE невалидный, используем другой текст
      blockText = window.localization.textActiveCaloriesNoTDEE;
    }

    return `
      <div class="collection-card active-calories-block">
        <div class="collection-header">
          ${createFireIcon()}
          <span class="collection-title">${window.localization.titleActiveCalories}</span>
        </div>
        <div class="collection-text">
          ${blockText}
        </div>
        ${createTdeeMiniChart(numericValues, tdee)}
      </div>
    `;
  }

  // Функция для построения блока сравнения за месяц
  function buildMonthComparisonBlock() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const currentStart = new Date(currentYear, currentMonth, 1);
    const currentEnd = new Date(currentYear, currentMonth + 1, 1);

    let prevYear = currentYear, prevMonth = currentMonth - 1;
    if (prevMonth < 0) {
      prevMonth = 11;
      prevYear = currentYear - 1;
    }
    const prevStart = new Date(prevYear, prevMonth, 1);
    const prevEnd = new Date(prevYear, prevMonth + 1, 1);

    const currentMonthData = window.allData.filter(item => item.date >= currentStart && item.date < currentEnd && item.calories > 0);
    const prevMonthData = window.allData.filter(item => item.date >= prevStart && item.date < prevEnd && item.calories > 0);

    const currentAvg = currentMonthData.length
      ? Math.round(currentMonthData.reduce((a, b) => a + b.calories, 0) / currentMonthData.length)
      : null;
    const prevAvg = prevMonthData.length
      ? Math.round(prevMonthData.reduce((a, b) => a + b.calories, 0) / prevMonthData.length)
      : null;

    const currentMonthLabel = currentStart.toLocaleDateString(window.localization.getLocale(), { month: 'long' });
    const prevMonthLabel = prevStart.toLocaleDateString(window.localization.getLocale(), { month: 'long' });

    const formattedCurrentLabel = currentMonthLabel.charAt(0).toUpperCase() + currentMonthLabel.slice(1);
    const formattedPrevLabel = prevMonthLabel.charAt(0).toUpperCase() + prevMonthLabel.slice(1);

    if (!currentAvg && !prevAvg) {
      return createEmptyDataCard(window.localization.titleMonthComparison);
    }

    // Определяем сообщение для блока сравнения
    let comparisonText;
    
    if (!prevAvg) {
      comparisonText = window.localization.textNoPrevMonthData;
    } else {
      // Проверяем на близкие значения (разница менее 5%)
      const difference = Math.abs(currentAvg - prevAvg);
      const percentDifference = (difference / prevAvg) * 100;
      
      if (percentDifference < 5) {
        comparisonText = window.localization.textMonthComparisonIdentical;
      } else if (currentAvg >= prevAvg) {
        comparisonText = window.localization.textMonthComparisonHigher;
      } else {
        comparisonText = window.localization.textMonthComparisonLower;
      }
    }

    return createComparisonBlock(
      comparisonText,
      currentAvg,
      prevAvg,
      formattedCurrentLabel,
      formattedPrevLabel,
      window.localization.titleMonthComparison
    );
  }

  function buildYearComparisonBlock() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const previousYear = currentYear - 1;

    const currentYearData = window.allData.filter(item => item.date.getFullYear() === currentYear && item.calories > 0);
    const previousYearData = window.allData.filter(item => item.date.getFullYear() === previousYear && item.calories > 0);

    const currentAvg = currentYearData.length
      ? Math.round(currentYearData.reduce((sum, v) => sum + v.calories, 0) / currentYearData.length)
      : null;
    const previousAvg = previousYearData.length
      ? Math.round(previousYearData.reduce((sum, v) => sum + v.calories, 0) / previousYearData.length)
      : null;

    if (!currentAvg && !previousAvg) {
      return createEmptyDataCard(window.localization.titleYearComparison);
    }

    // Определяем сообщение для блока сравнения
    let comparisonText;
    
    if (!previousAvg) {
      comparisonText = window.localization.textNoPrevYearData;
    } else {
      // Проверяем на близкие значения (разница менее 5%)
      const difference = Math.abs(currentAvg - previousAvg);
      const percentDifference = (difference / previousAvg) * 100;
      
      if (percentDifference < 5) {
        comparisonText = window.localization.textYearComparisonIdentical;
      } else if (currentAvg >= previousAvg) {
        comparisonText = window.localization.textYearComparisonHigher;
      } else {
        comparisonText = window.localization.textYearComparisonLower;
      }
    }

    return createComparisonBlock(
      comparisonText,
      currentAvg,
      previousAvg,
      currentYear.toString(),
      previousYear.toString(),
      window.localization.titleYearComparison
    );
  }

  // Функция для создания карточки при отсутствии данных
  function createEmptyDataCard(title) {
    return `
      <div class="collection-card empty-data">
        <div class="collection-header">
          <span class="collection-title">${title}</span>
        </div>
        <div class="collection-text">${window.localization.noData}</div>
      </div>
    `;
  }



  function buildLoggedStreakCard() {
    const current = window.userCurrentLoggedStreak || 0;
    const max = window.userMaxLoggedStreak || 0;

    const currentText = window.localization.textCurrentStreak
      .replace('{value}', `<strong>${formatNumber(current)}</strong>`)
      .replace('{unit}', `<strong>${window.localization.pluralizeDays(current)}</strong>`);
    const maxText = window.localization.textMaxStreak
      .replace('{value}', `<strong>${formatNumber(max)}</strong>`)
      .replace('{unit}', `<strong>${window.localization.pluralizeDays(max)}</strong>`);

    const safeMax = max > 0 ? max : 1;
    const rawPercent = (current / safeMax) * 100;

    return `
      <div class="collection-card">
        <div class="collection-header">
          ${createFireIcon()}
          <span class="collection-title">${window.localization.titleStreak}</span>
        </div>
        <div class="collection-text">
          ${currentText}<br>${maxText}
        </div>
        <div class="progress-container">
          <div class="period-bar background"></div>
          <div class="period-bar current" style="width: ${rawPercent.toFixed(1)}%">
            <span class="period-bar-label">${current}/${max}</span>
          </div>
        </div>
      </div>
    `;
  }

  function buildGoalStreakCard() {
    const current = window.userCurrentGoalStreak || 0;
    const max = window.userMaxGoalStreak || 0;

    const currentText = window.localization.textCurrentGoalStreak
      .replace('{value}', `<strong>${formatNumber(current)}</strong>`)
      .replace('{unit}', `<strong>${window.localization.pluralizeDays(current)}</strong>`);
    const maxText = window.localization.textMaxGoalStreak
      .replace('{value}', `<strong>${formatNumber(max)}</strong>`)
      .replace('{unit}', `<strong>${window.localization.pluralizeDays(max)}</strong>`);

    const safeMax = max > 0 ? max : 1;
    const rawPercent = (current / safeMax) * 100;

    return `
      <div class="collection-card">
        <div class="collection-header">
          ${createFireIcon()}
          <span class="collection-title">${window.localization.titleGoalStreak}</span>
        </div>
        <div class="collection-text">
          ${currentText}<br>${maxText}
        </div>
        <div class="progress-container">
          <div class="period-bar background"></div>
          <div class="period-bar current" style="width: ${rawPercent.toFixed(1)}%">
            <span class="period-bar-label">${current}/${max}</span>
          </div>
        </div>
      </div>
    `;
  }

  function buildStreakRow() {
    return `<div class="streak-row">${buildLoggedStreakCard()}${buildGoalStreakCard()}</div>`;
  }

  // Регистрируем функции построения блоков в фабрике
  BlockFactory.register((data, tdee) => buildActiveBlock(data, tdee));
  BlockFactory.register(() => buildStaticBlock(getWeekData()));
  BlockFactory.register(() => buildMonthComparisonBlock());
  BlockFactory.register(() => buildYearComparisonBlock());
  BlockFactory.register(() => buildStreakRow());

  // Основная функция обновления инфо-блоков, объединяющая результаты всех блоков
  // Теперь эта функция лишь инициализирует все блоки при загрузке и обновляет только блок активности при переключении вкладок
  function updateCollections(data, tdee) {
    // Создаем HTML для всех блоков через фабрику
    const html = BlockFactory.buildAll(data, tdee);
    collectionsContainer.innerHTML = html;

    // Добавляем классы для идентификации блоков
    const blocks = collectionsContainer.querySelectorAll('.collection-card');
    if (blocks.length >= 2) blocks[1].classList.add('static-calories-block');
    if (blocks.length >= 3) blocks[2].classList.add('month-comparison-block');
    if (blocks.length >= 4) blocks[3].classList.add('year-comparison-block');
    if (blocks.length >= 5) blocks[4].classList.add('streak-block');
    if (blocks.length >= 6) blocks[5].classList.add('goal-streak-block');
  }

  // Экспортируем функцию updateCollections в глобальную область видимости
  window.updateCollections = updateCollections;

  // Не вызываем здесь инициализацию, а перенесем ее в script.js
  // updateCollections(getWeekData(), 2200);
});
