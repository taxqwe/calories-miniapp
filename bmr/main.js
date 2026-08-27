document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = window.CaloriesMiniAppConfig?.apiBaseUrl || 'https://caloriesai.duckdns.org';

  // Поддерживаемые локали
  const supportedLocales = ["ar", "de", "es", "fr", "hi", "ru", "tr", "uk", "en", "pt"];

  // Множители активности (Mifflin–St Jeor): уровни 1..5
  const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9];

  // Множители цели — зеркалят GoalCompletionPolicy в боте (deficit не опускается
  // ниже базового обмена). Норма, посчитанная здесь, — то же число, по которому
  // бот рисует закреп и сверяет анализ дня.
  const GOAL_DEFICIT_FACTOR = 0.85;
  const GOAL_SURPLUS_FACTOR = 1.10;

  // Диапазоны валидации
  const validationRanges = {
    height: { min: 100, max: 250 },
    weight: { min: 30, max: 300 },
    age: { min: 14, max: 120 },
    customCalories: { min: 1000, max: 20000 }
  };

  // Пищевые предпочтения — единый источник для чипсов (ключи locale-independent).
  const preferenceDefs = [
    { key: 'more_protein', emoji: '🥩', dir: 'up' },
    { key: 'less_sugar', emoji: '🍬', dir: 'down' },
    { key: 'more_veggies', emoji: '🥗', dir: 'up' },
    { key: 'low_carb', emoji: '🌾', dir: 'down' },
    { key: 'more_water', emoji: '💧', dir: 'up' },
    { key: 'less_fat', emoji: '🧈', dir: 'down' }
  ];
  const preferenceKeys = preferenceDefs.map((def) => def.key);

  const translations = {
    en: {
      // header
      titleEdit: "Metabolism",
      titleFirst: "Let's calculate your norm",
      subtitleEdit: "How much energy your body spends per day. Mifflin–St Jeor formula.",
      subtitleFirst: "This is needed once — then everything is counted automatically.",
      onbGuide: "Fill in height, weight, age and sex — your daily norm will appear here automatically.",
      // hero
      heroLabel: "Target calories",
      heroUnit: "kcal/day",
      heroEmpty: "—",
      basalLabel: "basal metabolism",
      heroMetaWaiting: "fill in the data",
      // sections
      bodySectionEdit: "Body data",
      bodySectionFirst: "Step 1 · body data",
      activitySectionEdit: "Activity",
      activitySectionFirst: "Step 2 · activity",
      // fields
      labelHeight: "Height, cm",
      labelWeight: "Weight, kg",
      labelAge: "Age",
      heightPlaceholderEdit: "175",
      weightPlaceholderEdit: "70",
      agePlaceholderEdit: "30",
      heightPlaceholderFirst: "e.g. 178",
      weightPlaceholderFirst: "e.g. 72",
      agePlaceholderFirst: "e.g. 29",
      genderMale: "Male",
      genderFemale: "Female",
      activityRowLabel: "Level",
      goalToggleLabel: "Set calorie goal",
      goalDeficit: "Deficit · −15%",
      goalSurplus: "Surplus · +10%",
      goalMaintenanceWord: "maintenance",
      goalNoteOff: "No goal set — your norm equals maintenance.",
      goalNoteFloor: "We don't go below basal metabolism — raised to {bmr}.",
      goalNoteSource: "The bot shows this number in the pinned message and checks your daily analysis against it.",
      preferencesTitle: "Preferences",
      preferences: {
        more_protein: "Protein",
        less_sugar: "Sugar",
        more_veggies: "Veggies",
        low_carb: "Carbs",
        more_water: "Water",
        less_fat: "Fat"
      },
      // cta
      ctaEdit: "Save",
      ctaFirst: "Calculate and save",
      ctaHintFirst: "Fill in height, weight, age and sex to continue",
      ctaHintMissing: "Fill in: ",
      missingHeight: "height",
      missingWeight: "weight",
      missingAge: "age",
      missingGender: "sex",
      // statuses
      sending: "Sending data…",
      success: "✅ Data saved!",
      error: "❌ Error: ",
      profileLoading: "Loading your profile…",
      profileErrorText: "Couldn't load your profile. Saving is off so your goal isn't overwritten.",
      profileErrorRetry: "Retry",
      // validation
      validation: {
        heightRange: "Height must be between 100 and 250 cm",
        weightRange: "Weight must be between 30 and 300 kg",
        ageRange: "Age must be between 14 and 120 years"
      },
      activityLevels: {
        1: { title: "Sedentary", details: "You spend most of your day sitting and rarely exercise." },
        2: { title: "Light activity", details: "Light exercise or walking a few times a week." },
        3: { title: "Moderate activity", details: "Moderate exercise or sport 3–5 times a week." },
        4: { title: "High activity", details: "Hard exercise or sport 6–7 times a week." },
        5: { title: "Very high activity", details: "Very intense training, possibly twice a day." }
      }
    },
    ru: {
      titleEdit: "Метаболизм",
      titleFirst: "Рассчитаем норму",
      subtitleEdit: "Сколько энергии тело тратит за день. Формула Миффлина — Сан-Жеора.",
      subtitleFirst: "Это нужно один раз — потом всё считается автоматически.",
      onbGuide: "Заполните рост, вес, возраст и пол — дневная норма появится здесь автоматически.",
      heroLabel: "Целевые калории",
      heroUnit: "ккал/день",
      heroEmpty: "—",
      basalLabel: "базовый обмен",
      heroMetaWaiting: "заполните данные",
      bodySectionEdit: "Данные тела",
      bodySectionFirst: "Шаг 1 · данные тела",
      activitySectionEdit: "Активность",
      activitySectionFirst: "Шаг 2 · активность",
      labelHeight: "Рост, см",
      labelWeight: "Вес, кг",
      labelAge: "Возраст",
      heightPlaceholderEdit: "175",
      weightPlaceholderEdit: "70",
      agePlaceholderEdit: "30",
      heightPlaceholderFirst: "напр. 178",
      weightPlaceholderFirst: "напр. 72",
      agePlaceholderFirst: "напр. 29",
      genderMale: "Мужчина",
      genderFemale: "Женщина",
      activityRowLabel: "Уровень",
      goalToggleLabel: "Установить цель калорий",
      goalDeficit: "Дефицит · −15%",
      goalSurplus: "Профицит · +10%",
      goalMaintenanceWord: "поддержание",
      goalNoteOff: "Цель не задана — норма равна поддержанию.",
      goalNoteFloor: "Ниже базового обмена не опускаем — подняли до {bmr}.",
      goalNoteSource: "Это число бот показывает в закрепе и с ним же сверяет «Оцени рацион».",
      preferencesTitle: "Предпочтения",
      preferences: {
        more_protein: "Белок",
        less_sugar: "Сахар",
        more_veggies: "Овощи",
        low_carb: "Углеводы",
        more_water: "Вода",
        less_fat: "Жиры"
      },
      ctaEdit: "Сохранить",
      ctaFirst: "Рассчитать и сохранить",
      ctaHintFirst: "Заполните рост, вес, возраст и пол, чтобы продолжить",
      ctaHintMissing: "Заполните: ",
      missingHeight: "рост",
      missingWeight: "вес",
      missingAge: "возраст",
      missingGender: "пол",
      sending: "Отправка данных…",
      success: "✅ Данные сохранены!",
      error: "❌ Ошибка: ",
      profileLoading: "Загружаем профиль…",
      profileErrorText: "Не удалось загрузить профиль. Сохранение отключено, чтобы не стереть вашу цель.",
      profileErrorRetry: "Повторить",
      validation: {
        heightRange: "Рост должен быть от 100 до 250 см",
        weightRange: "Вес должен быть от 30 до 300 кг",
        ageRange: "Возраст должен быть от 14 до 120 лет"
      },
      activityLevels: {
        1: { title: "Сидячий образ жизни", details: "Большую часть дня вы сидите и почти не занимаетесь спортом." },
        2: { title: "Лёгкая активность", details: "Лёгкие упражнения или прогулки несколько раз в неделю." },
        3: { title: "Умеренная активность", details: "Умеренные упражнения или спорт 3–5 раз в неделю." },
        4: { title: "Высокая активность", details: "Интенсивные тренировки 6–7 раз в неделю." },
        5: { title: "Очень высокая активность", details: "Очень интенсивный режим, возможно, по две тренировки в день." }
      }
    },
    uk: {
      titleEdit: "Метаболізм",
      titleFirst: "Розрахуємо норму",
      subtitleEdit: "Скільки енергії тіло витрачає за день. Формула Міффліна — Сан-Жеора.",
      subtitleFirst: "Це потрібно один раз — потім усе рахується автоматично.",
      onbGuide: "Заповніть зріст, вагу, вік і стать — денна норма з’явиться тут автоматично.",
      heroLabel: "Цільові калорії",
      heroUnit: "ккал/день",
      heroEmpty: "—",
      basalLabel: "базовий обмін",
      heroMetaWaiting: "заповніть дані",
      bodySectionEdit: "Дані тіла",
      bodySectionFirst: "Крок 1 · дані тіла",
      activitySectionEdit: "Активність",
      activitySectionFirst: "Крок 2 · активність",
      labelHeight: "Зріст, см",
      labelWeight: "Вага, кг",
      labelAge: "Вік",
      heightPlaceholderEdit: "175",
      weightPlaceholderEdit: "70",
      agePlaceholderEdit: "30",
      heightPlaceholderFirst: "напр. 178",
      weightPlaceholderFirst: "напр. 72",
      agePlaceholderFirst: "напр. 29",
      genderMale: "Чоловік",
      genderFemale: "Жінка",
      activityRowLabel: "Рівень",
      goalToggleLabel: "Встановити ціль калорій",
      goalDeficit: "Дефіцит · −15%",
      goalSurplus: "Профіцит · +10%",
      goalMaintenanceWord: "підтримання",
      goalNoteOff: "Ціль не задана — норма дорівнює підтриманню.",
      goalNoteFloor: "Нижче базового обміну не опускаємо — підняли до {bmr}.",
      goalNoteSource: "Це число бот показує в закріпленому повідомленні та з ним звіряє «Оціни раціон».",
      preferencesTitle: "Уподобання",
      preferences: {
        more_protein: "Білок",
        less_sugar: "Цукор",
        more_veggies: "Овочі",
        low_carb: "Вуглеводи",
        more_water: "Вода",
        less_fat: "Жири"
      },
      ctaEdit: "Зберегти",
      ctaFirst: "Розрахувати і зберегти",
      ctaHintFirst: "Заповніть зріст, вагу, вік і стать, щоб продовжити",
      ctaHintMissing: "Заповніть: ",
      missingHeight: "зріст",
      missingWeight: "вагу",
      missingAge: "вік",
      missingGender: "стать",
      sending: "Відправлення даних…",
      success: "✅ Дані збережено!",
      error: "❌ Помилка: ",
      profileLoading: "Завантажуємо профіль…",
      profileErrorText: "Не вдалося завантажити профіль. Збереження вимкнено, щоб не стерти вашу ціль.",
      profileErrorRetry: "Повторити",
      validation: {
        heightRange: "Зріст має бути від 100 до 250 см",
        weightRange: "Вага має бути від 30 до 300 кг",
        ageRange: "Вік має бути від 14 до 120 років"
      },
      activityLevels: {
        1: { title: "Малорухливий спосіб життя", details: "Більшу частину дня ви сидите й майже не займаєтесь спортом." },
        2: { title: "Низька активність", details: "Легкі вправи або прогулянки кілька разів на тиждень." },
        3: { title: "Помірна активність", details: "Помірні вправи або спорт 3–5 разів на тиждень." },
        4: { title: "Висока активність", details: "Інтенсивні тренування 6–7 разів на тиждень." },
        5: { title: "Дуже висока активність", details: "Дуже інтенсивний режим, можливо, по два тренування на день." }
      }
    },
    de: {
      titleEdit: "Stoffwechsel",
      titleFirst: "Lass uns deinen Bedarf berechnen",
      subtitleEdit: "Wie viel Energie dein Körper pro Tag verbraucht. Mifflin–St-Jeor-Formel.",
      subtitleFirst: "Das ist nur einmal nötig — danach wird alles automatisch berechnet.",
      onbGuide: "Gib Größe, Gewicht, Alter und Geschlecht ein — dein Tagesbedarf erscheint hier automatisch.",
      heroLabel: "Zielkalorien",
      heroUnit: "kcal/Tag",
      heroEmpty: "—",
      basalLabel: "Grundumsatz",
      heroMetaWaiting: "Daten eingeben",
      bodySectionEdit: "Körperdaten",
      bodySectionFirst: "Schritt 1 · Körperdaten",
      activitySectionEdit: "Aktivität",
      activitySectionFirst: "Schritt 2 · Aktivität",
      labelHeight: "Größe, cm",
      labelWeight: "Gewicht, kg",
      labelAge: "Alter",
      heightPlaceholderEdit: "175",
      weightPlaceholderEdit: "70",
      agePlaceholderEdit: "30",
      heightPlaceholderFirst: "z.B. 178",
      weightPlaceholderFirst: "z.B. 72",
      agePlaceholderFirst: "z.B. 29",
      genderMale: "Mann",
      genderFemale: "Frau",
      activityRowLabel: "Niveau",
      goalToggleLabel: "Kalorienziel festlegen",
      goalDeficit: "Defizit · −15%",
      goalSurplus: "Überschuss · +10%",
      goalMaintenanceWord: "Erhaltung",
      goalNoteOff: "Kein Ziel gesetzt — die Norm entspricht der Erhaltung.",
      goalNoteFloor: "Wir gehen nicht unter den Grundumsatz — auf {bmr} angehoben.",
      goalNoteSource: "Diese Zahl zeigt der Bot in der angehefteten Nachricht und vergleicht damit deine Tagesanalyse.",
      preferencesTitle: "Vorlieben",
      preferences: {
        more_protein: "Protein",
        less_sugar: "Zucker",
        more_veggies: "Gemüse",
        low_carb: "Carbs",
        more_water: "Wasser",
        less_fat: "Fett"
      },
      ctaEdit: "Speichern",
      ctaFirst: "Berechnen und speichern",
      ctaHintFirst: "Gib Größe, Gewicht, Alter und Geschlecht ein, um fortzufahren",
      ctaHintMissing: "Bitte ausfüllen: ",
      missingHeight: "Größe",
      missingWeight: "Gewicht",
      missingAge: "Alter",
      missingGender: "Geschlecht",
      sending: "Daten werden gesendet…",
      success: "✅ Daten gespeichert!",
      error: "❌ Fehler: ",
      profileLoading: "Profil wird geladen…",
      profileErrorText: "Profil konnte nicht geladen werden. Speichern ist aus, damit dein Ziel nicht überschrieben wird.",
      profileErrorRetry: "Erneut versuchen",
      validation: {
        heightRange: "Die Größe muss zwischen 100 und 250 cm liegen",
        weightRange: "Das Gewicht muss zwischen 30 und 300 kg liegen",
        ageRange: "Das Alter muss zwischen 14 und 120 Jahren liegen"
      },
      activityLevels: {
        1: { title: "Sitzend", details: "Du sitzt den Großteil des Tages und trainierst selten." },
        2: { title: "Leichte Aktivität", details: "Leichtes Training oder Spaziergänge mehrmals pro Woche." },
        3: { title: "Mäßige Aktivität", details: "Mäßiges Training oder Sport 3–5 Mal pro Woche." },
        4: { title: "Hohe Aktivität", details: "Intensives Training 6–7 Mal pro Woche." },
        5: { title: "Sehr hohe Aktivität", details: "Sehr intensives Training, evtl. zweimal täglich." }
      }
    },
    es: {
      titleEdit: "Metabolismo",
      titleFirst: "Calculemos tu norma",
      subtitleEdit: "Cuánta energía gasta tu cuerpo al día. Fórmula de Mifflin–St Jeor.",
      subtitleFirst: "Solo se hace una vez — luego todo se calcula automáticamente.",
      onbGuide: "Indica estatura, peso, edad y sexo — tu norma diaria aparecerá aquí automáticamente.",
      heroLabel: "Calorías objetivo",
      heroUnit: "kcal/día",
      heroEmpty: "—",
      basalLabel: "metabolismo basal",
      heroMetaWaiting: "completa los datos",
      bodySectionEdit: "Datos corporales",
      bodySectionFirst: "Paso 1 · datos corporales",
      activitySectionEdit: "Actividad",
      activitySectionFirst: "Paso 2 · actividad",
      labelHeight: "Estatura, cm",
      labelWeight: "Peso, kg",
      labelAge: "Edad",
      heightPlaceholderEdit: "175",
      weightPlaceholderEdit: "70",
      agePlaceholderEdit: "30",
      heightPlaceholderFirst: "ej. 178",
      weightPlaceholderFirst: "ej. 72",
      agePlaceholderFirst: "ej. 29",
      genderMale: "Hombre",
      genderFemale: "Mujer",
      activityRowLabel: "Nivel",
      goalToggleLabel: "Establecer objetivo de calorías",
      goalDeficit: "Déficit · −15%",
      goalSurplus: "Superávit · +10%",
      goalMaintenanceWord: "mantenimiento",
      goalNoteOff: "Sin objetivo — tu norma es igual al mantenimiento.",
      goalNoteFloor: "No bajamos del metabolismo basal: subido a {bmr}.",
      goalNoteSource: "El bot muestra este número en el mensaje fijado y compara con él tu análisis del día.",
      preferencesTitle: "Preferencias",
      preferences: {
        more_protein: "Proteína",
        less_sugar: "Azúcar",
        more_veggies: "Verduras",
        low_carb: "Carbos",
        more_water: "Agua",
        less_fat: "Grasa"
      },
      ctaEdit: "Guardar",
      ctaFirst: "Calcular y guardar",
      ctaHintFirst: "Indica estatura, peso, edad y sexo para continuar",
      ctaHintMissing: "Completa: ",
      missingHeight: "estatura",
      missingWeight: "peso",
      missingAge: "edad",
      missingGender: "sexo",
      sending: "Enviando datos…",
      success: "✅ ¡Datos guardados!",
      error: "❌ Error: ",
      profileLoading: "Cargando tu perfil…",
      profileErrorText: "No se pudo cargar el perfil. Guardar está desactivado para no borrar tu objetivo.",
      profileErrorRetry: "Reintentar",
      validation: {
        heightRange: "La estatura debe estar entre 100 y 250 cm",
        weightRange: "El peso debe estar entre 30 y 300 kg",
        ageRange: "La edad debe estar entre 14 y 120 años"
      },
      activityLevels: {
        1: { title: "Sedentario", details: "Pasas la mayor parte del día sentado y rara vez haces ejercicio." },
        2: { title: "Actividad ligera", details: "Ejercicio ligero o caminatas varias veces por semana." },
        3: { title: "Actividad moderada", details: "Ejercicio o deporte moderado 3–5 veces por semana." },
        4: { title: "Actividad alta", details: "Entrenamiento intenso 6–7 veces por semana." },
        5: { title: "Actividad muy alta", details: "Entrenamiento muy intenso, posiblemente dos veces al día." }
      }
    },
    fr: {
      titleEdit: "Métabolisme",
      titleFirst: "Calculons votre besoin",
      subtitleEdit: "Combien d'énergie votre corps dépense par jour. Formule de Mifflin–St Jeor.",
      subtitleFirst: "C'est nécessaire une seule fois — ensuite tout est calculé automatiquement.",
      onbGuide: "Renseignez taille, poids, âge et sexe — votre besoin journalier apparaîtra ici automatiquement.",
      heroLabel: "Calories cibles",
      heroUnit: "kcal/jour",
      heroEmpty: "—",
      basalLabel: "métabolisme de base",
      heroMetaWaiting: "renseignez les données",
      bodySectionEdit: "Données corporelles",
      bodySectionFirst: "Étape 1 · données corporelles",
      activitySectionEdit: "Activité",
      activitySectionFirst: "Étape 2 · activité",
      labelHeight: "Taille, cm",
      labelWeight: "Poids, kg",
      labelAge: "Âge",
      heightPlaceholderEdit: "175",
      weightPlaceholderEdit: "70",
      agePlaceholderEdit: "30",
      heightPlaceholderFirst: "ex. 178",
      weightPlaceholderFirst: "ex. 72",
      agePlaceholderFirst: "ex. 29",
      genderMale: "Homme",
      genderFemale: "Femme",
      activityRowLabel: "Niveau",
      goalToggleLabel: "Définir un objectif calorique",
      goalDeficit: "Déficit · −15%",
      goalSurplus: "Surplus · +10%",
      goalMaintenanceWord: "maintien",
      goalNoteOff: "Aucun objectif — votre norme est égale au maintien.",
      goalNoteFloor: "On ne descend pas sous le métabolisme de base : relevé à {bmr}.",
      goalNoteSource: "Le bot affiche ce nombre dans le message épinglé et y compare votre analyse du jour.",
      preferencesTitle: "Préférences",
      preferences: {
        more_protein: "Protéines",
        less_sugar: "Sucre",
        more_veggies: "Légumes",
        low_carb: "Glucides",
        more_water: "Eau",
        less_fat: "Gras"
      },
      ctaEdit: "Enregistrer",
      ctaFirst: "Calculer et enregistrer",
      ctaHintFirst: "Renseignez taille, poids, âge et sexe pour continuer",
      ctaHintMissing: "À renseigner : ",
      missingHeight: "taille",
      missingWeight: "poids",
      missingAge: "âge",
      missingGender: "sexe",
      sending: "Envoi des données…",
      success: "✅ Données enregistrées !",
      error: "❌ Erreur : ",
      profileLoading: "Chargement du profil…",
      profileErrorText: "Impossible de charger le profil. L'enregistrement est désactivé pour ne pas effacer votre objectif.",
      profileErrorRetry: "Réessayer",
      validation: {
        heightRange: "La taille doit être entre 100 et 250 cm",
        weightRange: "Le poids doit être entre 30 et 300 kg",
        ageRange: "L'âge doit être entre 14 et 120 ans"
      },
      activityLevels: {
        1: { title: "Sédentaire", details: "Vous passez l'essentiel de la journée assis et faites rarement de l'exercice." },
        2: { title: "Activité légère", details: "Exercice léger ou marche plusieurs fois par semaine." },
        3: { title: "Activité modérée", details: "Exercice ou sport modéré 3–5 fois par semaine." },
        4: { title: "Activité élevée", details: "Entraînement intense 6–7 fois par semaine." },
        5: { title: "Activité très élevée", details: "Entraînement très intense, parfois deux fois par jour." }
      }
    },
    pt: {
      titleEdit: "Metabolismo",
      titleFirst: "Vamos calcular sua meta",
      subtitleEdit: "Quanta energia seu corpo gasta por dia. Fórmula de Mifflin–St Jeor.",
      subtitleFirst: "Isto é necessário uma vez — depois tudo é calculado automaticamente.",
      onbGuide: "Informe altura, peso, idade e sexo — sua meta diária aparecerá aqui automaticamente.",
      heroLabel: "Calorias-alvo",
      heroUnit: "kcal/dia",
      heroEmpty: "—",
      basalLabel: "metabolismo basal",
      heroMetaWaiting: "preencha os dados",
      bodySectionEdit: "Dados corporais",
      bodySectionFirst: "Passo 1 · dados corporais",
      activitySectionEdit: "Atividade",
      activitySectionFirst: "Passo 2 · atividade",
      labelHeight: "Altura, cm",
      labelWeight: "Peso, kg",
      labelAge: "Idade",
      heightPlaceholderEdit: "175",
      weightPlaceholderEdit: "70",
      agePlaceholderEdit: "30",
      heightPlaceholderFirst: "ex. 178",
      weightPlaceholderFirst: "ex. 72",
      agePlaceholderFirst: "ex. 29",
      genderMale: "Homem",
      genderFemale: "Mulher",
      activityRowLabel: "Nível",
      goalToggleLabel: "Definir meta de calorias",
      goalDeficit: "Déficit · −15%",
      goalSurplus: "Superávit · +10%",
      goalMaintenanceWord: "manutenção",
      goalNoteOff: "Sem meta — sua norma é igual à manutenção.",
      goalNoteFloor: "Não descemos abaixo do metabolismo basal: elevado para {bmr}.",
      goalNoteSource: "O bot mostra este número na mensagem fixada e compara com ele a sua análise do dia.",
      preferencesTitle: "Preferências",
      preferences: {
        more_protein: "Proteína",
        less_sugar: "Açúcar",
        more_veggies: "Vegetais",
        low_carb: "Carbo",
        more_water: "Água",
        less_fat: "Gordura"
      },
      ctaEdit: "Salvar",
      ctaFirst: "Calcular e salvar",
      ctaHintFirst: "Informe altura, peso, idade e sexo para continuar",
      ctaHintMissing: "Preencha: ",
      missingHeight: "altura",
      missingWeight: "peso",
      missingAge: "idade",
      missingGender: "sexo",
      sending: "Enviando dados…",
      success: "✅ Dados salvos!",
      error: "❌ Erro: ",
      profileLoading: "Carregando seu perfil…",
      profileErrorText: "Não foi possível carregar o perfil. Salvar está desativado para não apagar sua meta.",
      profileErrorRetry: "Tentar de novo",
      validation: {
        heightRange: "A altura deve estar entre 100 e 250 cm",
        weightRange: "O peso deve estar entre 30 e 300 kg",
        ageRange: "A idade deve estar entre 14 e 120 anos"
      },
      activityLevels: {
        1: { title: "Sedentário", details: "Você passa a maior parte do dia sentado e raramente se exercita." },
        2: { title: "Atividade leve", details: "Exercício leve ou caminhadas algumas vezes por semana." },
        3: { title: "Atividade moderada", details: "Exercício ou esporte moderado 3–5 vezes por semana." },
        4: { title: "Atividade alta", details: "Treino intenso 6–7 vezes por semana." },
        5: { title: "Atividade muito alta", details: "Treino muito intenso, possivelmente duas vezes ao dia." }
      }
    },
    tr: {
      titleEdit: "Metabolizma",
      titleFirst: "Normunu hesaplayalım",
      subtitleEdit: "Vücudunuzun günde harcadığı enerji. Mifflin–St Jeor formülü.",
      subtitleFirst: "Bu yalnızca bir kez gerekir — sonra her şey otomatik hesaplanır.",
      onbGuide: "Boy, kilo, yaş ve cinsiyeti girin — günlük normunuz burada otomatik görünecek.",
      heroLabel: "Hedef kalori",
      heroUnit: "kcal/gün",
      heroEmpty: "—",
      basalLabel: "bazal metabolizma",
      heroMetaWaiting: "verileri doldurun",
      bodySectionEdit: "Vücut verileri",
      bodySectionFirst: "Adım 1 · vücut verileri",
      activitySectionEdit: "Aktivite",
      activitySectionFirst: "Adım 2 · aktivite",
      labelHeight: "Boy, cm",
      labelWeight: "Kilo, kg",
      labelAge: "Yaş",
      heightPlaceholderEdit: "175",
      weightPlaceholderEdit: "70",
      agePlaceholderEdit: "30",
      heightPlaceholderFirst: "örn. 178",
      weightPlaceholderFirst: "örn. 72",
      agePlaceholderFirst: "örn. 29",
      genderMale: "Erkek",
      genderFemale: "Kadın",
      activityRowLabel: "Seviye",
      goalToggleLabel: "Kalori hedefi belirle",
      goalDeficit: "Açık · −15%",
      goalSurplus: "Fazla · +10%",
      goalMaintenanceWord: "koruma",
      goalNoteOff: "Hedef yok — normun korumaya eşit.",
      goalNoteFloor: "Bazal metabolizmanın altına inmiyoruz — {bmr} değerine yükseltildi.",
      goalNoteSource: "Bot bu sayıyı sabitlenmiş mesajda gösterir ve günlük analizini onunla karşılaştırır.",
      preferencesTitle: "Tercihler",
      preferences: {
        more_protein: "Protein",
        less_sugar: "Şeker",
        more_veggies: "Sebze",
        low_carb: "Karbonhidrat",
        more_water: "Su",
        less_fat: "Yağ"
      },
      ctaEdit: "Kaydet",
      ctaFirst: "Hesapla ve kaydet",
      ctaHintFirst: "Devam etmek için boy, kilo, yaş ve cinsiyeti girin",
      ctaHintMissing: "Doldurun: ",
      missingHeight: "boy",
      missingWeight: "kilo",
      missingAge: "yaş",
      missingGender: "cinsiyet",
      sending: "Veriler gönderiliyor…",
      success: "✅ Veriler kaydedildi!",
      error: "❌ Hata: ",
      profileLoading: "Profil yükleniyor…",
      profileErrorText: "Profil yüklenemedi. Hedefinizin silinmemesi için kaydetme kapalı.",
      profileErrorRetry: "Tekrar dene",
      validation: {
        heightRange: "Boy 100 ile 250 cm arasında olmalı",
        weightRange: "Kilo 30 ile 300 kg arasında olmalı",
        ageRange: "Yaş 14 ile 120 arasında olmalı"
      },
      activityLevels: {
        1: { title: "Hareketsiz", details: "Günün çoğunu oturarak geçirir, nadiren egzersiz yaparsınız." },
        2: { title: "Hafif aktivite", details: "Haftada birkaç kez hafif egzersiz veya yürüyüş." },
        3: { title: "Orta aktivite", details: "Haftada 3–5 kez orta düzey egzersiz veya spor." },
        4: { title: "Yüksek aktivite", details: "Haftada 6–7 kez yoğun antrenman." },
        5: { title: "Çok yüksek aktivite", details: "Çok yoğun program, muhtemelen günde iki antrenman." }
      }
    },
    ar: {
      titleEdit: "الأيض",
      titleFirst: "لنحسب احتياجك",
      subtitleEdit: "كمية الطاقة التي يحرقها جسمك يوميًا. معادلة ميفلين–سان جور.",
      subtitleFirst: "هذا مطلوب مرة واحدة — بعدها يُحسب كل شيء تلقائيًا.",
      onbGuide: "أدخل الطول والوزن والعمر والجنس — ستظهر احتياجك اليومي هنا تلقائيًا.",
      heroLabel: "السعرات المستهدفة",
      heroUnit: "سعرة/يوم",
      heroEmpty: "—",
      basalLabel: "الأيض الأساسي",
      heroMetaWaiting: "أدخل البيانات",
      bodySectionEdit: "بيانات الجسم",
      bodySectionFirst: "الخطوة 1 · بيانات الجسم",
      activitySectionEdit: "النشاط",
      activitySectionFirst: "الخطوة 2 · النشاط",
      labelHeight: "الطول، سم",
      labelWeight: "الوزن، كجم",
      labelAge: "العمر",
      heightPlaceholderEdit: "175",
      weightPlaceholderEdit: "70",
      agePlaceholderEdit: "30",
      heightPlaceholderFirst: "مثال: 178",
      weightPlaceholderFirst: "مثال: 72",
      agePlaceholderFirst: "مثال: 29",
      genderMale: "ذكر",
      genderFemale: "أنثى",
      activityRowLabel: "المستوى",
      goalToggleLabel: "تحديد هدف للسعرات",
      goalDeficit: "عجز · −15%",
      goalSurplus: "فائض · +10%",
      goalMaintenanceWord: "الحفاظ",
      goalNoteOff: "لا يوجد هدف — معدلك يساوي الحفاظ.",
      goalNoteFloor: "لا ننزل تحت الأيض الأساسي — تم الرفع إلى {bmr}.",
      goalNoteSource: "يعرض البوت هذا الرقم في الرسالة المثبتة ويقارن به تحليل يومك.",
      preferencesTitle: "التفضيلات",
      preferences: {
        more_protein: "بروتين",
        less_sugar: "سكر",
        more_veggies: "خضار",
        low_carb: "كربوهيدرات",
        more_water: "ماء",
        less_fat: "دهون"
      },
      ctaEdit: "حفظ",
      ctaFirst: "احسب واحفظ",
      ctaHintFirst: "أدخل الطول والوزن والعمر والجنس للمتابعة",
      ctaHintMissing: "أكمل: ",
      missingHeight: "الطول",
      missingWeight: "الوزن",
      missingAge: "العمر",
      missingGender: "الجنس",
      sending: "جارٍ إرسال البيانات…",
      success: "✅ تم حفظ البيانات!",
      error: "❌ خطأ: ",
      profileLoading: "جارٍ تحميل الملف الشخصي…",
      profileErrorText: "تعذر تحميل الملف الشخصي. تم تعطيل الحفظ حتى لا يُمحى هدفك.",
      profileErrorRetry: "إعادة المحاولة",
      validation: {
        heightRange: "يجب أن يكون الطول بين 100 و250 سم",
        weightRange: "يجب أن يكون الوزن بين 30 و300 كجم",
        ageRange: "يجب أن يكون العمر بين 14 و120 سنة"
      },
      activityLevels: {
        1: { title: "خامل", details: "تقضي معظم يومك جالسًا ونادرًا ما تتمرن." },
        2: { title: "نشاط خفيف", details: "تمارين خفيفة أو مشي عدة مرات أسبوعيًا." },
        3: { title: "نشاط معتدل", details: "تمارين أو رياضة معتدلة 3–5 مرات أسبوعيًا." },
        4: { title: "نشاط عالٍ", details: "تمارين مكثفة 6–7 مرات أسبوعيًا." },
        5: { title: "نشاط مرتفع جدًا", details: "نظام تدريب مكثف جدًا، ربما مرتين يوميًا." }
      }
    },
    hi: {
      titleEdit: "मेटाबॉलिज़्म",
      titleFirst: "आइए आपकी ज़रूरत निकालें",
      subtitleEdit: "आपका शरीर रोज़ कितनी ऊर्जा खर्च करता है। मिफ़्लिन–सेंट जॉर फ़ॉर्मूला।",
      subtitleFirst: "यह एक बार करना होता है — फिर सब अपने आप गिना जाता है।",
      onbGuide: "ऊँचाई, वज़न, उम्र और लिंग भरें — आपकी दैनिक ज़रूरत यहाँ अपने आप दिखेगी।",
      heroLabel: "लक्ष्य कैलोरी",
      heroUnit: "कैलोरी/दिन",
      heroEmpty: "—",
      basalLabel: "बेसल मेटाबॉलिज़्म",
      heroMetaWaiting: "डेटा भरें",
      bodySectionEdit: "शरीर का डेटा",
      bodySectionFirst: "चरण 1 · शरीर का डेटा",
      activitySectionEdit: "गतिविधि",
      activitySectionFirst: "चरण 2 · गतिविधि",
      labelHeight: "ऊँचाई, सेमी",
      labelWeight: "वज़न, किग्रा",
      labelAge: "उम्र",
      heightPlaceholderEdit: "175",
      weightPlaceholderEdit: "70",
      agePlaceholderEdit: "30",
      heightPlaceholderFirst: "उदा. 178",
      weightPlaceholderFirst: "उदा. 72",
      agePlaceholderFirst: "उदा. 29",
      genderMale: "पुरुष",
      genderFemale: "महिला",
      activityRowLabel: "स्तर",
      goalToggleLabel: "कैलोरी लक्ष्य सेट करें",
      goalDeficit: "डेफिसिट · −15%",
      goalSurplus: "सरप्लस · +10%",
      goalMaintenanceWord: "रखरखाव",
      goalNoteOff: "कोई लक्ष्य नहीं — आपका मान रखरखाव के बराबर है।",
      goalNoteFloor: "बेसल मेटाबॉलिज़्म से नीचे नहीं जाते — {bmr} तक बढ़ाया गया।",
      goalNoteSource: "बॉट यह संख्या पिन किए गए संदेश में दिखाता है और आपके दिन के विश्लेषण की तुलना इसी से करता है।",
      preferencesTitle: "पसंद",
      preferences: {
        more_protein: "प्रोटीन",
        less_sugar: "चीनी",
        more_veggies: "सब्ज़ियाँ",
        low_carb: "कार्ब",
        more_water: "पानी",
        less_fat: "वसा"
      },
      ctaEdit: "सहेजें",
      ctaFirst: "गणना करें और सहेजें",
      ctaHintFirst: "जारी रखने के लिए ऊँचाई, वज़न, उम्र और लिंग भरें",
      ctaHintMissing: "भरें: ",
      missingHeight: "ऊँचाई",
      missingWeight: "वज़न",
      missingAge: "उम्र",
      missingGender: "लिंग",
      sending: "डेटा भेजा जा रहा है…",
      success: "✅ डेटा सहेजा गया!",
      error: "❌ त्रुटि: ",
      profileLoading: "प्रोफ़ाइल लोड हो रही है…",
      profileErrorText: "प्रोफ़ाइल लोड नहीं हो सकी। आपका लक्ष्य मिटने से बचाने के लिए सेव बंद है।",
      profileErrorRetry: "फिर से कोशिश करें",
      validation: {
        heightRange: "ऊँचाई 100 से 250 सेमी के बीच होनी चाहिए",
        weightRange: "वज़न 30 से 300 किग्रा के बीच होना चाहिए",
        ageRange: "उम्र 14 से 120 वर्ष के बीच होनी चाहिए"
      },
      activityLevels: {
        1: { title: "गतिहीन", details: "आप दिन का अधिकांश समय बैठे रहते हैं और शायद ही व्यायाम करते हैं।" },
        2: { title: "हल्की गतिविधि", details: "सप्ताह में कुछ बार हल्का व्यायाम या टहलना।" },
        3: { title: "मध्यम गतिविधि", details: "सप्ताह में 3–5 बार मध्यम व्यायाम या खेल।" },
        4: { title: "उच्च गतिविधि", details: "सप्ताह में 6–7 बार कठिन व्यायाम।" },
        5: { title: "बहुत उच्च गतिविधि", details: "बहुत गहन प्रशिक्षण, शायद दिन में दो बार।" }
      }
    }
  };

  // ── DOM ──
  const pageEl = document.getElementById('page');
  const titleEl = document.getElementById('page-title');
  const subtitleEl = document.getElementById('page-subtitle');
  const onbGuideEl = document.getElementById('onb-guide');
  const onbGuideTextEl = document.getElementById('onb-guide-text');

  const heroLabelEl = document.getElementById('hero-label');
  const heroValueEl = document.getElementById('hero-value');
  const heroUnitEl = document.getElementById('hero-unit');
  const heroMetaEl = document.getElementById('hero-meta');

  const bodySectionTitleEl = document.getElementById('body-section-title');
  const activitySectionTitleEl = document.getElementById('activity-section-title');

  const heightEl = document.getElementById('height');
  const weightEl = document.getElementById('weight');
  const ageEl = document.getElementById('age');
  const labelHeightEl = document.getElementById('label-height');
  const labelWeightEl = document.getElementById('label-weight');
  const labelAgeEl = document.getElementById('label-age');

  const genderSegEl = document.getElementById('gender-seg');
  const genderMaleEl = document.getElementById('gender-male');
  const genderFemaleEl = document.getElementById('gender-female');

  const activityRowLabelEl = document.getElementById('activity-row-label');
  const activityLevelNameEl = document.getElementById('activity-level-name');
  const activityRangeEl = document.getElementById('activityRange');
  const activityNoteEl = document.getElementById('activity-note');

  const goalToggleEl = document.getElementById('goal-toggle');
  const labelGoalToggleEl = document.getElementById('label-goal-toggle');
  const goalSegEl = document.getElementById('goal-seg');
  const goalDeficitEl = document.getElementById('goal-deficit');
  const goalSurplusEl = document.getElementById('goal-surplus');
  const goalNoteEl = document.getElementById('goal-note');

  const preferencesSectionTitleEl = document.getElementById('preferences-section-title');
  const preferencesChipsEl = document.getElementById('preferences-chips');

  const macroCardEl = document.getElementById('macro-card');
  const macroToggleEl = document.getElementById('macro-toggle');
  const labelMacroToggleEl = document.getElementById('label-macro-toggle');
  const macroBodyEl = document.getElementById('macro-body');
  const macroRefLabelEl = document.getElementById('macro-ref-label');
  const macroRefCurrentEl = document.getElementById('macro-ref-current');
  const macroRefCurrentLabelEl = document.getElementById('macro-ref-current-label');
  const macroRefDesiredEl = document.getElementById('macro-ref-desired');
  const macroRefDesiredLabelEl = document.getElementById('macro-ref-desired-label');
  const desiredWeightEl = document.getElementById('desired-weight');
  const macroDesiredUnitEl = document.getElementById('macro-desired-unit');
  const macroDesiredHintEl = document.getElementById('macro-desired-hint');
  const macroChipsEl = document.getElementById('macro-chips');
  const macroCustomEl = document.getElementById('macro-custom');
  const macroZeroNoteEl = document.getElementById('macro-zero-note');
  const macroPreviewEl = document.getElementById('macro-preview');
  const macroPreviewLineEl = document.getElementById('macro-preview-line');
  const macroFormulaEl = document.getElementById('macro-preview-formula');
  const macroBarEl = document.getElementById('macro-bar');
  const macroBarFillEl = document.getElementById('macro-bar-fill');
  const macroBarCaptionEl = document.getElementById('macro-bar-caption');
  const macroBannerEl = document.getElementById('macro-banner');
  const macroBannerTextEl = document.getElementById('macro-banner-text');
  const macroBannerBtnEl = document.getElementById('macro-banner-btn');

  const profileBannerEl = document.getElementById('profile-banner');
  const profileBannerTextEl = document.getElementById('profile-banner-text');
  const profileBannerBtnEl = document.getElementById('profile-banner-btn');

  const calculateButtonEl = document.getElementById('calculate-button');
  const ctaHintEl = document.getElementById('cta-hint');
  const resultEl = document.getElementById('result');

  // ── Состояние ──
  const urlParams = new URLSearchParams(window.location.search || '');
  // Точка входа: ?mode=edit означает «пришли из Профиля». Это управляет ТОЛЬКО
  // навигацией (кнопка «Назад» → Профиль, возврат после «Сохранить»).
  const mode = urlParams.get('mode') === 'edit' ? 'edit' : 'first';
  const isEdit = mode === 'edit';
  // Презентация (edit-вид vs онбординг) больше НЕ завязана на mode, а на наличии
  // сохранённых данных профиля. По умолчанию рисуем онбординг, после ответа
  // /api/profile переключаемся на edit-вид, если данные пришли.
  let hasData = false;
  let profileState = 'loading';
  const langParam = urlParams.get('lang');

  function normalizeLocale(value) {
    if (typeof value !== 'string') return null;
    const code = value.toLowerCase().split('-')[0];
    return supportedLocales.includes(code) ? code : null;
  }

  const langFromUrl = normalizeLocale(langParam);
  let lang = langFromUrl || 'ru';
  let t = translations[lang] || translations.ru;
  let langLocked = Boolean(langFromUrl);

  function setLocale(value) {
    if (langLocked) return false;
    const next = normalizeLocale(value);
    if (!next || next === lang) return false;
    lang = next;
    t = translations[lang] || translations.ru;
    return true;
  }

  let chatId = null;
  let tg = null;
  let selectedGender = null; // 'm' | 'f' | null
  let selectedGoalType = 'deficit'; // 'deficit' | 'surplus'
  let selectedPreferences = new Set(); // канонические ключи предпочтений

  // Цели по БЖУ: секция появляется только если /api/profile вернул macroPresets
  // (deploy-безопасность: старый бот без B2 → секции нет и ключи не шлются).
  const macroMetrics = ['protein', 'fat', 'carbs'];
  const macro = {
    available: false,
    presets: [],
    recommended: null,
    normTarget: null,
    savedHadGoals: false,
    enabled: false,
    ref: 'current',
    desiredWeight: null,
    desiredWeightRaw: '',
    presetId: null,
    custom: { protein: null, fat: null, carbs: null },
    direction: { protein: null, fat: null, carbs: null }
  };
  const macroDirections = ['at_least', 'at_most', 'around'];
  const macroDirectionSigns = { at_least: '≥', at_most: '≤', around: '≈' };
  const macroRowEls = {};
  const MACRO_BALANCE_TOLERANCE_KCAL = 20;

  // ── Утилиты ──
  function digitsOnly(value, maxLen) {
    const clean = String(value).replace(/\D/g, '');
    return maxLen ? clean.slice(0, maxLen) : clean;
  }

  function formatNumber(n) {
    // Пробел-разделитель тысяч (узкий неразрывный)
    return Math.round(n).toLocaleString('ru-RU').replace(/ /g, ' ');
  }

  function formatMultiplier(n) {
    return n.toLocaleString(lang, { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  }

  function getInputs() {
    const height = parseFloat(heightEl.value);
    const weight = parseFloat(weightEl.value);
    const age = parseFloat(ageEl.value);
    const activityLevel = parseInt(activityRangeEl.value, 10);
    return { height, weight, age, activityLevel };
  }

  function computeBmrTdee(height, weight, age, gender, activityLevel) {
    let bmr;
    if (gender === 'm') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    const tdee = bmr * multipliers[activityLevel - 1];
    return { bmr, tdee };
  }

  // Поля валидны и в диапазоне -> данные расчёта, иначе null
  function getValidComputation() {
    const { height, weight, age, activityLevel } = getInputs();
    if (!selectedGender) return null;
    if (!height || height < validationRanges.height.min || height > validationRanges.height.max) return null;
    if (!weight || weight < validationRanges.weight.min || weight > validationRanges.weight.max) return null;
    if (!age || age < validationRanges.age.min || age > validationRanges.age.max) return null;
    if (!activityLevel || activityLevel < 1 || activityLevel > 5) return null;
    const { bmr, tdee } = computeBmrTdee(height, weight, age, selectedGender, activityLevel);
    return { height, weight, age, gender: selectedGender, activityLevel, bmr, tdee };
  }

  // Что осталось заполнить (для онбординг-хинта)
  function getMissing() {
    const { height, weight, age } = getInputs();
    const missing = [];
    if (!height) missing.push(t.missingHeight);
    if (!weight) missing.push(t.missingWeight);
    if (!age) missing.push(t.missingAge);
    if (!selectedGender) missing.push(t.missingGender);
    return missing;
  }

  // Дневная норма и её вывод. Считаем от округлённых bmr/tdee — именно они
  // уходят на бэк в handleSubmit, поэтому предпросмотр совпадает с числом,
  // которое потом посчитает бот, вплоть до килокалории.
  function computeGoalTarget(comp) {
    const tdee = Math.round(comp.tdee);
    const bmr = Math.round(comp.bmr);
    if (!goalToggleEl.checked) {
      return { value: tdee, tdee, bmr, kind: 'maintenance', factor: null, flooredAtBmr: false };
    }
    if (selectedGoalType === 'surplus') {
      return {
        value: Math.round(tdee * GOAL_SURPLUS_FACTOR),
        tdee, bmr, kind: 'surplus', factor: GOAL_SURPLUS_FACTOR, flooredAtBmr: false
      };
    }
    const raw = Math.round(tdee * GOAL_DEFICIT_FACTOR);
    const floored = bmr <= tdee && raw < bmr;
    return {
      value: floored ? bmr : raw,
      tdee, bmr, kind: 'deficit', factor: GOAL_DEFICIT_FACTOR, flooredAtBmr: floored
    };
  }

  // ── Живой пересчёт / hero ──
  function updateHero() {
    const comp = getValidComputation();
    const multiplier = multipliers[parseInt(activityRangeEl.value, 10) - 1];
    if (comp) {
      heroValueEl.textContent = formatNumber(computeGoalTarget(comp).value);
      heroUnitEl.textContent = t.heroUnit;
      heroMetaEl.innerHTML = `${t.basalLabel}<br><b>${formatNumber(comp.bmr)}</b> · ×${formatMultiplier(multiplier)}`;
    } else {
      heroValueEl.textContent = t.heroEmpty;
      heroUnitEl.textContent = '';
      heroMetaEl.innerHTML = `${t.basalLabel}<br><span>${t.heroMetaWaiting}</span>`;
    }
  }

  // ── Расшифровка нормы под выбором цели ──
  function updateGoalNote() {
    const comp = getValidComputation();
    if (!comp) {
      goalNoteEl.innerHTML = '';
      goalNoteEl.hidden = true;
      return;
    }
    const goal = computeGoalTarget(comp);
    const parts = [`<b class="goal-note__value">${formatNumber(goal.value)} ${t.heroUnit}</b>`];
    if (goal.kind === 'maintenance') {
      parts.push(`<span>${t.goalNoteOff}</span>`);
    } else {
      parts.push(
        `<span>${t.goalMaintenanceWord} ${formatNumber(goal.tdee)} × ${formatMultiplier(goal.factor)}</span>`
      );
    }
    if (goal.flooredAtBmr) {
      parts.push(
        `<span class="goal-note__floor">${t.goalNoteFloor.replace('{bmr}', formatNumber(goal.bmr))}</span>`
      );
    }
    parts.push(`<span class="goal-note__hint">${t.goalNoteSource}</span>`);
    goalNoteEl.innerHTML = parts.join('');
    goalNoteEl.hidden = false;
  }

  // ── Готовность профиля ──
  function isProfileReady() {
    return profileState === 'ready';
  }

  function updateProfileBanner() {
    profileBannerTextEl.textContent = t.profileErrorText;
    profileBannerBtnEl.textContent = t.profileErrorRetry;
    profileBannerEl.hidden = profileState !== 'error';
  }

  // ── Кнопка + хинт ──
  function updateCtaState() {
    if (!isProfileReady()) {
      calculateButtonEl.disabled = true;
      ctaHintEl.textContent = profileState === 'error' ? t.profileErrorText : t.profileLoading;
      ctaHintEl.hidden = false;
      return;
    }
    const comp = getValidComputation();
    if (hasData) {
      // edit-вид (есть сохранённые данные): кнопка всегда активна; пустую/невалидную
      // форму ловим на submit с подсветкой ошибок.
      calculateButtonEl.disabled = false;
      ctaHintEl.hidden = true;
      return;
    }
    // Онбординг: кнопка активна только при валидном расчёте
    if (comp) {
      calculateButtonEl.disabled = false;
      ctaHintEl.hidden = true;
    } else {
      calculateButtonEl.disabled = true;
      const missing = getMissing();
      if (missing.length) {
        ctaHintEl.textContent = t.ctaHintMissing + missing.join(', ');
      } else {
        // Все поля заполнены, но вне диапазона
        ctaHintEl.textContent = t.ctaHintFirst;
      }
      ctaHintEl.hidden = false;
    }
  }

  function refresh() {
    updateHero();
    updateGoalNote();
    updateProfileBanner();
    updateCtaState();
    updateMacroSection();
  }

  // ── Активность ──
  function updateActivityDescription() {
    const level = parseInt(activityRangeEl.value, 10);
    const activity = t.activityLevels[level] || t.activityLevels[3];
    activityLevelNameEl.textContent = activity.title;
    activityNoteEl.innerHTML = `<b>${activity.title}</b>${activity.details}`;
  }

  // ── Сегментированные контролы ──
  function setGender(value) {
    selectedGender = value;
    genderMaleEl.classList.toggle('segmented__item--active', value === 'm');
    genderFemaleEl.classList.toggle('segmented__item--active', value === 'f');
    refresh();
  }

  function setGoalType(value) {
    selectedGoalType = value;
    goalDeficitEl.classList.toggle('segmented__item--active', value === 'deficit');
    goalSurplusEl.classList.toggle('segmented__item--active', value === 'surplus');
    refresh();
  }

  // ── Чипсы предпочтений ──
  function renderPreferenceChips() {
    preferencesChipsEl.innerHTML = '';
    preferenceDefs.forEach((def) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.dataset.key = def.key;
      btn.dataset.dir = def.dir;
      const emoji = document.createElement('span');
      emoji.className = 'chip__emoji';
      emoji.textContent = def.emoji;
      const label = document.createElement('span');
      label.className = 'chip__label';
      btn.append(emoji, label);
      btn.addEventListener('click', () => togglePreference(def.key));
      preferencesChipsEl.appendChild(btn);
    });
    updatePreferenceChips();
  }

  function togglePreference(key) {
    if (selectedPreferences.has(key)) {
      selectedPreferences.delete(key);
    } else {
      selectedPreferences.add(key);
    }
    updatePreferenceChips();
  }

  function updatePreferenceChips() {
    preferencesChipsEl.querySelectorAll('.chip').forEach((btn) => {
      btn.classList.toggle('chip--active', selectedPreferences.has(btn.dataset.key));
    });
  }

  // ── Цели по БЖУ ──
  function mtDict() {
    const dicts = window.MacroGoalsI18n || {};
    return dicts[lang] || dicts.en || {};
  }

  function round1(v) {
    return Math.round(v * 10) / 10;
  }

  function round2(v) {
    return Math.round(v * 100) / 100;
  }

  function decimalOnly(value) {
    let clean = String(value).replace(',', '.').replace(/[^\d.]/g, '');
    const parts = clean.split('.');
    if (parts.length > 2) clean = parts[0] + '.' + parts.slice(1).join('');
    return clean.slice(0, 5);
  }

  function getCurrentWeightKg() {
    const w = parseFloat(weightEl.value);
    if (w >= validationRanges.weight.min && w <= validationRanges.weight.max) return w;
    return null;
  }

  function getTargetCalories() {
    const comp = getValidComputation();
    if (comp) return computeGoalTarget(comp).value;
    return macro.normTarget;
  }

  function macroBaseWeight() {
    return macro.ref === 'desired' ? macro.desiredWeight : getCurrentWeightKg();
  }

  // Границы желаемого веса те же, что у веса тела (validationRanges.weight):
  // бот молча очищает поле вне 30..300, поэтому такое значение не отправляем.
  function setDesiredWeightRaw(raw) {
    macro.desiredWeightRaw = raw;
    const v = parseInt(raw, 10);
    const inRange = !isNaN(v)
      && v >= validationRanges.weight.min
      && v <= validationRanges.weight.max;
    macro.desiredWeight = inRange ? v : null;
  }

  function isDesiredWeightInvalid() {
    return macro.desiredWeightRaw !== '' && macro.desiredWeight == null;
  }

  function recommendedPerKg() {
    const rec = macro.recommended;
    if (!rec || !(rec.basisWeightKg > 0)) return null;
    return { protein: rec.proteinG / rec.basisWeightKg, fat: rec.fatG / rec.basisWeightKg };
  }

  function activePresetPerKg() {
    if (macro.presetId === 'recommended') return recommendedPerKg();
    const preset = macro.presets.find((p) => p.id === macro.presetId);
    if (!preset || !(preset.proteinPerKg > 0) || !(preset.fatPerKg > 0)) return null;
    return { protein: preset.proteinPerKg, fat: preset.fatPerKg };
  }

  function isDeficitGoal() {
    return goalToggleEl.checked && selectedGoalType === 'deficit';
  }

  function presetDirection(metric) {
    if (metric === 'protein') return 'at_least';
    if (metric === 'fat') return 'at_most';
    return isDeficitGoal() ? 'at_most' : 'around';
  }

  function effectiveDirection(metric) {
    return macro.direction[metric] || presetDirection(metric);
  }

  function directionSign(metric) {
    return macroDirectionSigns[effectiveDirection(metric)] || '';
  }

  function setMacroDirection(metric, direction) {
    macro.direction[metric] = direction;
    updateMacroSection();
  }

  function resolveMacroGoalGrams(goal, baseW) {
    if (!goal) return null;
    if (goal.basis === 'absolute') return Math.round(goal.value);
    return baseW ? Math.round(goal.value * baseW) : null;
  }

  function resolveMacroPreview() {
    const target = getTargetCalories();
    const baseW = macroBaseWeight();
    const res = {
      target,
      proteinG: null,
      fatG: null,
      carbsG: null,
      carbsAuto: true,
      carbsZero: false,
      impliedKcal: null,
      diffKcal: 0,
      perKg: null,
      needDesired: false
    };
    if (macro.presetId === 'custom') {
      res.proteinG = resolveMacroGoalGrams(macro.custom.protein, baseW);
      res.fatG = resolveMacroGoalGrams(macro.custom.fat, baseW);
      res.carbsAuto = !macro.custom.carbs;
      if (macro.custom.carbs) res.carbsG = resolveMacroGoalGrams(macro.custom.carbs, baseW);
      const usesPerKg = macroMetrics.some((m) => macro.custom[m] && macro.custom[m].basis === 'per_kg');
      res.needDesired = usesPerKg && macro.ref === 'desired' && !macro.desiredWeight;
    } else {
      const pk = activePresetPerKg();
      res.perKg = pk;
      if (pk && baseW) {
        res.proteinG = Math.round(pk.protein * baseW);
        res.fatG = Math.round(pk.fat * baseW);
      }
      res.needDesired = macro.ref === 'desired' && !macro.desiredWeight;
    }
    if (res.carbsAuto && target != null && res.proteinG != null && res.fatG != null) {
      const rest = Math.round((target - 4 * res.proteinG - 9 * res.fatG) / 4);
      res.carbsG = Math.max(0, rest);
      if (rest <= 0) res.carbsZero = true;
    }
    if (target != null && res.proteinG != null && res.fatG != null && res.carbsG != null) {
      res.impliedKcal = 4 * res.proteinG + 9 * res.fatG + 4 * res.carbsG;
      res.diffKcal = res.impliedKcal - target;
    }
    return res;
  }

  function macroChipDefs() {
    const defs = [];
    if (recommendedPerKg()) defs.push({ id: 'recommended', emoji: '⭐' });
    macro.presets.forEach((p) => {
      const emoji = p.id === 'high_protein' ? '🥩' : p.id === 'moderate' ? '⚖️' : '•';
      defs.push({ id: p.id, emoji });
    });
    defs.push({ id: 'custom', emoji: '✎' });
    return defs;
  }

  function renderMacroChips() {
    macroChipsEl.innerHTML = '';
    macroChipDefs().forEach((def) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chip';
      btn.dataset.key = def.id;
      const emoji = document.createElement('span');
      emoji.className = 'chip__emoji';
      emoji.textContent = def.emoji;
      const label = document.createElement('span');
      label.className = 'chip__label';
      btn.append(emoji, label);
      btn.addEventListener('click', () => selectMacroPreset(def.id));
      macroChipsEl.appendChild(btn);
    });
    applyMacroChipLabels();
  }

  function applyMacroChipLabels() {
    const mt = mtDict();
    macroChipsEl.querySelectorAll('.chip').forEach((btn) => {
      const label = btn.querySelector('.chip__label');
      if (label) label.textContent = (mt.presets && mt.presets[btn.dataset.key]) || btn.dataset.key;
      btn.classList.toggle('chip--active', macro.presetId === btn.dataset.key);
    });
  }

  function prefillCustomFromPreset() {
    if (macro.custom.protein || macro.custom.fat || macro.custom.carbs) return;
    const pk = activePresetPerKg();
    if (!pk) return;
    macro.custom.protein = { basis: 'per_kg', value: round1(pk.protein) };
    macro.custom.fat = { basis: 'per_kg', value: round1(pk.fat) };
  }

  function selectMacroPreset(id) {
    if (id === 'custom' && macro.presetId !== 'custom') prefillCustomFromPreset();
    macro.presetId = id;
    updateMacroSection();
  }

  function buildMacroRows() {
    macroCustomEl.innerHTML = '';
    macroMetrics.forEach((metric) => {
      const row = document.createElement('div');
      row.className = 'macro-row';
      row.dataset.metric = metric;
      const name = document.createElement('span');
      name.className = 'macro-row__name';
      const grams = document.createElement('input');
      grams.className = 'macro-row__input';
      grams.type = 'text';
      grams.inputMode = 'numeric';
      grams.autocomplete = 'off';
      const gramsUnit = document.createElement('span');
      gramsUnit.className = 'macro-row__unit';
      row.append(name, grams, gramsUnit);
      const refs = { row, name, grams, gramsUnit };
      if (metric === 'carbs') {
        const autoBtn = document.createElement('button');
        autoBtn.type = 'button';
        autoBtn.className = 'macro-row__auto';
        autoBtn.addEventListener('click', () => {
          macro.custom.carbs = null;
          updateMacroSection();
        });
        row.append(autoBtn);
        refs.autoBtn = autoBtn;
      } else {
        const perKg = document.createElement('input');
        perKg.className = 'macro-row__input';
        perKg.type = 'text';
        perKg.inputMode = 'decimal';
        perKg.autocomplete = 'off';
        const perKgUnit = document.createElement('span');
        perKgUnit.className = 'macro-row__unit';
        row.append(perKg, perKgUnit);
        refs.perKg = perKg;
        refs.perKgUnit = perKgUnit;
        perKg.addEventListener('input', () => {
          perKg.value = decimalOnly(perKg.value);
          const v = parseFloat(perKg.value);
          macro.custom[metric] = perKg.value === ''
            ? null
            : { basis: 'per_kg', value: isNaN(v) ? 0 : v };
          updateMacroSection();
        });
        perKg.addEventListener('blur', () => updateMacroSection());
      }
      grams.addEventListener('input', () => {
        grams.value = digitsOnly(grams.value, 3);
        const v = parseInt(grams.value, 10);
        macro.custom[metric] = grams.value === ''
          ? null
          : { basis: 'absolute', value: isNaN(v) ? 0 : v };
        updateMacroSection();
      });
      grams.addEventListener('blur', () => updateMacroSection());
      const dir = document.createElement('div');
      dir.className = 'macro-row__dir';
      dir.setAttribute('role', 'group');
      refs.dirBtns = {};
      macroDirections.forEach((direction) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'macro-row__dir-btn';
        btn.dataset.direction = direction;
        btn.addEventListener('click', () => setMacroDirection(metric, direction));
        dir.appendChild(btn);
        refs.dirBtns[direction] = btn;
      });
      row.append(dir);
      macroCustomEl.appendChild(row);
      macroRowEls[metric] = refs;
    });
  }

  function macroBoundsIssue(metric, gramsVal, perKgVal) {
    if (gramsVal != null && gramsVal > 600) return true;
    if (perKgVal != null) {
      if (metric === 'protein' && (perKgVal < 0.5 || perKgVal > 3.5)) return true;
      if (metric === 'fat' && perKgVal < 0.5) return true;
    }
    return false;
  }

  function macroHasZeroGoal() {
    return macro.presetId === 'custom'
      && macroMetrics.some((m) => macro.custom[m] && macro.custom[m].value === 0);
  }

  function syncCustomRows(res) {
    const mt = mtDict();
    const baseW = macroBaseWeight();
    macroMetrics.forEach((metric) => {
      const refs = macroRowEls[metric];
      if (!refs) return;
      const goal = macro.custom[metric];
      refs.name.textContent = mt[metric] || metric;
      refs.gramsUnit.textContent = mt.unitG;
      if (refs.perKgUnit) refs.perKgUnit.textContent = mt.unitPerKg;
      if (refs.autoBtn) {
        refs.autoBtn.textContent = '⟲ ' + (mt.auto || '');
        refs.autoBtn.classList.toggle('macro-row__auto--active', !goal);
      }
      let grams = null;
      if (goal) {
        grams = resolveMacroGoalGrams(goal, baseW);
      } else if (metric === 'carbs') {
        grams = res.carbsG;
      }
      if (document.activeElement !== refs.grams) {
        refs.grams.value = grams != null ? String(grams) : '';
      }
      refs.grams.classList.toggle('macro-row__input--auto', metric === 'carbs' && !goal);
      let perKgVal = null;
      if (goal) {
        perKgVal = goal.basis === 'per_kg' ? goal.value : (baseW ? round1(goal.value / baseW) : null);
      }
      if (refs.perKg && document.activeElement !== refs.perKg) {
        refs.perKg.value = perKgVal != null ? String(perKgVal) : '';
      }
      refs.row.classList.toggle('macro-row--error', !!(goal && goal.value === 0));
      refs.row.classList.toggle('macro-row--warn', !!goal && macroBoundsIssue(metric, grams, perKgVal));
      if (refs.dirBtns) {
        const active = effectiveDirection(metric);
        const labels = {
          at_least: mt.dirAtLeast,
          at_most: mt.dirAtMost,
          around: mt.dirAround
        };
        macroDirections.forEach((direction) => {
          const btn = refs.dirBtns[direction];
          if (!btn) return;
          btn.textContent = `${macroDirectionSigns[direction]} ${labels[direction] || direction}`;
          btn.classList.toggle('macro-row__dir-btn--active', direction === active);
        });
      }
    });
  }

  function updateMacroSection() {
    if (!macro.available || !hasData) {
      macroCardEl.hidden = true;
      return;
    }
    const mt = mtDict();
    macroCardEl.hidden = false;
    labelMacroToggleEl.textContent = mt.title;
    macroToggleEl.checked = macro.enabled;
    macroBodyEl.hidden = !macro.enabled;
    if (!macro.enabled) return;

    macroRefLabelEl.textContent = mt.refLabel;
    const w = getCurrentWeightKg();
    macroRefCurrentLabelEl.textContent = (mt.refCurrent || '').replace('{w}', w != null ? String(w) : '—');
    macroRefDesiredLabelEl.textContent = mt.refDesired;
    macroDesiredUnitEl.textContent = mt.unitKg;
    macroRefCurrentEl.checked = macro.ref === 'current';
    macroRefDesiredEl.checked = macro.ref === 'desired';
    if (document.activeElement !== desiredWeightEl) {
      desiredWeightEl.value = macro.desiredWeightRaw;
    }

    const res = resolveMacroPreview();

    const badDesired = isDesiredWeightInvalid();
    desiredWeightEl.classList.toggle('macro-ref__weight--error', badDesired);
    if (badDesired) {
      macroDesiredHintEl.textContent = (mt.desiredWeightRange || '')
        .replace('{min}', String(validationRanges.weight.min))
        .replace('{max}', String(validationRanges.weight.max));
      macroDesiredHintEl.classList.add('macro-ref__hint--error');
      macroDesiredHintEl.hidden = false;
    } else {
      macroDesiredHintEl.textContent = mt.needDesired;
      macroDesiredHintEl.classList.remove('macro-ref__hint--error');
      macroDesiredHintEl.hidden = !res.needDesired;
    }

    applyMacroChipLabels();

    const isCustom = macro.presetId === 'custom';
    macroCustomEl.hidden = !isCustom;
    if (isCustom) syncCustomRows(res);

    const hasZero = macroHasZeroGoal();
    macroZeroNoteEl.textContent = mt.zeroForbidden;
    macroZeroNoteEl.hidden = !hasZero;

    macroPreviewEl.hidden = false;
    if (isCustom) {
      macroPreviewLineEl.hidden = true;
    } else {
      const fmt = (metric, v) =>
        (v != null ? `${directionSign(metric)} ${formatNumber(v)}` : '—');
      macroPreviewLineEl.textContent =
        `${mt.protein} ${fmt('protein', res.proteinG)} ${mt.unitG} · ` +
        `${mt.fat} ${fmt('fat', res.fatG)} ${mt.unitG} · ` +
        `${mt.carbs} ${fmt('carbs', res.carbsG)} ${mt.unitG}`;
      macroPreviewLineEl.hidden = false;
    }
    if (res.perKg) {
      const baseText = macro.ref === 'desired' ? mt.formulaDesired : mt.formulaCurrent;
      macroFormulaEl.textContent =
        `${formatMultiplier(round1(res.perKg.protein))} / ${formatMultiplier(round1(res.perKg.fat))} ${baseText}`;
      macroFormulaEl.hidden = false;
    } else {
      macroFormulaEl.hidden = true;
    }

    const balanced = res.impliedKcal != null && Math.abs(res.diffKcal) < MACRO_BALANCE_TOLERANCE_KCAL;
    if (res.impliedKcal != null && res.target) {
      const ratio = Math.max(0, Math.min(1, res.impliedKcal / res.target));
      macroBarFillEl.style.width = `${Math.round(ratio * 100)}%`;
      macroBarEl.classList.toggle('macro-bar--warn', !balanced || res.carbsZero);
      macroBarEl.hidden = false;
      macroBarCaptionEl.textContent =
        `${formatNumber(res.impliedKcal)} / ${formatNumber(res.target)}` +
        (balanced && !res.carbsZero ? ` · ${mt.balanceOk}` : '');
      macroBarCaptionEl.hidden = false;
    } else {
      macroBarEl.hidden = true;
      macroBarCaptionEl.hidden = true;
    }

    let bannerText = null;
    let showFit = false;
    if (res.carbsZero) {
      bannerText = mt.carbsZero;
    } else if (res.impliedKcal != null && !balanced) {
      bannerText = (res.diffKcal > 0 ? mt.balanceOver : mt.balanceUnder)
        .replace('{n}', formatNumber(Math.abs(res.diffKcal)));
      showFit = isCustom && !!macro.custom.carbs;
    }
    if (bannerText) {
      macroBannerTextEl.textContent = bannerText;
      macroBannerBtnEl.textContent = mt.fitCarbs;
      macroBannerBtnEl.hidden = !showFit;
      macroBannerEl.hidden = false;
    } else {
      macroBannerEl.hidden = true;
    }
  }

  function macroApplyProfile(data) {
    if (!Array.isArray(data.macroPresets)) {
      macro.available = false;
      updateMacroSection();
      return;
    }
    macro.available = true;
    macro.presets = data.macroPresets.filter((p) => p && typeof p.id === 'string');
    macro.recommended = (data.recommendedMacros && typeof data.recommendedMacros === 'object')
      ? data.recommendedMacros
      : null;
    macro.normTarget = (data.norm && typeof data.norm.target === 'number') ? data.norm.target : null;
    if (typeof data.desiredWeight === 'number' && data.desiredWeight > 0) {
      setDesiredWeightRaw(String(Math.round(data.desiredWeight)));
    }

    const saved = data.macroGoals;
    const goals = (saved && Array.isArray(saved.goals)) ? saved.goals : [];
    if (goals.length) {
      macro.savedHadGoals = true;
      macro.enabled = true;
      const perKgGoal = goals.find((g) => g && g.basis === 'per_kg');
      macro.ref = (perKgGoal && perKgGoal.ref === 'desired') ? 'desired' : 'current';
      if (saved.source === 'recommended' && recommendedPerKg()) {
        macro.presetId = 'recommended';
      } else if (saved.source === 'preset' && saved.presetId
          && macro.presets.some((p) => p.id === saved.presetId)) {
        macro.presetId = saved.presetId;
      } else {
        macro.presetId = 'custom';
        goals.forEach((g) => {
          if (!g || !macroMetrics.includes(g.metric) || !(typeof g.value === 'number')) return;
          if (macroDirections.includes(g.direction)) macro.direction[g.metric] = g.direction;
          if (g.basis === 'absolute') {
            macro.custom[g.metric] = { basis: 'absolute', value: Math.round(g.value) };
          } else if (g.basis === 'per_kg') {
            macro.custom[g.metric] = { basis: 'per_kg', value: g.value };
          }
        });
      }
    }
    renderMacroChips();
    updateMacroSection();
  }

  function buildMacroGoalsPayload() {
    const goals = [];
    if (macro.presetId === 'custom') {
      macroMetrics.forEach((metric) => {
        const g = macro.custom[metric];
        if (!g || !(g.value > 0)) return;
        const goal = g.basis === 'absolute'
          ? { metric, basis: 'absolute', value: g.value }
          : { metric, basis: 'per_kg', value: g.value, ref: macro.ref };
        goal.direction = effectiveDirection(metric);
        goals.push(goal);
      });
      return { v: 1, source: 'manual', goals };
    }
    const pk = activePresetPerKg();
    if (pk) {
      goals.push({
        metric: 'protein',
        basis: 'per_kg',
        value: round2(pk.protein),
        ref: macro.ref,
        direction: presetDirection('protein')
      });
      goals.push({
        metric: 'fat',
        basis: 'per_kg',
        value: round2(pk.fat),
        ref: macro.ref,
        direction: presetDirection('fat')
      });
    }
    if (macro.presetId === 'recommended') return { v: 1, source: 'recommended', goals };
    return { v: 1, source: 'preset', presetId: macro.presetId, goals };
  }

  // ── Ошибки полей ──
  function clearFieldErrors() {
    [heightEl, weightEl, ageEl].forEach((el) => {
      el.closest('.metab-field').classList.remove('metab-field--error');
    });
    document.querySelectorAll('.field-error').forEach((el) => el.remove());
  }

  function showFieldError(inputEl, message) {
    const field = inputEl.closest('.metab-field');
    field.classList.add('metab-field--error');
    const div = document.createElement('div');
    div.className = 'field-error';
    div.textContent = message;
    field.insertAdjacentElement('afterend', div);
  }

  // ── Текстовое наполнение интерфейса ──
  function applyText() {
    document.documentElement.lang = lang;
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    }
    // Презентация (заголовки/секции/плейсхолдеры) — по наличию данных, не по mode.
    document.title = hasData ? t.titleEdit : t.titleFirst;

    titleEl.textContent = hasData ? t.titleEdit : t.titleFirst;
    subtitleEl.textContent = hasData ? t.subtitleEdit : t.subtitleFirst;

    onbGuideTextEl.textContent = t.onbGuide;

    heroLabelEl.textContent = t.heroLabel;

    bodySectionTitleEl.textContent = hasData ? t.bodySectionEdit : t.bodySectionFirst;
    activitySectionTitleEl.textContent = hasData ? t.activitySectionEdit : t.activitySectionFirst;

    labelHeightEl.textContent = t.labelHeight;
    labelWeightEl.textContent = t.labelWeight;
    labelAgeEl.textContent = t.labelAge;

    heightEl.placeholder = hasData ? t.heightPlaceholderEdit : t.heightPlaceholderFirst;
    weightEl.placeholder = hasData ? t.weightPlaceholderEdit : t.weightPlaceholderFirst;
    ageEl.placeholder = hasData ? t.agePlaceholderEdit : t.agePlaceholderFirst;

    genderMaleEl.textContent = t.genderMale;
    genderFemaleEl.textContent = t.genderFemale;

    activityRowLabelEl.textContent = t.activityRowLabel;
    labelGoalToggleEl.textContent = t.goalToggleLabel;
    goalDeficitEl.textContent = t.goalDeficit;
    goalSurplusEl.textContent = t.goalSurplus;

    preferencesSectionTitleEl.textContent = t.preferencesTitle;
    preferencesChipsEl.querySelectorAll('.chip').forEach((btn) => {
      const label = btn.querySelector('.chip__label');
      if (!label) return;
      const noun = (t.preferences && t.preferences[btn.dataset.key]) || '';
      const arrow = btn.dataset.dir === 'down' ? ' ↓' : ' ↑';
      label.textContent = noun ? noun + arrow : '';
    });

    // CTA: «Сохранить» когда есть данные (edit-вид), иначе «Рассчитать и сохранить».
    calculateButtonEl.textContent = hasData ? t.ctaEdit : t.ctaFirst;
    ctaHintEl.textContent = t.ctaHintFirst;

    updateMacroSection();
  }

  // ── Презентация: онбординг (нет данных) vs edit-вид (данные есть) ──
  // Завязана на hasData, а НЕ на точку входа. Возвратом назад рулит системная
  // кнопка Telegram, которую показываем только в режиме edit.
  function applyPresentation() {
    if (hasData) {
      onbGuideEl.hidden = true;
      ctaHintEl.hidden = true;
    } else {
      onbGuideEl.hidden = false;
      ctaHintEl.hidden = false;
    }
  }

  // ── Префилл из профиля (режим edit) ──
  async function prefillFromProfile() {
    profileState = 'loading';
    refresh();
    try {
      const initData = (tg && tg.initData) || '';
      const url = `${API_BASE_URL}/api/profile`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Source-App': 'BMR-Calculator'
        },
        body: JSON.stringify({ initData }),
        mode: 'cors'
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      profileState = 'ready';
      applyPrefill(data);
      refresh();
    } catch (error) {
      profileState = 'error';
      console.warn('Не удалось получить профиль для префилла:', error);
      refresh();
    }
  }

  function applyPrefill(data) {
    if (!data || typeof data !== 'object') return;
    if (setLocale(data.locale)) {
      applyText();
      updateActivityDescription();
    }
    const inputs = data.bmrInputs;
    if (inputs) {
      if (inputs.height != null) heightEl.value = String(inputs.height);
      if (inputs.weight != null) weightEl.value = String(inputs.weight);
      if (inputs.age != null) ageEl.value = String(inputs.age);
      if (inputs.gender === 'm' || inputs.gender === 'f') setGender(inputs.gender);
      if (inputs.activityLevel >= 1 && inputs.activityLevel <= 5) {
        activityRangeEl.value = String(inputs.activityLevel);
        updateActivityDescription();
      }
      // Данные пришли → переключаемся с онбординга на edit-вид (заголовок
      // «Метаболизм», CTA «Сохранить», без баннера/«Шаг 1·2»/примеров), даже если
      // открыто из меню бота (без ?mode=edit). Навигацию это НЕ трогает.
      hasData = true;
      applyText();
      applyPresentation();
    }
    const goal = data.goal;
    if (goal && (goal.type === 'deficit' || goal.type === 'surplus')) {
      goalToggleEl.checked = true;
      goalSegEl.hidden = false;
      setGoalType(goal.type);
    }
    if (Array.isArray(data.preferences)) {
      selectedPreferences = new Set(data.preferences.filter((key) => preferenceKeys.includes(key)));
      updatePreferenceChips();
    }
    macroApplyProfile(data);
    refresh();
  }

  // ── Submit: расчёт и сохранение ──
  async function handleSubmit(e) {
    e.preventDefault();
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }

    if (!isProfileReady()) {
      refresh();
      return;
    }

    clearFieldErrors();

    const { height, weight, age, activityLevel } = getInputs();
    let hasErrors = false;

    if (!height || height < validationRanges.height.min || height > validationRanges.height.max) {
      showFieldError(heightEl, t.validation.heightRange);
      hasErrors = true;
    }
    if (!weight || weight < validationRanges.weight.min || weight > validationRanges.weight.max) {
      showFieldError(weightEl, t.validation.weightRange);
      hasErrors = true;
    }
    if (!age || age < validationRanges.age.min || age > validationRanges.age.max) {
      showFieldError(ageEl, t.validation.ageRange);
      hasErrors = true;
    }
    if (!selectedGender) {
      genderSegEl.classList.add('metab-field--error');
      hasErrors = true;
    } else {
      genderSegEl.classList.remove('metab-field--error');
    }

    if (macro.available && macro.enabled && (macroHasZeroGoal() || isDesiredWeightInvalid())) {
      hasErrors = true;
    }

    if (hasErrors) {
      refresh();
      return;
    }

    const { bmr, tdee } = computeBmrTdee(height, weight, age, selectedGender, activityLevel);

    const payload = {
      data: {
        height: height,
        weight: weight,
        age: age,
        gender: selectedGender,
        activityLevel: activityLevel,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee) // именно tdee — как было раньше
      },
      preferences: Array.from(selectedPreferences),
      initData: (tg && tg.initData) || ''
    };

    // Ключи goal/macroGoals/desiredWeight шлём только по готовности профиля:
    // отсутствие ключа = «не трогать сохранённое» на стороне бота.
    if (isProfileReady()) {
      payload.goal = goalToggleEl.checked ? { type: selectedGoalType } : null;
    }

    if (isProfileReady() && macro.available) {
      if (macro.enabled) {
        payload.macroGoals = buildMacroGoalsPayload();
        payload.desiredWeight = macro.desiredWeight != null ? macro.desiredWeight : null;
      } else if (macro.savedHadGoals) {
        payload.macroGoals = null;
      }
    }

    if (typeof chatId === 'number' && chatId > 0) {
      payload.data.chatId = chatId;
    }

    resultEl.innerHTML = `<p class="status--sending">${t.sending}</p>`;
    resultEl.classList.add('visible');
    calculateButtonEl.disabled = true;

    try {
      const response = await fetch(`${API_BASE_URL}/bot/mbr`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Source-App': 'BMR-Calculator'
        },
        body: JSON.stringify(payload),
        mode: 'cors'
      });
      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} - ${response.statusText}`);
      }
      resultEl.innerHTML = `<p class="status--success">${t.success}</p>`;

      if (isEdit) {
        // Точка входа 1: возврат в Профиль
        window.location.href = '../profile/';
      } else {
        // Точка входа 2 (онбординг): закрыть мини-апп
        if (tg && typeof tg.close === 'function') {
          tg.close();
        }
      }
    } catch (error) {
      console.error('Ошибка отправки:', error);
      resultEl.innerHTML = `<p class="status--error">${t.error}${error.message}</p>`;
      calculateButtonEl.disabled = false;
    }
  }

  // ── Тема (Telegram-driven, как в history/profile/stats) ──
  // Красим по tg.colorScheme + tg.themeParams, НЕ по prefers-color-scheme.
  function applyTheme(themeParams = {}, colorScheme = (tg && tg.colorScheme)) {
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

    // Общий набор (совпадает с history/profile)
    root.style.setProperty('--bg-color', background);
    root.style.setProperty('--card-bg', secondaryBackground);
    root.style.setProperty('--card-elevated-bg', isLight ? '#ffffff' : 'rgba(255, 255, 255, 0.05)');
    root.style.setProperty('--text-color', textColor);
    root.style.setProperty('--text-secondary', hintColor);
    root.style.setProperty('--accent-color', accentColor);
    root.style.setProperty('--accent-contrast', accentContrast);
    root.style.setProperty('--destructive-color', destructiveColor);
    root.style.setProperty('--separator-color', isLight ? 'rgba(15, 23, 42, 0.1)' : 'rgba(255, 255, 255, 0.08)');
    root.style.setProperty('--border-color', isLight ? 'rgba(15, 23, 42, 0.08)' : 'rgba(255, 255, 255, 0.06)');
    root.style.setProperty('--shadow-soft', isLight ? '0 4px 14px rgba(15, 23, 42, 0.12)' : '0 6px 16px rgba(0, 0, 0, 0.18)');

    // BMR-специфичные токены (значения из прежнего :root / light-блока style.css)
    root.style.setProperty('--accent-soft', isLight ? 'rgba(255, 100, 34, 0.12)' : 'rgba(255, 100, 34, 0.16)');
    root.style.setProperty('--accent-border', isLight ? 'rgba(255, 100, 34, 0.3)' : 'rgba(255, 100, 34, 0.25)');
    root.style.setProperty('--track-color', isLight ? '#d6dae0' : '#48484a');
  }

  // ── Telegram init ──
  function initTelegram() {
    tg = window.Telegram && window.Telegram.WebApp;
    if (!tg) {
      // Без Telegram остаёмся на тёмных дефолтах из :root.
      return;
    }
    try {
      tg.expand();
    } catch (_) { /* noop */ }

    // Тема Telegram + реакция на её смену.
    applyTheme(tg.themeParams, tg.colorScheme);
    try {
      tg.onEvent('themeChanged', () => applyTheme(tg.themeParams, tg.colorScheme));
    } catch (_) { /* noop */ }

    const tgUser = tg.initDataUnsafe && tg.initDataUnsafe.user;
    if (tgUser && tgUser.id) {
      chatId = tgUser.id;
    }
    if (tgUser && tgUser.language_code) {
      const tgLocale = normalizeLocale(tgUser.language_code);
      if (tgLocale) {
        setLocale(tgLocale);
        langLocked = true;
      }
    }

    if (tg.BackButton) {
      if (isEdit) {
        try {
          tg.BackButton.show();
          tg.BackButton.onClick(() => { window.location.href = '../profile/'; });
        } catch (_) { /* noop */ }
      } else {
        try { tg.BackButton.hide(); } catch (_) { /* noop */ }
      }
    }
  }

  // ── Подписки на события ──
  function bindEvents() {
    [heightEl, weightEl, ageEl].forEach((el) => {
      el.addEventListener('input', () => {
        el.value = digitsOnly(el.value, 3);
        el.closest('.metab-field').classList.remove('metab-field--error');
        const next = el.nextSibling;
        if (next && next.classList && next.classList.contains('field-error')) next.remove();
        refresh();
      });
    });

    // Подсветка активной строки при фокусе (особенно для онбординга)
    [heightEl, weightEl, ageEl].forEach((el) => {
      el.addEventListener('focus', () => {
        document.querySelectorAll('.metab-field--focus').forEach((f) => f.classList.remove('metab-field--focus'));
        el.closest('.metab-field').classList.add('metab-field--focus');
      });
      el.addEventListener('blur', () => {
        el.closest('.metab-field').classList.remove('metab-field--focus');
      });
    });

    genderMaleEl.addEventListener('click', () => setGender('m'));
    genderFemaleEl.addEventListener('click', () => setGender('f'));

    activityRangeEl.addEventListener('input', () => {
      updateActivityDescription();
      refresh();
    });

    goalToggleEl.addEventListener('change', () => {
      goalSegEl.hidden = !goalToggleEl.checked;
      if (goalToggleEl.checked && !goalDeficitEl.classList.contains('segmented__item--active')
          && !goalSurplusEl.classList.contains('segmented__item--active')) {
        setGoalType('deficit');
      } else {
        refresh();
      }
    });

    goalDeficitEl.addEventListener('click', () => setGoalType('deficit'));
    goalSurplusEl.addEventListener('click', () => setGoalType('surplus'));

    macroToggleEl.addEventListener('change', () => {
      macro.enabled = macroToggleEl.checked;
      if (macro.enabled && !macro.presetId) {
        const defs = macroChipDefs();
        macro.presetId = defs.length ? defs[0].id : 'custom';
      }
      updateMacroSection();
    });

    macroRefCurrentEl.addEventListener('change', () => {
      if (macroRefCurrentEl.checked) {
        macro.ref = 'current';
        updateMacroSection();
      }
    });

    macroRefDesiredEl.addEventListener('change', () => {
      if (macroRefDesiredEl.checked) {
        macro.ref = 'desired';
        updateMacroSection();
      }
    });

    desiredWeightEl.addEventListener('input', () => {
      desiredWeightEl.value = digitsOnly(desiredWeightEl.value, 3);
      setDesiredWeightRaw(desiredWeightEl.value);
      updateMacroSection();
    });

    profileBannerBtnEl.addEventListener('click', () => {
      prefillFromProfile();
    });

    macroBannerBtnEl.addEventListener('click', () => {
      macro.custom.carbs = null;
      updateMacroSection();
    });

    document.getElementById('bmr-form').addEventListener('submit', handleSubmit);
  }

  // ── Инициализация ──
  function init() {
    initTelegram();
    renderPreferenceChips();
    buildMacroRows();
    applyText();
    applyPresentation();
    updateActivityDescription();
    bindEvents();
    refresh();

    // Префилл — ВСЕГДА, независимо от точки входа. Если /api/profile вернёт
    // bmrInputs — поля заполнятся, hasData=true, и вид переключится на edit.
    prefillFromProfile();

    if (!isEdit) {
      // Вход из меню бота: автофокус на первом поле (открывает клавиатуру).
      // Для существующего юзера фокус безвреден — данные приедут асинхронно
      // и заполнят форму. Из Профиля (?mode=edit) фокус не навязываем.
      try { heightEl.focus({ preventScroll: false }); } catch (_) { heightEl.focus(); }
    }
  }

  init();
});
