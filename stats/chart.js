import { state } from './dataService.js';

let statsChartContainer;
let trendContainer;
let averageLine;
let averageValue;

export function initChart() {
  statsChartContainer = document.querySelector('.stats-chart-container');
  if (!statsChartContainer) return;
  trendContainer = document.createElement('div');
  trendContainer.className = 'trend-container';
  statsChartContainer.appendChild(trendContainer);

  averageLine = document.createElement('div');
  averageLine.className = 'trend-line average-line';
  averageValue = document.createElement('span');
  averageValue.className = 'trend-value average-value';
  averageLine.appendChild(averageValue);
  trendContainer.appendChild(averageLine);
}

export function setTrendVisibility(visible) {
  if (!trendContainer) return;
  averageLine.style.opacity = visible ? '1' : '0';
  statsChartContainer.classList.toggle('trend-active', visible);
}

export function getWeekData() {
  return state.allData.slice(-7);
}

export function getMonthData() {
  return state.allData.slice(-30);
}

export function getSixMonthData() {
  const rawData = state.allData.slice(-180);
  const weekCount = 26;
  const groupSize = 7;
  const aggregated = [];
  for (let i = 0; i < weekCount; i++) {
    const startIndex = Math.max(0, rawData.length - (weekCount - i) * groupSize);
    const group = rawData.slice(startIndex, startIndex + groupSize);
    if (group.length > 0) {
      const nonEmpty = group.filter(item => item.calories > 0).map(item => item.calories);
      const avg = nonEmpty.length ? Math.round(nonEmpty.reduce((a,b)=>a+b,0)/nonEmpty.length) : 0;
      aggregated.push(avg);
    } else {
      aggregated.push(0);
    }
  }
  return aggregated;
}

export function getYearData() {
  const now = new Date();
  now.setHours(0,0,0,0);
  const startDate = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
  const filteredData = state.allData.filter(item => item.date >= startDate);
  const groups = {};
  for (let i = 0; i < 12; i++) {
    const currentMonth = (startDate.getMonth() + i) % 12;
    const currentYear = startDate.getFullYear() + Math.floor((startDate.getMonth() + i) / 12);
    const monthKey = `${currentYear}-${currentMonth}`;
    groups[monthKey] = [];
  }
  filteredData.forEach(item => {
    const m = item.date.getMonth();
    const y = item.date.getFullYear();
    const monthKey = `${y}-${m}`;
    if (groups[monthKey]) groups[monthKey].push(item.calories);
  });
  const aggregated = [];
  for (let i = 0; i < 12; i++) {
    const currentMonth = (startDate.getMonth() + i) % 12;
    const currentYear = startDate.getFullYear() + Math.floor((startDate.getMonth() + i) / 12);
    const monthKey = `${currentYear}-${currentMonth}`;
    const group = groups[monthKey] || [];
    const nonEmpty = group.filter(v => v > 0);
    const avg = nonEmpty.length ? Math.round(nonEmpty.reduce((a,b)=>a+b,0)/nonEmpty.length) : 0;
    aggregated.push(avg);
  }
  return aggregated;
}

export function getSixMonthIntervals() {
  const rawData = state.allData.slice(-180);
  const weekCount = 26;
  const groupSize = 7;
  const intervals = [];
  for (let i = 0; i < weekCount; i++) {
    const startIndex = Math.max(0, rawData.length - (weekCount - i) * groupSize);
    const group = rawData.slice(startIndex, startIndex + groupSize);
    if (group.length > 0) {
      intervals.push(group[0].date);
    } else {
      const now = new Date();
      now.setHours(0,0,0,0);
      const calculatedDate = new Date(now);
      calculatedDate.setDate(now.getDate() - (weekCount - i) * groupSize);
      intervals.push(calculatedDate);
    }
  }
  return intervals;
}

export function getSixMonthLabels() {
  const now = new Date();
  now.setHours(0,0,0,0);
  const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const labels = [];
  for (let i = 0; i < 6; i++) {
    const current = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
    const monthName = current.toLocaleDateString(window.localization.getLocale(), { month: 'short' });
    labels.push(monthName);
  }
  return labels;
}

export function getLabelsForPeriod(period) {
  if (!state.allData || state.allData.length === 0) return [];
  const now = new Date();
  now.setHours(0,0,0,0);
  switch(period){
    case 'week':
      return Array.from({length:7},(_,i)=>{
        const date=new Date(now);
        date.setDate(now.getDate() - (6 - i));
        let shortDay = date.toLocaleDateString(window.localization.getLocale(), { weekday: 'short' });
        shortDay = shortDay.charAt(0).toUpperCase() + shortDay.slice(1);
        return shortDay;
      });
    case 'month': {
      const monthData = getMonthData();
      const labels = new Array(monthData.length).fill('');
      monthData.forEach((item,index)=>{
        const date=new Date(item.date);
        if (date.getDay()===1) labels[index]=date.getDate().toString();
      });
      return labels;
    }
    case '6month': {
      const intervals = getSixMonthIntervals();
      const labels = [];
      for (let i = 0; i < intervals.length; i++) {
        if (i===0 || intervals[i].getMonth()!==intervals[i-1].getMonth()) {
          const monthName = intervals[i].toLocaleDateString(window.localization.getLocale(), { month: 'short' });
          labels.push(monthName);
        } else {
          labels.push('');
        }
      }
      return labels;
    }
    case 'year': {
      const now = new Date();
      const startDate = new Date(now.getFullYear() - 1, now.getMonth() + 1, 1);
      const labels = [];
      for (let i = 0; i < 12; i++) {
        const currentMonth = (startDate.getMonth() + i) % 12;
        const currentYear = startDate.getFullYear() + Math.floor((startDate.getMonth() + i) / 12);
        const d = new Date(currentYear, currentMonth, 1);
        const monthName = d.toLocaleDateString(window.localization.getLocale(), { month: 'narrow' });
        labels.push(monthName);
      }
      return labels;
    }
    default:
      return Array.from({length:7},(_,i)=>{
        const date=new Date(now);
        date.setDate(now.getDate() - (6 - i));
        return date.getDate().toString();
      });
  }
}

