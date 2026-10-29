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

const translations = {
  ru: {
    pageTitle: 'Подписки',
    subtitleWatching: 'Итоги дня твоих подписок',
    subtitleSharing: 'Кто видит твои итоги дня',
    tabWatching: 'Подписки',
    tabSharing: 'Подписчики',
    loading: 'Загружаем…',
    loadError: 'Не удалось загрузить. Попробуй позже.',
    retry: 'Повторить',
    sectionStale: 'Давно не записывали',
    sectionToday: 'Сегодня',
    daysOne: 'день без записей',
    daysFew: 'дня без записей',
    daysMany: 'дней без записей',
    noLogsEver: 'Записей ещё не было',
    noLogsToday: 'Сегодня записей пока нет',
    ofKcal: '{cal} из {norm} ккал',
    kcalOnly: '{cal} ккал',
    normMissing: 'норма не рассчитана',
    streakShort: 'серия {n} дн.',
    overNorm: '+{n} к норме',
    emptyTitle: 'Пока нет подписок',
    emptyText: 'Подпишись на итоги дня друга или клиента: калории и БЖУ против нормы, пропуски, серии.',
    step1: 'Отправь ссылку тому, на кого хочешь подписаться',
    step2: 'В боте останется нажать «Разрешить»',
    step3: 'Итоги появятся здесь, а по понедельникам придёт сводка',
    invite: 'Пригласить по ссылке',
    inviteText: 'Чтобы подписаться ещё на кого-то, отправь ссылку. Как только подписку разрешат, придёт уведомление.',
    copyLink: 'Скопировать ссылку',
    resetLink: 'Сбросить ссылку',
    resetConfirm: 'Сбросить ссылку? Старая перестанет работать, текущие подписки останутся.',
    shareText: '👋 Открой ссылку и разреши подписку на итоги твоего дня: видны только калории и БЖУ против нормы, без блюд и фото.',
    shareProgress: '📤 Поделиться прогрессом',
    shareProgressText: '👀 Смотри мой прогресс: открой ссылку, и тебе будут видны итоги моего дня — калории и БЖУ против нормы. Блюда и фото не видны.',
    linkCopied: 'Ссылка скопирована',
    linkReset: 'Новая ссылка готова, старая больше не работает',
    linkError: 'Не удалось получить ссылку. Попробуй позже.',
    linksDisabled: 'Приглашения сейчас недоступны.',
    linksOffText: 'Приглашения по ссылке сейчас отключены. Когда их включат, здесь можно будет пригласить по ссылке.',
    sinceDate: 'Подписчик с {date}',
    close: 'Удалить',
    closeConfirm: 'Удалить подписчика {name}? Подписаться снова по ссылке не получится.',
    closeError: 'Не удалось удалить подписчика. Попробуй позже.',
    sharingEmpty: 'Пока нет подписчиков',
    whatSeen: 'Что видно',
    seen1: 'Калории и БЖУ за день против твоей нормы',
    seen2: 'Были ли записи за день и серию дней',
    whatHidden: 'Что не видно',
    hidden1: 'Блюда, фото и переписку с ботом',
    hidden2: 'Вес и данные анкеты',
    sharingNote: 'Удалить подписчика можно в любой момент. Уведомления об этом не будет.',
    dayTitle: 'Итог дня',
    weekTitle: '7 дней',
    weekCount: 'записи {n} из 7 дней',
    legendNorm: 'норма',
    legendNone: 'нет записей',
    dayLogged: 'есть записи',
    daysAria: 'Дни',
    dayNote: 'Видны только итоги дня: калории и БЖУ. Блюда, фото и вес не видны.',
    macroProtein: 'Белки',
    macroFat: 'Жиры',
    macroCarbs: 'Углеводы',
    macroShortProtein: 'Б',
    macroShortFat: 'Ж',
    macroShortCarbs: 'У',
    gramsUnit: 'г',
    unfollow: 'Отписаться',
    unfollowConfirm: 'Отписаться от пользователя {name}?',
    unfollowError: 'Не удалось отписаться. Попробуй позже.',
    streakLong: 'Серия {n} дн.',
    today: 'Сегодня',
    ofNormKcal: 'из {norm} ккал',
    kcal: 'ккал',
    toNorm: 'До нормы {n} ккал',
    overNormLong: '+{n} ккал к норме',
    normMissingLong: 'Норма не рассчитана',
    noEntriesDay: 'Записей нет',
    noAccessTitle: 'Итоги недоступны',
    noAccessText: 'Итоги этого пользователя сейчас недоступны.',
    toList: 'К подпискам',
    navHistory: 'История',
    navStats: 'Статистика',
    navProfile: 'Профиль',
    navAriaLabel: 'Основная навигация'
  },
  en: {
    pageTitle: 'Following',
    subtitleWatching: 'Daily summaries from people you follow',
    subtitleSharing: 'Who can see your daily summaries',
    tabWatching: 'Following',
    tabSharing: 'Followers',
    loading: 'Loading…',
    loadError: "Couldn't load. Please try again later.",
    retry: 'Retry',
    sectionStale: 'Haven’t logged in a while',
    sectionToday: 'Today',
    daysOne: 'day without entries',
    daysFew: 'days without entries',
    daysMany: 'days without entries',
    noLogsEver: 'No entries yet',
    noLogsToday: 'No entries today yet',
    ofKcal: '{cal} of {norm} kcal',
    kcalOnly: '{cal} kcal',
    normMissing: 'norm not calculated',
    streakShort: '{n}-day streak',
    overNorm: '+{n} over norm',
    emptyTitle: 'Not following anyone yet',
    emptyText: 'Follow a friend’s or client’s daily summaries: calories and macros vs. norm, gaps, streaks.',
    step1: 'Send your link to someone you want to follow',
    step2: 'They just tap “Allow” in the bot',
    step3: 'Summaries will show up here, and a digest arrives on Mondays',
    invite: 'Invite by link',
    inviteText: 'To follow someone else, send your link. You\'ll get a notification once they allow it.',
    copyLink: 'Copy link',
    resetLink: 'Reset link',
    resetConfirm: 'Reset the link? The old one will stop working; current follows stay.',
    shareText: '👋 Open the link and allow following your daily summaries: only calories and macros vs. norm are visible, no dishes or photos.',
    shareProgress: '📤 Share progress',
    shareProgressText: '👀 See my progress: open the link to see my daily totals — calories and macros vs. target. Dishes and photos stay hidden.',
    linkCopied: 'Link copied',
    linkReset: 'New link is ready, the old one no longer works',
    linkError: "Couldn't get the link. Please try again later.",
    linksDisabled: 'Invitations are unavailable right now.',
    linksOffText: 'Invitations by link are turned off right now. Once they are back, you can invite by link here.',
    sinceDate: 'Follower since {date}',
    close: 'Remove',
    closeConfirm: 'Remove follower {name}? They won’t be able to follow again with a new link.',
    closeError: "Couldn't remove the follower. Please try again later.",
    sharingEmpty: 'No followers yet',
    whatSeen: 'What they see',
    seen1: 'Calories and macros for the day vs. your norm',
    seen2: 'Whether you logged that day, and your streak',
    whatHidden: 'What they don’t see',
    hidden1: 'Dishes, photos and your chat with the bot',
    hidden2: 'Weight and questionnaire data',
    sharingNote: 'You can remove a follower any time. They won’t be notified.',
    dayTitle: 'Day total',
    weekTitle: '7 days',
    weekCount: 'logged {n} of 7 days',
    legendNorm: 'norm',
    legendNone: 'no entries',
    dayLogged: 'has entries',
    daysAria: 'Days',
    dayNote: 'Only the day’s totals are visible: calories and macros. Dishes, photos and weight are not visible.',
    macroProtein: 'Protein',
    macroFat: 'Fat',
    macroCarbs: 'Carbs',
    macroShortProtein: 'P',
    macroShortFat: 'F',
    macroShortCarbs: 'C',
    gramsUnit: 'g',
    unfollow: 'Unfollow',
    unfollowConfirm: 'Unfollow user {name}?',
    unfollowError: "Couldn't unfollow. Please try again later.",
    streakLong: '{n}-day streak',
    today: 'Today',
    ofNormKcal: 'of {norm} kcal',
    kcal: 'kcal',
    toNorm: '{n} kcal to norm',
    overNormLong: '+{n} kcal over norm',
    normMissingLong: 'Norm not calculated',
    noEntriesDay: 'No entries',
    noAccessTitle: 'Summaries unavailable',
    noAccessText: 'This user’s summaries are unavailable right now.',
    toList: 'Back to following',
    navHistory: 'History',
    navStats: 'Stats',
    navProfile: 'Profile',
    navAriaLabel: 'Main navigation'
  },
  ar: {
    pageTitle: 'من أتابعهم',
    subtitleWatching: 'ملخصات يوم من تتابعهم',
    subtitleSharing: 'من يرى ملخصات يومك',
    tabWatching: 'من أتابعهم',
    tabSharing: 'المتابِعون',
    loading: 'جارٍ التحميل…',
    loadError: 'تعذّر التحميل. حاول لاحقًا.',
    retry: 'إعادة المحاولة',
    sectionStale: 'لم يسجّلوا منذ مدة',
    sectionToday: 'اليوم',
    daysOne: 'يوم بلا تسجيلات',
    daysTwo: 'يومًا بلا تسجيلات',
    daysFew: 'أيام بلا تسجيلات',
    daysMany: 'يومًا بلا تسجيلات',
    daysOther: 'يوم بلا تسجيلات',
    noLogsEver: 'لا توجد تسجيلات بعد',
    noLogsToday: 'لا توجد تسجيلات اليوم بعد',
    ofKcal: '{cal} من {norm} سعرة حرارية',
    kcalOnly: '{cal} سعرة حرارية',
    normMissing: 'لم تُحسب السعرات المعيارية',
    streakShort: 'سلسلة {n} يوم',
    overNorm: '+{n} فوق المعيار',
    emptyTitle: 'لا تتابع أحدًا بعد',
    emptyText: 'تابع ملخصات يوم صديق أو عميل: السعرات والمغذيات الكبرى مقارنة بالمعيار، والأيام الفائتة، وسلاسل الأيام.',
    step1: 'أرسل الرابط إلى من تريد متابعته',
    step2: 'لن يبقى في البوت سوى الضغط على «سماح»',
    step3: 'ستظهر الملخصات هنا، وكل يوم اثنين يصلك ملخص',
    invite: 'دعوة عبر رابط',
    inviteText: 'لمتابعة شخص آخر، أرسل الرابط. سيصلك إشعار فور السماح بالمتابعة.',
    copyLink: 'نسخ الرابط',
    resetLink: 'إعادة تعيين الرابط',
    resetConfirm: 'إعادة تعيين الرابط؟ سيتوقف الرابط القديم عن العمل، وتبقى المتابعات الحالية.',
    shareText: '👋 افتح الرابط واسمح بمتابعة ملخصات يومك: يظهر فقط السعرات والمغذيات الكبرى مقارنة بالمعيار، دون أطباق أو صور.',
    shareProgress: '📤 شارك تقدّمك',
    shareProgressText: '👀 شاهد تقدّمي: افتح الرابط وسترى ملخص يومي — السعرات والمغذيات الكبرى مقارنة بالهدف. الأطباق والصور تبقى مخفية.',
    linkCopied: 'تم نسخ الرابط',
    linkReset: 'الرابط الجديد جاهز، والقديم لم يعد يعمل',
    linkError: 'تعذّر الحصول على الرابط. حاول لاحقًا.',
    linksDisabled: 'الدعوات غير متاحة حاليًا.',
    linksOffText: 'الدعوات عبر الرابط متوقفة حاليًا. عند تفعيلها ستتمكن من الدعوة عبر رابط هنا.',
    sinceDate: 'متابِع منذ {date}',
    close: 'إزالة',
    closeConfirm: 'إزالة المتابِع {name}؟ لن يتمكن من المتابعة مجددًا عبر الرابط.',
    closeError: 'تعذّرت إزالة المتابِع. حاول لاحقًا.',
    sharingEmpty: 'لا يوجد متابِعون بعد',
    whatSeen: 'ما يظهر',
    seen1: 'السعرات والمغذيات الكبرى لليوم مقارنة بمعيارك',
    seen2: 'هل سجّلت في اليوم، وسلسلة أيامك',
    whatHidden: 'ما لا يظهر',
    hidden1: 'الأطباق والصور ومحادثتك مع البوت',
    hidden2: 'الوزن وبيانات الاستبيان',
    sharingNote: 'يمكنك إزالة المتابِع في أي وقت. لن يصله أي إشعار.',
    dayTitle: 'حصيلة اليوم',
    weekTitle: '7 أيام',
    weekCount: 'تسجيلات في {n} من 7 أيام',
    legendNorm: 'المعيار',
    legendNone: 'بلا تسجيلات',
    dayLogged: 'توجد تسجيلات',
    daysAria: 'الأيام',
    dayNote: 'تظهر حصيلة اليوم فقط: السعرات والمغذيات الكبرى. لا تظهر الأطباق والصور والوزن.',
    macroProtein: 'البروتين',
    macroFat: 'الدهون',
    macroCarbs: 'الكربوهيدرات',
    macroShortProtein: 'ب',
    macroShortFat: 'د',
    macroShortCarbs: 'ك',
    gramsUnit: 'غ',
    unfollow: 'إلغاء المتابعة',
    unfollowConfirm: 'إلغاء متابعة {name}؟',
    unfollowError: 'تعذّر إلغاء المتابعة. حاول لاحقًا.',
    streakLong: 'سلسلة {n} يوم',
    today: 'اليوم',
    ofNormKcal: 'من {norm} سعرة حرارية',
    kcal: 'سعرة حرارية',
    toNorm: 'متبقٍّ {n} سعرة حرارية للمعيار',
    overNormLong: '+{n} سعرة حرارية فوق المعيار',
    normMissingLong: 'لم تُحسب السعرات المعيارية',
    noEntriesDay: 'لا توجد تسجيلات',
    noAccessTitle: 'الملخصات غير متاحة',
    noAccessText: 'ملخصات هذا المستخدم غير متاحة حاليًا.',
    toList: 'إلى من أتابعهم',
    navHistory: 'السجل',
    navStats: 'الإحصاءات',
    navProfile: 'الملف الشخصي',
    navAriaLabel: 'التنقل الرئيسي'
  },
  de: {
    pageTitle: 'Wem ich folge',
    subtitleWatching: 'Tagesbilanzen der Personen, denen du folgst',
    subtitleSharing: 'Wer deine Tagesbilanz sieht',
    tabWatching: 'Ich folge',
    tabSharing: 'Follower',
    loading: 'Wird geladen…',
    loadError: 'Laden fehlgeschlagen. Versuche es später erneut.',
    retry: 'Erneut versuchen',
    sectionStale: 'Lange nichts eingetragen',
    sectionToday: 'Heute',
    daysOne: 'Tag ohne Einträge',
    daysOther: 'Tage ohne Einträge',
    noLogsEver: 'Noch keine Einträge',
    noLogsToday: 'Heute noch keine Einträge',
    ofKcal: '{cal} von {norm} kcal',
    kcalOnly: '{cal} kcal',
    normMissing: 'Norm nicht berechnet',
    streakShort: 'Serie: {n} T.',
    overNorm: '+{n} über der Norm',
    emptyTitle: 'Du folgst noch niemandem',
    emptyText: 'Folge der Tagesbilanz von Freunden oder Kunden: Kalorien und Makros im Vergleich zur Norm, Lücken, Serien.',
    step1: 'Schick deinen Link an die Person, der du folgen möchtest',
    step2: 'Im Bot muss sie nur noch „Erlauben“ tippen',
    step3: 'Die Bilanzen erscheinen hier, und montags kommt eine Übersicht',
    invite: 'Per Link einladen',
    inviteText: 'Um jemand anderem zu folgen, schick den Link. Sobald die Person zustimmt, bekommst du eine Benachrichtigung.',
    copyLink: 'Link kopieren',
    resetLink: 'Link zurücksetzen',
    resetConfirm: 'Link zurücksetzen? Der alte funktioniert nicht mehr, bestehende Follows bleiben.',
    shareText: '👋 Öffne den Link und erlaube das Folgen deiner Tagesbilanz: Sichtbar sind nur Kalorien und Makros im Vergleich zur Norm, keine Gerichte oder Fotos.',
    shareProgress: '📤 Fortschritt teilen',
    shareProgressText: '👀 Sieh meinen Fortschritt: Öffne den Link, dann siehst du meine Tagesbilanz — Kalorien und Makros im Vergleich zum Ziel. Gerichte und Fotos bleiben verborgen.',
    linkCopied: 'Link kopiert',
    linkReset: 'Neuer Link ist bereit, der alte funktioniert nicht mehr',
    linkError: 'Link konnte nicht abgerufen werden. Versuche es später erneut.',
    linksDisabled: 'Einladungen sind gerade nicht verfügbar.',
    linksOffText: 'Einladungen per Link sind gerade deaktiviert. Sobald sie wieder verfügbar sind, kannst du hier per Link einladen.',
    sinceDate: 'Follower seit {date}',
    close: 'Entfernen',
    closeConfirm: 'Follower {name} entfernen? Mit dem Link kann er dir nicht erneut folgen.',
    closeError: 'Follower konnte nicht entfernt werden. Versuche es später erneut.',
    sharingEmpty: 'Noch keine Follower',
    whatSeen: 'Was sichtbar ist',
    seen1: 'Kalorien und Makros des Tages im Vergleich zu deiner Norm',
    seen2: 'Ob du an dem Tag Einträge hattest, und deine Serie',
    whatHidden: 'Was nicht sichtbar ist',
    hidden1: 'Gerichte, Fotos und dein Chat mit dem Bot',
    hidden2: 'Gewicht und Angaben aus dem Fragebogen',
    sharingNote: 'Du kannst Follower jederzeit entfernen. Sie werden nicht benachrichtigt.',
    dayTitle: 'Tagesbilanz',
    weekTitle: '7 Tage',
    weekCount: 'Einträge an {n} von 7 Tagen',
    legendNorm: 'Norm',
    legendNone: 'keine Einträge',
    dayLogged: 'mit Einträgen',
    daysAria: 'Tage',
    dayNote: 'Sichtbar ist nur die Tagesbilanz: Kalorien und Makros. Gerichte, Fotos und Gewicht sind nicht sichtbar.',
    macroProtein: 'Eiweiß',
    macroFat: 'Fett',
    macroCarbs: 'Kohlenhydrate',
    macroShortProtein: 'E',
    macroShortFat: 'F',
    macroShortCarbs: 'KH',
    gramsUnit: 'g',
    unfollow: 'Nicht mehr folgen',
    unfollowConfirm: 'Nutzer {name} nicht mehr folgen?',
    unfollowError: 'Entfolgen fehlgeschlagen. Versuche es später erneut.',
    streakLong: 'Serie: {n} T.',
    today: 'Heute',
    ofNormKcal: 'von {norm} kcal',
    kcal: 'kcal',
    toNorm: 'Noch {n} kcal bis zur Norm',
    overNormLong: '+{n} kcal über der Norm',
    normMissingLong: 'Norm nicht berechnet',
    noEntriesDay: 'Keine Einträge',
    noAccessTitle: 'Bilanzen nicht verfügbar',
    noAccessText: 'Die Bilanzen dieses Nutzers sind gerade nicht verfügbar.',
    toList: 'Zurück zu „Wem ich folge“',
    navHistory: 'Verlauf',
    navStats: 'Statistik',
    navProfile: 'Profil',
    navAriaLabel: 'Hauptnavigation'
  },
  es: {
    pageTitle: 'Siguiendo',
    subtitleWatching: 'Resúmenes del día de las personas a las que sigues',
    subtitleSharing: 'Quién ve los resúmenes de tu día',
    tabWatching: 'Siguiendo',
    tabSharing: 'Seguidores',
    loading: 'Cargando…',
    loadError: 'No se pudo cargar. Inténtalo más tarde.',
    retry: 'Reintentar',
    sectionStale: 'Hace tiempo que no registran',
    sectionToday: 'Hoy',
    daysOne: 'día sin registros',
    daysOther: 'días sin registros',
    noLogsEver: 'Aún no hay registros',
    noLogsToday: 'Hoy aún no hay registros',
    ofKcal: '{cal} de {norm} kcal',
    kcalOnly: '{cal} kcal',
    normMissing: 'norma sin calcular',
    streakShort: 'racha de {n} d',
    overNorm: '+{n} sobre la norma',
    emptyTitle: 'Aún no sigues a nadie',
    emptyText: 'Sigue el resumen del día de un amigo o cliente: calorías y macros frente a la norma, días sin registros, rachas.',
    step1: 'Envía tu enlace a quien quieras seguir',
    step2: 'En el bot solo tendrá que pulsar «Permitir»',
    step3: 'Los resúmenes aparecerán aquí, y los lunes llegará un resumen semanal',
    invite: 'Invitar por enlace',
    inviteText: 'Para seguir a alguien más, envía el enlace. Recibirás un aviso cuando permitan el seguimiento.',
    copyLink: 'Copiar enlace',
    resetLink: 'Restablecer enlace',
    resetConfirm: '¿Restablecer el enlace? El anterior dejará de funcionar; los seguimientos actuales se mantienen.',
    shareText: '👋 Abre el enlace y permite seguir el resumen de tu día: solo se ven las calorías y los macros frente a la norma, sin platos ni fotos.',
    shareProgress: '📤 Compartir progreso',
    shareProgressText: '👀 Mira mi progreso: abre el enlace y verás el resumen de mi día — calorías y macros frente al objetivo. Platos y fotos quedan ocultos.',
    linkCopied: 'Enlace copiado',
    linkReset: 'El enlace nuevo está listo; el anterior ya no funciona',
    linkError: 'No se pudo obtener el enlace. Inténtalo más tarde.',
    linksDisabled: 'Las invitaciones no están disponibles ahora mismo.',
    linksOffText: 'Las invitaciones por enlace están desactivadas ahora mismo. Cuando vuelvan, podrás invitar por enlace aquí.',
    sinceDate: 'Seguidor desde el {date}',
    close: 'Eliminar',
    closeConfirm: '¿Eliminar al seguidor {name}? No podrá volver a seguirte con el enlace.',
    closeError: 'No se pudo eliminar al seguidor. Inténtalo más tarde.',
    sharingEmpty: 'Aún no hay seguidores',
    whatSeen: 'Qué se ve',
    seen1: 'Calorías y macros del día frente a tu norma',
    seen2: 'Si hubo registros ese día y tu racha',
    whatHidden: 'Qué no se ve',
    hidden1: 'Platos, fotos y tu conversación con el bot',
    hidden2: 'Peso y datos del cuestionario',
    sharingNote: 'Puedes eliminar a un seguidor en cualquier momento. No recibirá ningún aviso.',
    dayTitle: 'Resumen del día',
    weekTitle: '7 días',
    weekCount: 'registros en {n} de 7 días',
    legendNorm: 'norma',
    legendNone: 'sin registros',
    dayLogged: 'hay registros',
    daysAria: 'Días',
    dayNote: 'Solo se ve el resumen del día: calorías y macros. No se ven platos, fotos ni peso.',
    macroProtein: 'Proteínas',
    macroFat: 'Grasas',
    macroCarbs: 'Carbohidratos',
    macroShortProtein: 'P',
    macroShortFat: 'G',
    macroShortCarbs: 'C',
    gramsUnit: 'g',
    unfollow: 'Dejar de seguir',
    unfollowConfirm: '¿Dejar de seguir a {name}?',
    unfollowError: 'No se pudo dejar de seguir. Inténtalo más tarde.',
    streakLong: 'Racha de {n} d',
    today: 'Hoy',
    ofNormKcal: 'de {norm} kcal',
    kcal: 'kcal',
    toNorm: 'Faltan {n} kcal para la norma',
    overNormLong: '+{n} kcal sobre la norma',
    normMissingLong: 'Norma sin calcular',
    noEntriesDay: 'Sin registros',
    noAccessTitle: 'Resúmenes no disponibles',
    noAccessText: 'Los resúmenes de este usuario no están disponibles ahora mismo.',
    toList: 'Volver a Siguiendo',
    navHistory: 'Historial',
    navStats: 'Estadísticas',
    navProfile: 'Perfil',
    navAriaLabel: 'Navegación principal'
  },
  fr: {
    pageTitle: 'Mes abonnements',
    subtitleWatching: 'Les bilans du jour des personnes que tu suis',
    subtitleSharing: 'Qui voit tes bilans du jour',
    tabWatching: 'Abonnements',
    tabSharing: 'Abonnés',
    loading: 'Chargement…',
    loadError: 'Échec du chargement. Réessaie plus tard.',
    retry: 'Réessayer',
    sectionStale: 'Pas de saisie depuis longtemps',
    sectionToday: 'Aujourd’hui',
    daysOne: 'jour sans saisie',
    daysOther: 'jours sans saisie',
    noLogsEver: 'Aucune saisie pour l’instant',
    noLogsToday: 'Aucune saisie aujourd’hui pour l’instant',
    ofKcal: '{cal} sur {norm} kcal',
    kcalOnly: '{cal} kcal',
    normMissing: 'norme non calculée',
    streakShort: 'série de {n} j',
    overNorm: '+{n} au-dessus de la norme',
    emptyTitle: 'Tu ne suis personne pour l’instant',
    emptyText: 'Abonne-toi au bilan du jour d’un ami ou d’un client : calories et macros par rapport à la norme, jours sans saisie, séries.',
    step1: 'Envoie ton lien à la personne que tu veux suivre',
    step2: 'Dans le bot, il lui suffira d’appuyer sur « Autoriser »',
    step3: 'Les bilans apparaîtront ici, et un récapitulatif arrivera le lundi',
    invite: 'Inviter par lien',
    inviteText: 'Pour suivre quelqu’un d’autre, envoie ton lien. Tu recevras une notification dès que l’abonnement sera autorisé.',
    copyLink: 'Copier le lien',
    resetLink: 'Réinitialiser le lien',
    resetConfirm: 'Réinitialiser le lien ? L’ancien ne fonctionnera plus, les abonnements actuels restent.',
    shareText: '👋 Ouvre le lien et autorise l’abonnement à ton bilan du jour : seules les calories et les macros par rapport à la norme sont visibles, sans plats ni photos.',
    shareProgress: '📤 Partager ma progression',
    shareProgressText: '👀 Vois mes progrès : ouvre le lien pour voir mon bilan du jour — calories et macros par rapport à l\'objectif. Les plats et les photos restent cachés.',
    linkCopied: 'Lien copié',
    linkReset: 'Le nouveau lien est prêt, l’ancien ne fonctionne plus',
    linkError: 'Impossible d’obtenir le lien. Réessaie plus tard.',
    linksDisabled: 'Les invitations sont indisponibles pour le moment.',
    linksOffText: 'Les invitations par lien sont désactivées pour le moment. Quand elles reviendront, tu pourras inviter par lien ici.',
    sinceDate: 'Abonné depuis le {date}',
    close: 'Retirer',
    closeConfirm: 'Retirer l’abonné {name} ? Il ne pourra pas se réabonner avec le lien.',
    closeError: 'Impossible de retirer l’abonné. Réessaie plus tard.',
    sharingEmpty: 'Pas encore d’abonnés',
    whatSeen: 'Ce qui est visible',
    seen1: 'Les calories et les macros du jour par rapport à ta norme',
    seen2: 'S’il y a eu des saisies ce jour-là, et ta série',
    whatHidden: 'Ce qui n’est pas visible',
    hidden1: 'Les plats, les photos et ta conversation avec le bot',
    hidden2: 'Le poids et les données du questionnaire',
    sharingNote: 'Tu peux retirer un abonné à tout moment. Il ne sera pas prévenu.',
    dayTitle: 'Bilan du jour',
    weekTitle: '7 jours',
    weekCount: 'saisies sur {n} jours sur 7',
    legendNorm: 'norme',
    legendNone: 'aucune saisie',
    dayLogged: 'avec saisies',
    daysAria: 'Jours',
    dayNote: 'Seul le bilan du jour est visible : calories et macros. Les plats, les photos et le poids ne le sont pas.',
    macroProtein: 'Protéines',
    macroFat: 'Lipides',
    macroCarbs: 'Glucides',
    macroShortProtein: 'P',
    macroShortFat: 'L',
    macroShortCarbs: 'G',
    gramsUnit: 'g',
    unfollow: 'Se désabonner',
    unfollowConfirm: 'Se désabonner de {name} ?',
    unfollowError: 'Impossible de se désabonner. Réessaie plus tard.',
    streakLong: 'Série de {n} j',
    today: 'Aujourd’hui',
    ofNormKcal: 'sur {norm} kcal',
    kcal: 'kcal',
    toNorm: 'Encore {n} kcal pour atteindre la norme',
    overNormLong: '+{n} kcal au-dessus de la norme',
    normMissingLong: 'Norme non calculée',
    noEntriesDay: 'Aucune saisie',
    noAccessTitle: 'Bilans indisponibles',
    noAccessText: 'Les bilans de cet utilisateur sont indisponibles pour le moment.',
    toList: 'Retour aux abonnements',
    navHistory: 'Historique',
    navStats: 'Statistiques',
    navProfile: 'Profil',
    navAriaLabel: 'Navigation principale'
  },
  tr: {
    pageTitle: 'Takip ettiklerim',
    subtitleWatching: 'Takip ettiklerinin günlük özetleri',
    subtitleSharing: 'Günlük özetlerini kimler görüyor',
    tabWatching: 'Takip',
    tabSharing: 'Takipçiler',
    loading: 'Yükleniyor…',
    loadError: 'Yüklenemedi. Daha sonra tekrar dene.',
    retry: 'Tekrar dene',
    sectionStale: 'Uzun süredir kayıt girmeyenler',
    sectionToday: 'Bugün',
    daysOne: 'gün kayıtsız',
    daysOther: 'gün kayıtsız',
    noLogsEver: 'Henüz kayıt yok',
    noLogsToday: 'Bugün henüz kayıt yok',
    ofKcal: '{cal} / {norm} kcal',
    kcalOnly: '{cal} kcal',
    normMissing: 'norm hesaplanmadı',
    streakShort: '{n} günlük seri',
    overNorm: 'normun {n} üstünde',
    emptyTitle: 'Henüz kimseyi takip etmiyorsun',
    emptyText: 'Bir arkadaşının veya danışanının günlük özetini takip et: norma göre kalori ve makrolar, boş günler, seriler.',
    step1: 'Takip etmek istediğin kişiye bağlantını gönder',
    step2: 'Botta yalnızca “İzin ver” düğmesine dokunması yeterli',
    step3: 'Özetler burada görünür, pazartesi günleri de bir özet gelir',
    invite: 'Bağlantıyla davet et',
    inviteText: 'Başka birini takip etmek için bağlantını gönder. Takibe izin verildiğinde bildirim alırsın.',
    copyLink: 'Bağlantıyı kopyala',
    resetLink: 'Bağlantıyı sıfırla',
    resetConfirm: 'Bağlantı sıfırlansın mı? Eski bağlantı çalışmayacak, mevcut takipler kalacak.',
    shareText: '👋 Bağlantıyı aç ve günlük özetimi takip etmeye izin ver: yalnızca norma göre kalori ve makrolar görünür, yemekler ve fotoğraflar görünmez.',
    shareProgress: '📤 İlerlemeyi paylaş',
    shareProgressText: '👀 İlerlememi gör: bağlantıyı aç, günlük özetimi göreceksin — hedefe göre kalori ve makrolar. Yemekler ve fotoğraflar gizli kalır.',
    linkCopied: 'Bağlantı kopyalandı',
    linkReset: 'Yeni bağlantı hazır, eskisi artık çalışmıyor',
    linkError: 'Bağlantı alınamadı. Daha sonra tekrar dene.',
    linksDisabled: 'Davetler şu anda kullanılamıyor.',
    linksOffText: 'Bağlantıyla davetler şu anda kapalı. Tekrar açıldığında burada bağlantıyla davet edebileceksin.',
    sinceDate: '{date} tarihinden beri takipçi',
    close: 'Kaldır',
    closeConfirm: '{name} takipçisi kaldırılsın mı? Bağlantıyla tekrar takip edemez.',
    closeError: 'Takipçi kaldırılamadı. Daha sonra tekrar dene.',
    sharingEmpty: 'Henüz takipçi yok',
    whatSeen: 'Görünenler',
    seen1: 'Günün kalorisi ve makroları, normuna göre',
    seen2: 'O gün kayıt girilip girilmediği ve serin',
    whatHidden: 'Görünmeyenler',
    hidden1: 'Yemekler, fotoğraflar ve botla yazışman',
    hidden2: 'Kilo ve anket verileri',
    sharingNote: 'Takipçiyi istediğin zaman kaldırabilirsin. Bildirim gitmez.',
    dayTitle: 'Günün özeti',
    weekTitle: '7 gün',
    weekCount: '7 günün {n} gününde kayıt var',
    legendNorm: 'norm',
    legendNone: 'kayıt yok',
    dayLogged: 'kayıt var',
    daysAria: 'Günler',
    dayNote: 'Yalnızca günün özeti görünür: kalori ve makrolar. Yemekler, fotoğraflar ve kilo görünmez.',
    macroProtein: 'Protein',
    macroFat: 'Yağ',
    macroCarbs: 'Karbonhidrat',
    macroShortProtein: 'P',
    macroShortFat: 'Y',
    macroShortCarbs: 'K',
    gramsUnit: 'g',
    unfollow: 'Takibi bırak',
    unfollowConfirm: '{name} takibi bırakılsın mı?',
    unfollowError: 'Takip bırakılamadı. Daha sonra tekrar dene.',
    streakLong: '{n} günlük seri',
    today: 'Bugün',
    ofNormKcal: '/ {norm} kcal',
    kcal: 'kcal',
    toNorm: 'Norma {n} kcal kaldı',
    overNormLong: 'Normun {n} kcal üstünde',
    normMissingLong: 'Norm hesaplanmadı',
    noEntriesDay: 'Kayıt yok',
    noAccessTitle: 'Özetler kullanılamıyor',
    noAccessText: 'Bu kullanıcının özetleri şu anda kullanılamıyor.',
    toList: 'Takip ettiklerime dön',
    navHistory: 'Geçmiş',
    navStats: 'İstatistikler',
    navProfile: 'Profil',
    navAriaLabel: 'Ana gezinme'
  },
  uk: {
    pageTitle: 'Підписки',
    subtitleWatching: 'Підсумки дня тих, на кого ти підписаний',
    subtitleSharing: 'Хто бачить твої підсумки дня',
    tabWatching: 'Підписки',
    tabSharing: 'Підписники',
    loading: 'Завантажуємо…',
    loadError: 'Не вдалося завантажити. Спробуй пізніше.',
    retry: 'Повторити',
    sectionStale: 'Давно не робили записів',
    sectionToday: 'Сьогодні',
    daysOne: 'день без записів',
    daysFew: 'дні без записів',
    daysMany: 'днів без записів',
    noLogsEver: 'Записів ще не було',
    noLogsToday: 'Сьогодні записів поки немає',
    ofKcal: '{cal} із {norm} ккал',
    kcalOnly: '{cal} ккал',
    normMissing: 'норму не розраховано',
    streakShort: 'серія {n} дн.',
    overNorm: '+{n} до норми',
    emptyTitle: 'Поки немає підписок',
    emptyText: 'Підпишись на підсумки дня друга чи клієнта: калорії та БЖВ проти норми, пропуски, серії.',
    step1: 'Надішли посилання тому, на кого хочеш підписатися',
    step2: 'У боті залишиться натиснути «Дозволити»',
    step3: 'Підсумки з’являться тут, а в понеділок прийде зведення',
    invite: 'Запросити за посиланням',
    inviteText: 'Щоб підписатися ще на когось, надішли посилання. Щойно підписку дозволять, прийде сповіщення.',
    copyLink: 'Скопіювати посилання',
    resetLink: 'Скинути посилання',
    resetConfirm: 'Скинути посилання? Старе перестане працювати, поточні підписки залишаться.',
    shareText: '👋 Відкрий посилання й дозволь підписку на підсумки мого дня: видно лише калорії та БЖВ проти норми, без страв і фото.',
    shareProgress: '📤 Поділитися прогресом',
    shareProgressText: '👀 Дивись мій прогрес: відкрий посилання, і тобі буде видно підсумки мого дня — калорії та БЖВ проти норми. Страви й фото не видно.',
    linkCopied: 'Посилання скопійовано',
    linkReset: 'Нове посилання готове, старе більше не працює',
    linkError: 'Не вдалося отримати посилання. Спробуй пізніше.',
    linksDisabled: 'Запрошення зараз недоступні.',
    linksOffText: 'Запрошення за посиланням зараз вимкнені. Коли їх увімкнуть, тут можна буде запросити за посиланням.',
    sinceDate: 'Підписник від {date}',
    close: 'Видалити',
    closeConfirm: 'Видалити підписника {name}? Підписатися знову за посиланням не вийде.',
    closeError: 'Не вдалося видалити підписника. Спробуй пізніше.',
    sharingEmpty: 'Поки немає підписників',
    whatSeen: 'Що видно',
    seen1: 'Калорії та БЖВ за день проти твоєї норми',
    seen2: 'Чи були записи за день і серія днів',
    whatHidden: 'Що не видно',
    hidden1: 'Страви, фото й листування з ботом',
    hidden2: 'Вага та дані анкети',
    sharingNote: 'Видалити підписника можна будь-коли. Сповіщення про це не буде.',
    dayTitle: 'Підсумок дня',
    weekTitle: '7 днів',
    weekCount: 'записи у {n} із 7 днів',
    legendNorm: 'норма',
    legendNone: 'немає записів',
    dayLogged: 'є записи',
    daysAria: 'Дні',
    dayNote: 'Видно лише підсумки дня: калорії та БЖВ. Страви, фото й вага не видні.',
    macroProtein: 'Білки',
    macroFat: 'Жири',
    macroCarbs: 'Вуглеводи',
    macroShortProtein: 'Б',
    macroShortFat: 'Ж',
    macroShortCarbs: 'В',
    gramsUnit: 'г',
    unfollow: 'Відписатися',
    unfollowConfirm: 'Відписатися від користувача {name}?',
    unfollowError: 'Не вдалося відписатися. Спробуй пізніше.',
    streakLong: 'Серія {n} дн.',
    today: 'Сьогодні',
    ofNormKcal: 'із {norm} ккал',
    kcal: 'ккал',
    toNorm: 'До норми {n} ккал',
    overNormLong: '+{n} ккал до норми',
    normMissingLong: 'Норму не розраховано',
    noEntriesDay: 'Записів немає',
    noAccessTitle: 'Підсумки недоступні',
    noAccessText: 'Підсумки цього користувача зараз недоступні.',
    toList: 'До підписок',
    navHistory: 'Історія',
    navStats: 'Статистика',
    navProfile: 'Профіль',
    navAriaLabel: 'Основна навігація'
  },
  uz: {
    pageTitle: 'Obunalarim',
    subtitleWatching: 'Obuna boʻlganlaringizning kun yakunlari',
    subtitleSharing: 'Kun yakunlaringizni kim koʻradi',
    tabWatching: 'Obunalar',
    tabSharing: 'Obunachilar',
    loading: 'Yuklanmoqda…',
    loadError: 'Yuklab boʻlmadi. Keyinroq urinib koʻring.',
    retry: 'Qayta urinish',
    sectionStale: 'Anchadan beri yozuv yoʻq',
    sectionToday: 'Bugun',
    daysOne: 'kun yozuvsiz',
    daysOther: 'kun yozuvsiz',
    noLogsEver: 'Hali yozuvlar yoʻq',
    noLogsToday: 'Bugun hali yozuv yoʻq',
    ofKcal: '{cal} / {norm} kkal',
    kcalOnly: '{cal} kkal',
    normMissing: 'meʼyor hisoblanmagan',
    streakShort: '{n} kunlik seriya',
    overNorm: 'meʼyordan +{n}',
    emptyTitle: 'Hali hech kimga obuna emassiz',
    emptyText: 'Doʻst yoki mijozingizning kun yakunlariga obuna boʻling: meʼyorga nisbatan kaloriya va OYU, oʻtkazib yuborilgan kunlar, seriyalar.',
    step1: 'Obuna boʻlmoqchi boʻlgan odamga havolani yuboring',
    step2: 'Botda unga faqat «Ruxsat berish» tugmasini bosish qoladi',
    step3: 'Yakunlar shu yerda paydo boʻladi, dushanba kunlari esa xulosa keladi',
    invite: 'Havola orqali taklif qilish',
    inviteText: 'Yana kimgadir obuna boʻlish uchun havolani yuboring. Obunaga ruxsat berilishi bilan xabar keladi.',
    copyLink: 'Havolani nusxalash',
    resetLink: 'Havolani yangilash',
    resetConfirm: 'Havola yangilansinmi? Eskisi ishlamay qoladi, joriy obunalar saqlanadi.',
    shareText: '👋 Havolani oching va mening kun yakunlarimga obunaga ruxsat bering: faqat meʼyorga nisbatan kaloriya va OYU koʻrinadi, taomlar va rasmlar koʻrinmaydi.',
    shareProgress: '📤 Natijani ulashish',
    shareProgressText: '👀 Mening natijamni koʻr: havolani och va kun yakunimni koʻrasan — me\'yorga nisbatan kaloriya va OYU. Taomlar va rasmlar koʻrinmaydi.',
    linkCopied: 'Havola nusxalandi',
    linkReset: 'Yangi havola tayyor, eskisi endi ishlamaydi',
    linkError: 'Havolani olib boʻlmadi. Keyinroq urinib koʻring.',
    linksDisabled: 'Takliflar hozir mavjud emas.',
    linksOffText: 'Havola orqali takliflar hozir oʻchirilgan. Yoqilganda shu yerda havola orqali taklif qilish mumkin boʻladi.',
    sinceDate: '{date} dan beri obunachi',
    close: 'Oʻchirish',
    closeConfirm: '{name} obunachini oʻchirasizmi? U havola orqali qayta obuna boʻla olmaydi.',
    closeError: 'Obunachini oʻchirib boʻlmadi. Keyinroq urinib koʻring.',
    sharingEmpty: 'Hali obunachilar yoʻq',
    whatSeen: 'Nimalar koʻrinadi',
    seen1: 'Kun davomidagi kaloriya va OYU, meʼyoringizga nisbatan',
    seen2: 'Kunda yozuvlar boʻlgan-boʻlmagani va kunlar seriyasi',
    whatHidden: 'Nimalar koʻrinmaydi',
    hidden1: 'Taomlar, rasmlar va bot bilan yozishmalar',
    hidden2: 'Vazn va anketa maʼlumotlari',
    sharingNote: 'Obunachini istalgan vaqtda oʻchirish mumkin. Bu haqda xabar yuborilmaydi.',
    dayTitle: 'Kun yakuni',
    weekTitle: '7 kun',
    weekCount: '7 kunning {n} tasida yozuv bor',
    legendNorm: 'meʼyor',
    legendNone: 'yozuv yoʻq',
    dayLogged: 'yozuvlar bor',
    daysAria: 'Kunlar',
    dayNote: 'Faqat kun yakunlari koʻrinadi: kaloriya va OYU. Taomlar, rasmlar va vazn koʻrinmaydi.',
    macroProtein: 'Oqsil',
    macroFat: 'Yogʻ',
    macroCarbs: 'Uglevod',
    macroShortProtein: 'O',
    macroShortFat: 'Y',
    macroShortCarbs: 'U',
    gramsUnit: 'g',
    unfollow: 'Obunani bekor qilish',
    unfollowConfirm: '{name} foydalanuvchiga obunani bekor qilasizmi?',
    unfollowError: 'Obunani bekor qilib boʻlmadi. Keyinroq urinib koʻring.',
    streakLong: '{n} kunlik seriya',
    today: 'Bugun',
    ofNormKcal: '/ {norm} kkal',
    kcal: 'kkal',
    toNorm: 'Meʼyorgacha {n} kkal',
    overNormLong: 'Meʼyordan +{n} kkal',
    normMissingLong: 'Meʼyor hisoblanmagan',
    noEntriesDay: 'Yozuvlar yoʻq',
    noAccessTitle: 'Yakunlar mavjud emas',
    noAccessText: 'Bu foydalanuvchining yakunlari hozir mavjud emas.',
    toList: 'Obunalarga qaytish',
    navHistory: 'Tarix',
    navStats: 'Statistika',
    navProfile: 'Profil',
    navAriaLabel: 'Asosiy navigatsiya'
  }
};

