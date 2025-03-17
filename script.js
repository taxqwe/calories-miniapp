(function() {
    const tg = window.Telegram.WebApp;
    tg.expand();

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const secret = getQueryParam('secret') || '';

    // Обновление описания активности в зависимости от выбранного значения
    const activityRange = document.getElementById('activityRange');
    const activityDescription = document.getElementById('activityDescription');

    const activityTexts = {
      1: {
        level: "Сидячий образ жизни (минимальная активность)",
        details: "Вы проводите большую часть дня в сидячем положении и практически не занимаетесь спортом."
      },
      2: {
        level: "Легкая активность (1-3 тренировки в неделю)",
        details: "Вы немного двигаетесь, ходите пешком или занимаетесь легкими упражнениями несколько раз в неделю."
      },
      3: {
        level: "Умеренная активность (3-5 тренировок в неделю)",
        details: "Вы тренируетесь несколько раз в неделю, поддерживая хорошую физическую форму."
      },
      4: {
        level: "Высокая активность (6-7 тренировок в неделю)",
        details: "Вы регулярно занимаетесь спортом, что требует хорошей физической подготовки."
      },
      5: {
        level: "Очень высокая активность (интенсивные тренировки)",
        details: "У вас интенсивный тренировочный режим, возможно, с несколькими тренировками в день, что требует высокой выносливости."
      }
    };

    activityRange.addEventListener('input', function() {
      const activity = activityTexts[this.value];
      activityDescription.innerHTML = `
        <div class="activity-level">${activity.level}</div>
        <div class="activity-details">${activity.details}</div>
      `;
    });

    // Инициализируем начальное описание
    const initialActivity = activityTexts[activityRange.value];
    activityDescription.innerHTML = `
      <div class="activity-level">${initialActivity.level}</div>
      <div class="activity-details">${initialActivity.details}</div>
    `;

    document.getElementById('bmr-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const age = parseFloat(document.getElementById('age').value);
        const genderRadio = document.querySelector('input[name="gender"]:checked');
        const gender = genderRadio ? genderRadio.value : "";
        const activityLevel = parseInt(activityRange.value);

        let bmr;
        if (gender === 'м') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        let multiplier;
        switch (activityLevel) {
            case 1: multiplier = 1.2; break;
            case 2: multiplier = 1.375; break;
            case 3: multiplier = 1.55; break;
            case 4: multiplier = 1.725; break;
            case 5: multiplier = 1.9; break;
            default: multiplier = 1.0;
        }

        const tdee = bmr * multiplier;
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <h3>Результат:</h3>
            <p>BMR: <strong>${Math.round(bmr)}</strong> калорий/день</p>
            <p>TDEE: <strong>${Math.round(tdee)}</strong> калорий/день</p>
        `;

        const payload = {
            chat_id: tg.initDataUnsafe?.user?.id,
            secret: secret,
            data: {
                height, weight, age, gender, activityLevel,
                bmr: Math.round(bmr),
                tdee: Math.round(tdee)
            },
            initData: tg.initData
        };

        try {
            const response = await fetch("https://calories-bot.duckdns.org:8443/bot/mbr", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                tg.close();
            } else {
                resultDiv.innerHTML += `<p style="color:red;">Ошибка отправки данных: ${response.statusText}</p>`;
            }
        } catch (error) {
            console.error("Ошибка отправки данных:", error);
            resultDiv.innerHTML += `<p style="color:red;">Ошибка отправки данных: ${error.message}</p>`;
        }
    });
})();
