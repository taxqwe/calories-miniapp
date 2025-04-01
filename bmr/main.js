(function() {
  // Поддерживаемые локали
  const supportedLocales = ["ar", "de", "es", "fr", "hi", "ru", "tr", "uk", "en"];
  
  // Получаем параметр lang из URL, если он поддерживается, иначе — английский
  const urlParams = new URLSearchParams(window.location.search);
  let langParam = urlParams.get('lang');
  let lang = (langParam && supportedLocales.includes(langParam)) ? langParam : "en";
  
  // Объект переводов для страницы BMR калькулятора
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
      activityLevels: {
        1: { title: "Сидячий образ жизни (минимальная активность)", description: "Вы проводите большую часть дня в сидячем положении и практически не занимаетесь спортом." },
        2: { title: "Легкая активность (1-3 тренировок в неделю)", description: "Вы немного двигаетесь, ходите пешком или занимаетесь легкими упражнениями." },
        3: { title: "Умеренная активность (3-5 тренировок в неделю)", description: "Вы тренируетесь несколько раз в неделю, поддерживая хорошую физическую форму." },
        4: { title: "Высокая активность (6-7 тренировок в неделю)", description: "Вы регулярно занимаетесь спортом, что требует хорошей физической подготовки." },
        5: { title: "Очень высокая активность (интенсивные тренировки)", description: "У вас интенсивный тренировочный режим, возможно, с несколькими тренировками в день." }
      }
    },
    // Дополнительные локали (ar, de, es, fr, hi, tr, uk) можно добавить аналогичным образом...
    // Для краткости здесь приведены только en и ru, остальные добавляются по аналогии.
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
  const activityDescriptionEl = document.getElementById('activityDescription');
  const calculateButtonEl = document.getElementById('calculate-button');
  const resultEl = document.getElementById('result');

  // Перевод для всплывающих подсказок (используем в блоке описания)
  const tooltipBmrEl = document.getElementById('tooltip-bmr');
  const tooltipTdeeEl = document.getElementById('tooltip-tdee');

  // Состояние
  let currentDate = new Date();
  let chatId = null;
  let initDataRaw = null;
  let caloriesData = {}; // не используется для BMR калькулятора, но может быть в дальнейшем
  let isDebugMode = urlParams.get('debug') === 'true';

  // Функция обновления текста на странице
  function updateText() {
    const t = translations[lang];
    document.title = t.mainTitle;
    mainTitleEl.innerText = t.mainTitle;
    formHeaderEl.innerText = t.formHeader;
    descBmrEl.innerHTML = t.descBMR + ' <span class="info-tooltip"><span class="info-icon">i</span><span class="tooltip-text" id="tooltip-bmr"></span></span>';
    descTdeeEl.innerHTML = t.descTDEE + ' <span class="info-tooltip"><span class="info-icon">i</span><span class="tooltip-text" id="tooltip-tdee"></span></span>';
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
    // Обновляем описание уровня активности – здесь можно использовать фиксированные описания, если их не переводим
    updateActivityDescription();
    setupTooltips();
  }

  // Обновление описания активности (здесь можно оставить фиксированные строки)
  function updateActivityDescription() {
    // Пример: оставляем без перевода, или можно добавить перевод в объект translations.activityLevels
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
        document.querySelectorAll('.info-tooltip.active').forEach(tip => {
          tip.classList.remove('active');
        });
      }
    });
  }

  // Инициализация приложения без дополнительного ожидания
  function init() {
    updateText();
    const tg = window.Telegram.WebApp;
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
    // Здесь можно выполнять дополнительные действия, если необходимо
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
    
    const t = translations[lang];
    if (!height || !weight || !age || !gender) {
      alert(t.validationErrors.fillAll);
      return;
    }
    
    // Расчет BMR по формуле Миффлина-Сан Жеора
    let bmr;
    if (gender === 'm' || gender === 'м') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    // Множитель активности
    const multipliers = [1.2, 1.375, 1.55, 1.725, 1.9];
    const tdee = bmr * multipliers[activityLevel - 1]; // это общие калории
    // Формируем payload согласно исходной рабочей версии
    const payload = {
      chatId: chatId,
      height: height,
      weight: weight,
      age: age,
      gender: gender,
      activityLevel: activityLevel,
      bmr: Math.round(bmr),
      dailyCalories: Math.round(tdee),
      initData: window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp.initData : ''
    };
    
    // Вывод результата на страницу (можно оставить для отладки)
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<h3>${t.resultTitle}</h3>
      <p>${t.bmrResult} <strong>${Math.round(bmr)}</strong> ${t.kcal}</p>
      <p>${t.dailyCaloriesResult} <strong>${Math.round(tdee)}</strong> ${t.kcal}</p>
      <p class="sending-status">${t.sending || "Sending data..."}</p>`;
    resultDiv.classList.add('visible');
    
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
      
      resultDiv.innerHTML += `<p class="success-status">${t.success || "Data successfully sent!"}</p>`;
      // Закрываем окно приложения, если нужно
      window.Telegram.WebApp.close();
    } catch (error) {
      console.error("Ошибка отправки:", error);
      resultDiv.innerHTML += `<p class="error-status">${t.error || "Error sending data:"} ${error.message}</p>`;
      alert(`Критическая ошибка: ${error.message}`);
    }
  });
  
  // Адаптивное обновление размера (например, для календаря, если потребуется)
  function updateCalendarSize() {
    const containerWidth = document.querySelector('.container').offsetWidth;
    const daySize = (containerWidth - 10) / 7;
    document.documentElement.style.setProperty('--day-size', `${daySize}px`);
  }
  window.addEventListener('resize', updateCalendarSize);
  
  // Запуск базовой инициализации
  init();
})();
