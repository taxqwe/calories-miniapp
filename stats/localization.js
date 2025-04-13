// localization.js
(function() {
  // Функция для получения значения параметра из URL
  function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Извлекаем параметр lang (если не передан — по умолчанию 'en')
  const lang = getURLParameter('lang') || 'en';

  // Объект локализаций для разных языков
  const localizations = {
    ru: {
      averageLabel: "Средн.<br>Килокалории",
      kilocalories: "ккал",
      noData: "Нет данных",
      dailyKcalLabel: "ккал в день",
      tdeeThreshold: "TDEE Порог",
      
      titleStaticCalories: "Средние калории (последние 7 дней)",
      textStaticCalories: "В среднем за последние 7 дней Вы потребляли по {value} ккал в день.",
      
      titleActiveCalories: "Калории активности",
      textActiveCalories: "За выбранный период, из {countAndUnit}, среднее потребление калорий превышало TDEE ({tdee} ккал) {aboveAndUnit}.",
      
      titleMonthComparison: "Сравнение калорий за месяц",
      titleYearComparison: "Сравнение калорий за год",
      
      textNoPrevMonthData: "Показатели за предыдущий месяц появятся, когда будет достаточно информации.",
      textMonthComparisonIdentical: "Среднее потребление калорий за день в текущем месяце практически идентично предыдущему.",
      textMonthComparisonHigher: "За текущий календарный месяц среднее потребление калорий выше, чем в предыдущем месяце.",
      textMonthComparisonLower: "За текущий календарный месяц среднее потребление калорий ниже, чем в предыдущем месяце.",
      
      textNoPrevYearData: "Показатели за предыдущий год появятся, когда будет достаточно информации.",
      textYearComparisonIdentical: "Среднее потребление калорий за день в текущем году практически идентично предыдущему.",
      textYearComparisonHigher: "За текущий календарный год среднее потребление калорий за день выше, чем в предыдущем году.",
      textYearComparisonLower: "За текущий календарный год среднее потребление калорий за день ниже, чем в предыдущем году.",
      
      dailyAverageLabel: "В СРЕДНЕМ ЗА ДЕНЬ",
      trendButton: "Тренд",
      periodButtonWeek: "НЕД",
      periodButtonMonth: "МЕС",
      periodButtonSixMonth: "6 МЕС",
      periodButtonYear: "ГОД"
    },
    en: {
      averageLabel: "Avg.<br>Calories",
      kilocalories: "kcal",
      noData: "No data",
      dailyKcalLabel: "kcal/day",
      tdeeThreshold: "TDEE Threshold",
      
      titleStaticCalories: "Average Calories (Last 7 Days)",
      textStaticCalories: "On average over the last 7 days you consumed {value} kcal per day.",
      
      titleActiveCalories: "Active Calories",
      textActiveCalories: "During the selected period, out of {countAndUnit}, the average calorie consumption exceeded the TDEE ({tdee} kcal) by {aboveAndUnit}.",
      
      titleMonthComparison: "Monthly Calorie Comparison",
      titleYearComparison: "Yearly Calorie Comparison",
      
      textNoPrevMonthData: "Data for the previous month will appear when sufficient information is available.",
      textMonthComparisonIdentical: "The average daily calorie consumption this month is almost identical to the previous month.",
      textMonthComparisonHigher: "For the current month, the average calorie intake is higher than the previous month.",
      textMonthComparisonLower: "For the current month, the average calorie intake is lower than the previous month.",
      
      textNoPrevYearData: "Data for the previous year will appear when sufficient information is available.",
      textYearComparisonIdentical: "The average daily calorie consumption this year is almost identical to the previous year.",
      textYearComparisonHigher: "For the current year, the average calorie intake is higher than the previous year.",
      textYearComparisonLower: "For the current year, the average calorie intake is lower than the previous year.",
      
      dailyAverageLabel: "AVERAGE PER DAY",
      trendButton: "Trend",
      periodButtonWeek: "WEEK",
      periodButtonMonth: "MONTH",
      periodButtonSixMonth: "6 MONTHS",
      periodButtonYear: "YEAR"
    }
    // Дополнительные локализации можно добавить сюда.
  };

  // Устанавливаем глобальный объект локализации для текущего языка.
  window.localization = localizations[lang] || localizations['en'];

  // Сохраним текущий язык для дальнейшей обработки
  window.localization._lang = lang;

  // Функция для маппинга языка на полную локаль для Date API
  window.localization.getLocale = function() {
    switch(window.localization._lang) {
      case 'ru': return 'ru-RU';
      case 'en': return 'en-US';
      // Добавляйте дополнительные случаи по мере необходимости:
      // case 'es': return 'es-ES';
      default: return window.localization._lang;
    }
  };

  /**
   * Склоняет слово "день" в зависимости от числа и языка
   * @param {number} num Число
   * @returns {string} Склоненное слово
   */
  window.localization.pluralizeDays = function(num) {
    if (window.localization._lang === 'ru') {
      const abs = Math.abs(num);
      const lastDigit = abs % 10;
      const lastTwoDigits = abs % 100;

      if (lastDigit === 1 && lastTwoDigits !== 11) {
        return 'день';
      } else if (
        lastDigit >= 2 &&
        lastDigit <= 4 &&
        !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
      ) {
        return 'дня';
      } else {
        return 'дней';
      }
    } else {
      // Для английского и других языков
      return num === 1 ? 'day' : 'days';
    }
  };

  /**
   * Склоняет слово "неделя" в зависимости от числа и языка
   * @param {number} num Число
   * @returns {string} Склоненное слово
   */
  window.localization.pluralizeWeeks = function(num) {
    if (window.localization._lang === 'ru') {
      const abs = Math.abs(num);
      const lastDigit = abs % 10;
      const lastTwoDigits = abs % 100;

      if (lastDigit === 1 && lastTwoDigits !== 11) {
        return 'неделя';
      } else if (
        lastDigit >= 2 &&
        lastDigit <= 4 &&
        !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
      ) {
        return 'недели';
      } else {
        return 'недель';
      }
    } else {
      // Для английского и других языков
      return num === 1 ? 'week' : 'weeks';
    }
  };

  /**
   * Склоняет слово "месяц" в зависимости от числа и языка
   * @param {number} num Число
   * @returns {string} Склоненное слово
   */
  window.localization.pluralizeMonths = function(num) {
    if (window.localization._lang === 'ru') {
      const abs = Math.abs(num);
      const lastDigit = abs % 10;
      const lastTwoDigits = abs % 100;

      if (lastDigit === 1 && lastTwoDigits !== 11) {
        return 'месяц';
      } else if (
        lastDigit >= 2 &&
        lastDigit <= 4 &&
        !(lastTwoDigits >= 12 && lastTwoDigits <= 14)
      ) {
        return 'месяца';
      } else {
        return 'месяцев';
      }
    } else {
      // Для английского и других языков
      return num === 1 ? 'month' : 'months';
    }
  };
})(); 