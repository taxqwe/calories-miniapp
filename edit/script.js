(function() {
  const tg = window.Telegram.WebApp;
  tg.expand();

  // Элементы UI
  const calendar = document.getElementById('calendar');
  const currentMonthElement = document.getElementById('currentMonth');
  const daysContainer = document.getElementById('days');
  const editSection = document.getElementById('editSection');
  const caloriesInput = document.getElementById('caloriesInput');
  const loadingElement = document.getElementById('loading');

  // Состояние
  let currentDate = new Date();
  let selectedDate = null;
  let caloriesData = {};
  let chatId = null;

  // Инициализация
  function init() {
    updateCalendarSize();
    try {
      // Получаем chatId
      if (tg.initDataUnsafe?.user?.id) {
        chatId = tg.initDataUnsafe.user.id;
        console.log('chatId получен из initDataUnsafe:', chatId);
      } else {
        const initData = JSON.parse(tg.initData);
        if (initData.user?.id) {
          chatId = initData.user.id;
          console.log('chatId получен из initData:', chatId);
        }
      }

      if (!chatId) {
        console.error('chatId не получен!');
        throw new Error('Не удалось получить идентификатор пользователя');
      }

      // Настраиваем обработчики событий
      setupCalendarEventListeners();

      // Загружаем начальные данные
      fetchAndRenderCalendar();

    } catch (error) {
      console.error('Ошибка инициализации:', error);
      alert('Ошибка инициализации приложения');
    }
  }

  // Получение и отображение данных календаря
  async function fetchAndRenderCalendar() {
    if (!chatId) return;

    showLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      
      const requestBody = {
        chatId: chatId,
        date: `${year}-${month}`
      };
      console.log('Отправляем запрос:', JSON.stringify(requestBody));
      
      const response = await fetch('https://calories-bot.duckdns.org:8443/api/calories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Source-App': 'Calories-Editor'
        },
        mode: 'cors',
        body: JSON.stringify(requestBody)
      });

      console.log('Получен ответ:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка ответа сервера:', response.status, errorText);
        throw new Error('Ошибка получения данных');
      }

      const data = await response.json();
      console.log('Получены данные от сервера:', data);
      
      // Преобразуем массив в объект для удобства использования
      caloriesData = data.reduce((acc, item) => {
        acc[item.date] = item.calories;
        return acc;
      }, {});
      console.log('Данные после преобразования:', caloriesData);

      renderCalendar();
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      alert('Не удалось загрузить данные');
    } finally {
      showLoading(false);
    }
  }

  // Обновление калорий
  async function updateCalories(date, calories) {
    if (!chatId) return;

    showLoading(true);
    try {
      const requestBody = {
        chatId: chatId,
        date: date,
        calories: calories
      };
      console.log('Отправляем запрос на обновление:', JSON.stringify(requestBody));
      
      const response = await fetch('https://calories-bot.duckdns.org:8443/api/calories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Source-App': 'Calories-Editor'
        },
        mode: 'cors',
        body: JSON.stringify(requestBody)
      });

      console.log('Получен ответ на обновление:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ошибка ответа сервера при обновлении:', response.status, errorText);
        throw new Error('Ошибка обновления данных');
      }

      // Обновляем локальные данные
      caloriesData[date] = calories;
      renderCalendar();
    } catch (error) {
      console.error('Ошибка обновления данных:', error);
      alert('Не удалось обновить данные');
    } finally {
      showLoading(false);
    }
  }

  // Отрисовка календаря
  function renderCalendar() {
    // Обновляем заголовок месяца
    currentMonthElement.textContent = currentDate.toLocaleString('ru', {
      month: 'long',
      year: 'numeric'
    });

    // Получаем количество дней в месяце и день недели первого числа
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay() || 7;

    // Очищаем контейнер дней
    daysContainer.innerHTML = '';

    // Добавляем пустые ячейки для выравнивания
    for (let i = 1; i < firstDayOfMonth; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'day empty';
      daysContainer.appendChild(emptyDay);
    }

    // Добавляем дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement('div');
      const dateStr = formatDate(year, month + 1, day);
      const hasData = dateStr in caloriesData;

      dayElement.className = `day${dateStr === selectedDate ? ' selected' : ''}${hasData ? ' has-data' : ''}`;
      
      // Всегда показываем калории, если они есть
      if (hasData) {
        dayElement.innerHTML = `
          <span>${day}</span>
          <small>${caloriesData[dateStr]} ккал</small>
        `;
      } else {
        dayElement.innerHTML = `<span>${day}</span>`;
      }

      dayElement.addEventListener('click', () => {
        selectedDate = dateStr;
        editSection.style.display = 'block';
        caloriesInput.value = caloriesData[dateStr] || '';
        renderCalendar();
      });

      daysContainer.appendChild(dayElement);
    }
  }

  // Вспомогательные функции
  function formatDate(year, month, day) {
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  function showLoading(show) {
    loadingElement.style.display = show ? 'flex' : 'none';
    calendar.style.opacity = show ? '0.5' : '1';
    editSection.style.opacity = show ? '0.5' : '1';
  }

  function updateCalendarSize() {
    const vw = Math.min(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    
    // Вычисляем размер ячеек более адаптивно
    const containerWidth = Math.min(vw - 30, 480); // контейнер максимум 480px
    const daySize = Math.floor((containerWidth - 50) / 7); // учитываем отступы и границы
    
    // Адаптивный размер шрифта
    const fontSize = Math.max(9, Math.min(12, Math.floor(daySize / 4)));
    
    // Устанавливаем CSS переменные
    document.documentElement.style.setProperty('--day-size', daySize + 'px');
    document.documentElement.style.setProperty('--base-font-size', fontSize + 'px');
    
    // Подстраиваем высоту области редактирования
    if (editSection && editSection.style.display === 'block') {
      const calendarBottom = calendar.getBoundingClientRect().bottom;
      const availableHeight = window.innerHeight - calendarBottom - 20;
      editSection.style.maxHeight = Math.max(60, availableHeight) + 'px';
    }
  }

  // Вызываем функцию при загрузке и изменении размера окна
  window.addEventListener('resize', updateCalendarSize);
  window.addEventListener('load', updateCalendarSize);

  function setupCalendarEventListeners() {
    document.getElementById('prevMonth').addEventListener('click', function() {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
      fetchAndRenderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', function() {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
      fetchAndRenderCalendar();
    });

    document.getElementById('caloriesInput').addEventListener('change', function() {
      const value = parseInt(this.value);
      if (!isNaN(value) && value >= 0) {
        updateCalories(selectedDate, value);
      }
    });
    
    // Добавляем обработчики для кнопок быстрого изменения
    document.querySelectorAll('.quick-button').forEach(button => {
      button.addEventListener('click', function() {
        const change = parseInt(this.getAttribute('data-value'));
        const input = document.getElementById('caloriesInput');
        let currentValue = parseInt(input.value) || 0;
        
        // Проверяем, чтобы значение не стало отрицательным
        const newValue = Math.max(0, currentValue + change);
        input.value = newValue;
        
        // Обновляем калории на сервере
        updateCalories(selectedDate, newValue);
      });
    });
  }

  // Запускаем приложение
  init();
})(); 