import { useState } from 'react';
import styles from './Calendar.module.css';

interface CalendarProps {
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  caloriesData: { [date: string]: number };
}

export default function Calendar({
  currentMonth,
  setCurrentMonth,
  selectedDate,
  onDateSelect,
  caloriesData,
}: CalendarProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentMonth);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatDate = (day: number) => {
    const year = currentMonth.getFullYear();
    const month = (currentMonth.getMonth() + 1).toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');
    return `${year}-${month}-${dayStr}`;
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.header}>
        <button onClick={handlePrevMonth}>&lt;</button>
        <h2>
          {currentMonth.toLocaleString('ru', { month: 'long', year: 'numeric' })}
        </h2>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      
      <div className={styles.weekdays}>
        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>
      
      <div className={styles.days}>
        {Array.from({ length: firstDayOfMonth - 1 }).map((_, i) => (
          <div key={`empty-${i}`} className={styles.emptyDay} />
        ))}
        
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = formatDate(day);
          const hasCalories = dateStr in caloriesData;
          
          return (
            <div
              key={day}
              className={`${styles.day} ${
                dateStr === selectedDate ? styles.selected : ''
              } ${hasCalories ? styles.hasData : ''}`}
              onClick={() => onDateSelect(dateStr)}
            >
              <span>{day}</span>
              {hasCalories && (
                <small>{caloriesData[dateStr]} ккал</small>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 