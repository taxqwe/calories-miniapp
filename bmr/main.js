document.addEventListener('DOMContentLoaded', () => {
  // Поддерживаемые локали
  const supportedLocales = ["ar", "de", "es", "fr", "hi", "ru", "tr", "uk", "en"];
  
  // Объект с переводами для всех локалей
  const translations = {
    en: {
      mainTitle: "BMR and TDEE Calculator",
      formHeader: "Enter your data:",
      labelHeight: "Height (cm)",
      labelWeight: "Weight (kg)",
      labelAge: "Age (years)",
      labelGender: "Gender:",
      labelMale: "Male",
      labelFemale: "Female",
      labelActivity: "Physical Activity Level:",
      selectActivity: "Select level on the scale:",
      calculateButton: "Calculate and Send",
      resultTitle: "Result:",
      bmrResult: "BMR:",
      dailyCaloriesResult: "Daily Calories:",
      kcal: "calories/day",
      heightPlaceholder: "Example: 175",
      weightPlaceholder: "Example: 70",
      agePlaceholder: "Example: 30",
      descBMR: "BMR — Basal Metabolic Rate.",
      descTDEE: "TDEE — Total Daily Energy Expenditure.",
      tooltipBMR: "BMR (Basal Metabolic Rate) is the number of calories your body burns at rest over 24 hours. It's the basic energy requirement to maintain vital functions.",
      tooltipTDEE: "TDEE (Total Daily Energy Expenditure) is the total number of calories your body uses in a day, including physical activities.",
      validationErrors: { fillAll: "Please fill in all fields" },
      sending: "Sending data...",
      success: "✅ Data successfully sent!",
      error: "❌ Error sending data:",
      criticalError: "❌ Critical error:"
    },
    ru: {
      mainTitle: "Калькулятор BMR и TDEE",
      formHeader: "Внесите свои данные:",
      labelHeight: "Рост (см)",
      labelWeight: "Вес (кг)",
      labelAge: "Возраст (лет)",
      labelGender: "Пол:",
      labelMale: "Мужской",
      labelFemale: "Женский",
      labelActivity: "Уровень физической активности:",
      selectActivity: "Выберите уровень на шкале:",
      calculateButton: "Рассчитать и отправить",
      resultTitle: "Результат:",
      bmrResult: "BMR:",
      dailyCaloriesResult: "Калорий в день:",
      kcal: "калорий/день",
      heightPlaceholder: "Например, 175",
      weightPlaceholder: "Например, 70",
      agePlaceholder: "Например, 30",
      descBMR: "BMR — базовый метаболический уровень.",
      descTDEE: "TDEE — общий дневной расход энергии.",
      tooltipBMR: "BMR (Basal Metabolic Rate) — это количество калорий, которое ваш организм сжигает в состоянии покоя за 24 часа. Это базовая потребность организма в энергии для поддержания жизнедеятельности.",
      tooltipTDEE: "TDEE (Total Daily Energy Expenditure) — это суммарное количество калорий, затрачиваемое организмом за день, включая физическую активность.",
      validationErrors: { fillAll: "Пожалуйста, заполните все поля" },
      sending: "Отправка данных...",
      success: "✅ Данные успешно отправлены!",
      error: "❌ Ошибка отправки данных:",
      criticalError: "❌ Критическая ошибка:"
    },
    ar: {
      mainTitle: "حساب BMR و TDEE",
      formHeader: "أدخل بياناتك:",
      labelHeight: "الطول (سم)",
      labelWeight: "الوزن (كجم)",
      labelAge: "العمر (سنة)",
      labelGender: "الجنس:",
      labelMale: "ذكر",
      labelFemale: "أنثى",
      labelActivity: "مستوى النشاط البدني:",
      selectActivity: "اختر المستوى على المقياس:",
      calculateButton: "احسب وأرسل",
      resultTitle: "النتيجة:",
      bmrResult: "BMR:",
      dailyCaloriesResult: "السعرات الحرارية اليومية:",
      kcal: "سعر حراري/اليوم",
      heightPlaceholder: "مثال: 175",
      weightPlaceholder: "مثال: 70",
      agePlaceholder: "مثال: 30",
      descBMR: "BMR — معدل الأيض الأساسي.",
      descTDEE: "TDEE — إجمالي استهلاك الطاقة اليومي.",
      tooltipBMR: "BMR (Basal Metabolic Rate) هو عدد السعرات الحرارية التي يحرقها جسمك أثناء الراحة على مدار 24 ساعة. إنه الحد الأدنى من الطاقة المطلوبة للحفاظ على الوظائف الحيوية.",
      tooltipTDEE: "TDEE (Total Daily Energy Expenditure) هو إجمالي السعرات الحرارية التي يستهلكها جسمك في اليوم، بما في ذلك النشاط البدني.",
      validationErrors: { fillAll: "يرجى ملء جميع الحقول" },
      sending: "جاري إرسال البيانات...",
      success: "✅ تم إرسال البيانات بنجاح!",
      error: "❌ خطأ في إرسال البيانات:",
      criticalError: "❌ خطأ حرج:"
    },
    de: {
      mainTitle: "BMR- und TDEE-Rechner",
      formHeader: "Geben Sie Ihre Daten ein:",
      labelHeight: "Körpergröße (cm)",
      labelWeight: "Gewicht (kg)",
      labelAge: "Alter (Jahre)",
      labelGender: "Geschlecht:",
      labelMale: "Männlich",
      labelFemale: "Weiblich",
      labelActivity: "Körperliches Aktivitätsniveau:",
      selectActivity: "Wählen Sie den Level auf der Skala:",
      calculateButton: "Berechnen und Senden",
      resultTitle: "Ergebnis:",
      bmrResult: "BMR:",
      dailyCaloriesResult: "Tägliche Kalorien:",
      kcal: "kcal/Tag",
      heightPlaceholder: "Beispiel: 175",
      weightPlaceholder: "Beispiel: 70",
      agePlaceholder: "Beispiel: 30",
      descBMR: "BMR — Grundumsatz.",
      descTDEE: "TDEE — Gesamtumsatz pro Tag.",
      tooltipBMR: "Der BMR (Basal Metabolic Rate) ist die Menge an Kalorien, die Ihr Körper in Ruhe über 24 Stunden verbrennt. Dies ist der grundlegende Energiebedarf zur Aufrechterhaltung lebenswichtiger Funktionen.",
      tooltipTDEE: "Der TDEE (Total Daily Energy Expenditure) ist die Gesamtzahl der Kalorien, die Ihr Körper an einem Tag verbraucht, einschließlich körperlicher Aktivitäten.",
      validationErrors: { fillAll: "Bitte füllen Sie alle Felder aus" },
      sending: "Daten werden gesendet...",
      success: "✅ Daten erfolgreich gesendet!",
      error: "❌ Fehler beim Senden der Daten:",
      criticalError: "❌ Kritischer Fehler:"
    },
    es: {
      mainTitle: "Calculadora de BMR y TDEE",
      formHeader: "Ingrese sus datos:",
      labelHeight: "Estatura (cm)",
      labelWeight: "Peso (kg)",
      labelAge: "Edad (años)",
      labelGender: "Género:",
      labelMale: "Hombre",
      labelFemale: "Mujer",
      labelActivity: "Nivel de actividad física:",
      selectActivity: "Seleccione el nivel en la escala:",
      calculateButton: "Calcular y Enviar",
      resultTitle: "Resultado:",
      bmrResult: "BMR:",
      dailyCaloriesResult: "Calorías diarias:",
      kcal: "kcal/día",
      heightPlaceholder: "Ejemplo: 175",
      weightPlaceholder: "Ejemplo: 70",
      agePlaceholder: "Ejemplo: 30",
      descBMR: "BMR — Tasa Metabólica Basal.",
      descTDEE: "TDEE — Gasto Energético Total Diario.",
      tooltipBMR: "La BMR (Tasa Metabólica Basal) es la cantidad de calorías que tu cuerpo quema en reposo durante 24 horas. Es el requerimiento básico de energía para mantener las funciones vitales.",
      tooltipTDEE: "El TDEE (Gasto Energético Total Diario) es la cantidad total de calorías que tu cuerpo usa en un día, incluyendo actividades físicas.",
      validationErrors: { fillAll: "Por favor, complete todos los campos" },
      sending: "Enviando datos...",
      success: "✅ ¡Datos enviados con éxito!",
      error: "❌ Error al enviar los datos:",
      criticalError: "❌ Error crítico:"
    },
    fr: {
      mainTitle: "Calculateur de BMR et TDEE",
      formHeader: "Entrez vos informations :",
      labelHeight: "Taille (cm)",
      labelWeight: "Poids (kg)",
      labelAge: "Âge (ans)",
      labelGender: "Sexe :",
      labelMale: "Homme",
      labelFemale: "Femme",
      labelActivity: "Niveau d'activité physique :",
      selectActivity: "Sélectionnez le niveau sur l'échelle :",
      calculateButton: "Calculer et Envoyer",
      resultTitle: "Résultat :",
      bmrResult: "BMR :",
      dailyCaloriesResult: "Calories quotidiennes :",
      kcal: "kcal/jour",
      heightPlaceholder: "Exemple : 175",
      weightPlaceholder: "Exemple : 70",
      agePlaceholder: "Exemple : 30",
      descBMR: "BMR — Taux métabolique de base.",
      descTDEE: "TDEE — Dépense énergétique quotidienne totale.",
      tooltipBMR: "Le BMR (Basal Metabolic Rate) est la quantité de calories que votre corps brûle au repos pendant 24 heures. C'est le besoin énergétique de base pour maintenir les fonctions vitales.",
      tooltipTDEE: "Le TDEE (Total Daily Energy Expenditure) est la quantité totale de calories que votre corps utilise en une journée, y compris les activités physiques.",
      validationErrors: { fillAll: "Veuillez remplir tous les champs" },
      sending: "Envoi des données...",
      success: "✅ Données envoyées avec succès !",
      error: "❌ Erreur lors de l'envoi des données :",
      criticalError: "❌ Erreur critique :"
    },
    hi: {
      mainTitle: "BMR और TDEE कैलकुलेटर",
      formHeader: "अपनी जानकारी दर्ज करें:",
      labelHeight: "ऊँचाई (सेमी)",
      labelWeight: "वज़न (किग्रा)",
      labelAge: "उम्र (साल)",
      labelGender: "लिंग:",
      labelMale: "पुरुष",
      labelFemale: "महिला",
      labelActivity: "शारीरिक गतिविधि का स्तर:",
      selectActivity: "स्केल पर स्तर चुनें:",
      calculateButton: "गणना करें और भेजें",
      resultTitle: "परिणाम:",
      bmrResult: "BMR:",
      dailyCaloriesResult: "दैनिक कैलोरी:",
      kcal: "कैलोरी/दिन",
      heightPlaceholder: "उदाहरण: 175",
      weightPlaceholder: "उदाहरण: 70",
      agePlaceholder: "उदाहरण: 30",
      descBMR: "BMR — बेसल मेटाबॉलिक रेट.",
      descTDEE: "TDEE — कुल दैनिक ऊर्जा व्यय.",
      tooltipBMR: "BMR (Basal Metabolic Rate) वह कैलोरी की मात्रा है जो आपका शरीर 24 घंटे के आराम में जलाता है। यह महत्वपूर्ण शारीरिक कार्यों को बनाए रखने के लिए आवश्यक मूलभूत ऊर्जा है।",
      tooltipTDEE: "TDEE (Total Daily Energy Expenditure) वह कुल कैलोरी है जो आपका शरीर एक दिन में उपयोग करता है, जिसमें शारीरिक गतिविधियाँ शामिल हैं।",
      validationErrors: { fillAll: "कृपया सभी फ़ील्ड भरें" },
      sending: "डेटा भेजे जा रहे हैं...",
      success: "✅ डेटा सफलतापूर्वक भेजे गए!",
      error: "❌ डेटा भेजने में त्रुटि:",
      criticalError: "❌ गंभीर त्रुटि:"
    },
    tr: {
      mainTitle: "BMR ve TDEE Hesaplayıcı",
      formHeader: "Verilerinizi girin:",
      labelHeight: "Boy (cm)",
      labelWeight: "Kilo (kg)",
      labelAge: "Yaş (yıl)",
      labelGender: "Cinsiyet:",
      labelMale: "Erkek",
      labelFemale: "Kadın",
      labelActivity: "Fiziksel Aktivite Seviyesi:",
      selectActivity: "Ölçekteki seviyeyi seçin:",
      calculateButton: "Hesapla ve Gönder",
      resultTitle: "Sonuç:",
      bmrResult: "BMR:",
      dailyCaloriesResult: "Günlük Kalori:",
      kcal: "kalori/gün",
      heightPlaceholder: "Örneğin: 175",
      weightPlaceholder: "Örneğin: 70",
      agePlaceholder: "Örneğin: 30",
      descBMR: "BMR — Bazal Metabolizma Hızı.",
      descTDEE: "TDEE — Toplam Günlük Enerji Harcaması.",
      tooltipBMR: "BMR (Bazal Metabolizma Hızı), vücudunuzun 24 saatlik dinlenme süresince yaktığı kalori miktarıdır. Hayati fonksiyonları sürdürmek için gereken temel enerji ihtiyacıdır.",
      tooltipTDEE: "TDEE (Toplam Günlük Enerji Harcaması), fiziksel aktiviteler dahil olmak üzere vücudunuzun bir günde kullandığı toplam kalori miktarıdır.",
      validationErrors: { fillAll: "Lütfen tüm alanları doldurun" },
      sending: "Veriler gönderiliyor...",
      success: "✅ Veriler başarıyla gönderildi!",
      error: "❌ Veriler gönderilirken hata:",
      criticalError: "❌ Kritik hata:"
    },
    uk: {
      mainTitle: "Калькулятор BMR та TDEE",
      formHeader: "Введіть ваші дані:",
      labelHeight: "Зріст (см)",
      labelWeight: "Вага (кг)",
      labelAge: "Вік (років)",
      labelGender: "Стать:",
      labelMale: "Чоловіча",
      labelFemale: "Жіноча",
      labelActivity: "Рівень фізичної активності:",
      selectActivity: "Оберіть рівень на шкалі:",
      calculateButton: "Розрахувати і відправити",
      resultTitle: "Результат:",
      bmrResult: "BMR:",
      dailyCaloriesResult: "Денна кількість калорій:",
      kcal: "ккал/день",
      heightPlaceholder: "Наприклад: 175",
      weightPlaceholder: "Наприклад: 70",
      agePlaceholder: "Наприклад: 30",
      descBMR: "BMR — базальний метаболічний рівень.",
      descTDEE: "TDEE — загальні добові витрати енергії.",
      tooltipBMR: "BMR (Basal Metabolic Rate) — це кількість калорій, які організм спалює в стані спокою за 24 години. Це базова потреба в енергії для підтримання життєво важливих функцій.",
      tooltipTDEE: "TDEE (Total Daily Energy Expenditure) — це загальна кількість калорій, які організм витрачає за день, враховуючи фізичну активність.",
      validationErrors: { fillAll: "Будь ласка, заповніть усі поля" },
      sending: "Відправка даних...",
      success: "✅ Дані успішно відправлено!",
      error: "❌ Помилка відправки даних:",
      criticalError: "❌ Критична помилка:"
    }
  };

  // DOM-элементы
  const mainTitleEl = document.getElementById('main-title');
  const descBmrEl = document.getElementById('desc-bmr');
  const descTdeeEl = document.getElementById('desc-tdee');
  const formHeaderEl = document.getElementById('form-header');
  const heightEl = document.getElementById('height');
  const weightEl = document.getElementById('weight');
  const ageEl = document.getElementById('age');
  const labelGenderEl = document.getElementById('label-gender');
  const labelMaleEl = document.getElementById('label-male');
  const labelFemaleEl = document.getElementById('label-female');
  const labelActivityEl = document.getElementById('label-activity');
  const selectActivityEl = document.getElementById('select-activity');
  const activityRangeEl = document.getElementById('activityRange');
  activityRangeEl.addEventListener('input', updateActivityDescription);
  const activityDescriptionEl = document.getElementById('activityDescription');
  const calculateButtonEl = document.getElementById('calculate-button');
  const resultEl = document.getElementById('result');
  const tooltipBmrEl = document.getElementById('tooltip-bmr');
  const tooltipTdeeEl = document.getElementById('tooltip-tdee');

  // Состояние
  const urlParams = new URLSearchParams(window.location.search || '');
  let isDebugMode = urlParams.get('debug') === 'true';
  let currentDate = new Date();
  let chatId = null;
  let initDataRaw = null;
  const langParam = urlParams.get('lang');
  const lang = (langParam && supportedLocales.includes(langParam)) ? langParam : "en";


  // Функция обновления текста на странице
  function updateText() {
  const t = translations[lang] || translations["en"];
  document.title = t.mainTitle;
  mainTitleEl.innerText = t.mainTitle;
  formHeaderEl.innerText = t.formHeader;
  
  // Создаем динамически содержимое для описания
  descBmrEl.innerHTML = t.descBMR + ' <span class="info-tooltip"><span class="info-icon">i</span><span class="tooltip-text" id="tooltip-bmr"></span></span>';
  descTdeeEl.innerHTML = t.descTDEE + ' <span class="info-tooltip"><span class="info-icon">i</span><span class="tooltip-text" id="tooltip-tdee"></span></span>';
  
  // Получаем элементы после установки innerHTML
  const tooltipBmrEl = document.getElementById('tooltip-bmr');
  const tooltipTdeeEl = document.getElementById('tooltip-tdee');
  tooltipBmrEl.innerText = t.tooltipBMR;
  tooltipTdeeEl.innerText = t.tooltipTDEE;
  
  document.getElementById('label-height').innerText = t.labelHeight;
  document.getElementById('label-weight').innerText = t.labelWeight;
  document.getElementById('label-age').innerText = t.labelAge;
  labelGenderEl.innerText = t.labelGender;
  labelMaleEl.innerText = t.labelMale;
  labelFemaleEl.innerText = t.labelFemale;
  labelActivityEl.innerText = t.labelActivity;
  selectActivityEl.innerText = t.selectActivity;
  calculateButtonEl.innerText = t.calculateButton;
  heightEl.placeholder = t.heightPlaceholder;
  weightEl.placeholder = t.weightPlaceholder;
  ageEl.placeholder = t.agePlaceholder;
  updateActivityDescription();
  setupTooltips();
}


  // Функция обновления описания активности
  function updateActivityDescription() {
    const levels = {
      1: { title: "Sedentary (minimal activity)", details: "You spend most of your day sitting and rarely exercise." },
      2: { title: "Light activity (1-3 workouts per week)", details: "You do some light exercise or walking several times a week." },
      3: { title: "Moderate activity (3-5 workouts per week)", details: "You exercise several times a week, maintaining good physical condition." },
      4: { title: "High activity (6-7 workouts per week)", details: "You regularly engage in sports, requiring good physical fitness." },
      5: { title: "Very high activity (intensive training)", details: "You have an intensive training regime, possibly with multiple workouts per day." }
    };
    const level = activityRangeEl.value;
    const activity = levels[level];
    activityDescriptionEl.innerHTML = `<div class="activity-level">${activity.title}</div>
      <div class="activity-details">${activity.details}</div>`;
  }

  // Обработка всплывающих подсказок
  function setupTooltips() {
    document.querySelectorAll('.info-icon').forEach(icon => {
      icon.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const tooltipContainer = this.parentNode;
        document.querySelectorAll('.info-tooltip.active').forEach(tip => {
          if (tip !== tooltipContainer) {
            tip.classList.remove('active');
          }
        });
        tooltipContainer.classList.toggle('active');
      });
    });
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.info-tooltip')) {
        document.querySelectorAll('.info-tooltip.active').forEach(tip => tip.classList.remove('active'));
      }
    });
  }