const els = {
  viewList: document.getElementById('view-list'),
  viewDay: document.getElementById('view-day'),
  viewNoAccess: document.getElementById('view-noaccess'),
  listSubtitle: document.getElementById('list-subtitle'),
  tabWatching: document.getElementById('tab-watching'),
  tabSharing: document.getElementById('tab-sharing'),
  paneWatching: document.getElementById('pane-watching'),
  paneSharing: document.getElementById('pane-sharing'),
  watchingStatus: document.getElementById('watching-status'),
  watchingBody: document.getElementById('watching-body'),
  sharingStatus: document.getElementById('sharing-status'),
  sharingBody: document.getElementById('sharing-body'),
  shareProgressBtn: document.getElementById('share-progress-btn'),
  viewers: document.getElementById('viewers'),
  viewersEmpty: document.getElementById('viewers-empty'),
  dayAvatar: document.getElementById('day-avatar'),
  dayName: document.getElementById('day-name'),
  dayMeta: document.getElementById('day-meta'),
  dayStrip: document.getElementById('day-strip'),
  dayStatus: document.getElementById('day-status'),
  dayBody: document.getElementById('day-body'),
  dayTotal: document.getElementById('day-total'),
  dayTotalNorm: document.getElementById('day-total-norm'),
  dayBar: document.getElementById('day-bar'),
  dayBarFill: document.getElementById('day-bar-fill'),
  dayHint: document.getElementById('day-hint'),
  dayMacros: document.getElementById('day-macros'),
  dayMacrosDivider: document.getElementById('day-macros-divider'),
  weekCount: document.getElementById('week-count'),
  week: document.getElementById('week'),
  legendNorm: document.getElementById('legend-norm'),
  unfollowBtn: document.getElementById('unfollow-btn'),
  noAccessBack: document.getElementById('noaccess-back'),
  toast: document.getElementById('toast')
};

