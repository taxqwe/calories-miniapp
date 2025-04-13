// localization.js
(function() {
  // Функция для получения значения параметра из URL
  function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Извлекаем параметр lang (если не передан — по умолчанию 'ru')
  const lang = getURLParameter('lang') || 'ru';

  // Объект локализаций для разных языков
  const localizations = {
    ru: {
      averageLabel: "Средн.<br>Килокалории",
      kilocalories: "ккал",
      noData: "Нет данных",
      dailyKcalLabel: "ккал в день",
      tdeeThreshold: "TDEE Порог",
      
      titleStaticCalories: "Средние калории (последние 7 дней)",
      textStaticCalories: "В среднем за последние 7 дней (без учёта дней с 0 ккал) Вы потребляли по {value} ккал в день.",
      
      titleActiveCalories: "Калории активности",
      textActiveCalories: "За выбранный период, из {count} {unit}, в {above} {unit} среднее потребление калорий превышало TDEE ({tdee} ккал).",
      
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
    }
    // Здесь можно добавить другие локализации (например, 'en', 'es' и т.д.)
  };

  // Устанавливаем глобальный объект локализации для текущего языка.
  // Если для переданного языка нет локализации, можно задать дефолтное значение (например, ru).
  window.localization = localizations[lang] || localizations['ru'];
})(); 