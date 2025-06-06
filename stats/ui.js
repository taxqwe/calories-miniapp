import { state, fetchUserStats, generateMockData } from './dataService.js';
import { initChart, updateChart, setTrendVisibility, getDataForPeriod } from './chart.js';
import { updateCollections } from './collections.js';

document.addEventListener('DOMContentLoaded', async () => {
  const tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();

  document.getElementById('period-week').textContent = window.localization.periodButtonWeek;
  document.getElementById('period-month').textContent = window.localization.periodButtonMonth;
  document.getElementById('period-6month').textContent = window.localization.periodButtonSixMonth;
  document.getElementById('period-year').textContent = window.localization.periodButtonYear;
  document.getElementById('daily-average-label').textContent = window.localization.dailyAverageLabel;
  document.getElementById('trend-button').textContent = window.localization.trendButton;

  const urlParams = new URLSearchParams(window.location.search);
  const debugMode = urlParams.get('debug') === 'true';
  const showLoadingOverlay = urlParams.get('loading') !== 'false';

  if (debugMode) {
    state.allData = generateMockData(730);
    state.userTDEE = 2200;
  }

  if (showLoadingOverlay) {
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    overlay.innerHTML = `
      <div id="loading-spinner">
        <div class="spinner"></div>
        <div class="spinner-text">${window.localization.loading}</div>
      </div>`;
    document.body.appendChild(overlay);
  }

  function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.remove();
  }

  const theme = tg.themeParams || {};
  document.documentElement.style.setProperty('--text-color', theme.text_color || '#ffffff');
  document.documentElement.style.setProperty('--text-light', theme.hint_color || '#999999');
  document.documentElement.style.setProperty('--accent-color', '#2196F3');
  document.documentElement.style.setProperty('--our-blue', '#2196F3');
  document.documentElement.style.setProperty('--orange-accent', '#FF6422');
  document.documentElement.style.setProperty('--border-color', '#5e5e5e');
  document.documentElement.style.setProperty('--chart-secondary', '#48484a');

  if (tg.colorScheme === 'light' && tg.initDataUnsafe && tg.initDataUnsafe.user) {
    document.documentElement.style.setProperty('--card-bg', theme.secondary_bg_color || '#f0f0f0');
    document.documentElement.style.setProperty('--prev-bar-color', 'rgba(0, 0, 0, 0.3)');
  } else {
    document.documentElement.style.setProperty('--card-bg', '#2c2c2e');
    document.documentElement.style.setProperty('--bg-color', '#1c1c1e');
    document.documentElement.style.setProperty('--prev-bar-color', 'rgba(255, 255, 255, 0.3)');
  }
  document.documentElement.style.setProperty('--dark-bg', document.documentElement.style.getPropertyValue('--card-bg'));

  initChart();

  if (!debugMode) {
    await fetchUserStats(tg);
  }

  updateChart(state.currentPeriod);
  updateCollections(getDataForPeriod(state.currentPeriod), state.userTDEE);
  if (showLoadingOverlay) hideLoadingOverlay();

  const periodButtons = document.querySelectorAll('.period-button');
  periodButtons.forEach(button => {
    button.addEventListener('click', () => {
      periodButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      state.currentPeriod = button.dataset.period;
      updateChart(state.currentPeriod);
      updateCollections(getDataForPeriod(state.currentPeriod), state.userTDEE);
      setTrendVisibility(isTrendVisible);
    });
  });

  let isTrendVisible = false;
  const trendButton = document.querySelector('.trend-button');
  trendButton.addEventListener('click', () => {
    isTrendVisible = !isTrendVisible;
    trendButton.classList.toggle('active', isTrendVisible);
    setTrendVisibility(isTrendVisible);
  });
});