const urlParams = new URLSearchParams(window.location.search || '');
const urlLangParam = urlParams.get('lang');
let profileLocale = null;

function normalizeLocale(value) {
  if (!value) return null;
  const code = String(value).toLowerCase().split(/[-_]/)[0];
  if (!code) return null;
  return Object.prototype.hasOwnProperty.call(translations, code) ? code : 'en';
}

function resolveLocale() {
  return (
    normalizeLocale(urlLangParam) ||
    normalizeLocale(profileLocale) ||
    normalizeLocale(tg?.initDataUnsafe?.user?.language_code) ||
    'en'
  );
}

function t() {
  return translations[resolveLocale()] || translations.en;
}

function fmt(template, vars) {
  return String(template).replace(/\{(\w+)\}/g, (_, key) => (vars && vars[key] !== undefined ? vars[key] : ''));
}

function withLang(href) {
  const url = new URL(href, window.location.href);
  url.searchParams.set('lang', resolveLocale());
  return url.pathname + url.search + url.hash;
}

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

function intlLocale() {
  return INTL_LOCALES[resolveLocale()] || INTL_LOCALES.en;
}

function formatNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0';
  return Math.round(n).toLocaleString(intlLocale());
}

function parseIsoDate(iso) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]), 12, 0, 0);
}

