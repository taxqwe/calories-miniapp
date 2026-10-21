const tg = window.Telegram?.WebApp;

tg?.ready();
tg?.expand();

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});

function applyTheme(themeParams = {}, colorScheme = tg?.colorScheme) {
  const root = document.documentElement;
  const isLight = colorScheme === 'light';

  // В тёмной теме поверхности задаём хардкодом, как в разделе Statistics,
  // чтобы не зависеть от themeParams.bg_color (у некоторых тем = #000000).
  // В светлой теме поведение прежнее: фон из themeParams или светлые дефолты.
  const background = isLight ? (themeParams.bg_color || '#ffffff') : '#1c1c1e';
  const secondaryBackground = isLight ? (themeParams.secondary_bg_color || '#f3f4f6') : '#2c2c2e';
  const textColor = themeParams.text_color || (isLight ? '#1f2933' : '#ffffff');
  const hintColor = themeParams.hint_color || (isLight ? '#6b7a8c' : '#a0a0a0');
  const accentColor = '#ff6422';
  const accentContrast = '#ffffff';
  const destructiveColor = themeParams.destructive_text_color || '#ff5c5c';

  root.style.setProperty('--bg-color', background);
  root.style.setProperty('--card-bg', secondaryBackground);
  root.style.setProperty('--card-elevated-bg', isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.04)');
  root.style.setProperty('--text-color', textColor);
  root.style.setProperty('--text-secondary', hintColor);
  root.style.setProperty('--accent-color', accentColor);
  root.style.setProperty('--accent-contrast', accentContrast);
  root.style.setProperty('--destructive-color', destructiveColor);
  root.style.setProperty('--track-color', isLight ? '#d6dae0' : '#48484a');
  root.style.setProperty('--separator-color', isLight ? 'rgba(15, 23, 42, 0.1)' : 'rgba(255, 255, 255, 0.08)');
  root.style.setProperty('--border-color', isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.06)');
  root.style.setProperty('--shadow-soft', isLight ? '0 4px 14px rgba(15, 23, 42, 0.12)' : '0 6px 16px rgba(0, 0, 0, 0.18)');
}

if (tg) {
  applyTheme(tg.themeParams, tg.colorScheme);
  tg.onEvent('themeChanged', () => applyTheme(tg.themeParams, tg.colorScheme));
}

const API_BASE_URL = window.CaloriesMiniAppConfig.apiBaseUrl;

const REQUEST_TIMEOUT_MS = 15000;
const WEIGHT_SOURCE = 'profile_weight';
const WEIGHT_SPARK_HEIGHT = 48;
const SVG_NS = 'http://www.w3.org/2000/svg';
let weightRequest = null;

