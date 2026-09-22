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
      dayShort: "д",
      
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
      retryButton: "Попробовать ещё раз",
      titleStreak: "Без пропусков",
      textCurrentStreak: "Текущая серия: {value} {unit}.",
      textMaxStreak: "Макс. серия: {value} {unit}.",
      titleGoalStreak: "Выполнение цели",
      textCurrentGoalStreak: "Текущая серия: {value} {unit}.",
      textMaxGoalStreak: "Макс. серия: {value} {unit}.",

      goalsCardTitle: "Выполнение целей",
      goalsMetricCalories: "Калории",
      goalsMetricProtein: "Белки",
      goalsMetricFat: "Жиры",
      goalsMetricCarbs: "Углеводы",
      goalsProgress: "{met} из {total} {daysWord}",
      goalsUnitGrams: "г"
    },
    en: {
      averageLabel: "Average<br>per day",
      kilocalories: "kcal",
      noData: "No data",
      dailyKcalLabel: "kcal/day",
      dayShort: "d",
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
      retryButton: "Try again",
      titleStreak: "No skips",
      textCurrentStreak: "Current streak: {value} {unit}.",
      textMaxStreak: "Max streak: {value} {unit}.",
      titleGoalStreak: "Goal completion",
      textCurrentGoalStreak: "Current goal streak: {value} {unit}.",
      textMaxGoalStreak: "Max goal streak: {value} {unit}.",

      goalsCardTitle: "Goal Completion",
      goalsMetricCalories: "Calories",
      goalsMetricProtein: "Protein",
      goalsMetricFat: "Fat",
      goalsMetricCarbs: "Carbs",
      goalsProgress: "{met} of {total} {daysWord}",
      goalsUnitGrams: "g"
    },
    ar: {
      averageLabel: "متوسط<br>في اليوم",
      kilocalories: "سعرة حرارية",
      noData: "لا توجد بيانات",
      dayShort: "ي",
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
      retryButton: "حاول مرة أخرى",
      titleStreak: "بدون تفويت",
      textCurrentStreak: "السلسلة الحالية: {value} {unit}.",
      textMaxStreak: "أطول سلسلة: {value} {unit}.",
      titleGoalStreak: "تحقيق الهدف",
      textCurrentGoalStreak: "السلسلة الحالية: {value} {unit}.",
      textMaxGoalStreak: "أطول سلسلة: {value} {unit}.",

      goalsCardTitle: "Goal Completion",
      goalsMetricCalories: "Calories",
      goalsMetricProtein: "Protein",
      goalsMetricFat: "Fat",
      goalsMetricCarbs: "Carbs",
      goalsProgress: "{met} of {total} {daysWord}",
      goalsUnitGrams: "g"
    },

    de: {
      averageLabel: "Durchschnitt<br>pro Tag",
      kilocalories: "kcal",
      noData: "Keine Daten",
      dailyKcalLabel: "kcal/Tag",
      tdeeThreshold: "TDEE",
      dayShort: "T",
      
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
      retryButton: "Erneut versuchen",
      titleStreak: "Keine Aussetzer",
      textCurrentStreak: "Aktuelle Serie: {value} {unit}.",
      textMaxStreak: "Beste Serie: {value} {unit}.",
      titleGoalStreak: "Zielerfüllung",
      textCurrentGoalStreak: "Aktuelle Serie: {value} {unit}.",
      textMaxGoalStreak: "Beste Serie: {value} {unit}.",

      goalsCardTitle: "Goal Completion",
      goalsMetricCalories: "Calories",
      goalsMetricProtein: "Protein",
      goalsMetricFat: "Fat",
      goalsMetricCarbs: "Carbs",
      goalsProgress: "{met} of {total} {daysWord}",
      goalsUnitGrams: "g"
    },

    es: {
      averageLabel: "Promedio<br>por día",
      kilocalories: "kcal",
      noData: "No hay datos",
      dailyKcalLabel: "kcal/día",
      tdeeThreshold: "TDEE",
      dayShort: "d",
      
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
      retryButton: "Intentar de nuevo",
      titleStreak: "Sin faltas",
      textCurrentStreak: "Racha actual: {value} {unit}.",
      textMaxStreak: "Racha máxima: {value} {unit}.",
      titleGoalStreak: "Cumplimiento de la meta",
      textCurrentGoalStreak: "Racha actual: {value} {unit}.",
      textMaxGoalStreak: "Racha máxima: {value} {unit}.",

      goalsCardTitle: "Goal Completion",
      goalsMetricCalories: "Calories",
      goalsMetricProtein: "Protein",
      goalsMetricFat: "Fat",
      goalsMetricCarbs: "Carbs",
      goalsProgress: "{met} of {total} {daysWord}",
      goalsUnitGrams: "g"
    },

    fr: {
      averageLabel: "Moyenne<br>par jour",
      kilocalories: "kcal",
      noData: "Pas de données",
      dailyKcalLabel: "kcal/jour",
      tdeeThreshold: "TDEE",
      dayShort: "j",
      
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
      retryButton: "Réessayer",
      titleStreak: "Sans écart",
      textCurrentStreak: "Série en cours : {value} {unit}.",
      textMaxStreak: "Meilleure série : {value} {unit}.",
      titleGoalStreak: "Atteinte de l'objectif",
      textCurrentGoalStreak: "Série en cours : {value} {unit}.",
      textMaxGoalStreak: "Meilleure série : {value} {unit}.",

      goalsCardTitle: "Goal Completion",
      goalsMetricCalories: "Calories",
      goalsMetricProtein: "Protein",
      goalsMetricFat: "Fat",
      goalsMetricCarbs: "Carbs",
      goalsProgress: "{met} of {total} {daysWord}",
      goalsUnitGrams: "g"
    },
    tr: {
      averageLabel: "Günlük<br>ortalama",
      kilocalories: "kcal",
      noData: "Veri yok",
      dailyKcalLabel: "kcal/gün",
      tdeeThreshold: "TDEE",
      dayShort: "g",
      
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
      retryButton: "Tekrar dene",
      titleStreak: "Eksiksiz",
      textCurrentStreak: "Mevcut seri: {value} {unit}.",
      textMaxStreak: "En uzun seri: {value} {unit}.",
      titleGoalStreak: "Hedef Tamamlama",
      textCurrentGoalStreak: "Mevcut seri: {value} {unit}.",
      textMaxGoalStreak: "En uzun seri: {value} {unit}.",

      goalsCardTitle: "Goal Completion",
      goalsMetricCalories: "Calories",
      goalsMetricProtein: "Protein",
      goalsMetricFat: "Fat",
      goalsMetricCarbs: "Carbs",
      goalsProgress: "{met} of {total} {daysWord}",
      goalsUnitGrams: "g"
    },

    uz: {
      averageLabel: "Kunlik<br>oʻrtacha",
      kilocalories: "kkal",
      noData: "Maʼlumot yoʻq",
      dailyKcalLabel: "kkal/kun",
      tdeeThreshold: "TDEE",
      dayShort: "kun",

      titleStaticCalories: "Soʻnggi 7 kun",
      textStaticCalories: "Soʻnggi 7 kunda siz kuniga oʻrtacha {value} kkal isteʼmol qildingiz.",

      titleActiveCalories: "Faollik kaloriyalari",
      textActiveCalories: "{countAndUnit} davomida umumiy kunlik energiya sarfingizdan ({tdee} kkal) {aboveAndUnit} koʻp isteʼmol qildingiz.",

      titleMonthComparison: "Oylik taqqoslash",
      titleYearComparison: "Yillik taqqoslash",

      textNoPrevMonthData: "Taqqoslash uchun maʼlumot yoʻq.",
      textMonthComparisonIdentical: "Bu oy va oʻtgan oy deyarli bir xil miqdorda kaloriya isteʼmol qildingiz.",
      textMonthComparisonHigher: "Bu oy oʻrtacha oʻtgan oydagidan koʻproq kaloriya isteʼmol qilyapsiz.",
      textMonthComparisonLower: "Bu oy oʻrtacha oʻtgan oydagidan kamroq kaloriya isteʼmol qilyapsiz.",

      textNoPrevYearData: "Taqqoslash uchun maʼlumot yoʻq.",
      textYearComparisonIdentical: "Bu yil va oʻtgan yil deyarli bir xil miqdorda kaloriya isteʼmol qildingiz.",
      textYearComparisonHigher: "Bu yil oʻrtacha oʻtgan yildagidan koʻproq kaloriya isteʼmol qilyapsiz.",
      textYearComparisonLower: "Bu yil oʻrtacha oʻtgan yildagidan kamroq kaloriya isteʼmol qilyapsiz.",

      dailyAverageLabel: "KUNLIK OʻRTACHA",
      trendButton: "Trend",
      periodButtonWeek: "HAFTA",
      periodButtonMonth: "OY",
      periodButtonSixMonth: "6 OY",
      periodButtonYear: "YIL",
      textActiveCaloriesNoTDEE: "Avval energiya sarfingizni hisoblang: botga qayting va /calories menyusidan «Metabolizm»ni tanlang.",

      loading: "Yuklanmoqda...",
      loadingError: "Maʼlumotlarni yuklashda xatolik",
      retryButton: "Qayta urinish",
      titleStreak: "Tanaffussiz",
      textCurrentStreak: "Joriy ketma-ketlik: {value} {unit}.",
      textMaxStreak: "Eng uzun ketma-ketlik: {value} {unit}.",
      titleGoalStreak: "Maqsad bajarilishi",
      textCurrentGoalStreak: "Joriy maqsad ketma-ketligi: {value} {unit}.",
      textMaxGoalStreak: "Eng uzun maqsad ketma-ketligi: {value} {unit}.",

      goalsCardTitle: "Maqsad bajarilishi",
      goalsMetricCalories: "Kaloriya",
      goalsMetricProtein: "Oqsil",
      goalsMetricFat: "Yogʻ",
      goalsMetricCarbs: "Uglevod",
      goalsProgress: "{total} kundan {met} tasi",
      goalsUnitGrams: "g"
    },
    uk: {
      averageLabel: "Середнє<br>за день",
      kilocalories: "ккал",
      noData: "Немає даних",
      dailyKcalLabel: "ккал/день",
      tdeeThreshold: "TDEE",
      dayShort: "д",
      
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
      retryButton: "Спробувати ще раз",
      titleStreak: "Без пропусків",
      textCurrentStreak: "Поточна серія: {value} {unit}.",
      textMaxStreak: "Макс. серія: {value} {unit}.",
      titleGoalStreak: "Виконання цілі",
      textCurrentGoalStreak: "Поточна серія: {value} {unit}.",
      textMaxGoalStreak: "Макс. серія: {value} {unit}.",

      goalsCardTitle: "Goal Completion",
      goalsMetricCalories: "Calories",
      goalsMetricProtein: "Protein",
      goalsMetricFat: "Fat",
      goalsMetricCarbs: "Carbs",
      goalsProgress: "{met} of {total} {daysWord}",
      goalsUnitGrams: "g"
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

  // Возвращает сокращённую форму слова "день" для текущей локали
  window.localization.getDayShort = function() {
    return localizations[window.localization._lang]?.dayShort || 'd';
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