function toIsoDate(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function addDays(iso, delta) {
  const date = parseIsoDate(iso);
  if (!date) return iso;
  date.setDate(date.getDate() + delta);
  return toIsoDate(date);
}

function formatDayMonth(iso) {
  const date = parseIsoDate(iso);
  if (!date) return '';
  try {
    return date.toLocaleDateString(intlLocale(), { day: 'numeric', month: 'long' });
  } catch (error) {
    return iso;
  }
}

function weekdayShort(iso) {
  const date = parseIsoDate(iso);
  if (!date) return '';
  try {
    const label = date.toLocaleDateString(intlLocale(), { weekday: 'short' });
    return label.charAt(0).toUpperCase() + label.slice(1);
  } catch (error) {
    return '';
  }
}

function pluralDaysWithoutLogs(count) {
  const s = t();
  const category = new Intl.PluralRules(intlLocale()).select(count);
  const keyByCategory = {
    one: 'daysOne',
    two: 'daysTwo',
    few: 'daysFew',
    many: 'daysMany',
    other: 'daysOther'
  };
  return s[keyByCategory[category]] || s.daysOther || s.daysMany || s.daysFew || s.daysOne;
}

function getInitDataString() {
  return tg?.initData || window.Telegram?.WebApp?.initData || '';
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined && text !== null) node.textContent = text;
  return node;
}