// ── строки (9 локалей бота) ───────────────────────────────────────
const translations = {
  ru: {
    pageTitle: 'Профиль',
    subtitleFallback: 'Ваш профиль',
    statusLoading: 'Загружаем профиль…',
    cardTier: 'Тариф',
    cardNorm: 'Норма и цель',
    rowFollowing: 'Подписки',
    rowNotifications: 'Уведомления',
    notificationsNone: 'Выключены',
    notificationsDigestOnly: 'Только отчёт за неделю',
    remindersOne: 'напоминание',
    remindersFew: 'напоминания',
    remindersMany: 'напоминаний',
    rowLanguage: 'Язык',
    navHistory: 'История',
    navStats: 'Статистика',
    navProfile: 'Профиль',
    navAriaLabel: 'Основная навигация',
    tierPremium: 'Premium',
    tierBasic: 'Базовый',
    tierActiveUntil: 'активен до',
    premiumBuy: 'Купить Premium',
    premiumRenew: 'Продлить Premium',
    premiumError: 'Не удалось открыть оплату. Попробуйте позже.',
    premiumBenefitsTitle: 'Что даёт Premium',
    premiumBenefit1: 'Анализ блюд по фото и аудио',
    premiumBenefit2: 'Более мощная и точная AI-модель',
    premiumBenefit3: 'Точнее распознаёт блюда',
    premiumBenefit4: 'Подсчёт БЖУ (белки/жиры/углеводы)',
    goalDeficit: 'Цель: дефицит',
    goalSurplus: 'Цель: профицит',
    preferencesTitle: 'Предпочтения',
    preferences: {
      more_protein: 'Белок',
      less_sugar: 'Сахар',
      more_veggies: 'Овощи',
      low_carb: 'Углеводы',
      more_water: 'Вода',
      less_fat: 'Жиры'
    },
    normEdit: 'Изменить расчёт',
    normCalc: 'Рассчитать норму',
    normEmpty: 'Норма ещё не рассчитана. Рассчитайте дневную норму калорий.',
    loadError: 'Не удалось загрузить профиль. Попробуйте позже.',
    unit: 'ккал/день',
    expend: 'дневной расход',
    kcal: 'ккал',
    weightTitle: 'Вес',
    weightUnit: 'кг',
    weightTrend: '{v} кг в неделю',
    weightHint: 'График появится после следующего замера.',
    weightEmpty: 'Отметьте вес — здесь появится график.',
    weightChartLabel: 'График веса'
  },
  en: {
    pageTitle: 'Profile',
    subtitleFallback: 'Your profile',
    statusLoading: 'Loading profile…',
    cardTier: 'Plan',
    cardNorm: 'Norm & goal',
    rowFollowing: 'Following',
    rowNotifications: 'Notifications',
    notificationsNone: 'Off',
    notificationsDigestOnly: 'Weekly digest only',
    remindersOne: 'reminder',
    remindersFew: 'reminders',
    remindersMany: 'reminders',
    rowLanguage: 'Language',
    navHistory: 'History',
    navStats: 'Stats',
    navProfile: 'Profile',
    navAriaLabel: 'Main navigation',
    tierPremium: 'Premium',
    tierBasic: 'Basic',
    tierActiveUntil: 'active until',
    premiumBuy: 'Get Premium',
    premiumRenew: 'Renew Premium',
    premiumError: "Couldn't open checkout. Try again later.",
    premiumBenefitsTitle: 'What Premium gives you',
    premiumBenefit1: 'Meal analysis from photos and audio',
    premiumBenefit2: 'More powerful and accurate AI model',
    premiumBenefit3: 'More precise dish recognition',
    premiumBenefit4: 'Macronutrient counting (protein/fat/carbs)',
    goalDeficit: 'Goal: deficit',
    goalSurplus: 'Goal: surplus',
    preferencesTitle: 'Preferences',
    preferences: {
      more_protein: 'Protein',
      less_sugar: 'Sugar',
      more_veggies: 'Veggies',
      low_carb: 'Carbs',
      more_water: 'Water',
      less_fat: 'Fat'
    },
    normEdit: 'Edit calculation',
    normCalc: 'Calculate norm',
    normEmpty: 'Norm not calculated yet. Calculate your daily calorie norm.',
    loadError: "Couldn't load profile. Please try again later.",
    unit: 'kcal/day',
    expend: 'daily expenditure',
    kcal: 'kcal',
    weightTitle: 'Weight',
    weightUnit: 'kg',
    weightTrend: '{v} kg per week',
    weightHint: 'The chart will appear after your next weigh-in.',
    weightEmpty: 'Log your weight to see the chart here.',
    weightChartLabel: 'Weight chart'
  },
  ar: {
    pageTitle: 'الملف الشخصي',
    subtitleFallback: 'ملفك الشخصي',
    statusLoading: 'جارٍ تحميل الملف الشخصي…',
    cardTier: 'الخطة',
    cardNorm: 'السعرات المعيارية والهدف',
    rowFollowing: 'من أتابعهم',
    rowNotifications: 'الإشعارات',
    notificationsNone: 'متوقفة',
    notificationsDigestOnly: 'الملخص الأسبوعي فقط',
    remindersOne: 'تذكير',
    remindersTwo: 'تذكيران',
    remindersFew: 'تذكيرات',
    remindersMany: 'تذكيرًا',
    remindersOther: 'تذكير',
    rowLanguage: 'اللغة',
    navHistory: 'السجل',
    navStats: 'الإحصاءات',
    navProfile: 'الملف الشخصي',
    navAriaLabel: 'التنقل الرئيسي',
    tierPremium: 'Premium',
    tierBasic: 'أساسية',
    tierActiveUntil: 'نشط حتى',
    premiumBuy: 'احصل على Premium',
    premiumRenew: 'تمديد Premium',
    premiumError: 'تعذّر فتح صفحة الدفع. حاول لاحقًا.',
    premiumBenefitsTitle: 'ماذا يمنحك Premium',
    premiumBenefit1: 'تحليل الأطباق من الصور والصوت',
    premiumBenefit2: 'نموذج ذكاء اصطناعي أقوى وأدق',
    premiumBenefit3: 'تعرّف أدق على الأطباق',
    premiumBenefit4: 'حساب المغذيات الكبرى (بروتين/دهون/كربوهيدرات)',
    goalDeficit: 'الهدف: عجز',
    goalSurplus: 'الهدف: فائض',
    preferencesTitle: 'التفضيلات',
    preferences: {
      more_protein: 'بروتين',
      less_sugar: 'سكر',
      more_veggies: 'خضار',
      low_carb: 'كربوهيدرات',
      more_water: 'ماء',
      less_fat: 'دهون'
    },
    normEdit: 'تعديل الحساب',
    normCalc: 'احسب السعرات المعيارية',
    normEmpty: 'لم تُحسب السعرات المعيارية بعد. احسب معدل السعرات اليومي.',
    loadError: 'تعذّر تحميل الملف الشخصي. حاول لاحقًا.',
    unit: 'سعرة حرارية/يوم',
    expend: 'الإنفاق اليومي',
    kcal: 'سعرة حرارية',
    weightTitle: 'الوزن',
    weightUnit: 'كغ',
    weightTrend: '{v} كغ في الأسبوع',
    weightHint: 'سيظهر الرسم البياني بعد القياس التالي.',
    weightEmpty: 'سجّل وزنك ليظهر الرسم البياني هنا.',
    weightChartLabel: 'مخطط الوزن'
  },
  de: {
    pageTitle: 'Profil',
    subtitleFallback: 'Dein Profil',
    statusLoading: 'Profil wird geladen…',
    cardTier: 'Tarif',
    cardNorm: 'Kaloriennorm und Ziel',
    rowFollowing: 'Wem ich folge',
    rowNotifications: 'Benachrichtigungen',
    notificationsNone: 'Aus',
    notificationsDigestOnly: 'Nur Wochenbericht',
    remindersOne: 'Erinnerung',
    remindersOther: 'Erinnerungen',
    rowLanguage: 'Sprache',
    navHistory: 'Verlauf',
    navStats: 'Statistik',
    navProfile: 'Profil',
    navAriaLabel: 'Hauptnavigation',
    tierPremium: 'Premium',
    tierBasic: 'Basis',
    tierActiveUntil: 'aktiv bis',
    premiumBuy: 'Premium holen',
    premiumRenew: 'Premium verlängern',
    premiumError: 'Die Bezahlung konnte nicht geöffnet werden. Versuche es später erneut.',
    premiumBenefitsTitle: 'Das bietet Premium',
    premiumBenefit1: 'Analyse von Gerichten per Foto und Audio',
    premiumBenefit2: 'Leistungsstärkeres und genaueres KI-Modell',
    premiumBenefit3: 'Genauere Speiseerkennung',
    premiumBenefit4: 'Makronährstoffe zählen (Eiweiß/Fett/Kohlenhydrate)',
    goalDeficit: 'Ziel: Defizit',
    goalSurplus: 'Ziel: Überschuss',
    preferencesTitle: 'Vorlieben',
    preferences: {
      more_protein: 'Protein',
      less_sugar: 'Zucker',
      more_veggies: 'Gemüse',
      low_carb: 'Carbs',
      more_water: 'Wasser',
      less_fat: 'Fett'
    },
    normEdit: 'Berechnung ändern',
    normCalc: 'Norm berechnen',
    normEmpty: 'Die Norm ist noch nicht berechnet. Berechne deine tägliche Kaloriennorm.',
    loadError: 'Profil konnte nicht geladen werden. Versuche es später erneut.',
    unit: 'kcal/Tag',
    expend: 'Tagesverbrauch',
    kcal: 'kcal',
    weightTitle: 'Gewicht',
    weightUnit: 'kg',
    weightTrend: '{v} kg pro Woche',
    weightHint: 'Das Diagramm erscheint nach der nächsten Messung.',
    weightEmpty: 'Trag dein Gewicht ein – hier erscheint dann das Diagramm.',
    weightChartLabel: 'Gewichtsverlauf'
  },
  es: {
    pageTitle: 'Perfil',
    subtitleFallback: 'Tu perfil',
    statusLoading: 'Cargando el perfil…',
    cardTier: 'Plan',
    cardNorm: 'Norma calórica y objetivo',
    rowFollowing: 'Siguiendo',
    rowNotifications: 'Notificaciones',
    notificationsNone: 'Desactivadas',
    notificationsDigestOnly: 'Solo el resumen semanal',
    remindersOne: 'recordatorio',
    remindersOther: 'recordatorios',
    rowLanguage: 'Idioma',
    navHistory: 'Historial',
    navStats: 'Estadísticas',
    navProfile: 'Perfil',
    navAriaLabel: 'Navegación principal',
    tierPremium: 'Premium',
    tierBasic: 'Básico',
    tierActiveUntil: 'activo hasta',
    premiumBuy: 'Obtener Premium',
    premiumRenew: 'Renovar Premium',
    premiumError: 'No se pudo abrir el pago. Inténtalo más tarde.',
    premiumBenefitsTitle: 'Qué te da Premium',
    premiumBenefit1: 'Análisis de platos por foto y audio',
    premiumBenefit2: 'Modelo de IA más potente y preciso',
    premiumBenefit3: 'Reconocimiento de platos más preciso',
    premiumBenefit4: 'Cálculo de macronutrientes (proteínas/grasas/carbohidratos)',
    goalDeficit: 'Objetivo: déficit',
    goalSurplus: 'Objetivo: superávit',
    preferencesTitle: 'Preferencias',
    preferences: {
      more_protein: 'Proteína',
      less_sugar: 'Azúcar',
      more_veggies: 'Verduras',
      low_carb: 'Carbos',
      more_water: 'Agua',
      less_fat: 'Grasa'
    },
    normEdit: 'Cambiar el cálculo',
    normCalc: 'Calcular la norma',
    normEmpty: 'La norma aún no está calculada. Calcula tu norma calórica diaria.',
    loadError: 'No se pudo cargar el perfil. Inténtalo más tarde.',
    unit: 'kcal/día',
    expend: 'gasto diario',
    kcal: 'kcal',
    weightTitle: 'Peso',
    weightUnit: 'kg',
    weightTrend: '{v} kg por semana',
    weightHint: 'El gráfico aparecerá tras tu próximo registro.',
    weightEmpty: 'Registra tu peso para ver aquí el gráfico.',
    weightChartLabel: 'Gráfico de peso'
  },
  fr: {
    pageTitle: 'Profil',
    subtitleFallback: 'Ton profil',
    statusLoading: 'Chargement du profil…',
    cardTier: 'Forfait',
    cardNorm: 'Norme calorique et objectif',
    rowFollowing: 'Mes abonnements',
    rowNotifications: 'Notifications',
    notificationsNone: 'Désactivées',
    notificationsDigestOnly: 'Seulement le bilan de la semaine',
    remindersOne: 'rappel',
    remindersOther: 'rappels',
    rowLanguage: 'Langue',
    navHistory: 'Historique',
    navStats: 'Statistiques',
    navProfile: 'Profil',
    navAriaLabel: 'Navigation principale',
    tierPremium: 'Premium',
    tierBasic: 'De base',
    tierActiveUntil: 'actif jusqu’au',
    premiumBuy: 'Passer à Premium',
    premiumRenew: 'Prolonger Premium',
    premiumError: 'Impossible d’ouvrir le paiement. Réessaie plus tard.',
    premiumBenefitsTitle: 'Ce que Premium t’apporte',
    premiumBenefit1: 'Analyse des plats par photo et audio',
    premiumBenefit2: 'Modèle d’IA plus performant et plus précis',
    premiumBenefit3: 'Reconnaissance des plats plus précise',
    premiumBenefit4: 'Calcul des macronutriments (protéines/lipides/glucides)',
    goalDeficit: 'Objectif : déficit',
    goalSurplus: 'Objectif : surplus',
    preferencesTitle: 'Préférences',
    preferences: {
      more_protein: 'Protéines',
      less_sugar: 'Sucre',
      more_veggies: 'Légumes',
      low_carb: 'Glucides',
      more_water: 'Eau',
      less_fat: 'Gras'
    },
    normEdit: 'Modifier le calcul',
    normCalc: 'Calculer la norme',
    normEmpty: 'La norme n’est pas encore calculée. Calcule ta norme calorique quotidienne.',
    loadError: 'Impossible de charger le profil. Réessaie plus tard.',
    unit: 'kcal/jour',
    expend: 'dépense quotidienne',
    kcal: 'kcal',
    weightTitle: 'Poids',
    weightUnit: 'kg',
    weightTrend: '{v} kg par semaine',
    weightHint: 'Le graphique apparaîtra après la prochaine pesée.',
    weightEmpty: 'Indique ton poids pour voir le graphique ici.',
    weightChartLabel: 'Courbe de poids'
  },
  tr: {
    pageTitle: 'Profil',
    subtitleFallback: 'Profilin',
    statusLoading: 'Profil yükleniyor…',
    cardTier: 'Plan',
    cardNorm: 'Kalori normu ve hedef',
    rowFollowing: 'Takip ettiklerim',
    rowNotifications: 'Bildirimler',
    notificationsNone: 'Kapalı',
    notificationsDigestOnly: 'Yalnızca haftalık özet',
    remindersOne: 'hatırlatma',
    remindersOther: 'hatırlatma',
    rowLanguage: 'Dil',
    navHistory: 'Geçmiş',
    navStats: 'İstatistikler',
    navProfile: 'Profil',
    navAriaLabel: 'Ana gezinme',
    tierPremium: 'Premium',
    tierBasic: 'Temel',
    tierActiveUntil: 'Bitiş tarihi:',
    premiumBuy: 'Premium’a geç',
    premiumRenew: 'Premium’u uzat',
    premiumError: 'Ödeme açılamadı. Daha sonra tekrar dene.',
    premiumBenefitsTitle: 'Premium ne sağlar',
    premiumBenefit1: 'Yemekleri fotoğraf ve sesle analiz etme',
    premiumBenefit2: 'Daha güçlü ve daha doğru yapay zekâ modeli',
    premiumBenefit3: 'Daha doğru yemek tanıma',
    premiumBenefit4: 'Makro besin hesabı (protein/yağ/karbonhidrat)',
    goalDeficit: 'Hedef: açık',
    goalSurplus: 'Hedef: fazla',
    preferencesTitle: 'Tercihler',
    preferences: {
      more_protein: 'Protein',
      less_sugar: 'Şeker',
      more_veggies: 'Sebze',
      low_carb: 'Karbonhidrat',
      more_water: 'Su',
      less_fat: 'Yağ'
    },
    normEdit: 'Hesabı değiştir',
    normCalc: 'Normu hesapla',
    normEmpty: 'Norm henüz hesaplanmadı. Günlük kalori normunu hesapla.',
    loadError: 'Profil yüklenemedi. Daha sonra tekrar dene.',
    unit: 'kcal/gün',
    expend: 'günlük harcama',
    kcal: 'kcal',
    weightTitle: 'Kilo',
    weightUnit: 'kg',
    weightTrend: 'haftada {v} kg',
    weightHint: 'Grafik bir sonraki ölçümden sonra görünecek.',
    weightEmpty: 'Kilonu gir, grafik burada görünecek.',
    weightChartLabel: 'Kilo grafiği'
  },
  uk: {
    pageTitle: 'Профіль',
    subtitleFallback: 'Ваш профіль',
    statusLoading: 'Завантажуємо профіль…',
    cardTier: 'Тариф',
    cardNorm: 'Норма та мета',
    rowFollowing: 'Підписки',
    rowNotifications: 'Сповіщення',
    notificationsNone: 'Вимкнено',
    notificationsDigestOnly: 'Лише звіт за тиждень',
    remindersOne: 'нагадування',
    remindersFew: 'нагадування',
    remindersMany: 'нагадувань',
    rowLanguage: 'Мова',
    navHistory: 'Історія',
    navStats: 'Статистика',
    navProfile: 'Профіль',
    navAriaLabel: 'Основна навігація',
    tierPremium: 'Premium',
    tierBasic: 'Базовий',
    tierActiveUntil: 'активний до',
    premiumBuy: 'Придбати Premium',
    premiumRenew: 'Продовжити Premium',
    premiumError: 'Не вдалося відкрити оплату. Спробуйте пізніше.',
    premiumBenefitsTitle: 'Що дає Premium',
    premiumBenefit1: 'Аналіз страв за фото та аудіо',
    premiumBenefit2: 'Потужніша й точніша AI-модель',
    premiumBenefit3: 'Точніше розпізнає страви',
    premiumBenefit4: 'Підрахунок БЖВ (білки/жири/вуглеводи)',
    goalDeficit: 'Мета: дефіцит',
    goalSurplus: 'Мета: профіцит',
    preferencesTitle: 'Уподобання',
    preferences: {
      more_protein: 'Білок',
      less_sugar: 'Цукор',
      more_veggies: 'Овочі',
      low_carb: 'Вуглеводи',
      more_water: 'Вода',
      less_fat: 'Жири'
    },
    normEdit: 'Змінити розрахунок',
    normCalc: 'Розрахувати норму',
    normEmpty: 'Норму ще не розраховано. Розрахуйте денну норму калорій.',
    loadError: 'Не вдалося завантажити профіль. Спробуйте пізніше.',
    unit: 'ккал/день',
    expend: 'денні витрати',
    kcal: 'ккал',
    weightTitle: 'Вага',
    weightUnit: 'кг',
    weightTrend: '{v} кг на тиждень',
    weightHint: 'Графік з’явиться після наступного виміру.',
    weightEmpty: 'Відмітьте вагу — тут з’явиться графік.',
    weightChartLabel: 'Графік ваги'
  },
  uz: {
    pageTitle: 'Profil',
    subtitleFallback: 'Profilingiz',
    statusLoading: 'Profil yuklanmoqda…',
    cardTier: 'Tarif',
    cardNorm: 'Meʼyor va maqsad',
    rowFollowing: 'Obunalarim',
    rowNotifications: 'Bildirishnomalar',
    notificationsNone: 'Oʻchirilgan',
    notificationsDigestOnly: 'Faqat haftalik hisobot',
    remindersOne: 'eslatma',
    remindersOther: 'eslatma',
    rowLanguage: 'Til',
    navHistory: 'Tarix',
    navStats: 'Statistika',
    navProfile: 'Profil',
    navAriaLabel: 'Asosiy navigatsiya',
    tierPremium: 'Premium',
    tierBasic: 'Asosiy',
    tierActiveUntil: 'Amal qilish muddati:',
    premiumBuy: 'Premium olish',
    premiumRenew: 'Premiumni uzaytirish',
    premiumError: 'Toʻlovni ochib boʻlmadi. Keyinroq urinib koʻring.',
    premiumBenefitsTitle: 'Premium nima beradi',
    premiumBenefit1: 'Taomlarni surat va audio orqali tahlil qilish',
    premiumBenefit2: 'Kuchliroq va aniqroq AI modeli',
    premiumBenefit3: 'Taomlarni aniqroq aniqlash',
    premiumBenefit4: 'OYU hisobi (oqsil/yogʻ/uglevod)',
    goalDeficit: 'Maqsad: tanqislik',
    goalSurplus: 'Maqsad: ortiqcha kaloriya',
    preferencesTitle: 'Ovqatlanish istaklari',
    preferences: {
      more_protein: 'Oqsil',
      less_sugar: 'Shakar',
      more_veggies: 'Sabzavotlar',
      low_carb: 'Uglevod',
      more_water: 'Suv',
      less_fat: 'Yogʻ'
    },
    normEdit: 'Hisobni oʻzgartirish',
    normCalc: 'Meʼyorni hisoblash',
    normEmpty: 'Meʼyor hali hisoblanmagan. Kunlik kaloriya meʼyorini hisoblang.',
    loadError: 'Profilni yuklab boʻlmadi. Keyinroq urinib koʻring.',
    unit: 'kkal/kun',
    expend: 'kunlik sarf',
    kcal: 'kkal',
    weightTitle: 'Vazn',
    weightUnit: 'kg',
    weightTrend: 'haftasiga {v} kg',
    weightHint: 'Grafik keyingi oʻlchovdan soʻng paydo boʻladi.',
    weightEmpty: 'Vazningizni kiriting — grafik shu yerda paydo boʻladi.',
    weightChartLabel: 'Vazn grafigi'
  }
};

