(function() {
    const tg = window.Telegram.WebApp;
    tg.expand();

    // Функция для получения значения параметра из URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Получаем секрет из URL-параметра (например, ?secret=abc123)
    const secret = getQueryParam('secret') || '';

    document.getElementById('bmr-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        // Получаем данные из формы
        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const age = parseFloat(document.getElementById('age').value);
        const gender = document.getElementById('gender').value;
        const activityLevel = parseInt(document.getElementById('activity').value);

        // Расчёт BMR по формуле Mifflin-St Jeor:
        // Для мужчин: BMR = 10 * вес + 6.25 * рост - 5 * возраст + 5
        // Для женщин: BMR = 10 * вес + 6.25 * рост - 5 * возраст - 161
        let bmr;
        if (gender === 'м') {
            bmr = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            bmr = 10 * weight + 6.25 * height - 5 * age - 161;
        }

        // Определяем множитель активности:
        // 1: 1.2, 2: 1.375, 3: 1.55, 4: 1.725, 5: 1.9
        let multiplier;
        switch (activityLevel) {
            case 1:
                multiplier = 1.2;
                break;
            case 2:
                multiplier = 1.375;
                break;
            case 3:
                multiplier = 1.55;
                break;
            case 4:
                multiplier = 1.725;
                break;
            case 5:
                multiplier = 1.9;
                break;
            default:
                multiplier = 1.0;
        }

        // Расчёт TDEE (общее количество калорий с учетом активности)
        const tdee = bmr * multiplier;

        // Вывод результата на страницу
        const resultDiv = document.getElementById('result');
        resultDiv.innerHTML = `
            <h3>Результат:</h3>
            <p>BMR (базальный уровень метаболизма): <strong>${Math.round(bmr)}</strong> калорий/день</p>
            <p>TDEE (с учётом активности): <strong>${Math.round(tdee)}</strong> калорий/день</p>
        `;

        // Формируем объект с данными для отправки на сервер
        const payload = {
            // Обратите внимание, что tg.initDataUnsafe не гарантирует безопасность — для проверки используйте tg.initData
            chat_id: tg.initDataUnsafe?.user?.id,
            secret: secret,
            data: {
                height: height,
                weight: weight,
                age: age,
                gender: gender,
                activityLevel: activityLevel,
                bmr: Math.round(bmr),
                tdee: Math.round(tdee)
            },
            initData: tg.initData  // безопасные данные для проверки подписи на сервере
        };

        try {
            const response = await fetch("https://calories-bot.duckdns.org/bot/mbr", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                console.error("Ошибка отправки данных", response.statusText);
            }
        } catch (error) {
            console.error("Ошибка отправки данных:", error);
        }

        // Закрываем мини-приложение
        tg.close();
    });
})();
