(function() {
    // Проверяем параметр debug в URL
    const urlParams = new URLSearchParams(window.location.search);
    const isDebugMode = urlParams.get('debug') === 'true';
    
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
        
        fields.forEach(field => {
            const input = document.getElementById(field);
            
            input.addEventListener('input', function() {
                const value = parseFloat(this.value);
                clearValidationError(field);
                
                if (isNaN(value)) return;
                
                switch(field) {
                    case 'height':
                        if (value < 100 || value > 230) {
                            showValidationError(field, 'Рост должен быть от 100 до 230 см');
                        }
                        break;
                    case 'weight':
                        if (value < 30 || value > 300) {
                            showValidationError(field, 'Вес должен быть от 30 до 300 кг');
                        }
                        break;
                    case 'age':
                        if (value < 14 || value > 120) {
                            showValidationError(field, 'Возраст должен быть от 14 до 120 лет');
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

        // Валидация данных
        const validationErrors = validateInputs(height, weight, age);
        if (validationErrors.length > 0) {
            // Показываем ошибки для каждого поля
            validationErrors.forEach(error => {
                if (error.includes('Рост')) {
                    showValidationError('height', error);
                } else if (error.includes('Вес')) {
                    showValidationError('weight', error);
                } else if (error.includes('Возраст')) {
                    showValidationError('age', error);
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

        try {
            // Расширенное логирование для отладки (только в режиме отладки)
            if (isDebugMode) {
                logToPage("Подготовка к отправке данных:", "info");
                logToPage("URL: https://calories-bot.duckdns.org:8443/bot/mbr", "info");
                logToPage("Заголовки: " + JSON.stringify({ 
                    "Content-Type": "application/json",
                    "X-Source-App": "BMR-Calculator"
                }), "info");
                logToPage("Данные payload: " + JSON.stringify(payload, null, 2), "info");
            }
            
            // Отображаем сообщение об отправке
            resultDiv.innerHTML += `<p class="sending-status">Отправка данных...</p>`;
            
            // Отправка через fetch с CORS
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
                if (isDebugMode) {
                    logToPage("Получен ответ от сервера: " + response.status, "info");
                }
                if (response.ok) {
                    if (isDebugMode) {
                        logToPage("Данные успешно отправлены!", "info");
                    }
                    resultDiv.innerHTML += `<p class="success-status">✅ Данные успешно отправлены!</p>`;
                    
                    // Закрываем окно через небольшую задержку, чтобы пользователь успел увидеть сообщение об успехе
                    setTimeout(() => {
                        window.close();
                    }, 1500);
                    
                    return response.text();
                } else {
                    throw new Error("Ошибка HTTP: " + response.status);
                }
            })
            .then(data => {
                if (data && isDebugMode) {
                    logToPage("Ответ сервера: " + data, "info");
                }
            })
            .catch(error => {
                if (isDebugMode) {
                    logToPage("Ошибка отправки: " + error.message, "error");
                }
                resultDiv.innerHTML += `
                    <p class="error-status">❌ Ошибка отправки данных: ${error.message}</p>
                `;
                
                if (isDebugMode) {
                    // Проверка доступности сервера
                    logToPage("Проверка доступности сервера...", "warning");
                    return fetch('https://calories-bot.duckdns.org:8443/bot/mbr', {
                        method: 'HEAD'
                    })
                    .then(response => {
                        logToPage("Сервер доступен, код ответа: " + response.status, "info");
                    })
                    .catch(headError => {
                        logToPage("Сервер недоступен: " + headError.message, "error");
                        
                        // Проверка сетевого соединения
                        logToPage("Проверка сетевого соединения: " + (navigator.onLine ? "онлайн" : "офлайн"), "info");
                    });
                }
            });
            
        } catch (error) {
            if (isDebugMode) {
                console.error("Критическая ошибка:", error);
                logToPage("Критическая ошибка: " + error.message, "error");
                
                resultDiv.innerHTML += `
                    <p class="error-status">❌ Критическая ошибка: ${error.message}</p>
                    <div class="debug-info">
                        <p>URL: https://calories-bot.duckdns.org:8443/bot/mbr</p>
                        <p>Тип ошибки: ${error.name}</p>
                        <p>Стек вызовов: ${error.stack || "недоступен"}</p>
                    </div>
                `;
            } else {
                resultDiv.innerHTML += `
                    <p class="error-status">❌ Произошла ошибка при отправке данных</p>
                `;
            }
        }
    });
})();