const LANG_NAMES = {
  ru: 'Русский',
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
  fr: 'Français',
  uk: 'Українська',
  uz: 'Oʻzbekcha',
  tr: 'Türkçe',
  ar: 'العربية'
};

const INTL_LOCALES = {
  ru: 'ru-RU',
  en: 'en-US',
  ar: 'ar',
  de: 'de-DE',
  es: 'es-ES',
  fr: 'fr-FR',
  tr: 'tr-TR',
  uk: 'uk-UA',
  uz: 'uz-UZ'
};

// ── элементы ──────────────────────────────────────────────────────
const els = {
  subtitle: document.getElementById('profile-subtitle'),
  status: document.getElementById('profile-status'),
  body: document.getElementById('profile-body'),
  tierBadge: document.getElementById('tier-badge'),
  tierBadgeIcon: document.getElementById('tier-badge-icon'),
  tierBadgeText: document.getElementById('tier-badge-text'),
  tierMeta: document.getElementById('tier-meta'),
  tierExpires: document.getElementById('tier-expires'),
  premiumBenefits: document.getElementById('premium-benefits'),
  premiumCta: document.getElementById('premium-cta'),
  premiumCtaError: document.getElementById('premium-cta-error'),
  normValue: document.getElementById('norm-value'),
  normMeta: document.getElementById('norm-meta'),
  normTdee: document.getElementById('norm-tdee'),
  goalChip: document.getElementById('goal-chip'),
  prefsBlock: document.getElementById('prefs-block'),
  prefChips: document.getElementById('pref-chips'),
  normEmpty: document.getElementById('norm-empty'),
  normEditLink: document.getElementById('norm-edit-link'),
  normEditLabel: document.getElementById('norm-edit-label'),
  followingLink: document.getElementById('row-following'),
  notificationsLink: document.getElementById('row-notifications'),
  notificationsValue: document.getElementById('notifications-value'),
  languageValue: document.getElementById('language-value'),
  weightCard: document.getElementById('weight-card'),
  weightBody: document.getElementById('weight-body'),
  weightValue: document.getElementById('weight-value'),
  weightTrend: document.getElementById('weight-trend'),
  weightSpark: document.getElementById('weight-spark'),
  weightHint: document.getElementById('weight-hint')
};

