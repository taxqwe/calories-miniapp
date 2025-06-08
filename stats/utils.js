/**
 * Утилитарные функции для форматирования чисел и работы с датами
 */

/**
 * Форматирует число, используя Intl.NumberFormat для корректного форматирования по локали
 * @param {number} num Исходное число
 * @returns {string} Отформатированная строка с разделителями в соответствии с локалью
 */
function formatNumber(num) {
  return new Intl.NumberFormat(window.localization.getLocale(), { 
    maximumFractionDigits: 0 
  }).format(num);
}

/**
 * Форматирует дату в виде "9 апр. 2025"
 * @param {Date} date Объект даты
 * @returns {string} Отформатированная дата
 */
function formatShortDate(date) {
  return date.toLocaleDateString(window.localization.getLocale(), {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Форматирует дату в виде "пн, 9 апр. 2025"
 * @param {Date} date Объект даты
 * @returns {string} Отформатированная дата с днём недели
 */
function formatShortDateWithWeekday(date) {
  const formatted = date.toLocaleDateString(window.localization.getLocale(), {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Форматирует дату в виде "янв. 2025"
 * @param {Date} date Объект даты
 * @returns {string} Отформатированная дата
 */
function formatMonthYear(date) {
  return date.toLocaleDateString(window.localization.getLocale(), { 
    month: 'short', 
    year: 'numeric' 
  });
}

/**
 * Форматирует период для отображения в блоке "В СРЕДНЕМ ЗА ДЕНЬ"
 * @param {string} period Тип периода ('week', 'month', '6month', 'year')
 * @returns {string} Отформатированная строка с интервалом дат
 */
function formatPeriodDate(period) {
  const now = new Date();
  // Устанавливаем время на полночь в локальной таймзоне
  now.setHours(0, 0, 0, 0);
  let start;
  
  switch (period) {
    case 'week':
      start = new Date(now);
      start.setDate(now.getDate() - 7);
      return `${start.getDate()} ${start.toLocaleDateString(window.localization.getLocale(), { month: 'short' })} — ${now.getDate()} ${now.toLocaleDateString(window.localization.getLocale(), { month: 'short' })} ${now.getFullYear()}г.`;
    case 'month':
      start = new Date(now);
      start.setDate(now.getDate() - 30);
      return `${start.getDate()} ${start.toLocaleDateString(window.localization.getLocale(), { month: 'short' })} — ${now.getDate()} ${now.toLocaleDateString(window.localization.getLocale(), { month: 'short' })} ${now.getFullYear()}г.`;
    case '6month':
      start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      return `1 ${start.toLocaleDateString(window.localization.getLocale(), { month: 'short' })} ${start.getFullYear()} — ${now.getDate()} ${now.toLocaleDateString(window.localization.getLocale(), { month: 'short' })} ${now.getFullYear()}г.`;
    case 'year':
      start = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
      return `${start.toLocaleDateString(window.localization.getLocale(), { month: 'short' })} ${start.getFullYear()} — ${now.toLocaleDateString(window.localization.getLocale(), { month: 'short' })} ${now.getFullYear()}г.`;
  }
}

/**
 * Форматирует интервал недели
 * @param {Date} startDate Дата начала недели
 * @returns {string} Отформатированная строка с интервалом недели
 */
function formatWeekInterval(startDate) {
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  if (startDate.getMonth() === endDate.getMonth()) {
    // Если даты в одном месяце: 17-23 марта 2025 г.
    return `${startDate.getDate()}-${endDate.getDate()} ${
      startDate.toLocaleDateString(window.localization.getLocale(), { month: 'long' })
    } ${startDate.getFullYear()} г.`;
  } else {
    // Если в разных месяцах: 31 янв. - 6 марта 2025 г.
    return `${startDate.getDate()} ${
      startDate.toLocaleDateString(window.localization.getLocale(), { month: 'short' })
    } - ${endDate.getDate()} ${
      endDate.toLocaleDateString(window.localization.getLocale(), { month: 'short' })
    } ${endDate.getFullYear()} г.`;
  }
} 