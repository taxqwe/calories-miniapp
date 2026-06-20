document.addEventListener('DOMContentLoaded', () => {
  const API_BASE_URL = window.CaloriesMiniAppConfig?.apiBaseUrl || 'https://caloriesai.duckdns.org';

  // Поддерживаемые локали
  const supportedLocales = ["ar", "de", "es", "fr", "hi", "ru", "tr", "uk", "en", "pt"];

  // Множители активности (Mifflin–St Jeor): уровни 1..5
  const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9];

  // Сдвиг по умолчанию для цели (дефицит/профицит), ккал
  const GOAL_DELTA = 300;

  // Диапазоны валидации
  const validationRanges = {
    height: { min: 100, max: 250 },
    weight: { min: 30, max: 300 },
    age: { min: 14, max: 120 },
    customCalories: { min: 1000, max: 20000 }
  };

  const translations = {
    en: {
      // header
      titleEdit: "Metabolism",
      titleFirst: "Let's calculate your norm",
      subtitleEdit: "How much energy your body spends per day. Mifflin–St Jeor formula.",
      subtitleFirst: "This is needed once — then everything is counted automatically.",
      backLabel: "Profile",
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
      goalDeficit: "Deficit · −300",
      goalSurplus: "Surplus · +300",
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
      backLabel: "Профиль",
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
      goalDeficit: "Дефицит · −300",
      goalSurplus: "Профицит · +300",
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
      backLabel: "Профіль",
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
      goalDeficit: "Дефіцит · −300",
      goalSurplus: "Профіцит · +300",
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
      backLabel: "Profil",
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
      goalDeficit: "Defizit · −300",
      goalSurplus: "Überschuss · +300",
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
      backLabel: "Perfil",
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
      goalDeficit: "Déficit · −300",
      goalSurplus: "Superávit · +300",
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
      backLabel: "Profil",
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
      goalDeficit: "Déficit · −300",
      goalSurplus: "Surplus · +300",
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
      backLabel: "Perfil",
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
      goalDeficit: "Déficit · −300",
      goalSurplus: "Superávit · +300",
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
      backLabel: "Profil",
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
      goalDeficit: "Açık · −300",
      goalSurplus: "Fazla · +300",
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
      backLabel: "الملف الشخصي",
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
      goalDeficit: "عجز · −300",
      goalSurplus: "فائض · +300",
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
      backLabel: "प्रोफ़ाइल",
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
      goalDeficit: "डेफिसिट · −300",
      goalSurplus: "सरप्लस · +300",
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
  const backBtnEl = document.getElementById('back-btn');
  const backLabelEl = document.getElementById('back-label');
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

  // ── Живой пересчёт / hero ──
  function updateHero() {
    const comp = getValidComputation();
    const multiplier = multipliers[parseInt(activityRangeEl.value, 10) - 1];
    if (comp) {
      const goalTarget = goalToggleEl.checked
        ? comp.tdee + (selectedGoalType === 'surplus' ? GOAL_DELTA : -GOAL_DELTA)
        : comp.tdee;
      heroValueEl.textContent = formatNumber(goalTarget);
      heroUnitEl.textContent = t.heroUnit;
      heroMetaEl.innerHTML = `${t.basalLabel}<br><b>${formatNumber(comp.bmr)}</b> · ×${formatMultiplier(multiplier)}`;
    } else {
      heroValueEl.textContent = t.heroEmpty;
      heroUnitEl.textContent = '';
      heroMetaEl.innerHTML = `${t.basalLabel}<br><span>${t.heroMetaWaiting}</span>`;
    }
  }

  // ── Кнопка + хинт ──
  function updateCtaState() {
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
    updateCtaState();
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

    backLabelEl.textContent = t.backLabel;
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

    // CTA: «Сохранить» когда есть данные (edit-вид), иначе «Рассчитать и сохранить».
    calculateButtonEl.textContent = hasData ? t.ctaEdit : t.ctaFirst;
    ctaHintEl.textContent = t.ctaHintFirst;
  }

  // ── Презентация: онбординг (нет данных) vs edit-вид (данные есть) ──
  // Завязана на hasData, а НЕ на точку входа. Навигацией (back-кнопка) рулит
  // отдельно applyNavigation() по isEdit.
  function applyPresentation() {
    if (hasData) {
      onbGuideEl.hidden = true;
      ctaHintEl.hidden = true;
    } else {
      onbGuideEl.hidden = false;
      ctaHintEl.hidden = false;
    }
  }

  // ── Навигация: кнопка «Назад» в шапке — только при входе из Профиля ──
  function applyNavigation() {
    backBtnEl.hidden = !isEdit;
  }

  // ── Префилл из профиля (режим edit) ──
  async function prefillFromProfile() {
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
      if (!response.ok) return;
      const data = await response.json();
      applyPrefill(data);
    } catch (error) {
      // Тихо: пустая форма допустима, если профиль недоступен
      console.warn('Не удалось получить профиль для префилла:', error);
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
    refresh();
  }

  // ── Submit: расчёт и сохранение ──
  async function handleSubmit(e) {
    e.preventDefault();
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
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

    if (hasErrors) {
      refresh();
      return;
    }

    const { bmr, tdee } = computeBmrTdee(height, weight, age, selectedGender, activityLevel);

    const goalInfo = goalToggleEl.checked ? { type: selectedGoalType } : null;

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
      goal: goalInfo,
      initData: (tg && tg.initData) || ''
    };

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

    backBtnEl.addEventListener('click', () => { window.location.href = '../profile/'; });

    document.getElementById('bmr-form').addEventListener('submit', handleSubmit);
  }

  // ── Инициализация ──
  function init() {
    initTelegram();
    applyText();
    applyPresentation();
    applyNavigation();
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
