(function () {
  const defaultConfig = {
    apiBaseUrl: 'https://caloriesai.duckdns.org'
  };

  window.CaloriesMiniAppConfig = Object.assign(
    defaultConfig,
    window.CaloriesMiniAppConfig || {}
  );
})();