function chevron() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'prow__chev');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('aria-hidden', 'true');
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M9.3 6.3a1 1 0 0 1 1.4 0l4.8 4.8a1 1 0 0 1 0 1.4l-4.8 4.8a1 1 0 1 1-1.4-1.4l4.1-4.1-4.1-4.1a1 1 0 0 1 0-1.4z');
  svg.appendChild(path);
  return svg;
}

function initialOf(name) {
  const trimmed = String(name || '').trim();
  return trimmed ? Array.from(trimmed)[0].toUpperCase() : '?';
}

function nameLine(person) {
  const line = el('div', 'prow__name');
  line.setAttribute('dir', 'auto');
  line.appendChild(el('bdi', null, person.name || ''));
  if (person.username) {
    const user = el('span', 'prow__user', ' ');
    user.appendChild(el('bdi', null, '@' + person.username));
    line.appendChild(user);
  }
  return line;
}

function avatarNode(name, className) {
  const node = el('div', className, initialOf(name));
  node.setAttribute('aria-hidden', 'true');
  return node;
}

function hasNormValue(value) {
  const n = Number(value);
  return value !== null && value !== undefined && Number.isFinite(n) && n > 0;
}

const MACRO_KEYS = [
  { key: 'protein', short: 'macroShortProtein', long: 'macroProtein' },
  { key: 'fat', short: 'macroShortFat', long: 'macroFat' },
  { key: 'carbs', short: 'macroShortCarbs', long: 'macroCarbs' }
];

