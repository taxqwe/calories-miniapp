// Реализация вертикальной линии при длительном нажатии
document.addEventListener('DOMContentLoaded', () => {
  let longPressTimer = null;
  let verticalLine = null;
  let isLongPressActive = false; // Флаг активного долгого нажатия
  let originalAverageValue = ''; // Для сохранения исходного значения
  let originalDateLabel = ''; // Для сохранения исходной подписи

  // Функция создания или обновления вертикальной линии для выбранного столбца
  function updateVerticalLineAt(targetElement) {
    // Выбираем общий контейнер, который охватывает как блок "В СРЕДНЕМ ЗА ДЕНЬ", так и график
    const container = document.querySelector('.stats-container');
    if (!container) return;
    const containerRect = container.getBoundingClientRect();

    // Получаем координаты выбранного столбца
    const barRect = targetElement.getBoundingClientRect();
    
    // Блок "В СРЕДНЕМ ЗА ДЕНЬ" – в данном примере первый элемент с классом .stats-card
    const topStatsCard = container.querySelector('.stats-card');
    if (!topStatsCard) return;
    const statsCardRect = topStatsCard.getBoundingClientRect();

    // Вычисляем горизонтальное положение линии (центр столбца)
    const leftPos = barRect.left - containerRect.left + (barRect.width / 2);
    // Верхняя точка линии — нижняя граница блока "В СРЕДНЕМ ЗА ДЕНЬ"
    const lineStart = statsCardRect.bottom - containerRect.top;
    // Нижняя точка линии — верх выбранного столбца с отступом 2px
    const lineEnd = barRect.top - containerRect.top - 2;

    if (verticalLine) {
      // Если линия уже создана, обновляем её свойства
      verticalLine.style.left = `${leftPos}px`;
      verticalLine.style.top = `${lineStart}px`;
      verticalLine.style.height = `${lineEnd - lineStart}px`;
    } else {
      // Создаем новую линию, если её ещё нет
      verticalLine = document.createElement('div');
      verticalLine.classList.add('vertical-line');
      verticalLine.style.position = 'absolute';
      verticalLine.style.left = `${leftPos}px`;
      verticalLine.style.top = `${lineStart}px`;
      verticalLine.style.height = `${lineEnd - lineStart}px`;
      verticalLine.style.width = '2px';
      verticalLine.style.backgroundColor = 'var(--text-light)'; // Цвет линии такой же, как у подписей оси X
      verticalLine.style.zIndex = '10';
      container.appendChild(verticalLine);
      
      // Сохраняем исходные значения при первом создании линии
      const statsValueElem = topStatsCard.querySelector('.stats-value');
      const statsLabelElem = topStatsCard.querySelector('.stats-label:last-child');
      if (statsValueElem) originalAverageValue = statsValueElem.textContent;
      if (statsLabelElem) originalDateLabel = statsLabelElem.textContent;
    }
    
    // Теперь обновляем блок "В СРЕДНЕМ ЗА ДЕНЬ"
    // Получаем значение из выбранного столбца
    const calories = targetElement.getAttribute('data-calories');
    const dataType = targetElement.getAttribute('data-type');
    const rawDate = targetElement.getAttribute('data-date');
    
    if (calories !== null && rawDate) {
      // Создаем объект Date в локальной таймзоне
      const dateObj = new Date(rawDate);
      const statsValueElem = topStatsCard.querySelector('.stats-value');
      const statsLabelElem = topStatsCard.querySelector('.stats-label:last-child');
      
      if (statsValueElem) {
        // Форматируем значение: разделитель тысяч
        statsValueElem.textContent = `${parseInt(calories).toLocaleString(window.localization.getLocale())} ${window.localization.kilocalories}`;
      }
      
      if (statsLabelElem) {
        // Форматируем дату в зависимости от типа периода
        const currentPeriod = document.querySelector('.period-button.active')?.dataset.period || 'week';
        let formattedDate = '';
        
        if (currentPeriod === 'week') {
          // Для дня в режиме недели: 9 апр. 2025
          formattedDate = formatShortDate(dateObj);
        } else if (currentPeriod === 'month') {
          // Для дня в режиме месяца показываем день недели
          formattedDate = formatShortDateWithWeekday(dateObj);
        } else if (currentPeriod === '6month') {
          // Для недели вычисляем интервал: начальная дата + 6 дней
          formattedDate = formatWeekInterval(dateObj);
        } else if (currentPeriod === 'year') {
          // Для месяца: янв. 2025
          formattedDate = formatMonthYear(dateObj);
        }
        
        statsLabelElem.textContent = formattedDate;
      }
    }
  }

  // Функция сброса состояния и удаления линии
  function clearLongPress() {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    
    if (verticalLine) {
      verticalLine.remove();
      verticalLine = null;
      
      // Восстанавливаем исходные значения в блоке "В СРЕДНЕМ ЗА ДЕНЬ"
      const topStatsCard = document.querySelector('.stats-card');
      if (topStatsCard) {
        const statsValueElem = topStatsCard.querySelector('.stats-value');
        const statsLabelElem = topStatsCard.querySelector('.stats-label:last-child');
        
        if (statsValueElem && originalAverageValue) {
          statsValueElem.textContent = originalAverageValue;
        }
        
        if (statsLabelElem && originalDateLabel) {
          statsLabelElem.textContent = originalDateLabel;
        }
      }
    }
    
    isLongPressActive = false;
  }

  // Обработчик начала нажатия
  document.addEventListener('pointerdown', (event) => {
    if (event.target.classList.contains('chart-bar')) {
      longPressTimer = setTimeout(() => {
        isLongPressActive = true;
        updateVerticalLineAt(event.target);
      }, 250); // Уменьшаем задержку для длинного нажатия с 500 до 250 мс
    }
  });

  // Обновляем положение линии при перемещении, если длинное нажатие активно
  document.addEventListener('pointermove', (event) => {
    if (isLongPressActive) {
      // Определяем элемент, который находится под текущими координатами указателя
      const elementUnderPointer = document.elementFromPoint(event.clientX, event.clientY);
      if (elementUnderPointer && elementUnderPointer.classList.contains('chart-bar')) {
        updateVerticalLineAt(elementUnderPointer);
      }
    } else {
      // Если длинное нажатие ещё не активировано, при значительном перемещении отменяем таймер
      if (longPressTimer && (Math.abs(event.movementX) > 5 || Math.abs(event.movementY) > 5)) {
        clearLongPress();
      }
    }
  });

  // Блокируем вертикальный скроллинг при активном длительном нажатии
  document.addEventListener('touchmove', function(event) {
    if (isLongPressActive) {
      event.preventDefault(); // Предотвращаем скроллинг
    }
  }, { passive: false }); // Важно указать passive: false для возможности вызова preventDefault()

  // Сбрасываем состояние при отпускании или отмене нажатия
  document.addEventListener('pointerup', clearLongPress);
  document.addEventListener('pointerleave', clearLongPress);
  document.addEventListener('pointercancel', clearLongPress);

  // Добавляем базовые стили для контейнера и вертикальной линии, если они не заданы в CSS
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .stats-container {
      position: relative;
    }
    .vertical-line {
      position: absolute;
      width: 2px;
      background-color: var(--text-light);
      z-index: 10;
    }
  `;
  document.head.appendChild(styleElement);
}); 