const PREFERENCE_DEFS = [
  { key: 'more_protein', emoji: '🥩', dir: 'up' },
  { key: 'less_sugar', emoji: '🍬', dir: 'down' },
  { key: 'more_veggies', emoji: '🥗', dir: 'up' },
  { key: 'low_carb', emoji: '🌾', dir: 'down' },
  { key: 'more_water', emoji: '💧', dir: 'up' },
  { key: 'less_fat', emoji: '🧈', dir: 'down' }
];

const PREMIUM_STAR_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 7.7l5.4-.8z"/></svg>';

// ── утилиты ───────────────────────────────────────────────────────
function getInitDataString() {
  return tg?.initData || window.Telegram?.WebApp?.initData || '';
}

function intlLocale() {
  return INTL_LOCALES[resolveLocale()] || INTL_LOCALES.en;
}

function formatNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  return Math.round(n).toLocaleString(intlLocale());
}

function formatDate(iso) {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  try {
    return date.toLocaleDateString(intlLocale(), { day: 'numeric', month: 'long', year: 'numeric' });
  } catch (error) {
    return null;
  }
}

function languageName(locale) {
  if (!locale) return null;
  const code = String(locale).toLowerCase().split(/[-_]/)[0];
  return LANG_NAMES[code] || locale;
}

