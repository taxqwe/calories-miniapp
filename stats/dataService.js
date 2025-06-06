export const state = {
  allData: [],
  userTDEE: 0,
  currentPeriod: 'week'
};

export function generateMockData(count) {
  const data = [];
  let startDate = new Date();
  startDate.setDate(startDate.getDate() - (count - 1));
  for (let i = 0; i < count; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const calories = Math.random() > 0.8 ? 0 : Math.floor(Math.random() * 2200) + 800;
    data.push({ date: currentDate, calories });
  }
  return data;
}

export async function fetchUserStats(tg) {
  try {
    const initData = tg.initData;
    const userId = tg.initDataUnsafe?.user?.id;
    const controller = new AbortController();
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const response = await fetch('https://calories-bot.duckdns.org:8443/api/stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Source-App': 'Calories-Stats'
      },
      mode: 'cors',
      signal: controller.signal,
      body: JSON.stringify({ initData, userId, timezone: userTimezone })
    });

    if (!response.ok) {
      throw new Error(`Server status ${response.status}`);
    }

    const responseData = await response.json();
    const caloriesMap = responseData.calories;
    const tdee = responseData.tdee;

    const formattedData = [];
    let startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    startDate.setDate(startDate.getDate() - 729);
    for (let i = 0; i < 730; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      const calories = caloriesMap[dateKey] || 0;
      formattedData.push({ date: currentDate, calories });
    }

    state.allData = formattedData;
    if (tdee) {
      state.userTDEE = tdee;
    }
    return true;
  } catch (error) {
    console.log('Ошибка загрузки данных с сервера:', error);
    return false;
  }
}
