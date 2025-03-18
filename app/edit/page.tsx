'use client'
import { useState, useEffect } from 'react'
import Calendar from '../components/Calendar'
import styles from './page.module.css'
import { LoadingSpinner } from '../components/LoadingSpinner'

interface CaloriesData {
  [date: string]: number;
}

interface WeekHistoryDomain {
  date: string;
  calories: number;
}

declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    };
  }
}

export default function EditPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [caloriesData, setCaloriesData] = useState<CaloriesData>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [chatId, setChatId] = useState<number | undefined>(undefined);

  useEffect(() => {
    // Инициализация Telegram WebApp
    const webApp = window.Telegram?.WebApp;
    if (webApp) {
      webApp.ready();
      // Пробуем получить chatId из initData
      try {
        const initData = JSON.parse(webApp.initData);
        if (initData.user?.id) {
          setChatId(initData.user.id);
        }
      } catch (e) {
        console.warn('Ошибка при парсинге initData:', e);
      }

      // Пробуем получить из initDataUnsafe если не получили из initData
      if (!chatId && webApp.initDataUnsafe?.user?.id) {
        setChatId(webApp.initDataUnsafe.user.id);
      }
    }
  }, []);

  useEffect(() => {
    if (chatId) {
      fetchCaloriesData();
    }
  }, [chatId, currentMonth]);

  const fetchCaloriesData = async () => {
    if (!chatId) return;

    setIsLoading(true);
    try {
      const year = currentMonth.getFullYear();
      const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
      
      const response = await fetch('/api/calories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatid: chatId,
          date: `${year}-${month}`
        })
      });

      const data: WeekHistoryDomain[] = await response.json();
      
      // Преобразуем массив в объект для удобства использования в календаре
      const transformedData: CaloriesData = data.reduce((acc, item) => {
        acc[item.date] = item.calories;
        return acc;
      }, {} as CaloriesData);
      
      setCaloriesData(transformedData);
    } catch (error) {
      console.error('Error fetching calories data:', error);
    }
    setIsLoading(false);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleCaloriesUpdate = async (calories: number) => {
    if (!selectedDate || !chatId) return;

    try {
      await fetch('/api/calories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatid: chatId,
          date: selectedDate,
          calories,
        }),
      });
      
      // Обновляем локальные данные
      setCaloriesData(prev => ({
        ...prev,
        [selectedDate]: calories
      }));
    } catch (error) {
      console.error('Error updating calories:', error);
    }
  };

  if (!chatId) {
    return <div className={styles.container}>
      <h1>Ошибка</h1>
      <p>Не удалось получить идентификатор пользователя</p>
    </div>;
  }

  return (
    <div className={styles.container}>
      <h1>Редактирование калорий</h1>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Calendar 
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            caloriesData={caloriesData}
          />
          {selectedDate && (
            <div className={styles.editSection}>
              <input
                type="number"
                value={caloriesData[selectedDate] || ''}
                onChange={(e) => handleCaloriesUpdate(Number(e.target.value))}
                placeholder="Введите калории"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
} 