export function getDataForPeriod(period) {
  switch(period){
    case 'week':
      return getWeekData();
    case 'month':
      return getMonthData();
    case '6month': {
      const averages = getSixMonthData();
      const dates = getSixMonthIntervals();
      return averages.map((cals, i) => ({ date: dates[i], calories: cals }));
    }
    case 'year': {
      const now = new Date();
      now.setHours(0,0,0,0);
      const startDate = new Date(now.getFullYear()-1, now.getMonth()+1, 1);
      const values = getYearData();
      return values.map((val, i) => {
        const monthDate = new Date(startDate.getFullYear(), startDate.getMonth()+i, 1);
        return { date: monthDate, calories: val };
      });
    }
    default:
      return [];
  }
}

export function updateChart(period){
  let data = [];
  if(state.allData && state.allData.length > 0){
    if(period==='week') data = getWeekData().map(i=>i.calories);
    else if(period==='month') data = getMonthData().map(i=>i.calories);
    else if(period==='6month') data = getSixMonthData();
    else if(period==='year') data = getYearData();
  }
  const TDEE = state.userTDEE || 0;
  const maxValue = data.length > 0 ? Math.max(...data, TDEE, 100) : 100;
  const labels = getLabelsForPeriod(period, data.length);
  const gridMax = data.length > 0 ? Math.ceil(maxValue / 3 / 100) * 100 * 3 : 300;
  const chartContainerElem = document.querySelector('.stats-chart');
  if(chartContainerElem){
    chartContainerElem.innerHTML='';
    const dataLength = data.length || 7;
    for(let i=0;i<dataLength;i++){
      const value = data[i] || 0;
      const bar = document.createElement('div');
      bar.className = 'chart-bar' + (value === 0 ? ' empty' : '');
      const height = value === 0 ? 4 : (value / gridMax * 100);
      bar.style.height = `${height}%`;
      bar.setAttribute('data-calories', value);
      if(period==='week' || period==='month'){
        bar.setAttribute('data-type','day');
        if(state.allData && state.allData.length > 0){
          const dateObj = period==='week' ? getWeekData()[i]?.date : getMonthData()[i]?.date;
          if(dateObj) bar.setAttribute('data-date', dateObj.toISOString());
        }
      } else if(period==='6month'){
        bar.setAttribute('data-type','week');
        if(state.allData && state.allData.length > 0){
          const rawData = state.allData.slice(-180);
          const weekIndex = Math.floor(i*7);
          if(weekIndex < rawData.length){
            bar.setAttribute('data-date', rawData[weekIndex].date.toISOString());
          }
        }
      } else if(period==='year'){
        bar.setAttribute('data-type','month');
        if(state.allData && state.allData.length > 0){
          const now = new Date();
          now.setHours(0,0,0,0);
          const startDate = new Date(now.getFullYear()-1, now.getMonth()+1,1);
          const monthDate = new Date(startDate.getFullYear(), startDate.getMonth()+i,1);
          bar.setAttribute('data-date', monthDate.toISOString());
        }
      }
      chartContainerElem.appendChild(bar);
    }
  }
  const labelsContainer = document.querySelector('.chart-labels');
  labelsContainer.setAttribute('data-period', period);
  labelsContainer.innerHTML = labels.map(label => `<span>${label || ''}</span>`).join('');
  const nonEmptyDays = data.filter(v=>v>0);
  const average = nonEmptyDays.length ? Math.round(nonEmptyDays.reduce((a,b)=>a+b,0)/nonEmptyDays.length) : 0;
  document.querySelector('.stats-value').textContent = `${parseInt(average).toLocaleString(window.localization.getLocale())} ${window.localization.kilocalories}`;
  document.querySelector('.stats-label:last-child').textContent = formatPeriodDate(period);
  const gridStep = gridMax / 3;
  const gridValues = document.querySelectorAll('.grid-value');
  gridValues[0].textContent = gridMax.toString();
  gridValues[1].textContent = (gridStep * 2).toString();
  gridValues[2].textContent = gridStep.toString();
  gridValues[3].textContent = '0';
  if(averageLine){
    const percent = average > 0 ? Math.max((average / gridMax * 100), 1) : 0;
    averageLine.style.bottom = `${percent}%`;
  }
  if(averageValue){
    averageValue.textContent = `${average} ${window.localization.kilocalories}`;
  }
}
