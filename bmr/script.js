(function() {
    const tg = window.Telegram.WebApp;
    tg.expand();
    
    // Для отладки - вывод initData в консоль
    console.log("Telegram initData:", tg.initData);
    
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
        
        // Добавляем тестовый лог для проверки работы логирования
        logToPage("Тестовый лог - проверка работы механизма логирования", "info");
        logToPage("Результаты расчета: BMR=" + Math.round(bmr) + ", TDEE=" + Math.round(tdee), "info");

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
            // Расширенное логирование для отладки
            logToPage("Подготовка к отправке данных:", "info");
            logToPage("URL: https://calories-bot.duckdns.org:8443/bot", "info");
            logToPage("Заголовки: " + JSON.stringify({ 
                "Content-Type": "application/json",
                "Host": "calories-bot.duckdns.org"
            }), "info");
            logToPage("Данные payload: " + JSON.stringify(payload, null, 2), "info");
            
            // Отображаем сообщение об отправке
            resultDiv.innerHTML += `<p class="sending-status">Отправка данных...</p>`;
            
            // Пробуем альтернативный метод - отправка через Telegram WebApp Data
            logToPage("Используем Telegram WebApp для отправки данных", "warning");
            
            // Создаем копию данных для передачи Telegram
            const telegramData = {
                bmr: Math.round(bmr),
                tdee: Math.round(tdee),
                userInfo: {
                    height, weight, age, gender, activityLevel
                }
            };
            
            // Устанавливаем данные в Telegram WebApp
            tg.MainButton.setText('Отправить результаты');
            tg.MainButton.show();
            
            // Альтернативная отправка #1: Используем Telegram WebApp для завершения
            logToPage("Метод #1: Используем Telegram WebApp MainButton", "info");
            
            // При нажатии на кнопку, отправляем обратные данные в Telegram
            tg.MainButton.onClick(() => {
                logToPage("Кнопка MainButton нажата, отправляем данные", "info");
                
                try {
                    // Отправляем данные через WebApp
                    tg.sendData(JSON.stringify(telegramData));
                    
                    logToPage("Данные отправлены через Telegram WebApp", "info");
                    resultDiv.innerHTML += `<p class="success-status">Данные успешно отправлены!</p>`;
                    
                    // Закрываем WebApp через 2 секунды
                    setTimeout(() => {
                        tg.close();
                    }, 2000);
                } catch (sendError) {
                    logToPage("Ошибка при отправке через Telegram: " + sendError, "error");
                    
                    // Альтернативная отправка #2: Используем форму в скрытом iframe
                    tryIframeMethod();
                }
            });
            
            // Альтернативная отправка #2: Пробуем через iframe если первый метод не сработает
            const tryIframeMethod = () => {
                logToPage("Метод #2: Пробуем отправку через форму в iframe", "warning");
                
                // Создаем скрытый iframe
                const iframe = document.createElement('iframe');
                iframe.name = 'hidden_iframe';
                iframe.style.display = 'none';
                document.body.appendChild(iframe);
                
                // Создаем форму
                const form = document.createElement('form');
                form.method = 'POST';
                form.action = 'https://calories-bot.duckdns.org:8443/bot';
                form.target = 'hidden_iframe';
                form.style.display = 'none';
                
                // Добавляем данные в форму
                const dataInput = document.createElement('input');
                dataInput.type = 'hidden';
                dataInput.name = 'data';
                dataInput.value = JSON.stringify(payload);
                form.appendChild(dataInput);
                
                // Добавляем форму в документ и отправляем
                document.body.appendChild(form);
                
                // Логируем попытку отправки
                logToPage("Отправка формы через iframe...", "info");
                
                // Отслеживаем загрузку iframe
                iframe.onload = function() {
                    logToPage("Iframe загружен, возможно данные отправлены", "info");
                    resultDiv.innerHTML += `<p class="success-status">Данные отправлены (iframe метод)!</p>`;
                };
                
                // Отправляем форму
                form.submit();
                
                // Через 5 секунд проверяем статус и удаляем временные элементы
                setTimeout(() => {
                    logToPage("Очистка временных элементов iframe", "info");
                    form.remove();
                    iframe.remove();
                }, 5000);
            };
            
            // Если кнопка MainButton недоступна, сразу пробуем метод с iframe
            if (!tg.MainButton) {
                logToPage("MainButton недоступна, пробуем отправку через iframe", "warning");
                tryIframeMethod();
            }
            
        } catch (error) {
            console.error("Ошибка отправки данных:", error);
            
            // Расширенное логирование ошибки
            logToPage("Ошибка отправки данных: " + error, "error");
            logToPage("Тип ошибки: " + error.name, "error");
            logToPage("Сообщение ошибки: " + error.message, "error");
            logToPage("Стек вызовов: " + (error.stack || "недоступен"), "error");
            
            // Проверим доступность сервера через HEAD запрос
            logToPage("Проверка доступности сервера через HEAD...", "warning");
            try {
                fetch("https://calories-bot.duckdns.org:8443/bot", {
                    method: "HEAD",
                    headers: { 
                        "Host": "calories-bot.duckdns.org"
                    },
                })
                .then(response => {
                    logToPage("HEAD запрос успешен: " + response.status, "info");
                })
                .catch(headError => {
                    logToPage("HEAD запрос не удался: " + headError, "error");
                });
            } catch (headAttemptError) {
                logToPage("Не удалось выполнить HEAD запрос: " + headAttemptError, "error");
            }
            
            // Проверим доступность по IP напрямую
            logToPage("Проверка доступности по IP...", "warning");
            try {
                fetch("https://89.110.114.8:8443/bot", {
                    method: "HEAD",
                    headers: { 
                        "Host": "calories-bot.duckdns.org"
                    },
                })
                .then(response => {
                    logToPage("HEAD запрос по IP успешен: " + response.status, "info");
                })
                .catch(ipHeadError => {
                    logToPage("HEAD запрос по IP не удался: " + ipHeadError, "error");
                });
            } catch (ipAttemptError) {
                logToPage("Не удалось выполнить HEAD запрос по IP: " + ipAttemptError, "error");
            }
            
            // Проверка наличия сетевого соединения
            logToPage("Проверка сетевого соединения: " + (navigator.onLine ? "онлайн" : "офлайн"), "info");
            
            // Попробуем CORS-проверку с известным публичным API
            logToPage("Проверка CORS с публичным API...", "warning");
            fetch("https://jsonplaceholder.typicode.com/todos/1")
                .then(response => logToPage("Публичный API доступен: " + response.status, "info"))
                .catch(corsError => logToPage("Публичный API недоступен: " + corsError, "error"));
            
            resultDiv.innerHTML += `
                <p class="error-status">Ошибка отправки данных: ${error.message}</p>
                <div class="debug-info">
                    <p>URL: https://calories-bot.duckdns.org:8443/bot</p>
                    <p>Тип ошибки: ${error.name}</p>
                    <p>Стек вызовов: ${error.stack || "недоступен"}</p>
                </div>
            `;
        }
    });
})();