function macroNorm(norms, key) {
  const value = norms ? norms[key] : null;
  return hasNormValue(value) ? Number(value) : null;
}

function macroFill(value, norm) {
  return Math.min(100, Math.round(((Number(value) || 0) / norm) * 100));
}

function macrosLine(macros, norms) {
  const s = t();
  const parts = MACRO_KEYS.map(({ key, short }) => {
    const norm = macroNorm(norms, key);
    const value = formatNumber(macros[key]);
    return norm === null ? `${s[short]} ${value}` : `${s[short]} ${value}/${formatNumber(norm)}`;
  });
  return `${parts.join(' · ')} ${s.gramsUnit}`;
}

async function postJson(path, body) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      mode: 'cors',
      body: JSON.stringify(Object.assign({ initData: getInitDataString() }, body || {})),
      signal: controller.signal
    });
    let data = null;
    try {
      data = await response.json();
    } catch (error) {
      data = null;
    }
    return { ok: response.ok, status: response.status, data };
  } finally {
    window.clearTimeout(timeout);
  }
}

let toastTimer = null;
function showToast(message) {
  els.toast.textContent = message;
  els.toast.hidden = false;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    els.toast.hidden = true;
  }, 2500);
}

function confirmAction(message) {
  return new Promise((resolve) => {
    if (tg && typeof tg.showConfirm === 'function') {
      try {
        tg.showConfirm(message, (result) => resolve(Boolean(result)));
        return;
      } catch (error) {
        /* noop */
      }
    }
    resolve(window.confirm(message));
  });
}

const inFlight = new Set();

async function runExclusive(key, task) {
  if (inFlight.has(key)) return;
  inFlight.add(key);
  try {
    await task();
  } finally {
    inFlight.delete(key);
  }
}

const state = {
  tab: 'watching',
  view: 'list',
  people: null,
  viewers: null,
  linksEnabled: false,
  shareLinksAvailable: false,
  inviteUrl: null,
  currentPerson: null,
  currentDay: null,
  knownDays: {},
  dayRequestId: 0,
  dayLoading: false,
  requestedDate: null
};

function setView(view) {
  state.view = view;
  els.viewList.hidden = view !== 'list';
  els.viewDay.hidden = view !== 'day';
  els.viewNoAccess.hidden = view !== 'noaccess';
  document.body.classList.toggle('in-detail', view !== 'list');
  window.scrollTo(0, 0);
}

function applyStaticI18n() {
  const s = t();
  document.documentElement.lang = resolveLocale();
  document.documentElement.dir = resolveLocale() === 'ar' ? 'rtl' : 'ltr';
  document.title = s.pageTitle;
  document.querySelector('.bottom-nav')?.setAttribute('aria-label', s.navAriaLabel);
  els.dayStrip.setAttribute('aria-label', s.daysAria);
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.getAttribute('data-i18n');
    if (node.dataset.state === 'error') return;
    if (key && Object.prototype.hasOwnProperty.call(s, key)) {
      node.textContent = s[key];
    }
  });
}

function applyNavLang() {
  ['nav-history', 'nav-stats', 'nav-profile'].forEach((id) => {
    const link = document.getElementById(id);
    if (!link) return;
    const url = new URL(link.getAttribute('href'), window.location.href);
    url.searchParams.set('lang', resolveLocale());
    link.setAttribute('href', url.pathname + url.search + url.hash);
  });
}

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

function tabLabel(base, count) {
  return count > 0 ? `${base} · ${count}` : base;
}

function renderTabs() {
  const s = t();
  const isWatching = state.tab === 'watching';
  els.tabWatching.textContent = tabLabel(s.tabWatching, state.people ? state.people.length : 0);
  els.tabSharing.textContent = tabLabel(s.tabSharing, state.viewers ? state.viewers.length : 0);
  els.tabWatching.classList.toggle('tabs__item--active', isWatching);
  els.tabSharing.classList.toggle('tabs__item--active', !isWatching);
  els.tabWatching.setAttribute('aria-selected', String(isWatching));
  els.tabSharing.setAttribute('aria-selected', String(!isWatching));
  els.tabWatching.tabIndex = isWatching ? 0 : -1;
  els.tabSharing.tabIndex = isWatching ? -1 : 0;
  els.paneWatching.hidden = !isWatching;
  els.paneSharing.hidden = isWatching;
  els.listSubtitle.textContent = isWatching ? s.subtitleWatching : s.subtitleSharing;
}

function selectTab(tab) {
  state.tab = tab === 'sharing' ? 'sharing' : 'watching';
  renderTabs();
}

function showStatusWithRetry(statusEl, bodyEl, onRetry) {
  statusEl.dataset.state = 'error';
  statusEl.retryHandler = onRetry;
  statusEl.textContent = '';
  statusEl.appendChild(document.createTextNode(t().loadError));
  const retry = el('button', 'btn-secondary', t().retry);
  retry.type = 'button';
  retry.addEventListener('click', onRetry);
  statusEl.appendChild(retry);
  statusEl.hidden = false;
  if (bodyEl) bodyEl.hidden = true;
}

function showLoading(statusEl, bodyEl) {
  statusEl.dataset.state = 'loading';
  statusEl.retryHandler = null;
  statusEl.textContent = t().loading;
  statusEl.hidden = false;
  if (bodyEl) bodyEl.hidden = true;
}

function hideStatus(statusEl) {
  statusEl.hidden = true;
  statusEl.dataset.state = '';
  statusEl.retryHandler = null;
}

function refreshStatuses() {
  [els.watchingStatus, els.sharingStatus, els.dayStatus].forEach((statusEl) => {
    if (statusEl.hidden) return;
    if (statusEl.dataset.state === 'error' && statusEl.retryHandler) {
      showStatusWithRetry(statusEl, null, statusEl.retryHandler);
    } else if (statusEl.dataset.state === 'loading') {
      statusEl.textContent = t().loading;
    }
  });
}

function personMeta(person) {
  const s = t();
  const parts = [];
  const streak = Number(person.streakDays) > 0 ? fmt(s.streakShort, { n: person.streakDays }) : null;
  const hasNorm = hasNormValue(person.normCalories);
  const norm = Number(person.normCalories);
  const cal = Number(person.todayCalories) || 0;

  if (Number(person.daysWithoutLogs) > 0) {
    const n = Number(person.daysWithoutLogs);
    return `${n} ${pluralDaysWithoutLogs(n)}`;
  }
  if (!person.loggedToday) {
    parts.push(person.lastLogDate ? s.noLogsToday : s.noLogsEver);
    if (streak) parts.push(streak);
    return parts.join(' · ');
  }
  if (hasNorm) {
    parts.push(fmt(s.ofKcal, { cal: formatNumber(cal), norm: formatNumber(norm) }));
    if (cal > norm) {
      parts.push(fmt(s.overNorm, { n: formatNumber(cal - norm) }));
    } else if (streak) {
      parts.push(streak);
    }
  } else {
    parts.push(fmt(s.kcalOnly, { cal: formatNumber(cal) }));
    parts.push(s.normMissing);
  }
  return parts.join(' · ');
}

function personRow(person) {
  const hasNorm = hasNormValue(person.normCalories);
  const norm = Number(person.normCalories);
  const stale = Number(person.daysWithoutLogs) > 0;
  const showBar = !stale && person.loggedToday && hasNorm;

  const row = el('button', 'prow');
  row.type = 'button';
  row.appendChild(avatarNode(person.name, stale || !person.loggedToday ? 'avatar avatar--muted' : 'avatar'));

  const info = el('div', 'prow__info');
  info.appendChild(nameLine(person));
  info.appendChild(el('div', 'prow__meta', personMeta(person)));
  if (person.todayMacros) {
    info.appendChild(el('div', 'prow__meta', macrosLine(person.todayMacros, person.normMacros)));
  }
  if (showBar) {
    const bar = el('div', 'bar');
    const fill = el('div', 'bar__fill');
    fill.style.width = Math.min(100, Math.round(((Number(person.todayCalories) || 0) / norm) * 100)) + '%';
    bar.appendChild(fill);
    info.appendChild(bar);
  }
  row.appendChild(info);
  row.appendChild(chevron());
  row.addEventListener('click', () => openPerson(person));
  return row;
}

function personsSection(title, people) {
  const section = el('section', 'card card--flush');
  section.appendChild(el('h2', 'card__title card__title--pad', title));
  people.forEach((person) => section.appendChild(personRow(person)));
  return section;
}

function buildStep(number, text) {
  const step = el('div', 'step');
  step.appendChild(el('span', 'step__num', String(number)));
  step.appendChild(el('span', null, text));
  return step;
}

function actionButton(label, className, handler) {
  const button = el('button', className, label);
  button.type = 'button';
  button.addEventListener('click', () => handler(button));
  return button;
}

