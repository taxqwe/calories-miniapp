(function() {
  const tg = window.Telegram.WebApp;
  tg.expand();

  // UI elements
  const calendar = document.getElementById('calendar');
  const currentMonthElement = document.getElementById('currentMonth');
  const daysContainer = document.getElementById('days');
  const editSection = document.getElementById('editSection');
  const caloriesInput = document.getElementById('caloriesInput');
  const loadingElement = document.getElementById('loading');

  // State
  let currentDate = new Date();
  let selectedDate = null;
  let caloriesData = {};
  let chatId = null;
  let initDataRaw = null;

  // Initialization
  function init() {
    updateCalendarSize();
    try {
      // Save initData
      initDataRaw = tg.initData;
      console.log('Received initData length:', initDataRaw?.length || 0);
      
      // Get chatId
      if (tg.initDataUnsafe?.user?.id) {
        chatId = tg.initDataUnsafe.user.id;
        console.log('chatId received from initDataUnsafe:', chatId);
      } else {
        const initData = JSON.parse(tg.initData);
        if (initData.user?.id) {
          chatId = initData.user.id;
          console.log('chatId received from initData:', chatId);
        }
      }

      if (!chatId) {
        console.error('chatId not received!');
        throw new Error('Failed to get user ID');
      }

      // Setup event listeners
      setupCalendarEventListeners();

      // Load initial data
      fetchAndRenderCalendar();

      // Solve keyboard overlay issue
      handleKeyboardVisibility();

    } catch (error) {
      console.error('Initialization error:', error);
      alert('App initialization error');
    }
  }

  // Fetch and display calendar data
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
      console.log('Sending request:', JSON.stringify(requestBody));
      
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

      console.log('Received response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response error:', response.status, errorText);
        throw new Error('Error fetching data');
      }

      const data = await response.json();
      console.log('Received server data:', data);
      
      // Transform array to object for easier use
      caloriesData = data.reduce((acc, item) => {
        acc[item.date] = item.calories;
        return acc;
      }, {});
      console.log('Data after transformation:', caloriesData);

      renderCalendar();
    } catch (error) {
      console.error('Data loading error:', error);
      alert('Failed to load data');
    } finally {
      showLoading(false);
    }
  }

  // Update calories
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
      console.log('Sending update request:', JSON.stringify(requestBody));
      
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

      console.log('Received update response:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server update response error:', response.status, errorText);
        throw new Error('Error updating data');
      }

      // If calories = 0, remove entry
      if (calories === 0) {
        delete caloriesData[date];
      } else {
        // Otherwise update local data
        caloriesData[date] = calories;
      }
      renderCalendar();
    } catch (error) {
      console.error('Data update error:', error);
      alert('Failed to update data');
    } finally {
      showLoading(false);
    }
  }

  // Render calendar
  function renderCalendar() {
    // Update month title
    currentMonthElement.textContent = currentDate.toLocaleString('en', {
      month: 'long',
      year: 'numeric'
    });

    // Get number of days in month and day of week for first day
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay() || 7;

    // Clear days container
    daysContainer.innerHTML = '';

    // Add empty cells for alignment
    for (let i = 1; i < firstDayOfMonth; i++) {
      const emptyDay = document.createElement('div');
      emptyDay.className = 'day empty';
      daysContainer.appendChild(emptyDay);
    }

    // Add month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dayElement = document.createElement('div');
      const dateStr = formatDate(year, month + 1, day);
      // Day has data only if calories are greater than 0
      const hasData = dateStr in caloriesData && caloriesData[dateStr] > 0;
      
      // Check if this day is selected
      const isSelected = dateStr === selectedDate;

      dayElement.className = `day${isSelected ? ' selected' : ''}${hasData ? ' has-data' : ''}`;
      
      // Show calories only if they are greater than 0
      if (hasData) {
        dayElement.innerHTML = `
          <span>${day}</span>
          <small>${caloriesData[dateStr]}<br>cal</small>
        `;
      } else {
        dayElement.innerHTML = `<span>${day}</span>`;
      }

      dayElement.addEventListener('click', () => {
        // Remove 'selected' class from all days
        document.querySelectorAll('.day').forEach(day => {
          day.classList.remove('selected');
        });
        
        // Set current day as selected
        dayElement.classList.add('selected');
        
        selectedDate = dateStr;
        
        // Show edit section
        editSection.style.display = 'block';
        
        // Set calories value
        caloriesInput.value = caloriesData[dateStr] || '';
      });

      daysContainer.appendChild(dayElement);
    }
  }

  // Helper functions
  function formatDate(year, month, day) {
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }

  function showLoading(show) {
    loadingElement.style.display = show ? 'flex' : 'none';
    calendar.style.opacity = show ? '0.5' : '1';
    editSection.style.opacity = show ? '0.5' : '1';
  }

  function updateCalendarSize() {
    const containerWidth = document.querySelector('.container').offsetWidth;
    const daySize = (containerWidth - 10) / 7; // 7 days in a week
    document.documentElement.style.setProperty('--day-size', `${daySize}px`);
  }

  function setupCalendarEventListeners() {
    // Month buttons handlers
    document.getElementById('prevMonth').addEventListener('click', () => {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      fetchAndRenderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      fetchAndRenderCalendar();
    });

    // Quick buttons handlers
    document.querySelectorAll('.quick-button').forEach(button => {
      button.addEventListener('click', () => {
        if (!selectedDate) return;
        
        const change = parseInt(button.dataset.value, 10);
        let currentValue = parseInt(caloriesInput.value) || 0;
        let newValue = Math.max(0, currentValue + change);
        
        // Limit maximum value
        newValue = Math.min(newValue, 10000);
        
        caloriesInput.value = newValue;
        updateCalories(selectedDate, newValue);
      });
    });

    // Manual change handler
    caloriesInput.addEventListener('change', () => {
      if (!selectedDate) return;
      
      let value = parseInt(caloriesInput.value) || 0;
      value = Math.max(0, Math.min(value, 10000));
      caloriesInput.value = value || '';
      
      updateCalories(selectedDate, value);
    });
  }

  function handleKeyboardVisibility() {
    const container = document.querySelector('.container');
    
    caloriesInput.addEventListener('focus', () => {
      container.classList.add('keyboard-open');
    });
    
    caloriesInput.addEventListener('blur', () => {
      container.classList.remove('keyboard-open');
    });
  }

  // Window resize handler
  window.addEventListener('resize', updateCalendarSize);

  // Start application
  init();
})(); 