// Локаль из URL (?lang=) и из профиля (/api/profile.locale).
const urlLangParam = new URLSearchParams(window.location.search || '').get('lang');
let profileLocale = null;

// Нормализуем до 2-букв; неподдерживаемые языки → en.
function normalizeLocale(value) {
  if (!value) return null;
  const code = String(value).toLowerCase().split(/[-_]/)[0];
  if (!code) return null;
  return Object.prototype.hasOwnProperty.call(translations, code) ? code : 'en';
}

// Приоритет источников языка (как в остальных разделах):
//   ?lang= → /api/profile.locale → tg language_code → дефолт (en).
function resolveLocale() {
  return (
    normalizeLocale(urlLangParam) ||
    normalizeLocale(profileLocale) ||
    normalizeLocale(tg?.initDataUnsafe?.user?.language_code) ||
    'en'
  );
}

// Активный словарь — пересчитывается при каждом обращении к resolveLocale.
function t() {
  return translations[resolveLocale()] || translations.en;
}

function withLang(href) {
  const locale = resolveLocale();
  const url = new URL(href, window.location.href);
  url.searchParams.set('lang', locale);
  return url.pathname + url.search + url.hash;
}

function setSubtitle() {
  const user = tg?.initDataUnsafe?.user;
  const parts = [];
  if (user?.first_name) parts.push(user.first_name);
  if (user?.username) parts.push('@' + user.username);
  els.subtitle.textContent = parts.length ? parts.join(' · ') : t().subtitleFallback;
}