function buildEmptyCard() {
  const s = t();
  const card = el('section', 'card');
  const icon = el('div', 'empty-icon');
  icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>';
  card.appendChild(icon);
  const head = el('div');
  head.appendChild(el('h2', 'card__headline', s.emptyTitle));
  head.appendChild(el('p', 'card__text', s.emptyText));
  card.appendChild(head);
  if (state.linksEnabled) {
    card.appendChild(buildStep(1, s.step1));
    card.appendChild(buildStep(2, s.step2));
    card.appendChild(buildStep(3, s.step3));
    card.appendChild(actionButton(s.invite, 'btn-primary', shareInvite));
    card.appendChild(actionButton(s.copyLink, 'btn-secondary', copyInvite));
  } else {
    card.appendChild(el('p', 'card__text', s.linksOffText));
  }
  return card;
}

function buildInviteCard() {
  const s = t();
  const card = el('section', 'card');
  card.appendChild(el('p', 'card__text', s.inviteText));
  card.appendChild(actionButton(s.invite, 'btn-primary', shareInvite));
  const row = el('div', 'btn-row');
  row.appendChild(actionButton(s.copyLink, 'btn-secondary', copyInvite));
  row.appendChild(actionButton(s.resetLink, 'btn-secondary', resetInvite));
  card.appendChild(row);
  return card;
}

function renderWatching() {
  const people = state.people || [];
  els.watchingBody.textContent = '';
  if (!people.length) {
    els.watchingBody.appendChild(buildEmptyCard());
  } else {
    const s = t();
    const stale = people.filter((p) => Number(p.daysWithoutLogs) > 0);
    const rest = people.filter((p) => !(Number(p.daysWithoutLogs) > 0));
    if (stale.length) els.watchingBody.appendChild(personsSection(s.sectionStale, stale));
    if (rest.length) els.watchingBody.appendChild(personsSection(s.sectionToday, rest));
    if (state.linksEnabled) els.watchingBody.appendChild(buildInviteCard());
  }
  hideStatus(els.watchingStatus);
  els.watchingBody.hidden = false;
  renderTabs();
}

function renderSharing() {
  const viewers = state.viewers || [];
  els.viewers.textContent = '';
  viewers.forEach((viewer) => {
    const row = el('div', 'prow');
    row.appendChild(avatarNode(viewer.name, 'avatar'));
    const info = el('div', 'prow__info');
    info.appendChild(nameLine(viewer));
    if (viewer.since) {
      info.appendChild(el('div', 'prow__meta', fmt(t().sinceDate, { date: formatDayMonth(viewer.since) })));
    }
    row.appendChild(info);
    const close = el('button', 'btn-small', t().close);
    close.type = 'button';
    close.addEventListener('click', () => revokeViewer(viewer, close));
    row.appendChild(close);
    els.viewers.appendChild(row);
  });
  els.viewersEmpty.hidden = viewers.length > 0;
  els.shareProgressBtn.hidden = !state.shareLinksAvailable;
  hideStatus(els.sharingStatus);
  els.sharingBody.hidden = false;
  renderTabs();
}

const LIST_SOURCES = ['profile', 'digest', 'direct'];
let listSource = LIST_SOURCES.includes(urlParams.get('src')) ? urlParams.get('src') : 'direct';

async function loadWatching() {
  showLoading(els.watchingStatus, els.watchingBody);
  try {
    const result = await postJson('/api/follow/list', { src: listSource, tab: state.tab });
    if (!result.ok || !result.data) throw new Error(`HTTP ${result.status}`);
    state.people = Array.isArray(result.data.people) ? result.data.people : [];
    state.linksEnabled = result.data.linksEnabled !== false;
    state.shareLinksAvailable = result.data.shareLinksAvailable === true;
    renderWatching();
    if (state.viewers) renderSharing();
  } catch (error) {
    console.error('Failed to load follow list', error);
    showStatusWithRetry(els.watchingStatus, els.watchingBody, loadWatching);
  }
}

async function loadSharing() {
  showLoading(els.sharingStatus, els.sharingBody);
  try {
    const result = await postJson('/api/follow/sharing');
    if (!result.ok || !result.data) throw new Error(`HTTP ${result.status}`);
    state.viewers = Array.isArray(result.data.viewers) ? result.data.viewers : [];
    renderSharing();
  } catch (error) {
    console.error('Failed to load sharing list', error);
    showStatusWithRetry(els.sharingStatus, els.sharingBody, loadSharing);
  }
}

function revokeViewer(viewer, button) {
  return runExclusive('revoke', () => performRevoke(viewer, button));
}

async function performRevoke(viewer, button) {
  button.disabled = true;
  try {
    const confirmed = await confirmAction(fmt(t().closeConfirm, { name: viewer.name || '' }));
    if (!confirmed) {
      button.disabled = false;
      return;
    }
    const result = await postJson('/api/follow/revoke', { viewerChatId: viewer.viewerChatId });
    if (!result.ok || !result.data || result.data.ok !== true) throw new Error(`HTTP ${result.status}`);
    state.viewers = (state.viewers || []).filter((v) => v.viewerChatId !== viewer.viewerChatId);
    renderSharing();
  } catch (error) {
    console.error('Failed to revoke viewer', error);
    button.disabled = false;
    showToast(t().closeError);
  }
}

async function fetchInviteUrl(reset, action) {
  const body = { reset: Boolean(reset) };
  if (action) body.action = action;
  const result = await postJson('/api/follow/link', body);
  if (!result.ok || !result.data) throw new Error(`HTTP ${result.status}`);
  if (result.data.linksEnabled === false || !result.data.url) {
    state.linksEnabled = false;
    state.inviteUrl = null;
    renderWatching();
    showToast(t().linksDisabled);
    return null;
  }
  state.inviteUrl = result.data.url;
  return state.inviteUrl;
}

async function ensureInviteUrl(action) {
  if (state.inviteUrl) {
    postJson('/api/follow/link', { reset: false, action }).catch(() => {});
    return state.inviteUrl;
  }
  return fetchInviteUrl(false, action);
}

async function shareInvite(button) {
  button.disabled = true;
  try {
    const url = await ensureInviteUrl('share');
    if (!url) return;
    const shareUrl = 'https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(t().shareText);
    if (tg && typeof tg.openTelegramLink === 'function') {
      tg.openTelegramLink(shareUrl);
    } else {
      window.open(shareUrl, '_blank');
    }
  } catch (error) {
    console.error('Failed to share invite', error);
    showToast(t().linkError);
  } finally {
    button.disabled = false;
  }
}

async function shareProgress(button) {
  button.disabled = true;
  try {
    const result = await postJson('/api/follow/share-link');
    if (result.status === 403) {
      state.shareLinksAvailable = false;
      renderSharing();
      showToast(t().linksDisabled);
      return;
    }
    if (!result.ok || !result.data || !result.data.url) throw new Error(`HTTP ${result.status}`);
    const shareUrl = 'https://t.me/share/url?url=' + encodeURIComponent(result.data.url) + '&text=' + encodeURIComponent(t().shareProgressText);
    if (tg && typeof tg.openTelegramLink === 'function') {
      tg.openTelegramLink(shareUrl);
    } else {
      window.open(shareUrl, '_blank');
    }
  } catch (error) {
    console.error('Failed to share progress', error);
    showToast(t().linkError);
  } finally {
    button.disabled = false;
  }
}

async function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      /* noop */
    }
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch (error) {
    ok = false;
  }
  document.body.removeChild(area);
  return ok;
}

async function copyInvite(button) {
  button.disabled = true;
  try {
    const url = await ensureInviteUrl('copy');
    if (!url) return;
    const ok = await copyText(url);
    showToast(ok ? t().linkCopied : t().linkError);
  } catch (error) {
    console.error('Failed to copy invite', error);
    showToast(t().linkError);
  } finally {
    button.disabled = false;
  }
}

function resetInvite(button) {
  return runExclusive('reset', () => performReset(button));
}

async function performReset(button) {
  button.disabled = true;
  try {
    const confirmed = await confirmAction(t().resetConfirm);
    if (!confirmed) return;
    const url = await fetchInviteUrl(true, 'reset');
    if (url) showToast(t().linkReset);
  } catch (error) {
    console.error('Failed to reset invite', error);
    showToast(t().linkError);
  } finally {
    button.disabled = false;
  }
}

function showList() {
  state.dayRequestId += 1;
  setView('list');
  state.currentPerson = null;
  state.currentDay = null;
  listSource = 'back';
  loadWatching();
  loadSharing();
}

function openPerson(person) {
  state.currentPerson = person;
  state.currentDay = null;
  state.knownDays = {};
  state.dayLoading = false;
  state.requestedDate = null;
  els.dayAvatar.textContent = initialOf(person.name);
  els.dayName.textContent = '';
  els.dayName.appendChild(el('bdi', null, person.name || ''));
  if (person.username) {
    const user = el('span', 'person__user', ' ');
    user.appendChild(el('bdi', null, '@' + person.username));
    els.dayName.appendChild(user);
  }
  els.dayMeta.textContent = '';
  els.dayStrip.textContent = '';
  els.dayBody.hidden = true;
  els.dayBody.classList.remove('is-loading');
  setView('day');
  loadDay(isoDateOrNull(person.today) || toIsoDate(new Date()), true);
}

function isoDateOrNull(value) {
  return parseIsoDate(value) ? String(value) : null;
}

function renderDayStrip(day) {
  const s = t();
  els.dayStrip.textContent = '';
  const maxDate = day.maxDate || day.date;
  let minDate = day.minDate || day.date;
  const visibleFrom = state.currentPerson && isoDateOrNull(state.currentPerson.visibleFrom);
  if (visibleFrom && visibleFrom > minDate) minDate = visibleFrom;
  let activeNode = null;
  for (let iso = minDate, guard = 0; iso <= maxDate && guard < 400; iso = addDays(iso, 1), guard += 1) {
    const isActive = iso === day.date;
    const known = state.knownDays[iso];
    const locked = Boolean(known && known.beforeAccess);
    const classes = ['day'];
    if (isActive) classes.push('day--active');
    if (locked) classes.push('day--locked');
    const button = el('button', classes.join(' '));
    button.type = 'button';
    const label = iso === maxDate ? s.today : `${weekdayShort(iso)} ${Number(iso.slice(8, 10))}`;
    button.appendChild(el('span', null, label));
    const dotClass = known && !locked ? (known.logged ? 'day__dot day__dot--yes' : 'day__dot day__dot--no') : 'day__dot';
    const dot = el('span', dotClass);
    dot.setAttribute('aria-hidden', 'true');
    button.appendChild(dot);
    const ariaParts = [formatDayMonth(iso)];
    if (known && !locked) ariaParts.push(known.logged ? s.dayLogged : s.legendNone);
    button.setAttribute('aria-label', ariaParts.join(', '));
    if (isActive) {
      button.setAttribute('aria-current', 'date');
      activeNode = button;
    }
    if (locked) {
      button.disabled = true;
    } else {
      button.addEventListener('click', () => selectDay(iso));
    }
    els.dayStrip.appendChild(button);
  }
  if (activeNode) {
    els.dayStrip.scrollLeft = activeNode.offsetLeft - (els.dayStrip.clientWidth - activeNode.offsetWidth) / 2;
  }
}

