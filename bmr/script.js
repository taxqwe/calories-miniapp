(function() {
    // Проверяем параметры в URL
    const urlParams = new URLSearchParams(window.location.search);
    const isDebugMode = urlParams.get('debug') === 'true';
    const lang = urlParams.get('lang') || 'ru'; // По умолчанию русский
    
    // Получаем chatId из Telegram WebApp если он доступен
    let chatId = undefined;
    if (window.Telegram && window.Telegram.WebApp) {
        const webApp = window.Telegram.WebApp;
        if (isDebugMode) {
            console.log('WebApp данные:', {
                initDataUnsafe: webApp.initDataUnsafe,
                user: webApp.initDataUnsafe?.user,
                initData: webApp.initData
            });
        }
        
        // Пробуем получить chatId из initData
        try {
            const initData = webApp.initData ? JSON.parse(webApp.initData) : null;
            if (initData && initData.user && typeof initData.user.id === 'number' && initData.user.id > 0) {
                chatId = initData.user.id;
                if (isDebugMode) {
                    console.log('Получен chatId из initData:', chatId);
                }
            }
        } catch (e) {
            if (isDebugMode) {
                console.warn('Ошибка при парсинге initData:', e);
            }
        }
        
        // Если не получилось из initData, пробуем из initDataUnsafe
        if (!chatId && webApp.initDataUnsafe && webApp.initDataUnsafe.user && 
            typeof webApp.initDataUnsafe.user.id === 'number' && webApp.initDataUnsafe.user.id > 0) {
            chatId = webApp.initDataUnsafe.user.id;
            if (isDebugMode) {
                console.log('Получен chatId из initDataUnsafe:', chatId);
            }
        }
    }

    if (isDebugMode) {
        console.log('Итоговый chatId:', chatId);
    }
    
    // Объекты с переводами
    const translations = {
        ru: {
            title: "Что такое BMR?",
            bmrDescription: "BMR (Basal Metabolic Rate) — это количество калорий, которое ваш организм сжигает в состоянии покоя за 24 часа. Это базовая потребность организма в энергии для поддержания жизнедеятельности.",
            howToCalculate: "Как рассчитать BMR?",
            enterData: "Введите данные ниже:",
            height: "Рост (см)",
            weight: "Вес (кг)",
            age: "Возраст (лет)",
            heightPlaceholder: "Например, 175",
            weightPlaceholder: "Например, 70",
            agePlaceholder: "Например, 30",
            gender: "Пол:",
            male: "Мужской",
            female: "Женский",
            activityLevel: "Уровень физической активности:",
            selectActivity: "Выберите уровень на шкале:",
            activityLevels: {
                1: {
                    level: "Сидячий образ жизни (минимальная активность)",
                    details: "Вы проводите большую часть дня в сидячем положении и практически не занимаетесь спортом."
                },
                2: {
                    level: "Легкая активность (1-3 тренировок в неделю)",
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
            },
            calculateButton: "Рассчитать и отправить",
            result: "Результат:",
            caloriesPerDay: "калорий/день",
            sending: "Отправка данных...",
            success: "✅ Данные успешно отправлены!",
            error: "❌ Ошибка отправки данных:",
            criticalError: "❌ Критическая ошибка:",
            validationErrors: {
                height: "Рост должен быть от 100 до 230 см",
                weight: "Вес должен быть от 30 до 300 кг",
                age: "Возраст должен быть от 14 до 120 лет",
                fillAll: "Пожалуйста, заполните все поля"
            }
        },
        en: {
            title: "What is BMR?",
            bmrDescription: "BMR (Basal Metabolic Rate) is the number of calories your body burns at rest over 24 hours. This is your body's basic energy requirement for maintaining vital functions.",
            howToCalculate: "How to calculate BMR?",
            enterData: "Enter your data below:",
            height: "Height (cm)",
            weight: "Weight (kg)",
            age: "Age (years)",
            heightPlaceholder: "Example: 175",
            weightPlaceholder: "Example: 70",
            agePlaceholder: "Example: 30",
            gender: "Gender:",
            male: "Male",
            female: "Female",
            activityLevel: "Physical Activity Level:",
            selectActivity: "Select level on the scale:",
            activityLevels: {
                1: {
                    level: "Sedentary (minimal activity)",
                    details: "You spend most of your day sitting and rarely exercise."
                },
                2: {
                    level: "Light activity (1-3 workouts per week)",
                    details: "You do some light exercise or walking several times a week."
                },
                3: {
                    level: "Moderate activity (3-5 workouts per week)",
                    details: "You exercise several times a week, maintaining good physical condition."
                },
                4: {
                    level: "High activity (6-7 workouts per week)",
                    details: "You regularly engage in sports, requiring good physical fitness."
                },
                5: {
                    level: "Very high activity (intensive training)",
                    details: "You have an intensive training regime, possibly with multiple workouts per day, requiring high endurance."
                }
            },
            calculateButton: "Calculate and Send",
            result: "Result:",
            caloriesPerDay: "calories/day",
            sending: "Sending data...",
            success: "✅ Data successfully sent!",
            error: "❌ Error sending data:",
            criticalError: "❌ Critical error:",
            validationErrors: {
                height: "Height must be between 100 and 230 cm",
                weight: "Weight must be between 30 and 300 kg",
                age: "Age must be between 14 and 120 years",
                fillAll: "Please fill in all fields"
            }
        }
    };

    // Функция для обновления текста на странице
    const updatePageText = () => {
        const t = translations[lang];
        
        // Обновляем заголовки и описания
        document.querySelector('h2').textContent = t.title;
        document.querySelector('h2 + p').textContent = t.bmrDescription;
        document.querySelector('h3').textContent = t.howToCalculate;
        document.querySelector('h3 + p').textContent = t.enterData;
        
        // Обновляем метки полей ввода
        document.querySelector('label[for="height"]').textContent = t.height;
        document.querySelector('label[for="weight"]').textContent = t.weight;
        document.querySelector('label[for="age"]').textContent = t.age;
        
        // Обновляем плейсхолдеры
        document.getElementById('height').placeholder = t.heightPlaceholder;
        document.getElementById('weight').placeholder = t.weightPlaceholder;
        document.getElementById('age').placeholder = t.agePlaceholder;
        
        // Обновляем текст для выбора пола
        document.querySelector('.field-label').textContent = t.gender;
        document.querySelector('label[for="gender-male"]').textContent = t.male;
        document.querySelector('label[for="gender-female"]').textContent = t.female;
        
        // Обновляем текст для уровня активности
        document.querySelector('.range-container').previousElementSibling.textContent = t.activityLevel;
        document.querySelector('.range-container').previousElementSibling.previousElementSibling.textContent = t.selectActivity;
        
        // Обновляем кнопку
        document.querySelector('button[type="submit"]').textContent = t.calculateButton;
    };

    // Вызываем функцию обновления текста при загрузке страницы
    updatePageText();
    
    // Функция валидации данных
    const validateInputs = (height, weight, age) => {
        const errors = [];
        
        // Проверка роста (от 100 до 230 см)
        if (height < 100 || height > 230) {
            errors.push('Рост должен быть от 100 до 230 см');
        }
        
        // Проверка веса (от 30 до 300 кг)
        if (weight < 30 || weight > 300) {
            errors.push('Вес должен быть от 30 до 300 кг');
        }
        
        // Проверка возраста (от 14 до 120 лет)
        if (age < 14 || age > 120) {
            errors.push('Возраст должен быть от 14 до 120 лет');
        }
        
        return errors;
    };

    // Создаем контейнер для логов
    const createLogContainer = () => {
        let logContainer = document.getElementById('debug-logs');
        if (!logContainer) {
            logContainer = document.createElement('div');
            logContainer.id = 'debug-logs';
            logContainer.style.cssText = 'margin-top: 20px; padding: 10px; background-color: #f8f9fa; border: 1px solid #ddd; border-radius: 5px; font-family: monospace; font-size: 12px; white-space: pre-wrap; overflow-x: auto; max-height: 300px; overflow-y: auto;';
            document.body.appendChild(logContainer);
        }
        return logContainer;
    };
    
    // Функция для логирования в страницу
    const logToPage = (message, type = 'info') => {
        // Проверяем режим отладки
        if (!isDebugMode) return;
        
        // Получаем контейнер для результатов - он всегда видим после расчета
        const resultDiv = document.getElementById('result');
        if (!resultDiv) {
            console.error("Контейнер результатов не найден!");
            console.log(message);
            return;
        }
        
        // Проверяем, есть ли уже контейнер для логов внутри результатов
        let logSection = document.getElementById('visible-logs');
        if (!logSection) {
            logSection = document.createElement('div');
            logSection.id = 'visible-logs';
            logSection.innerHTML = '<h4>Отладочная информация:</h4>';
            logSection.style.cssText = 'margin-top: 20px; padding: 10px; background-color: #f8f9fa; border: 1px solid #ddd; border-radius: 5px; font-family: monospace; font-size: 12px; white-space: pre-wrap; overflow-x: auto; max-height: 300px; overflow-y: auto;';
            resultDiv.appendChild(logSection);
        }
        
        // Создаем элемент для записи лога
        const logEntry = document.createElement('div');
        logEntry.style.margin = '5px 0';
        
        logEntry.style.borderLeft = type === 'error' ? '3px solid #dc3545' : 
                                   type === 'warning' ? '3px solid #ffc107' : 
                                   '3px solid #28a745';
        logEntry.style.paddingLeft = '5px';
        
        // Преобразование объектов в строки
        let displayMessage;
        if (typeof message === 'object') {
            try {
                displayMessage = JSON.stringify(message, null, 2);
            } catch (e) {
                displayMessage = message.toString();
            }
        } else {
            displayMessage = message;
        }
        
        logEntry.textContent = new Date().toLocaleTimeString() + ': ' + displayMessage;
        logSection.appendChild(logEntry);
        logSection.scrollTop = logSection.scrollHeight; // Автопрокрутка вниз
        
        // Параллельно в консоль
        if (type === 'error') {
            console.error(message);
        } else if (type === 'warning') {
            console.warn(message);
        } else {
            console.log(message);
        }
    };
    
    // Функция для отображения ошибок валидации
    const showValidationError = (field, message) => {
        const input = document.getElementById(field);
        const errorDiv = document.getElementById(`${field}-error`) || document.createElement('div');
        errorDiv.id = `${field}-error`;
        errorDiv.className = 'validation-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: #dc3545; font-size: 0.8em; margin-top: 5px;';
        
        // Добавляем стили для поля с ошибкой
        input.style.borderColor = '#dc3545';
        input.style.backgroundColor = '#fff8f8';
        
        // Добавляем сообщение об ошибке после поля
        if (!document.getElementById(`${field}-error`)) {
            input.parentNode.insertBefore(errorDiv, input.nextSibling);
        }
    };

    // Функция для очистки ошибок валидации
    const clearValidationError = (field) => {
        const input = document.getElementById(field);
        const errorDiv = document.getElementById(`${field}-error`);
        
        if (errorDiv) {
            errorDiv.remove();
        }
        
        // Возвращаем стандартные стили
        input.style.borderColor = '';
        input.style.backgroundColor = '';
    };

    // Добавляем валидацию при вводе
    const setupValidation = () => {
        const fields = ['height', 'weight', 'age'];
        const t = translations[lang];
        
        fields.forEach(field => {
            const input = document.getElementById(field);
            
            input.addEventListener('input', function() {
                const value = parseFloat(this.value);
                clearValidationError(field);
                
                if (isNaN(value)) return;
                
                switch(field) {
                    case 'height':
                        if (value < 100 || value > 230) {
                            showValidationError(field, t.validationErrors.height);
                        }
                        break;
                    case 'weight':
                        if (value < 30 || value > 300) {
                            showValidationError(field, t.validationErrors.weight);
                        }
                        break;
                    case 'age':
                        if (value < 14 || value > 120) {
                            showValidationError(field, t.validationErrors.age);
                        }
                        break;
                }
            });
        });
    };

    // Настраиваем поля ввода для удобства использования на мобильных устройствах
    setupInputFields();
    setupValidation();

    // Обновление описания активности в зависимости от выбранного значения
    const activityRange = document.getElementById('activityRange');
    const activityDescription = document.getElementById('activityDescription');

    activityRange.addEventListener('input', function() {
        const t = translations[lang];
        const activity = t.activityLevels[this.value];
        activityDescription.innerHTML = `
            <div class="activity-level">${activity.level}</div>
            <div class="activity-details">${activity.details}</div>
        `;
    });

    // Инициализируем начальное описание
    const t = translations[lang];
    const initialActivity = t.activityLevels[activityRange.value];
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
        const t = translations[lang];

        // Проверка заполнения полей
        if (!height || !weight || !age || !gender) {
            alert(t.validationErrors.fillAll);
            return;
        }

        // Валидация данных
        const validationErrors = validateInputs(height, weight, age);
        if (validationErrors.length > 0) {
            // Показываем ошибки для каждого поля
            validationErrors.forEach(error => {
                if (error.includes('Рост') || error.includes('Height')) {
                    showValidationError('height', t.validationErrors.height);
                } else if (error.includes('Вес') || error.includes('Weight')) {
                    showValidationError('weight', t.validationErrors.weight);
                } else if (error.includes('Возраст') || error.includes('Age')) {
                    showValidationError('age', t.validationErrors.age);
                }
            });
            
            // Прокручиваем к первому полю с ошибкой
            const firstErrorField = document.querySelector('.validation-error');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        let bmr;
        if (gender === 'м' || gender === 'm') {
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
            <h3>${t.result}</h3>
            <p>BMR: <strong>${Math.round(bmr)}</strong> ${t.caloriesPerDay}</p>
            <p>TDEE: <strong>${Math.round(tdee)}</strong> ${t.caloriesPerDay}</p>
        `;

        // Прокручиваем к результатам
        resultDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Добавляем тестовый лог для проверки работы логирования (только в режиме отладки)
        if (isDebugMode) {
            logToPage("Тестовый лог - проверка работы механизма логирования", "info");
            logToPage("Результаты расчета: BMR=" + Math.round(bmr) + ", TDEE=" + Math.round(tdee), "info");
        }
        
        // Подготовка данных для отправки
        const payload = {
            data: {
                height, weight, age, gender, activityLevel,
                bmr: Math.round(bmr),
                tdee: Math.round(tdee)
            }
        };

        // Добавляем chatId только если он положительное число
        if (typeof chatId === 'number' && chatId > 0) {
            payload.data.chatId = chatId;
            if (isDebugMode) {
                console.log('Добавлен chatId в payload:', chatId);
            }
        } else if (isDebugMode) {
            console.warn('chatId не добавлен в payload:', chatId);
        }

        try {
            // В режиме отладки только показываем данные
            if (isDebugMode) {
                logToPage("Данные для отправки:", "info");
                logToPage("URL: https://calories-bot.duckdns.org:8443/bot/mbr", "info");
                logToPage("Заголовки: " + JSON.stringify({ 
                    "Content-Type": "application/json",
                    "X-Source-App": "BMR-Calculator"
                }), "info");
                logToPage("Данные payload: " + JSON.stringify(payload, null, 2), "info");
                
                // Показываем результат без отправки
                resultDiv.innerHTML += `<p class="debug-status">✅ Режим отладки: данные не отправлены</p>`;
                return;
            }
            
            // Отображаем сообщение об отправке
            resultDiv.innerHTML += `<p class="sending-status">${t.sending}</p>`;
            
            // Отправка через fetch с CORS (только если не режим отладки)
            fetch('https://calories-bot.duckdns.org:8443/bot/mbr', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Source-App': 'BMR-Calculator'
                },
                body: JSON.stringify(payload),
                mode: 'cors'
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Ошибка HTTP: " + response.status);
                }
                resultDiv.innerHTML += `<p class="success-status">${t.success}</p>`;
                
                // Сразу закрываем окно после успешной отправки
                if (window.Telegram && window.Telegram.WebApp) {
                    window.Telegram.WebApp.close();
                } else {
                    window.close();
                }
                
                return response.text();
            })
            .catch(error => {
                console.error("Ошибка отправки:", error);
                resultDiv.innerHTML += `
                    <p class="error-status">${t.error} ${error.message}</p>
                `;
            });
            
        } catch (error) {
            console.error("Критическая ошибка:", error);
            resultDiv.innerHTML += `
                <p class="error-status">${t.error}</p>
            `;
        }
    });
})();