// ── рендер ────────────────────────────────────────────────────────
// Текущий тариф (из /api/profile.subscription.tier) — нужен, чтобы выбрать
// лейбл CTA «Купить»/«Продлить» и при смене языка перерисовать его.
let currentTier = null;

// Premium-тарифы: для них CTA — «Продлить». Всё прочее (BASIC/NEW_USER/неизвестно)
// → «Купить». Кнопку показываем ВСЕМ.
function isPremiumTier(tier) {
  return tier === 'PREMIUM' || tier === 'PREMIUM_TRIAL';
}

function renderPremiumCtaLabel() {
  if (!els.premiumCta) return;
  els.premiumCta.textContent = isPremiumTier(currentTier)
    ? t().premiumRenew
    : t().premiumBuy;
}

function renderTier(subscription) {
  const tier = subscription?.tier;
  currentTier = tier || null;
  renderPremiumCtaLabel();
  const isPremium = tier && tier !== 'BASIC';
  // Бенефиты — мотивация к покупке: показываем только не-premium (#613).
  if (els.premiumBenefits) els.premiumBenefits.hidden = isPremium;
  if (isPremium) {
    els.tierBadge.classList.remove('tier__badge--basic');
    els.tierBadgeIcon.innerHTML = PREMIUM_STAR_SVG;
    els.tierBadgeText.textContent = t().tierPremium;
    const until = formatDate(subscription?.expiresAt);
    if (until) {
      els.tierExpires.textContent = until;
      els.tierMeta.hidden = false;
    } else {
      els.tierMeta.hidden = true;
    }
  } else {
    els.tierBadge.classList.add('tier__badge--basic');
    els.tierBadgeIcon.innerHTML = '';
    els.tierBadgeText.textContent = t().tierBasic;
    els.tierMeta.hidden = true;
  }
}

