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
  let initDataRaw = null;

  // Получаем доступ к переводам
  const translations = window.translations || {};
  const currentLang = window.currentLang || 'en';
  const t = translations[currentLang] || {};
  
  console.log('Current language set to:', currentLang);

  // Инициализация
  function init() {
    updateCalendarSize();
    try {
      // Сохраняем initData
      initDataRaw = tg.initData;
      console.log('Получены initData длиной:', initDataRaw?.length || 0);
      
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

      // Решение проблемы с перекрытием клавиатурой
      handleKeyboardVisibility();

    } catch (error) {
      console.error('Ошибка инициализации:', error);
      alert(t.error?.init || 'Ошибка инициализации приложения');
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
        date: `${year}-${month}`,
        initData: initDataRaw
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
      alert(t.error?.load || 'Не удалось загрузить данные');
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
        calories: calories,
        initData: initDataRaw
      };
      console.log('Отправляем запрос на обновление:', JSON.stringify(requestBody));
      
      const response = await fetch('https://calories-bot.duckdns.org:8443/api/edit', {
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

      // Если калории = 0, удаляем запись
      if (calories === 0) {
        delete caloriesData[date];
      } else {
        // Иначе обновляем локальные данные
        caloriesData[date] = calories;
      }
      renderCalendar();
    } catch (error) {
      console.error('Ошибка обновления данных:', error);
      alert(t.error?.update || 'Не удалось обновить данные');
    } finally {
      showLoading(false);
    }
  }

  // Отрисовка календаря
  function renderCalendar() {
    // Обновляем заголовок месяца с учетом названий месяцев из переводов
    const monthIndex = currentDate.getMonth();
    const year = currentDate.getFullYear();
    currentMonthElement.textContent = (t.monthNames ? 
      t.monthNames[monthIndex] : currentDate.toLocaleString('ru', { month: 'long' })) + ' ' + year;

    // Получаем количество дней в месяце и день недели первого числа
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
      // Считаем, что день имеет данные, только если калории больше 0
      const hasData = dateStr in caloriesData && caloriesData[dateStr] > 0;
      
      // Проверяем, является ли этот день выбранным
      const isSelected = dateStr === selectedDate;

      dayElement.className = `day${isSelected ? ' selected' : ''}${hasData ? ' has-data' : ''}`;
      
      // Показываем калории, только если они больше 0
      if (hasData) {
        dayElement.innerHTML = `
          <span>${day}</span>
          <small>${caloriesData[dateStr]}<br>${t.cal || 'ккал'}</small>
        `;
      } else {
        dayElement.innerHTML = `<span>${day}</span>`;
      }

      dayElement.addEventListener('click', () => {
        // Сбрасываем класс 'selected' у всех дней
        document.querySelectorAll('.day').forEach(day => {
          day.classList.remove('selected');
        });
        
        // Устанавливаем текущий день как выбранный
        dayElement.classList.add('selected');
        
        selectedDate = dateStr;
        
        // Показываем секцию редактирования
        editSection.style.display = 'block';
        
        // Устанавливаем значение калорий
        caloriesInput.value = caloriesData[dateStr] || '';
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
    
    // Вычисляем размер ячеек для полной ширины с минимальными отступами
    const containerWidth = vw - 4; // 2px отступ с каждой стороны контейнера
    // Используем меньшие отступы между ячейками (2px * 6 = 12px для промежутков)
    const daySize = Math.floor((containerWidth - 12) / 7);
    
    // Адаптивный размер шрифта
    const fontSize = Math.max(10, Math.min(14, Math.floor(daySize / 3.5)));
    
    // Устанавливаем CSS переменные
    document.documentElement.style.setProperty('--day-size', daySize + 'px');
    document.documentElement.style.setProperty('--base-font-size', fontSize + 'px');
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
      const value = parseInt(this.value) || 0;
      updateCalories(selectedDate, value);
      // Скрываем клавиатуру после ввода
      this.blur();
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
        
        // Скрываем клавиатуру после изменения
        input.blur();
      });
    });
  }

  function handleKeyboardVisibility() {
const container = document.querySelector('.container');
const input = document.getElementById('caloriesInput');

// Запоминаем исходную высоту окна (без клавиатуры)
let originalWindowHeight = window.innerHeight;

// При фокусе на поле
input.addEventListener('focus', () => {
  container.classList.add('keyboard-open');
  
  // Небольшая задержка, чтобы клавиатура успела открыться
  setTimeout(() => {
    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, 300);
});

// При потере фокуса
input.addEventListener('blur', () => {
  container.classList.remove('keyboard-open');
});

// Отслеживаем изменение высоты окна (появление/скрытие клавиатуры)
window.addEventListener('resize', () => {
  if (window.innerHeight < originalWindowHeight) {
    // Высота стала меньше — клавиатура открыта
    container.classList.add('keyboard-open');
  } else {
    // Высота вернулась — клавиатура закрыта
    container.classList.remove('keyboard-open');
  }
  originalWindowHeight = window.innerHeight;
});
}


  

  // Запускаем приложение
  init();
})(); 