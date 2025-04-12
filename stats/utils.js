/**
 * Утилитарные функции для форматирования чисел и работы с датами
 */

/**
 * Форматирует число, добавляя пробелы в качестве разделителей разрядов
 * @param {number} num Исходное число
 * @returns {string} Отформатированная строка с разделителями
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Форматирует дату в виде "9 апр. 2025"
 * @param {Date} date Объект даты
 * @returns {string} Отформатированная дата
 */
function formatShortDate(date) {
  return date.toLocaleDateString('ru-RU', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
}

/**
 * Форматирует дату в виде "янв. 2025"
 * @param {Date} date Объект даты
 * @returns {string} Отформатированная дата
 */
function formatMonthYear(date) {
  return date.toLocaleDateString('ru-RU', { 
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
  let start;
  const months = ['янв.', 'февр.', 'март', 'апр.', 'май', 'июнь', 'июль', 'авг.', 'сент.', 'окт.', 'нояб.', 'дек.'];
  
  switch (period) {
    case 'week':
      start = new Date(now);
      start.setDate(now.getDate() - 7);
      return `${start.getDate()} ${months[start.getMonth()]} — ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}г.`;
    case 'month':
      start = new Date(now);
      start.setDate(now.getDate() - 30);
      return `${start.getDate()} ${months[start.getMonth()]} — ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}г.`;
    case '6month':
      start = new Date(now);
      start.setMonth(now.getMonth() - 6);
      return `14 окт. ${start.getFullYear()} — 13 апр. ${now.getFullYear()}г.`;
    case 'year':
      start = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
      return `${months[start.getMonth()]} ${start.getFullYear()} — ${months[now.getMonth()]} ${now.getFullYear()}г.`;
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
      startDate.toLocaleDateString('ru-RU', { month: 'long' })
    } ${startDate.getFullYear()} г.`;
  } else {
    // Если в разных месяцах: 31 янв. - 6 марта 2025 г.
    return `${startDate.getDate()} ${
      startDate.toLocaleDateString('ru-RU', { month: 'short' })
    } - ${endDate.getDate()} ${
      endDate.toLocaleDateString('ru-RU', { month: 'short' })
    } ${endDate.getFullYear()} г.`;
  }
} 