function renderNorm(norm, goal) {
  const s = t();
  const tdeeValue = Number(norm?.tdee);
  const hasNorm = Number.isFinite(tdeeValue);
  const tdee = formatNumber(tdeeValue);

  if (hasNorm) {
    const isDeficit = goal?.type === 'deficit';
    const isSurplus = goal?.type === 'surplus';

    const targetValue = Number(norm?.target);
    const hasTarget = Number.isFinite(targetValue);
    const displayValue = hasTarget ? targetValue : tdeeValue;

    els.normValue.innerHTML = `${formatNumber(displayValue)} <span class="unit">${s.unit}</span>`;
    els.normTdee.textContent = `${tdee} ${s.kcal}`;
    // «дневной расход» показываем только когда цель реально сдвигает число (иначе target == tdee и это дубль).
    els.normMeta.hidden = !(hasTarget && targetValue !== tdeeValue);
    els.normEmpty.hidden = true;

    if ((isDeficit || isSurplus) && hasTarget && tdeeValue > 0) {
      const label = isDeficit ? s.goalDeficit : s.goalSurplus;
      const pct = Math.round((targetValue / tdeeValue - 1) * 100);
      if (pct === 0) {
        els.goalChip.textContent = label;
      } else {
        const sign = pct > 0 ? '+' : '−';
        els.goalChip.textContent = `${label} ${sign}${Math.abs(pct)}%`;
      }
      els.goalChip.hidden = false;
    } else {
      els.goalChip.hidden = true;
    }

    els.normEditLabel.textContent = s.normEdit;
    els.normEditLink.setAttribute('href', withLang('../bmr/index.html?mode=edit&source=profile'));
  } else {
    // Норма ещё не рассчитана — ведём на первичный расчёт.
    els.normValue.innerHTML = `— <span class="unit">${s.unit}</span>`;
    els.normMeta.hidden = true;
    els.goalChip.hidden = true;
    els.normEmpty.hidden = false;
    els.normEditLabel.textContent = s.normCalc;
    els.normEditLink.setAttribute('href', withLang('../bmr/?source=profile'));
  }
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function normalizeWeight(raw) {
  const points = (Array.isArray(raw?.points) ? raw.points : [])
    .map((p) => ({ time: Date.parse(p?.date), kg: p?.weightKg }))
    .filter((p) => Number.isFinite(p.time) && isFiniteNumber(p.kg))
    .sort((a, b) => a.time - b.time);
  return {
    points,
    currentKg: isFiniteNumber(raw?.currentKg) ? raw.currentKg : points[points.length - 1]?.kg,
    kgPerWeek: isFiniteNumber(raw?.kgPerWeek) ? raw.kgPerWeek : null
  };
}

function formatKg(value) {
  return Number(value).toLocaleString(intlLocale(), { maximumFractionDigits: 2 });
}

function formatSignedKg(value) {
  const abs = formatKg(Math.abs(value));
  let text = abs;
  if (value > 0) text = '+' + abs;
  else if (value < 0) text = '−' + abs;
  return resolveLocale() === 'ar' ? '⁦' + text + '⁩' : text;
}

function svgNode(name, attrs) {
  const node = document.createElementNS(SVG_NS, name);
  Object.keys(attrs).forEach((key) => node.setAttribute(key, attrs[key]));
  return node;
}

function buildWeightSpark(points, width) {
  const height = WEIGHT_SPARK_HEIGHT;
  const top = 5;
  const bottom = height - 5;
  const left = 5;
  const right = width - 5;
  const values = points.map((p) => p.kg);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = max > min ? (max - min) * 0.1 : 1;
  const yMin = min - pad;
  const yMax = max + pad;
  const t0 = points[0].time;
  const t1 = points[points.length - 1].time;
  const coords = points.map((p) => [
    left + ((p.time - t0) / (t1 - t0)) * (right - left),
    top + ((yMax - p.kg) / (yMax - yMin)) * (bottom - top)
  ]);
  const line = coords.map((c, i) => `${i ? 'L' : 'M'}${c[0].toFixed(1)} ${c[1].toFixed(1)}`).join(' ');
  const area = `${line} L${coords[coords.length - 1][0].toFixed(1)} ${height} L${coords[0][0].toFixed(1)} ${height} Z`;
  const svg = svgNode('svg', {
    viewBox: `0 0 ${width} ${height}`,
    width: String(width),
    height: String(height),
    role: 'img',
    'aria-label': t().weightChartLabel
  });
  svg.appendChild(svgNode('path', { class: 'weight-spark__area', d: area }));
  svg.appendChild(svgNode('path', { class: 'weight-spark__line', d: line }));
  const last = coords[coords.length - 1];
  svg.appendChild(svgNode('circle', { class: 'weight-spark__dot', cx: last[0].toFixed(1), cy: last[1].toFixed(1), r: 4 }));
  return svg;
}

function renderWeight(raw, hasNorm) {
  const s = t();
  const data = raw ? normalizeWeight(raw) : null;
  if (!data || (!data.points.length && !hasNorm)) {
    els.weightCard.hidden = true;
    return;
  }
  els.weightCard.setAttribute(
    'href',
    withLang(hasNorm ? `../bmr/index.html?mode=edit&source=${WEIGHT_SOURCE}` : `../bmr/?source=${WEIGHT_SOURCE}`)
  );
  els.weightCard.hidden = false;
  els.weightSpark.textContent = '';

  if (!data.points.length) {
    els.weightBody.hidden = true;
    els.weightHint.textContent = s.weightEmpty;
    els.weightHint.hidden = false;
    return;
  }

  els.weightBody.hidden = false;
  els.weightValue.textContent = formatKg(data.currentKg);
  const trendText = data.kgPerWeek != null ? s.weightTrend.replace('{v}', formatSignedKg(data.kgPerWeek)) : '';
  els.weightTrend.textContent = trendText;
  els.weightTrend.hidden = !trendText;

  const hasChart = data.points.length >= 2;
  els.weightSpark.hidden = !hasChart;
  els.weightHint.textContent = hasChart ? '' : s.weightHint;
  els.weightHint.hidden = hasChart;
  if (hasChart) {
    const width = Math.max(Math.round(els.weightSpark.clientWidth) || 140, 80);
    els.weightSpark.appendChild(buildWeightSpark(data.points, width));
  }
}

function loadWeight() {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  return fetch(`${API_BASE_URL}/api/weight`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    mode: 'cors',
    body: JSON.stringify({ initData: getInitDataString() }),
    signal: controller.signal
  })
    .then((response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.json();
    })
    .catch((error) => {
      console.warn('Failed to load weight', error);
      return null;
    })
    .finally(() => window.clearTimeout(timeout));
}

function renderPreferences(preferences) {
  if (!els.prefsBlock || !els.prefChips) return;
  const allowed = Array.isArray(preferences)
    ? PREFERENCE_DEFS.filter((def) => preferences.includes(def.key))
    : [];

  els.prefChips.innerHTML = '';
  if (!allowed.length) {
    els.prefsBlock.hidden = true;
    return;
  }

  const labels = t().preferences || {};
  allowed.forEach((def) => {
    const chip = document.createElement('span');
    chip.className = 'pref-chip';

    const emoji = document.createElement('span');
    emoji.className = 'pref-chip__emoji';
    emoji.textContent = def.emoji;

    const label = document.createElement('span');
    label.textContent = (labels[def.key] || def.key) + (def.dir === 'down' ? ' ↓' : ' ↑');

    chip.append(emoji, label);
    els.prefChips.appendChild(chip);
  });
  els.prefsBlock.hidden = false;
}

// Сводка для строки «Уведомления»: сколько слотов напоминаний настроено.
// Когда слотов нет — показываем состояние еженедельного отчёта, чтобы строка
// не выглядела пустой у тех, кто напоминаниями не пользуется.
function notificationsSummary(profile) {
  const s = t();
  // Выключенный мастер-тумблер гасит слоты целиком — считаем их нулём.
  const remindersOn = profile?.remindersEnabled !== false;
  const count = remindersOn && Array.isArray(profile?.reminders) ? profile.reminders.length : 0;
  if (count > 0) return count + ' ' + pluralReminders(count);
  return profile?.weeklyDigestEnabled === false ? s.notificationsNone : s.notificationsDigestOnly;
}