function selectDay(iso) {
  const current = state.dayLoading ? state.requestedDate : (state.currentDay && state.currentDay.date);
  if (iso === current) return;
  loadDay(iso);
}

function requestDay(date, initial) {
  return postJson('/api/follow/day', { ownerChatId: state.currentPerson.ownerChatId, date, initial: Boolean(initial) });
}

function showDayLoading() {
  if (state.currentDay) {
    els.dayBody.classList.add('is-loading');
    els.dayBody.setAttribute('aria-busy', 'true');
    return;
  }
  showLoading(els.dayStatus, els.dayBody);
}

function clearDayLoading() {
  els.dayBody.classList.remove('is-loading');
  els.dayBody.removeAttribute('aria-busy');
}

async function loadDay(date, initial) {
  const requestId = ++state.dayRequestId;
  state.dayLoading = true;
  state.requestedDate = date;
  showDayLoading();
  try {
    const result = await requestDay(date, initial);
    if (requestId !== state.dayRequestId) return;
    state.dayLoading = false;
    clearDayLoading();
    if (result.status === 403) {
      setView('noaccess');
      return;
    }
    if (!result.ok || !result.data) throw new Error(`HTTP ${result.status}`);
    renderDay(result.data);
  } catch (error) {
    if (requestId !== state.dayRequestId) return;
    state.dayLoading = false;
    clearDayLoading();
    console.error('Failed to load follow day', error);
    if (state.currentDay) {
      showToast(t().loadError);
      return;
    }
    showStatusWithRetry(els.dayStatus, els.dayBody, () => loadDay(date, initial));
  }
}

function renderDay(day) {
  const s = t();
  state.currentDay = day;
  (Array.isArray(day.week) ? day.week : []).forEach((entry) => {
    state.knownDays[entry.date] = { logged: Boolean(entry.logged), beforeAccess: entry.beforeAccess === true };
  });
  state.knownDays[day.date] = { logged: Boolean(day.logged), beforeAccess: false };

  els.dayMeta.textContent = Number(day.streakDays) > 0 ? fmt(s.streakLong, { n: day.streakDays }) : '';

  const hasNorm = hasNormValue(day.normCalories);
  const norm = Number(day.normCalories);
  const cal = Number(day.calories) || 0;

  if (day.logged) {
    els.dayTotal.textContent = formatNumber(cal);
    els.dayTotal.classList.remove('total__value--muted');
    els.dayTotalNorm.textContent = hasNorm ? fmt(s.ofNormKcal, { norm: formatNumber(norm) }) : s.kcal;
  } else {
    els.dayTotal.textContent = s.noEntriesDay;
    els.dayTotal.classList.add('total__value--muted');
    els.dayTotalNorm.textContent = '';
  }

  els.dayBar.hidden = !(day.logged && hasNorm);
  if (day.logged && hasNorm) {
    els.dayBarFill.style.width = Math.min(100, Math.round((cal / norm) * 100)) + '%';
  }
  if (!hasNorm) {
    els.dayHint.textContent = s.normMissingLong;
  } else if (!day.logged) {
    els.dayHint.textContent = fmt(s.ofNormKcal, { norm: formatNumber(norm) });
  } else if (cal > norm) {
    els.dayHint.textContent = fmt(s.overNormLong, { n: formatNumber(cal - norm) });
  } else {
    els.dayHint.textContent = fmt(s.toNorm, { n: formatNumber(norm - cal) });
  }

  renderDayMacros(day);
  renderWeek(day, hasNorm ? norm : null);
  renderDayStrip(day);

  hideStatus(els.dayStatus);
  els.dayBody.hidden = false;
}

function renderDayMacros(day) {
  const s = t();
  const macros = day.macros || null;
  els.dayMacros.hidden = !macros;
  els.dayMacrosDivider.hidden = !macros;
  els.dayMacros.textContent = '';
  if (!macros) return;
  MACRO_KEYS.forEach(({ key, long }) => {
    const norm = macroNorm(day.normMacros, key);
    const cell = el('div', 'macro');
    cell.appendChild(el('span', 'macro__label', s[long]));
    const value = el('span', 'macro__value', formatNumber(macros[key]));
    if (norm !== null) {
      value.appendChild(el('span', 'macro__norm', ` / ${formatNumber(norm)} ${s.gramsUnit}`));
    } else {
      value.appendChild(el('span', 'macro__norm', ` ${s.gramsUnit}`));
    }
    cell.appendChild(value);
    if (norm !== null) {
      const bar = el('div', 'bar');
      const fill = el('div', 'bar__fill');
      fill.style.width = macroFill(macros[key], norm) + '%';
      bar.appendChild(fill);
      cell.appendChild(bar);
    }
    els.dayMacros.appendChild(cell);
  });
}

function renderWeek(day, norm) {
  const s = t();
  const week = Array.isArray(day.week) ? day.week : [];
  const loggedCount = week.filter((entry) => entry.logged && entry.beforeAccess !== true).length;
  els.weekCount.textContent = fmt(s.weekCount, { n: loggedCount });
  els.week.textContent = '';

  const maxCal = week.reduce((max, entry) => (entry.logged && entry.beforeAccess !== true ? Math.max(max, Number(entry.calories) || 0) : max), 0);
  const scaleMax = Math.max(maxCal, norm || 0) * 1.1 || 1;
  const barHeight = 84;

  if (norm) {
    const line = el('div', 'week__norm');
    line.setAttribute('aria-hidden', 'true');
    line.style.top = Math.round(barHeight * (1 - norm / scaleMax)) + 'px';
    els.week.appendChild(line);
  }
  els.legendNorm.hidden = !norm;

  week.forEach((entry) => {
    const locked = entry.beforeAccess === true;
    const colClass = ['week__col'];
    if (entry.date === day.date) colClass.push('week__col--active');
    if (locked) colClass.push('week__col--locked');
    const col = el('div', colClass.join(' '));
    if (locked) {
      const bar = el('div', 'week__bar week__bar--locked');
      bar.setAttribute('aria-hidden', 'true');
      col.appendChild(bar);
    } else if (entry.logged) {
      const bar = el('div', 'week__bar');
      const fill = el('div', 'week__fill');
      fill.style.height = Math.max(4, Math.round(((Number(entry.calories) || 0) / scaleMax) * 100)) + '%';
      bar.appendChild(fill);
      col.appendChild(bar);
    } else {
      col.appendChild(el('div', 'week__bar week__bar--empty', '—'));
    }
    col.appendChild(el('span', null, weekdayShort(entry.date)));
    els.week.appendChild(col);
  });
}

function unfollowCurrent() {
  return runExclusive('unfollow', performUnfollow);
}

async function performUnfollow() {
  const person = state.currentPerson;
  if (!person) return;
  els.unfollowBtn.disabled = true;
  try {
    const confirmed = await confirmAction(fmt(t().unfollowConfirm, { name: person.name || '' }));
    if (!confirmed) return;
    const result = await postJson('/api/follow/unfollow', { ownerChatId: person.ownerChatId });
    if (result.status === 403) {
      showList();
      return;
    }
    if (!result.ok || !result.data || result.data.ok !== true) throw new Error(`HTTP ${result.status}`);
    showList();
  } catch (error) {
    console.error('Failed to unfollow', error);
    showToast(t().unfollowError);
  } finally {
    els.unfollowBtn.disabled = false;
  }
}

function goBack() {
  if (state.view !== 'list') {
    showList();
    return;
  }
  window.location.replace(withLang('../profile/index.html'));
}

function setupBackButton() {
  if (!tg?.BackButton) return;
  try {
    tg.BackButton.show();
    tg.BackButton.onClick(goBack);
  } catch (_) { /* noop */ }
}

function rerenderAll() {
  applyStaticI18n();
  applyNavLang();
  renderTabs();
  if (state.people && !els.watchingStatus.dataset.state) renderWatching();
  if (state.viewers && !els.sharingStatus.dataset.state) renderSharing();
  if (state.view === 'day' && state.currentDay && !els.dayBody.hidden) renderDay(state.currentDay);
  refreshStatuses();
}

async function loadLocaleFromProfile() {
  if (normalizeLocale(urlLangParam)) return;
  try {
    const result = await postJson('/api/profile');
    if (!result.ok || !result.data) return;
    profileLocale = result.data.locale || null;
    rerenderAll();
  } catch (error) {
    console.error('Failed to load profile locale', error);
  }
}

els.tabWatching.addEventListener('click', () => selectTab('watching'));
els.tabSharing.addEventListener('click', () => selectTab('sharing'));
[els.tabWatching, els.tabSharing].forEach((tab) => {
  tab.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    const next = tab === els.tabWatching ? els.tabSharing : els.tabWatching;
    selectTab(next === els.tabSharing ? 'sharing' : 'watching');
    next.focus();
  });
});
els.unfollowBtn.addEventListener('click', unfollowCurrent);
els.shareProgressBtn.addEventListener('click', () => shareProgress(els.shareProgressBtn));
els.noAccessBack.addEventListener('click', showList);

applyStaticI18n();
applyNavLang();
setupNavClickInterception();
setupBackButton();
selectTab(urlParams.get('tab') === 'sharing' ? 'sharing' : 'watching');
loadWatching();
loadSharing();
loadLocaleFromProfile();
