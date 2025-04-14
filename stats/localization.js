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
      averageLabel: "СРЕДН.",
      kilocalories: "ккал",
      noData: "Нет данных",
      dailyKcalLabel: "ккал/день",
      tdeeThreshold: "TDEE",
      
      titleStaticCalories: "Калории (7 дней)",
      textStaticCalories: "За 7 дней среднее потребление калорий составило {value} ккал в день.",
      
      titleActiveCalories: "Калории активности",
      textActiveCalories: "За {countAndUnit} вы превысили расчетную норму TDEE ({tdee} ккал) {aboveAndUnit}.",
      
      titleMonthComparison: "Сравнение калорий за месяц",
      titleYearComparison: "Сравнение калорий за год",
      
      textNoPrevMonthData: "Данных за прошлый месяц нет для сравнения.",
      textMonthComparisonIdentical: "В этом и прошлом месяце вы потребляли примерно одинаковое количество калорий.",
      textMonthComparisonHigher: "В этом месяце вы в среднем потребляете больше калорий, чем в прошлом.",
      textMonthComparisonLower: "В этом месяце вы в среднем потребляете меньше калорий, чем в прошлом.",
      
      textNoPrevYearData: "Данных за прошлый год нет для сравнения.",
      textYearComparisonIdentical: "В этом и прошлом году вы потребляли примерно одинаковое количество калорий.",
      textYearComparisonHigher: "В этом году вы в среднем потребляете больше калорий, чем в прошлом.",
      textYearComparisonLower: "В этом году вы в среднем потребляете меньше калорий, чем в прошлом.",
      
      dailyAverageLabel: "В СРЕДНЕМ ЗА ДЕНЬ",
      trendButton: "Тренд",
      periodButtonWeek: "НЕД",
      periodButtonMonth: "МЕС",
      periodButtonSixMonth: "6 МЕС",
      periodButtonYear: "ГОД",
      textActiveCaloriesNoTDEE: "Установите свой TDEE в настройках, чтобы увидеть сравнение потребленных калорий с вашей нормой.",
      
      // Новые ключи для спиннера и ошибки
      loading: "Загрузка...",
      loadingError: "Ошибка загрузки данных"
    },
    en: {
      averageLabel: "AVG.",
      kilocalories: "kcal",
      noData: "No data",
      dailyKcalLabel: "kcal/day",
      tdeeThreshold: "TDEE",
      
      titleStaticCalories: "Calories (7 days)",
      textStaticCalories: "For the past 7 days, the average calorie consumption was {value} kcal per day.",
      
      titleActiveCalories: "Active Calories",
      textActiveCalories: "For {countAndUnit}, you exceeded your estimated TDEE ({tdee} kcal) {aboveAndUnit}.",
      
      titleMonthComparison: "Monthly Calorie Comparison",
      titleYearComparison: "Yearly Calorie Comparison",
      
      textNoPrevMonthData: "No data for last month to compare.",
      textMonthComparisonIdentical: "This month and last month, you consumed roughly the same amount of calories.",
      textMonthComparisonHigher: "This month, you are consuming more calories on average than last month.",
      textMonthComparisonLower: "This month, you are consuming fewer calories on average than last month.",
      
      textNoPrevYearData: "No data for last year to compare.",
      textYearComparisonIdentical: "This year and last year, you consumed roughly the same amount of calories.",
      textYearComparisonHigher: "This year, you are consuming more calories on average than last year.",
      textYearComparisonLower: "This year, you are consuming fewer calories on average than last year.",
      
      dailyAverageLabel: "AVERAGE PER DAY",
      trendButton: "Trend",
      periodButtonWeek: "WEEK",
      periodButtonMonth: "MONTH",
      periodButtonSixMonth: "6 MONTHS",
      periodButtonYear: "YEAR",
      textActiveCaloriesNoTDEE: "Set your TDEE in settings to see how your calorie intake compares to your norm.",
      
      // Новые ключи для спиннера и ошибки
      loading: "Loading...",
      loadingError: "Error loading data"
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