function pluralReminders(count) {
  const s = t();
  const category = new Intl.PluralRules(intlLocale()).select(count);
  const keyByCategory = {
    one: 'remindersOne',
    two: 'remindersTwo',
    few: 'remindersFew',
    many: 'remindersMany',
    other: 'remindersOther'
  };
  return s[keyByCategory[category]] || s.remindersOther || s.remindersMany || s.remindersFew;
}

function renderNotifications(profile) {
  if (!els.notificationsValue) return;
  els.notificationsValue.textContent = notificationsSummary(profile);
  els.notificationsLink?.setAttribute('href', withLang('notifications/index.html'));
}

function renderFollowing(profile) {
  if (!els.followingLink) return;
  els.followingLink.hidden = !(profile?.followsEnabled === true || profile?.hasFollows === true);
  els.followingLink.setAttribute('href', withLang('../following/index.html?src=profile'));
}

function renderMisc(locale) {
  els.languageValue.textContent = languageName(locale) || '—';
}

// Статичные лейблы (RU отрисован в HTML до JS) — свапаем на язык пользователя.
// data-i18n помечает узел, текст которого нужно заменить по ключу словаря.
function applyStaticI18n() {
  const s = t();
  document.documentElement.lang = resolveLocale();
  document.documentElement.dir = resolveLocale() === 'ar' ? 'rtl' : 'ltr';
  document.title = s.pageTitle;
  document.querySelector('.bottom-nav')?.setAttribute('aria-label', s.navAriaLabel);
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.getAttribute('data-i18n');
    if (key && Object.prototype.hasOwnProperty.call(s, key)) {
      node.textContent = s[key];
    }
  });
  // CTA Premium не помечена data-i18n (лейбл зависит от тарифа) — обновляем отдельно.
  renderPremiumCtaLabel();
}

// Пробрасываем текущий ?lang= на все ссылки нижней навигации, чтобы язык
// сохранялся при переходах между разделами.
function applyNavLang() {
  ['nav-history', 'nav-stats', 'nav-profile'].forEach((id) => {
    const link = document.getElementById(id);
    if (!link) return;
    const url = new URL(link.getAttribute('href'), window.location.href);
    url.searchParams.set('lang', resolveLocale());
    link.setAttribute('href', url.pathname + url.search + url.hash);
  });
}

// Переходы по нижней навигации делаем через location.replace, чтобы webview не
// копил историю вкладок → системный «назад» на верхнем уровне закрывает мини-апп.
// Контентные ссылки (напр. «Изменить расчёт» → ../bmr/?mode=edit) НЕ трогаем —
// они остаются обычным push, чтобы «назад» из BMR-edit вёл сюда через BackButton.
// Вызывается один раз при загрузке (applyNavLang может перерисовывать href).
function setupNavClickInterception() {
  ['nav-history', 'nav-stats', 'nav-profile'].forEach((id) => {
    const link = document.getElementById(id);
    if (!link) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.replace(link.getAttribute('href'));
    });
  });
}

// ── CTA покупки Premium ───────────────────────────────────────────
// По клику: POST /api/premium {initData} → бот сам пришлёт оффер в чат →
// при успехе закрываем мини-апп (tg.close()). При ошибке/таймауте —
// разблокируем кнопку и показываем мягкое сообщение, НЕ закрываем.
function setupPremiumCta() {
  const btn = els.premiumCta;
  if (!btn) return;

  btn.addEventListener('click', async () => {
    if (btn.disabled) return; // защита от повторных кликов
    const label = btn.textContent;
    btn.disabled = true;
    btn.textContent = '…';
    if (els.premiumCtaError) els.premiumCtaError.hidden = true;

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${API_BASE_URL}/api/premium`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify({ initData: getInitDataString() }),
        signal: controller.signal
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      // Успех — бот пришлёт оффер в чат, мини-апп закрываем.
      tg?.close();
    } catch (error) {
      console.error('Failed to open premium checkout', error);
      btn.disabled = false;
      btn.textContent = label;
      if (els.premiumCtaError) {
        els.premiumCtaError.textContent = t().premiumError;
        els.premiumCtaError.hidden = false;
      }
    } finally {
      window.clearTimeout(timeout);
    }
  });
}

function render(profile) {
  profileLocale = profile?.locale || null;
  // Локаль могла уточниться из профиля (когда ?lang= нет) — перерисуем статику.
  applyStaticI18n();
  applyNavLang();
  renderTier(profile?.subscription);
  renderNorm(profile?.norm, profile?.goal);
  renderPreferences(profile?.preferences);
  renderNotifications(profile);
  renderFollowing(profile);
  renderMisc(profile?.locale);
  els.status.hidden = true;
  els.body.hidden = false;
  const hasNorm = Number.isFinite(Number(profile?.norm?.tdee));
  weightRequest.then((raw) => renderWeight(raw, hasNorm));
  // Событие оставляем для возможных модулей-карточек Профиля: полный профиль +
  // резолвнутая локаль, чтобы карточка переводилась тем же языком.
  document.dispatchEvent(
    new CustomEvent('profile:loaded', {
      detail: { profile, locale: resolveLocale() }
    })
  );
}

function showError() {
  els.status.textContent = t().loadError;
  els.status.hidden = false;
  els.body.hidden = true;
}

// ── загрузка ──────────────────────────────────────────────────────
async function loadProfile() {
  const initData = getInitDataString();
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify({ initData }),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const profile = await response.json();
    render(profile);
  } catch (error) {
    console.error('Failed to load profile', error);
    showError();
  } finally {
    window.clearTimeout(timeout);
  }
}

// На верхнеуровневой вкладке прячем Telegram BackButton, чтобы работало нативное
// закрытие мини-аппа по «назад».
if (tg?.BackButton) {
  try { tg.BackButton.hide(); } catch (_) { /* noop */ }
}

applyStaticI18n();
applyNavLang();
setupNavClickInterception();
setupPremiumCta();
setSubtitle();
weightRequest = loadWeight();
loadProfile();