let tg;

  // Инициализация приложения
  function init() {
    updateText();
    tg = window.Telegram.WebApp;
    tg.expand();
    initDataRaw = tg.initData;
    if (tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.id) {
      chatId = tg.initDataUnsafe.user.id;
    } else {
      const initData = JSON.parse(tg.initData);
      if (initData.user && initData.user.id) {
        chatId = initData.user.id;
      }
    }
    if (!chatId) {
      throw new Error('Не удалось получить идентификатор пользователя');
    }
  }

  // Обработка отправки формы – расчет BMR и ежедневных калорий
  document.getElementById('bmr-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    document.activeElement.blur();
    
    const height = parseFloat(heightEl.value);
    const weight = parseFloat(weightEl.value);
    const age = parseFloat(ageEl.value);
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const activityLevel = parseInt(activityRangeEl.value, 10);
    const t = translations[lang] || translations["en"];
    
    if (!height || !weight || !age || !gender) {
      alert(t.validationErrors.fillAll);
      return;
    }
    
    let bmr;
    if (gender === 'm' || gender === 'м') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
    const tdee = bmr * multipliers[activityLevel - 1];
    
    const payload = {
      data: {
        height: height,
        weight: weight,
        age: age,
        gender: gender,
        activityLevel: activityLevel,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee) // именно tdee, как было раньше
      },
      initData: window.Telegram.WebApp.initData
    };

    if (typeof chatId === 'number' && chatId > 0) {
      payload.data.chatId = chatId;
    }
    
    resultEl.innerHTML = `<h3>${t.resultTitle}</h3>
      <p>${t.bmrResult} <strong>${Math.round(bmr)}</strong> ${t.kcal}</p>
      <p>${t.dailyCaloriesResult} <strong>${Math.round(tdee)}</strong> ${t.kcal}</p>
      <p class="sending-status">${t.sending}</p>`;
    resultEl.classList.add('visible');
    
    try {
      const response = await fetch('https://calories-bot.duckdns.org:8443/bot/mbr', {
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
        throw new Error(`Ошибка HTTP: ${response.status} - ${response.statusText}`);
      }
      resultEl.innerHTML += `<p class="success-status">${t.success}</p>`;
      tg.close();
    } catch (error) {
      console.error("Ошибка отправки:", error);
      resultEl.innerHTML += `<p class="error-status">${t.error} ${error.message}</p>`;
      alert(`Критическая ошибка: ${error.message}`);
    }
  });
  
  function updateCalendarSize() {
    const containerWidth = document.querySelector('.container').offsetWidth;
    const daySize = (containerWidth - 10) / 7;
    document.documentElement.style.setProperty('--day-size', `${daySize}px`);
  }
  window.addEventListener('resize', updateCalendarSize);
  
  updateCalendarSize();
  init();
});
