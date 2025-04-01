(function() {
  // Список поддерживаемых локалей
  const supportedLocales = ["ar", "de", "es", "fr", "hi", "ru", "tr", "uk", "en"];
  const urlParams = new URLSearchParams(window.location.search);
  let langParam = urlParams.get('lang');
  // Если параметр отсутствует или не поддерживается – используем английский
  let lang = (langParam && supportedLocales.includes(langParam)) ? langParam : "en";

  // Объект переводов для BMR калькулятора
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
      dailyCaloriesResult: "TDEE:",
      kcal: "calories/day",
      heightPlaceholder: "Example: 175",
      weightPlaceholder: "Example: 70",
      agePlaceholder: "Example: 30",
      descBMR: "BMR — Basal Metabolic Rate.",
      descTDEE: "TDEE — Total Daily Energy Expenditure.",
      tooltipBMR: "BMR (Basal Metabolic Rate) is the number of calories your body burns at rest over 24 hours. It is your body's basic energy requirement for maintaining vital functions.",
      tooltipTDEE: "TDEE (Total Daily Energy Expenditure) is the total number of calories your body uses in a day, including physical activities.",
      validationErrors: { fillAll: "Please fill in all fields" },
      activityLevels: {
        1: { title: "Sedentary (minimal activity)", description: "You spend most of your day sitting and rarely exercise." },
        2: { title: "Light activity (1-3 workouts per week)", description: "You do some light exercise or walking several times a week." },
        3: { title: "Moderate activity (3-5 workouts per week)", description: "You exercise several times a week, maintaining good physical condition." },
        4: { title: "High activity (6-7 workouts per week)", description: "You regularly engage in sports, requiring good physical fitness." },
        5: { title: "Very high activity (intensive training)", description: "You have an intensive training regime, possibly with multiple workouts per day." }
      }
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
      dailyCaloriesResult: "TDEE:",
      kcal: "калорий/день",
      heightPlaceholder: "Например, 175",
      weightPlaceholder: "Например, 70",
      agePlaceholder: "Например, 30",
      descBMR: "BMR — базовый метаболический уровень.",
      descTDEE: "TDEE — общий дневной расход энергии.",
      tooltipBMR: "BMR (Basal Metabolic Rate) — это количество калорий, которое ваш организм сжигает в состоянии покоя за 24 часа. Это базовая потребность организма в энергии для поддержания жизнедеятельности.",
      tooltipTDEE: "TDEE (Total Daily Energy Expenditure) — это суммарное количество калорий, затрачиваемое организмом за день, включая физическую активность.",
      validationErrors: { fillAll: "Пожалуйста, заполните все поля" },
      activityLevels: {
        1: { title: "Сидячий образ жизни (минимальная активность)", description: "Вы проводите большую часть дня в сидячем положении и практически не занимаетесь спортом." },
        2: { title: "Легкая активность (1-3 тренировок в неделю)", description: "Вы немного двигаетесь, ходите пешком или занимаетесь легкими упражнениями." },
        3: { title: "Умеренная активность (3-5 тренировок в неделю)", description: "Вы тренируетесь несколько раз в неделю, поддерживая хорошую физическую форму." },
        4: { title: "Высокая активность (6-7 тренировок в неделю)", description: "Вы регулярно занимаетесь спортом, что требует хорошей физической подготовки." },
        5: { title: "Очень высокая активность (интенсивные тренировки)", description: "У вас интенсивный тренировочный режим, возможно, с несколькими тренировками в день." }
      }
    },
    // Здесь можно добавить переводы для других локалей (ar, de, es, fr, hi, tr, uk) аналогично...
    // Для примера добавим ещё один вариант:
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
      dailyCaloriesResult: "TDEE:",
      kcal: "kcal/Tag",
      heightPlaceholder: "Beispiel: 175",
      weightPlaceholder: "Beispiel: 70",
      agePlaceholder: "Beispiel: 30",
      descBMR: "BMR – Grundumsatz.",
      descTDEE: "TDEE – Gesamtumsatz pro Tag.",
      tooltipBMR: "Der BMR (Basal Metabolic Rate) ist die Menge an Kalorien, die Ihr Körper in Ruhe über 24 Stunden verbrennt. Dies ist der grundlegende Energiebedarf zur Aufrechterhaltung lebenswichtiger Funktionen.",
      tooltipTDEE: "Der TDEE (Total Daily Energy Expenditure) ist die Gesamtzahl der Kalorien, die Ihr Körper an einem Tag verbraucht, einschließlich körperlicher Aktivitäten.",
      validationErrors: { fillAll: "Bitte füllen Sie alle Felder aus" },
      activityLevels: {
        1: { title: "Sitzende Lebensweise (minimal aktiv)", description: "Sie verbringen die meiste Zeit des Tages sitzend und treiben selten Sport." },
        2: { title: "Leichte Aktivität (1-3 Workouts pro Woche)", description: "Gelegentlich machen Sie leichte Übungen oder gehen mehrmals pro Woche spazieren." },
        3: { title: "Mäßige Aktivität (3-5 Workouts pro Woche)", description: "Sie trainieren mehrmals pro Woche und halten eine gute Fitness." },
        4: { title: "Hohe Aktivität (6-7 Workouts pro Woche)", description: "Sie treiben regelmäßig Sport, was eine gute körperliche Verfassung erfordert." },
        5: { title: "Sehr hohe Aktivität (intensives Training)", description: "Sie haben ein intensives Trainingsprogramm, möglicherweise mit mehreren Einheiten pro Tag." }
      }
    }
    // Аналогично можно добавить остальные переводы.
  };

  // DOM-элементы
  const mainTitleEl = document.getElementById('main-title');
  const descBmrEl = document.getElementById('desc-bmr');
  const descTdeeEl = document.getElementById('desc-tdee');
  const formHeaderEl = document.getElementById('form-header');
  const labelHeightEl = document.getElementById('label-height');
  const labelWeightEl = document.getElementById('label-weight');
  const labelAgeEl = document.getElementById('label-age');
  const labelGenderEl = document.getElementById('label-gender');
  const labelMaleEl = document.getElementById('label-male');
  const labelFemaleEl = document.getElementById('label-female');
  const labelActivityEl = document.getElementById('label-activity');
  const selectActivityEl = document.getElementById('select-activity');
  const calculateButtonEl = document.getElementById('calculate-button');
  const heightInputEl = document.getElementById('height');
  const weightInputEl = document.getElementById('weight');
  const ageInputEl = document.getElementById('age');
  const activityRangeEl = document.getElementById('activityRange');
  const activityDescriptionEl = document.getElementById('activityDescription');
  const resultEl = document.getElementById('result');

  // Для отправки данных
  let chatId = null;
  let initDataRaw = null;

  // Состояние калькулятора
  let currentDate = new Date();
  let selectedActivityLevel = activityRangeEl.value;
  let translationsData = translations[lang];
  let caloriesResult = {}; // не используется в BMR, но можно сохранить расчёт

  // Функция обновления текста страницы (переводы)
  function updateText() {
    const t = translations[lang];
    document.title = t.mainTitle;
    mainTitleEl.innerText = t.mainTitle;
    formHeaderEl.innerText = t.formHeader;
    labelHeightEl.innerText = t.labelHeight;
    labelWeightEl.innerText = t.labelWeight;
    labelAgeEl.innerText = t.labelAge;
    labelGenderEl.innerText = t.labelGender;
    labelMaleEl.innerText = t.labelMale;
    labelFemaleEl.innerText = t.labelFemale;
    labelActivityEl.innerText = t.labelActivity;
    selectActivityEl.innerText = t.selectActivity;
    calculateButtonEl.innerText = t.calculateButton;
    heightInputEl.placeholder = t.heightPlaceholder;
    weightInputEl.placeholder = t.weightPlaceholder;
    ageInputEl.placeholder = t.agePlaceholder;
    // Описание для BMR и TDEE с подсказками
    descBmrEl.innerHTML = t.descBMR + 
      ' <span class="info-tooltip"><span class="info-icon">i</span><span class="tooltip-text" id="tooltip-bmr"></span></span>';
    descTdeeEl.innerHTML = t.descTDEE + 
      ' <span class="info-tooltip"><span class="info-icon">i</span><span class="tooltip-text" id="tooltip-tdee"></span></span>';
    document.getElementById('tooltip-bmr').innerText = t.tooltipBMR;
    document.getElementById('tooltip-tdee').innerText = t.tooltipTDEE;
    updateActivityDescription();
    setupTooltips();
  }

  // Обновление описания уровня активности по ползунку
  function updateActivityDescription() {
    const t = translations[lang];
    const level = activityRangeEl.value;
    const activity = t.activityLevels[level];
    activityDescriptionEl.innerHTML = `<div class="activity-level">${activity.title}</div>
      <div class="activity-details">${activity.description}</div>`;
  }

  activityRangeEl.addEventListener('input', updateActivityDescription);

  // Настройка всплывающих подсказок
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

  updateText();

  // Функция расчёта BMR и TDEE и отправки данных на сервер
  function calculateAndSend() {
    const height = parseFloat(heightInputEl.value);
    const weight = parseFloat(weightInputEl.value);
    const age = parseFloat(ageInputEl.value);
    const gender = document.querySelector('input[name="gender"]:checked')?.value;
    const activityLevel = parseInt(activityRangeEl.value, 10);
    if (!height || !weight || !age || !gender) {
      alert(translations[lang].validationErrors.fillAll);
      return;
    }
    // Расчёт по формуле Миффлина-Сан Жеора
    let bmr;
    if (gender === 'm' || gender === 'м') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
    const tdee = Math.round(bmr * multipliers[activityLevel - 1]);
    // Отображаем результат
    resultEl.innerHTML = `
      <h3>${translations[lang].resultTitle}</h3>
      <p><strong>${translations[lang].bmrResult}</strong> ${Math.round(bmr)} ${translations[lang].kcal}</p>
      <p><strong>${translations[lang].dailyCaloriesResult}</strong> ${tdee} ${translations[lang].kcal}</p>
    `;
    resultEl.classList.add('visible');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Подготовка данных для отправки
    const payload = {
      chatId: chatId,
      height: height,
      weight: weight,
      age: age,
      gender: gender,
      activityLevel: activityLevel,
      bmr: Math.round(bmr),
      tdee: tdee,
      initData: window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp.initData : ""
    };
    
    // Отправка данных на сервер (production endpoint)
    fetch('https://calories-bot.duckdns.org:8443/bot/mbr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source-App': 'BMR-Calculator'
      },
      body: JSON.stringify(payload)
    })
    .then(async response => {
      const responseText = await response.text();
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status} - ${response.statusText}`);
      }
      resultEl.innerHTML += `<p class="success-status">${translations[lang].success || "✅ Data successfully sent!"}</p>`;
      // Закрываем окно WebApp, если требуется
      if (window.Telegram && window.Telegram.WebApp) {
        window.Telegram.WebApp.close();
      }
      return responseText;
    })
    .catch(error => {
      console.error("Ошибка отправки:", error);
      resultEl.innerHTML += `<p class="error-status">${translations[lang].error || "❌ Error sending data:"} ${error.message}</p>`;
      alert(`Критическая ошибка: ${error.message}`);
    });
  }

  // Обработка отправки формы
  document.getElementById('bmr-form').addEventListener('submit', function(e) {
    e.preventDefault();
    calculateAndSend();
  });

  // Telegram WebApp интеграция (без ожидания)
  function initTelegram() {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();
      try {
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
          throw new Error("Не удалось получить идентификатор пользователя");
        }
      } catch (error) {
        console.error("Ошибка получения Telegram данных:", error);
        alert("Ошибка получения данных Telegram");
      }
    } else {
      console.error("Telegram WebApp API не найден!");
      alert("Telegram WebApp API не найден!");
    }
  }

  initTelegram();

  // Функция для адаптивного размера календаря (если используется)
  function updateCalendarSize() {
    const containerWidth = document.querySelector('.container').offsetWidth;
    const daySize = (containerWidth - 10) / 7;
    document.documentElement.style.setProperty('--day-size', `${daySize}px`);
  }
  window.addEventListener('resize', updateCalendarSize);
  updateCalendarSize();

  // Здесь можно добавить дополнительные функции для мобильной клавиатуры и т.п.
  function handleKeyboardVisibility() {
    const container = document.querySelector('.container');
    heightInputEl.addEventListener('focus', () => container.classList.add('keyboard-open'));
    weightInputEl.addEventListener('focus', () => container.classList.add('keyboard-open'));
    ageInputEl.addEventListener('focus', () => container.classList.add('keyboard-open'));
    heightInputEl.addEventListener('blur', () => container.classList.remove('keyboard-open'));
    weightInputEl.addEventListener('blur', () => container.classList.remove('keyboard-open'));
    ageInputEl.addEventListener('blur', () => container.classList.remove('keyboard-open'));
  }
  handleKeyboardVisibility();
})();
