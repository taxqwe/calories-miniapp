(function () {
  function getURLParameter(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  const langParam = getURLParameter('lang');
  const lang = typeof langParam === 'string' && langParam.length > 0 ? langParam.toLowerCase() : 'en';

  const localizations = {
    ru: {
      locale: 'ru-RU',
      loading: 'Загрузка...',
      pageTitle: 'История',
      pageSubtitle: 'Выберите день, чтобы посмотреть приёмы пищи',
      mealsTitle: 'Приёмы пищи',
      daySelectorAriaLabel: 'Выбор дня',
      prevDaysAriaLabel: 'Предыдущие дни',
      nextDaysAriaLabel: 'Следующие дни',
      addButton: 'Добавить',
      addModalTitle: 'Добавить приём пищи',
      addModalDescription: 'Опишите, что вы ели в выбранный день. Разбор и кнопки «Сохранить» / «Отмена» придут в чат Telegram.',
      addModalPlaceholder: 'Например, овсянка на молоке и кофе',
      addModalCancel: 'Отмена',
      addModalSubmit: 'Отправить',
      addModalSubmitBusy: 'Отправляем…',
      addModalDayLabel: 'Выбранный день: {day}',
      addModalCurrent: 'Текущий итог: {value} {unit}',
      addModalCurrentZero: 'Текущий итог: 0 {unit}',
      selectDayFirst: 'Сначала выберите день',
      invalidMealText: 'Введите описание блюда',
      addMealAnalyzeError: 'Не удалось отправить блюдо',
      invalidMealAnalyzeData: 'Некорректные данные',
      userNotFound: 'Не удалось определить пользователя',
      httpErrorStatus: 'Ошибка {status}',
      daySelectorLoading: 'Загрузка...',
      daySelectorEmpty: 'Нет данных',
      mealsSelectPrompt: 'Выберите день, чтобы посмотреть приёмы пищи',
      mealsLoading: 'Загрузка...',
      mealsNoData: 'Нет данных',
      mealsNoDataDay: 'Нет данных за этот день',
      deleteMealError: 'Не удалось удалить приём пищи',
      loadDaysError: 'Не удалось загрузить список дней',
      loadDayError: 'Не удалось загрузить данные',
      caloriesUnit: 'ккал',
      gramsUnit: 'г',
      deleteMealAriaLabel: 'Удалить приём пищи'
    },
    en: {
      locale: 'en-US',
      loading: 'Loading...',
      pageTitle: 'History',
      pageSubtitle: 'Select a day to view meals',
      mealsTitle: 'Meals',
      daySelectorAriaLabel: 'Select day',
      prevDaysAriaLabel: 'Previous days',
      nextDaysAriaLabel: 'Next days',
      addButton: 'Add',
      addModalTitle: 'Add meal',
      addModalDescription: 'Describe what you ate for the selected day. Analysis and save or cancel happen in the Telegram chat.',
      addModalPlaceholder: 'For example, oatmeal with milk and coffee',
      addModalCancel: 'Cancel',
      addModalSubmit: 'Send',
      addModalSubmitBusy: 'Sending…',
      addModalDayLabel: 'Selected day: {day}',
      addModalCurrent: 'Current total: {value} {unit}',
      addModalCurrentZero: 'Current total: 0 {unit}',
      selectDayFirst: 'Select a day first',
      invalidMealText: 'Enter a meal description',
      addMealAnalyzeError: 'Failed to send meal',
      invalidMealAnalyzeData: 'Invalid data',
      userNotFound: 'Unable to identify the user',
      httpErrorStatus: 'Error {status}',
      daySelectorLoading: 'Loading...',
      daySelectorEmpty: 'No data',
      mealsSelectPrompt: 'Select a day to view meals',
      mealsLoading: 'Loading...',
      mealsNoData: 'No data',
      mealsNoDataDay: 'No data for this day',
      deleteMealError: 'Failed to delete the meal',
      loadDaysError: 'Failed to load days list',
      loadDayError: 'Failed to load day data',
      caloriesUnit: 'kcal',
      gramsUnit: 'g',
      deleteMealAriaLabel: 'Delete meal'
    }
  };

  const fallbackLang = 'en';
  const fallback = localizations[fallbackLang];
  const selected = localizations[lang];

  if (selected) {
    window.historyLocalization = selected;
    window.historyLanguage = lang;
  } else {
    window.historyLocalization = fallback;
    window.historyLanguage = fallbackLang;
  }
})();
