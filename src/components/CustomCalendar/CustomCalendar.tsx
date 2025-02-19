import { useState, useEffect } from 'react';
import { format, addDays, subDays, startOfWeek, endOfWeek } from 'date-fns';
import pt from 'date-fns/locale/pt';

const CustomCalendar = ({ selectedDate, setSelectedDate }) => {
    const [currentWeek, setCurrentWeek] = useState([]);

    useEffect(() => {
        const start = startOfWeek(selectedDate, { locale: pt });
        const end = endOfWeek(selectedDate, { locale: pt });

        const week = [];
        for (let day = start; day <= end; day = addDays(day, 1)) {
            week.push(day);
        }

        setCurrentWeek(week);
    }, [selectedDate]);

    return (
        <div className="custom-calendar">
            <button onClick={() => setSelectedDate(subDays(selectedDate, 7))}>{'<'}</button>
            {currentWeek.map(day => (
                <div 
                    key={day} 
                    className={`day ${format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd') ? 'selected' : ''}`} 
                    onClick={() => setSelectedDate(day)}
                >
                    <span>{format(day, 'EEE', { locale: pt }).toUpperCase()}</span>
                    <span>{format(day, 'dd', { locale: pt })}</span>
                </div>
            ))}
            <button onClick={() => setSelectedDate(addDays(selectedDate, 7))}>{'>'}</button>
        </div>
    );
};

export default CustomCalendar;
