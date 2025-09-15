import { useState } from "react";

interface DatePickerProps {
    selectedDate: string;
    onDateSelect: (date: string) => void;
    showDatePicker: boolean;
    onClose: () => void;
}

const DatePicker = ({ selectedDate, onDateSelect, showDatePicker, onClose }: DatePickerProps) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const today = new Date();

    const getDaysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const isDateSelected = (date: Date) => {
        return formatDate(date) === selectedDate;
    };


    const handleDateSelect = (date: Date) => {
        // Allow selection of any date
        onDateSelect(formatDate(date));
        onClose();
    };

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-7"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const isSelected = isDateSelected(date);
        const isToday = formatDate(date) === formatDate(today);
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        days.push(
            <button
                key={day}
                onClick={() => handleDateSelect(date)}
                className={`h-7 w-7 rounded text-xs font-medium transition-colors relative z-10 ${
                    isSelected
                        ? 'bg-[#429818] text-white'
                        : isToday
                        ? 'bg-blue-100 text-blue-700 font-semibold hover:bg-blue-200'
                        : isWeekend
                        ? 'text-gray-600 hover:bg-[#F6FFE8] hover:text-[#429818]'
                        : 'text-gray-700 hover:bg-[#F6FFE8] hover:text-[#429818]'
                }`}
                title={isToday ? 'Today' : isWeekend ? 'Weekend' : ''}
            >
                {day}
            </button>
        );
    }

    if (!showDatePicker) return null;

    return (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 w-[240px] max-w-[90vw] sm:max-w-none">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
                <button
                    onClick={goToPreviousMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h3 className="text-base font-semibold text-gray-800">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <button
                    onClick={goToNextMonth}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
                {days}
            </div>
        </div>
    );
};

export default DatePicker;