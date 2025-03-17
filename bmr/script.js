(function() {
    const tg = window.Telegram.WebApp;
    tg.expand();
    
    // Для отладки - вывод initData в консоль
    console.log("Telegram initData:", tg.initData);
    
    // Включаем кнопку Telegram "Назад" (если доступно)
    if (tg.BackButton) {
        tg.BackButton.hide();
    }
    
    // Включаем кнопку Telegram "Главная" (если доступно)
    if (tg.MainButton) {
        tg.MainButton.hide();
    }

    // Настраиваем поля ввода для удобства использования на мобильных устройствах
    setupInputFields();

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

    // Функция для настройки полей ввода
    function setupInputFields() {
        // Получаем все поля ввода на форме
        const inputFields = [
            document.getElementById('height'),
            document.getElementById('weight'),
            document.getElementById('age')
        ];

        // Настраиваем поля для корректной работы с мобильной клавиатурой
        inputFields.forEach((field, index) => {
            // Проверяем, что атрибуты enterkeyhint уже установлены
            if (!field.getAttribute('enterkeyhint')) {
                field.setAttribute('enterkeyhint', index < inputFields.length - 1 ? 'next' : 'done');
            }
            
            // Обработчик события нажатия Enter/Done
            field.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    
                    // Переход к следующему полю или закрытие клавиатуры
                    if (index < inputFields.length - 1) {
                        inputFields[index + 1].focus();
                    } else {
                        field.blur(); // Закрываем клавиатуру на последнем поле
                    }
                }
            });
        });

        // Обработка проблемы скрытия содержимого клавиатурой
        handleKeyboardVisibility();
    }

    // Функция для обработки видимости клавиатуры
    function handleKeyboardVisibility() {
        const form = document.getElementById('bmr-form');
        const container = document.querySelector('.container');
        
        // Обработчики фокуса на полях ввода
        const inputElements = form.querySelectorAll('input[type="number"]');
        inputElements.forEach(input => {
            input.addEventListener('focus', function() {
                // Добавляем класс, указывающий что клавиатура открыта
                container.classList.add('keyboard-open');
                
                // Прокручиваем к активному полю
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
            
            input.addEventListener('blur', function() {
                // Удаляем класс при закрытии клавиатуры
                container.classList.remove('keyboard-open');
            });
        });

        // Наблюдаем за изменением размера окна (когда клавиатура появляется/исчезает)
        let windowHeight = window.innerHeight;
        window.addEventListener('resize', function() {
            // Если высота окна уменьшилась (клавиатура открылась)
            if (window.innerHeight < windowHeight) {
                container.classList.add('keyboard-open');
            } else {
                container.classList.remove('keyboard-open');
            }
            windowHeight = window.innerHeight;
        });
    }

    document.getElementById('bmr-form').addEventListener('submit', async function(e) {
        e.preventDefault();

        // Скрываем клавиатуру при отправке формы
        document.activeElement.blur();

        const height = parseFloat(document.getElementById('height').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const age = parseFloat(document.getElementById('age').value);
        const genderRadio = document.querySelector('input[name="gender"]:checked');
        const gender = genderRadio ? genderRadio.value : "";
        const activityLevel = parseInt(activityRange.value);

        // Проверка заполнения полей
        if (!height || !weight || !age || !gender) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

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
        
        // Показываем блок с результатами
        resultDiv.classList.add('visible');
        
        resultDiv.innerHTML = `
            <h3>Результат:</h3>
            <p>BMR: <strong>${Math.round(bmr)}</strong> калорий/день</p>
            <p>TDEE: <strong>${Math.round(tdee)}</strong> калорий/день</p>
        `;

        // Прокручиваем к результатам
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Получаем данные из Telegram WebApp
        const userId = tg.initDataUnsafe?.user?.id || '';
        
        // Подготовка данных для отправки
        const payload = {
            chat_id: userId,
            data: {
                height, weight, age, gender, activityLevel,
                bmr: Math.round(bmr),
                tdee: Math.round(tdee)
            },
            // Передаем initData без изменений - сервер сам проверит его подлинность
            initData: tg.initData
        };

        try {
            // Отображаем сообщение об отправке
            resultDiv.innerHTML += `<p class="sending-status">Отправка данных...</p>`;
            
            // Попытка отправки данных
            const response = await fetch("https://calories-bot.duckdns.org:8443/bot/bmr", {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Host": "calories-bot.duckdns.org"
                },
                body: JSON.stringify(payload)
            });
            
            // Обработка ответа
            if (response.ok) {
                resultDiv.innerHTML += `<p class="success-status">Данные успешно отправлены!</p>`;
                
                // Показываем кнопку Telegram "Главная" и настраиваем её
                if (tg.MainButton) {
                    tg.MainButton.setText('Завершить');
                    tg.MainButton.show();
                    tg.MainButton.onClick(function() {
                        tg.close();
                    });
                } else {
                    // Добавляем кнопку закрытия мини-приложения если Telegram кнопка недоступна
                    const closeButton = document.createElement('button');
                    closeButton.className = 'close-button';
                    closeButton.textContent = 'Завершить';
                    closeButton.addEventListener('click', () => {
                        tg.close();
                    });
                    resultDiv.appendChild(closeButton);
                }
            } else {
                // Получаем тело ответа для дополнительных данных об ошибке
                let errorText = response.statusText;
                try {
                    const errorBody = await response.text();
                    errorText += ` | Детали: ${errorBody}`;
                } catch (textError) {
                    console.error("Не удалось получить детали ошибки:", textError);
                }
                
                resultDiv.innerHTML += `
                    <p class="error-status">Ошибка отправки данных: ${errorText}</p>
                    <div class="debug-info">
                        <p>URL: https://calories-bot.duckdns.org:8443/bot/bmr</p>
                        <p>Статус: ${response.status}</p>
                        <p>Заголовки ответа: ${JSON.stringify(Object.fromEntries(response.headers))}</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error("Ошибка отправки данных:", error);
            resultDiv.innerHTML += `
                <p class="error-status">Ошибка отправки данных: ${error.message}</p>
                <div class="debug-info">
                    <p>URL: https://calories-bot.duckdns.org:8443/bot/bmr</p>
                    <p>Тип ошибки: ${error.name}</p>
                    <p>Стек вызовов: ${error.stack}</p>
                </div>
            `;
        }
    });
})();
