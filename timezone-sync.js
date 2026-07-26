(function () {
  // Общий хелпер: при открытии любого экрана miniapp сообщает боту таймзону
  // браузера через POST {API_BASE_URL}/api/tz. Fire-and-forget: не блокирует
  // рендер, не показывает ошибок пользователю, ничего не делает вне Telegram.
  // Контекст: taxqwe/caloriesv2#806 — экраны bmr/profile/edit не слали
  // таймзону вообще, из-за чего часть пользователей получала напоминания
  // по дефолтной (языковой) таймзоне вместо реальной.

  function getInitData() {
    try {
      return window.Telegram?.WebApp?.initData || '';
    } catch (error) {
      return '';
    }
  }

  function getUserTimezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || null;
    } catch (error) {
      return null;
    }
  }

  function getApiBaseUrl() {
    return window.CaloriesMiniAppConfig?.apiBaseUrl || 'https://caloriesai.duckdns.org';
  }

  function sendTimezone() {
    var initData = getInitData();
    if (!initData) {
      // Открыто вне Telegram — отправлять нечего и некому.
      return;
    }

    var timezone = getUserTimezone();
    if (!timezone) {
      // Резолв не удался — молча ничего не отправляем, не гадаем.
      return;
    }

    try {
      fetch(getApiBaseUrl() + '/api/tz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initData: initData, timezone: timezone })
      }).catch(function () {
        // Сетевая ошибка/не-2xx — тихо игнорируем, экран не должен пострадать.
      });
    } catch (error) {
      // На случай окружений без fetch — тоже тихо игнорируем.
    }
  }

  sendTimezone();
})();
