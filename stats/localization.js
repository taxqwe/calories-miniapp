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
      averageLabel: "Среднее<br>за день",
      kilocalories: "ккал",
      noData: "Нет данных",
      dailyKcalLabel: "ккал в день",
      tdeeThreshold: "TDEE",
      
      titleStaticCalories: "За последние 7 дней",
      textStaticCalories: "В среднем за последние 7 дней Вы потребляли {value} ккал в день.",
      
      titleActiveCalories: "Калории активности",
      textActiveCalories: "За {countAndUnit} вы превышали рассчетное значение общего ежедневного расхода энергии ({tdee} ккал) {aboveAndUnit}.",
      
      titleMonthComparison: "Сравнение за месяц",
      titleYearComparison: "Сравнение за год",
      
      textNoPrevMonthData: "Нет данных для сравнения.",
      textMonthComparisonIdentical: "В этом и прошлом месяце Вы потребляли примерно одинаковое количество калорий.",
      textMonthComparisonHigher: "В этом месяце Вы в среднем потребляете больше калорий, чем в прошлом.",
      textMonthComparisonLower: "В этом месяце Вы в среднем потребляете меньше калорий, чем в прошлом.",
      
      textNoPrevYearData: "Нет данных для сравнения.",
      textYearComparisonIdentical: "В этом и прошлом году вы потребляли примерно одинаковое количество калорий.",
      textYearComparisonHigher: "В этом году вы в среднем потребляете больше калорий, чем в прошлом.",
      textYearComparisonLower: "В этом году вы в среднем потребляете меньше калорий, чем в прошлом.",
      
      dailyAverageLabel: "В СРЕДНЕМ ЗА ДЕНЬ",
      trendButton: "Тренд",
      periodButtonWeek: "НЕД",
      periodButtonMonth: "МЕС",
      periodButtonSixMonth: "6 МЕС",
      periodButtonYear: "ГОД",
      textActiveCaloriesNoTDEE: "Сначала рассчитайте расход энергии: вернитесь в бота и выберите 'Метаболизм' в /calories.",
      
      // Новые ключи для спиннера и ошибки
      loading: "Загрузка...",
      loadingError: "Ошибка при загрузке данных",
      retryButton: "Попробовать ещё раз"
    },
    en: {
      averageLabel: "Average<br>per day",
      kilocalories: "kcal",
      noData: "No data",
      dailyKcalLabel: "kcal/day",
      tdeeThreshold: "TDEE",
      
      titleStaticCalories: "Last 7 days",
      textStaticCalories: "On average over the last 7 days, you consumed {value} kcal per day.",
      
      titleActiveCalories: "Activity Calories",
      textActiveCalories: "Over the course of {countAndUnit}, you exceeded your total daily energy expenditure ({tdee} kcal) {aboveAndUnit}.",
      
      titleMonthComparison: "Monthly comparison",
      titleYearComparison: "Yearly comparison",
      
      textNoPrevMonthData: "No data for comparison.",
      textMonthComparisonIdentical: "This month and last month, you consumed roughly the same amount of calories.",
      textMonthComparisonHigher: "This month, you are consuming more calories on average than last month.",
      textMonthComparisonLower: "This month, you are consuming fewer calories on average than last month.",
      
      textNoPrevYearData: "No data for comparison.",
      textYearComparisonIdentical: "This year and last year, you consumed roughly the same amount of calories.",
      textYearComparisonHigher: "This year, you are consuming more calories on average than last year.",
      textYearComparisonLower: "This year, you are consuming fewer calories on average than last year.",
      
      dailyAverageLabel: "AVERAGE PER DAY",
      trendButton: "Trend",
      periodButtonWeek: "WEEK",
      periodButtonMonth: "MONTH",
      periodButtonSixMonth: "6 MONTHS",
      periodButtonYear: "YEAR",
      
      textActiveCaloriesNoTDEE: "First, calculate your energy expenditure: return to the bot and select 'Metabolism' in /calories.",
      
      // New keys for spinner and error
      loading: "Loading...",
      loadingError: "Error loading data",
      retryButton: "Try again"
    },
    ar: {
      averageLabel: "متوسط<br>في اليوم",
      kilocalories: "سعرة حرارية",
      noData: "لا توجد بيانات",
      dailyKcalLabel: "سعرة/اليوم",
      tdeeThreshold: "TDEE",
      
      titleStaticCalories: "آخر 7 أيام",
      textStaticCalories: "في المتوسط، خلال الأيام السبعة الماضية، استهلكت {value} سعرة حرارية في اليوم.",
      
      titleActiveCalories: "سعرات النشاط",
      textActiveCalories: "خلال {countAndUnit} تجاوزت إجمالي المصروف اليومي للطاقة ({tdee} سعرة حرارية) بمقدار {aboveAndUnit}.",
      
      titleMonthComparison: "المقارنة الشهرية",
      titleYearComparison: "المقارنة السنوية",
      
      textNoPrevMonthData: "لا توجد بيانات للمقارنة.",
      textMonthComparisonIdentical: "هذا الشهر والشهر الماضي، استهلكت تقريبًا نفس القدر من السعرات الحرارية.",
      textMonthComparisonHigher: "هذا الشهر، تستهلك في المتوسط سعرات حرارية أكثر من الشهر الماضي.",
      textMonthComparisonLower: "هذا الشهر، تستهلك في المتوسط سعرات حرارية أقل من الشهر الماضي.",
      
      textNoPrevYearData: "لا توجد بيانات للمقارنة.",
      textYearComparisonIdentical: "هذا العام والعام الماضي، استهلكت تقريبًا نفس القدر من السعرات الحرارية.",
      textYearComparisonHigher: "هذا العام، تستهلك في المتوسط سعرات حرارية أكثر من العام الماضي.",
      textYearComparisonLower: "هذا العام، تستهلك في المتوسط سعرات حرارية أقل من العام الماضي.",
      
      dailyAverageLabel: "المتوسط اليومي",
      trendButton: "المنحنى",
      periodButtonWeek: "أسبوع",
      periodButtonMonth: "شهر",
      periodButtonSixMonth: "6 أشهر",
      periodButtonYear: "سنة",
      textActiveCaloriesNoTDEE: "أولاً، احسب إنفاقك اليومي للطاقة: عد إلى البوت واختر 'Metabolism' في /calories.",
      
      loading: "جارٍ التحميل...",
      loadingError: "خطأ في تحميل البيانات",
      retryButton: "حاول مرة أخرى"
    },

    de: {
      averageLabel: "Durchschnitt<br>pro Tag",
      kilocalories: "kcal",
      noData: "Keine Daten",
      dailyKcalLabel: "kcal/Tag",
      tdeeThreshold: "TDEE",
      
      titleStaticCalories: "Letzte 7 Tage",
      textStaticCalories: "In den letzten 7 Tagen haben Sie durchschnittlich {value} kcal pro Tag konsumiert.",
      
      titleActiveCalories: "Aktive Kalorien",
      textActiveCalories: "Innerhalb von {countAndUnit} haben Sie Ihren gesamten täglichen Energieverbrauch ({tdee} kcal) um {aboveAndUnit} überschritten.",
      
      titleMonthComparison: "Monatlicher Vergleich",
      titleYearComparison: "Jährlicher Vergleich",
      
      textNoPrevMonthData: "Keine Daten zum Vergleich.",
      textMonthComparisonIdentical: "Diesen und letzten Monat haben Sie ungefähr die gleiche Menge an Kalorien konsumiert.",
      textMonthComparisonHigher: "Diesen Monat konsumieren Sie im Durchschnitt mehr Kalorien als letzten Monat.",
      textMonthComparisonLower: "Diesen Monat konsumieren Sie im Durchschnitt weniger Kalorien als letzten Monat.",
      
      textNoPrevYearData: "Keine Daten zum Vergleich.",
      textYearComparisonIdentical: "Dieses und letztes Jahr haben Sie ungefähr die gleiche Menge an Kalorien konsumiert.",
      textYearComparisonHigher: "Dieses Jahr konsumieren Sie im Durchschnitt mehr Kalorien als letztes Jahr.",
      textYearComparisonLower: "Dieses Jahr konsumieren Sie im Durchschnitt weniger Kalorien als letztes Jahr.",
      
      dailyAverageLabel: "DURCHSCHNITT PRO TAG",
      trendButton: "Trend",
      periodButtonWeek: "WOCHE",
      periodButtonMonth: "MONAT",
      periodButtonSixMonth: "6 MONATE",
      periodButtonYear: "JAHR",
      textActiveCaloriesNoTDEE: "Berechnen Sie zuerst Ihren Energieverbrauch: Kehren Sie zum Bot zurück und wählen Sie 'Metabolism' im Menü /calories.",
      
      loading: "Laden...",
      loadingError: "Fehler beim Laden der Daten",
      retryButton: "Erneut versuchen"
    },

    es: {
      averageLabel: "Promedio<br>por día",
      kilocalories: "kcal",
      noData: "No hay datos",
      dailyKcalLabel: "kcal/día",
      tdeeThreshold: "TDEE",
      
      titleStaticCalories: "Últimos 7 días",
      textStaticCalories: "En promedio, durante los últimos 7 días, consumiste {value} kcal por día.",
      
      titleActiveCalories: "Calorías de actividad",
      textActiveCalories: "Durante {countAndUnit}, superaste tu gasto energético diario total ({tdee} kcal) en {aboveAndUnit}.",
      
      titleMonthComparison: "Comparación mensual",
      titleYearComparison: "Comparación anual",
      
      textNoPrevMonthData: "No hay datos para comparar.",
      textMonthComparisonIdentical: "Este mes y el mes pasado consumiste aproximadamente la misma cantidad de calorías.",
      textMonthComparisonHigher: "Este mes consumes más calorías en promedio que el mes pasado.",
      textMonthComparisonLower: "Este mes consumes menos calorías en promedio que el mes pasado.",
      
      textNoPrevYearData: "No hay datos para comparar.",
      textYearComparisonIdentical: "Este año y el año pasado consumiste aproximadamente la misma cantidad de calorías.",
      textYearComparisonHigher: "Este año consumes más calorías en promedio que el año pasado.",
      textYearComparisonLower: "Este año consumes menos calorías en promedio que el año pasado.",
      
      dailyAverageLabel: "PROMEDIO POR DÍA",
      trendButton: "Tendencia",
      periodButtonWeek: "SEM",
      periodButtonMonth: "MES",
      periodButtonSixMonth: "6 MESES",
      periodButtonYear: "AÑO",
      textActiveCaloriesNoTDEE: "Primero calcula tu gasto energético: regresa al bot y elige 'Metabolismo' en /calories.",
      
      loading: "Cargando...",
      loadingError: "Error al cargar datos",
      retryButton: "Intentar de nuevo"
    },

    fr: {
      averageLabel: "Moyenne<br>par jour",
      kilocalories: "kcal",
      noData: "Pas de données",
      dailyKcalLabel: "kcal/jour",
      tdeeThreshold: "TDEE",
      
      titleStaticCalories: "7 derniers jours",
      textStaticCalories: "En moyenne, au cours des 7 derniers jours, vous avez consommé {value} kcal par jour.",
      
      titleActiveCalories: "Calories d'activité",
      textActiveCalories: "Pendant {countAndUnit}, vous avez dépassé votre dépense énergétique quotidienne totale ({tdee} kcal) de {aboveAndUnit}.",
      
      titleMonthComparison: "Comparaison mensuelle",
      titleYearComparison: "Comparaison annuelle",
      
      textNoPrevMonthData: "Aucune donnée pour comparer.",
      textMonthComparisonIdentical: "Ce mois-ci et le mois dernier, vous avez consommé à peu près la même quantité de calories.",
      textMonthComparisonHigher: "Ce mois-ci, vous consommez plus de calories en moyenne que le mois dernier.",
      textMonthComparisonLower: "Ce mois-ci, vous consommez moins de calories en moyenne que le mois dernier.",
      
      textNoPrevYearData: "Aucune donnée pour comparer.",
      textYearComparisonIdentical: "Cette année et l'année dernière, vous avez consommé à peu près la même quantité de calories.",
      textYearComparisonHigher: "Cette année, vous consommez plus de calories en moyenne que l'année dernière.",
      textYearComparisonLower: "Cette année, vous consommez moins de calories en moyenne que l'année dernière.",
      
      dailyAverageLabel: "MOYENNE PAR JOUR",
      trendButton: "Tendance",
      periodButtonWeek: "SEM",
      periodButtonMonth: "MOIS",
      periodButtonSixMonth: "6 MOIS",
      periodButtonYear: "AN",
      textActiveCaloriesNoTDEE: "Calculez d'abord votre dépense énergétique : retournez sur le bot et sélectionnez 'Metabolism' dans /calories.",
      
      loading: "Chargement...",
      loadingError: "Erreur de chargement des données",
      retryButton: "Réessayer"
    },

    hi: {
      averageLabel: "औसत<br>प्रति दिन",
      kilocalories: "कैलोरी",
      noData: "कोई डेटा नहीं",
      dailyKcalLabel: "कैलोरी/दिन",
      tdeeThreshold: "TDEE",
      
      titleStaticCalories: "पिछले 7 दिन",
      textStaticCalories: "पिछले 7 दिनों में औसतन, आपने {value} कैलोरी प्रति दिन उपभोग की हैं।",
      
      titleActiveCalories: "सक्रिय कैलोरी",
      textActiveCalories: "{countAndUnit} के दौरान, आपने अपने कुल दैनिक ऊर्जा व्यय ({tdee} कैलोरी) को {aboveAndUnit} से पार कर लिया।",
      
      titleMonthComparison: "मासिक तुलना",
      titleYearComparison: "वार्षिक तुलना",
      
      textNoPrevMonthData: "तुलना के लिए कोई डेटा नहीं है।",
      textMonthComparisonIdentical: "इस महीने और पिछले महीने, आपने लगभग समान मात्रा में कैलोरी का सेवन किया।",
      textMonthComparisonHigher: "इस महीने, आप पिछले महीने की तुलना में औसतन अधिक कैलोरी का सेवन कर रहे हैं।",
      textMonthComparisonLower: "इस महीने, आप पिछले महीने की तुलना में औसतन कम कैलोरी का सेवन कर रहे हैं।",
      
      textNoPrevYearData: "तुलना के लिए कोई डेटा नहीं है।",
      textYearComparisonIdentical: "इस वर्ष और पिछले वर्ष, आपने लगभग समान मात्रा में कैलोरी का सेवन किया।",
      textYearComparisonHigher: "इस वर्ष, आप पिछले वर्ष की तुलना में औसतन अधिक कैलोरी का सेवन कर रहे हैं।",
      textYearComparisonLower: "इस वर्ष, आप पिछले वर्ष की तुलना में औसतन कम कैलोरी का सेवन कर रहे हैं।",
      
      dailyAverageLabel: "प्रति दिन औसत",
      trendButton: "रुझान",
      periodButtonWeek: "सप्ताह",
      periodButtonMonth: "महीना",
      periodButtonSixMonth: "6 महीने",
      periodButtonYear: "साल",
      textActiveCaloriesNoTDEE: "पहले अपनी ऊर्जा खपत की गणना करें: बॉट पर वापस जाएँ और /calories मेनू में 'Metabolism' चुनें.",
      
      loading: "लोड हो रहा है...",
      loadingError: "डेटा लोड करते समय त्रुटि",
      retryButton: "पुनः प्रयास करें"
    },

    pt: {
      averageLabel: "Média<br>por dia",
      kilocalories: "kcal",
      noData: "Nenhum dado",
      dailyKcalLabel: "kcal/dia",
      tdeeThreshold: "TDEE",
      
      titleStaticCalories: "Últimos 7 dias",
      textStaticCalories: "Em média, nos últimos 7 dias, você consumiu {value} kcal por dia.",
      
      titleActiveCalories: "Calorias de atividade",
      textActiveCalories: "Durante {countAndUnit}, você excedeu seu gasto energético diário total ({tdee} kcal) em {aboveAndUnit}.",
      
      titleMonthComparison: "Comparação mensal",
      titleYearComparison: "Comparação anual",
      
      textNoPrevMonthData: "Nenhum dado para comparar.",
      textMonthComparisonIdentical: "Neste mês e no mês passado, você consumiu aproximadamente a mesma quantidade de calorias.",
      textMonthComparisonHigher: "Neste mês, você está consumindo mais calorias em média do que no mês passado.",
      textMonthComparisonLower: "Neste mês, você está consumindo menos calorias em média do que no mês passado.",
      
      textNoPrevYearData: "Nenhum dado para comparar.",
      textYearComparisonIdentical: "Neste ano e no ano passado, você consumiu aproximadamente a mesma quantidade de calorias.",
      textYearComparisonHigher: "Neste ano, você está consumindo mais calorias em média do que no ano passado.",
      textYearComparisonLower: "Neste ano, você está consumindo menos calorias em média do que no ano passado.",
      
      dailyAverageLabel: "MÉDIA POR DIA",
      trendButton: "Tendência",
      periodButtonWeek: "SEM",
      periodButtonMonth: "MÊS",
      periodButtonSixMonth: "6 MESES",
      periodButtonYear: "ANO",
      textActiveCaloriesNoTDEE: "Primeiro, calcule seu gasto de energia: volte ao bot e selecione 'Metabolismo' no menu /calories.",
      
      loading: "Carregando...",
      loadingError: "Erro ao carregar os dados",
      retryButton: "Tentar novamente"
    },

    tr: {
      averageLabel: "Günlük<br>ortalama",
      kilocalories: "kcal",
      noData: "Veri yok",
      dailyKcalLabel: "kcal/gün",
      tdeeThreshold: "TDEE",
      
      titleStaticCalories: "Son 7 gün",
      textStaticCalories: "Son 7 günde ortalama olarak günde {value} kcal tükettiniz.",
      
      titleActiveCalories: "Aktif Kaloriler",
      textActiveCalories: "{countAndUnit} süresince, toplam günlük enerji harcamanızı ({tdee} kcal) {aboveAndUnit} aşmış bulunuyorsunuz.",
      
      titleMonthComparison: "Aylık karşılaştırma",
      titleYearComparison: "Yıllık karşılaştırma",
      
      textNoPrevMonthData: "Karşılaştırma için veri yok.",
      textMonthComparisonIdentical: "Bu ay ve geçen ay yaklaşık olarak aynı miktarda kalori tükettiniz.",
      textMonthComparisonHigher: "Bu ay, geçen aya göre ortalama daha fazla kalori tüketiyorsunuz.",
      textMonthComparisonLower: "Bu ay, geçen aya göre ortalama daha az kalori tüketiyorsunuz.",
      
      textNoPrevYearData: "Karşılaştırma için veri yok.",
      textYearComparisonIdentical: "Bu yıl ve geçen yıl yaklaşık olarak aynı miktarda kalori tükettiniz.",
      textYearComparisonHigher: "Bu yıl, geçen yıla göre ortalama daha fazla kalori tüketiyorsunuz.",
      textYearComparisonLower: "Bu yıl, geçen yıla göre ortalama daha az kalori tüketiyorsunuz.",
      
      dailyAverageLabel: "GÜNLÜK ORTALAMA",
      trendButton: "Eğilim",
      periodButtonWeek: "HAFTA",
      periodButtonMonth: "AY",
      periodButtonSixMonth: "6 AY",
      periodButtonYear: "YIL",
      textActiveCaloriesNoTDEE: "Önce enerji harcamanızı hesaplayın: bota geri dönün ve /calories menüsünde 'Metabolizma' seçin.",
      
      loading: "Yükleniyor...",
      loadingError: "Veriler yüklenirken hata oluştu",
      retryButton: "Tekrar dene"
    },

    uk: {
      averageLabel: "Середнє<br>за день",
      kilocalories: "ккал",
      noData: "Немає даних",
      dailyKcalLabel: "ккал/день",
      tdeeThreshold: "TDEE",
      
      titleStaticCalories: "Останні 7 днів",
      textStaticCalories: "У середньому за останні 7 днів Ви споживали {value} ккал на день.",
      
      titleActiveCalories: "Калорії активності",
      textActiveCalories: "За {countAndUnit} Ви перевищували загальний добовий енергетичний витрат ({tdee} ккал) на {aboveAndUnit}.",
      
      titleMonthComparison: "Місячне порівняння",
      titleYearComparison: "Річне порівняння",
      
      textNoPrevMonthData: "Немає даних для порівняння.",
      textMonthComparisonIdentical: "Цього і минулого місяця Ви споживали приблизно однакову кількість калорій.",
      textMonthComparisonHigher: "Цього місяця Ви споживаєте в середньому більше калорій, ніж минулого.",
      textMonthComparisonLower: "Цього місяця Ви споживаєте в середньому менше калорій, ніж минулого.",
      
      textNoPrevYearData: "Немає даних для порівняння.",
      textYearComparisonIdentical: "Цього і минулого року Ви споживали приблизно однакову кількість калорій.",
      textYearComparisonHigher: "Цього року Ви споживаєте в середньому більше калорій, ніж минулого року.",
      textYearComparisonLower: "Цього року Ви споживаєте в середньому менше калорій, ніж минулого року.",
      
      dailyAverageLabel: "У СЕРЕДНЬОМУ ЗА ДЕНЬ",
      trendButton: "Тренд",
      periodButtonWeek: "ТИЖ",
      periodButtonMonth: "МІС",
      periodButtonSixMonth: "6 МІС",
      periodButtonYear: "РІК",
      textActiveCaloriesNoTDEE: "Спочатку розрахуйте свій енергетичний витрат: поверніться до бота та оберіть 'Metabolism' у меню /calories.",
      
      loading: "Завантаження...",
      loadingError: "Помилка завантаження даних",
      retryButton: "Спробувати ще раз"
    }
  };

  // Устанавливаем глобальный объект локализации для текущего языка.
  window.localization = localizations[lang] || localizations['en'];

  // Сохраним текущий язык для дальнейшей обработки
  window.localization._lang = lang;

  // Функция для получения локали для Intl.NumberFormat и date.toLocaleString
  window.localization.getLocale = function() {
    return window.localization._lang || 'en';
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