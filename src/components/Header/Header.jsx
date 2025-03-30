import React, { useState, useEffect } from "react";
import "./Header.css";
import { useWeather } from "../../context/WeatherContext";

const Header = () => {
  const { currentCity, searchCity, units, toggleUnits, theme, toggleTheme } = useWeather();
  const [searchInput, setSearchInput] = useState("");
  const [activeIcon, setActiveIcon] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [showMonthSelector, setShowMonthSelector] = useState(false);

  // Handle icon clicks
  const handleIconClick = (icon) => {
    if (icon === 'settings') {
      toggleTheme();
      // Show settings is active briefly
      setActiveIcon('settings');
      setTimeout(() => {
        setActiveIcon("");
      }, 500);
    } else if (icon === 'map') {
      // Toggle map visibility via custom event
      const event = new CustomEvent('weather-action', { 
        detail: { 
          action: 'toggleMap',
          show: activeIcon !== 'map'
        } 
      });
      window.dispatchEvent(event);
      setActiveIcon(activeIcon === 'map' ? '' : 'map');
    } else if (icon === 'calendar') {
      setActiveIcon(activeIcon === 'calendar' ? '' : 'calendar');
      // Reset current month to selected date when opening calendar
      if (activeIcon !== 'calendar') {
        setCurrentMonth(new Date(selectedDate));
        setShowYearSelector(false);
        setShowMonthSelector(false);
      }
    } else {
      setActiveIcon(activeIcon === icon ? '' : icon);
    }
  };

  // Generate years for selector (5 years back, 5 years forward)
  const getYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    return years;
  };

  // Month names for selector
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Handle year selection
  const selectYear = (year) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
    setShowYearSelector(false);
  };

  // Handle month selection
  const selectMonth = (monthIndex) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex, 1));
    setShowMonthSelector(false);
  };

  // Format date as Month DD, YYYY
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Get days for the current month view (including days from prev/next months to fill grid)
  const getDaysInMonth = (year, month) => {
    // Days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // First day of month (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    // Days from previous month needed to fill first row
    const daysFromPrevMonth = firstDayOfMonth;
    
    // Get number of days in previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Calculate days needed from next month to complete grid (6 rows x 7 days = 42 total cells)
    const totalCells = 42;
    const daysFromNextMonth = totalCells - daysInMonth - daysFromPrevMonth;
    
    const days = [];
    
    // Add days from previous month
    for (let i = daysInPrevMonth - daysFromPrevMonth + 1; i <= daysInPrevMonth; i++) {
      days.push({
        day: i,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true
      });
    }
    
    // Add days from next month
    for (let i = 1; i <= daysFromNextMonth; i++) {
      days.push({
        day: i,
        month: month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  // Check if a date is today
  const isToday = (day, month, year) => {
    const today = new Date();
    return day === today.getDate() && 
           month === today.getMonth() && 
           year === today.getFullYear();
  };

  // Check if a date is selected
  const isSelected = (day, month, year) => {
    return day === selectedDate.getDate() && 
           month === selectedDate.getMonth() && 
           year === selectedDate.getFullYear();
  };

  // Handle day selection
  const selectDay = (day, month, year) => {
    const newDate = new Date(year, month, day);
    setSelectedDate(newDate);
    
    // Trigger a weather fetch for this date via custom event
    const event = new CustomEvent('weather-action', { 
      detail: { 
        action: 'setDate',
        date: newDate
      } 
    });
    window.dispatchEvent(event);
    console.log("Selected date:", newDate);
    
    // Close calendar after a short delay
    setTimeout(() => {
      setActiveIcon('');
    }, 300);
  };

  // Set to today
  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
  };

  // Clear selection
  const clearSelection = () => {
    const today = new Date();
    setSelectedDate(today);
    setActiveIcon('');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchCity(searchInput);
      setSearchInput("");
    }
  };

  // Add event listener to close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (activeIcon === 'calendar' && !e.target.closest('.calendar-popup') && !e.target.closest('.ph-calendar')) {
        setActiveIcon('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeIcon]);

  return (
    <>
      <section className="header-section">
        <div>
          <i className="ph ph-map-pin"></i>
          <span>{currentCity}</span>
        </div>
        <form onSubmit={handleSearch}>
          <i className="ph ph-magnifying-glass"></i>
          <input 
            type="text" 
            placeholder="Search city" 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
        <div className="header-actions">
          <button 
            className={`unit-toggle ${units === 'imperial' ? 'fahrenheit' : ''}`} 
            onClick={toggleUnits}
            title={units === 'metric' ? 'Switch to Fahrenheit' : 'Switch to Celsius'}
          >
            {units === 'metric' ? '°C' : '°F'}
          </button>
          <i 
            className={`ph ph-calendar ${activeIcon === 'calendar' ? 'active' : ''}`} 
            title="Calendar"
            onClick={() => handleIconClick('calendar')}
          ></i>
          <i 
            className={`ph ph-map-trifold ${activeIcon === 'map' ? 'active' : ''}`} 
            title="Weather Map"
            onClick={() => handleIconClick('map')}
          ></i>
          <i 
            className={`ph ph-${theme === 'dark' ? 'sun' : 'moon'} ${activeIcon === 'settings' ? 'active' : ''}`} 
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            onClick={() => handleIconClick('settings')}
          ></i>
        </div>
      </section>
      
      {/* Custom Calendar popup */}
      {activeIcon === 'calendar' && (
        <div id="calendar-container">
          <div className="calendar-popup">
            <div className="calendar-header">
              <div className="calendar-selectors">
                <h3 onClick={() => setShowMonthSelector(!showMonthSelector)}>
                  {currentMonth.toLocaleDateString('en-US', { month: 'long' })}
                  <i className={`ph ph-caret-${showMonthSelector ? 'up' : 'down'}`}></i>
                </h3>
                <h3 onClick={() => setShowYearSelector(!showYearSelector)}>
                  {currentMonth.getFullYear()}
                  <i className={`ph ph-caret-${showYearSelector ? 'up' : 'down'}`}></i>
                </h3>
              </div>
              <div className="nav-buttons">
                <button onClick={prevMonth} title="Previous month">
                  <i className="ph ph-caret-left"></i>
                </button>
                <button onClick={nextMonth} title="Next month">
                  <i className="ph ph-caret-right"></i>
                </button>
              </div>
            </div>
            
            {/* Year Selector */}
            {showYearSelector && (
              <div className="year-selector">
                {getYearOptions().map(year => (
                  <div 
                    key={year} 
                    className={`year-option ${year === currentMonth.getFullYear() ? 'selected' : ''}`}
                    onClick={() => selectYear(year)}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
            
            {/* Month Selector */}
            {showMonthSelector && (
              <div className="month-selector">
                {months.map((month, index) => (
                  <div 
                    key={month} 
                    className={`month-option ${index === currentMonth.getMonth() ? 'selected' : ''}`}
                    onClick={() => selectMonth(index)}
                  >
                    {month}
                  </div>
                ))}
              </div>
            )}
            
            {/* Rest of the calendar remains the same */}
            {!showYearSelector && !showMonthSelector && (
              <div className="calendar-grid">
                <div className="calendar-weekdays">
                  <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                </div>
                
                <div className="calendar-days">
                  {getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth()).map((dateObj, index) => (
                    <div 
                      key={index}
                      className={`day-cell ${!dateObj.isCurrentMonth ? 'outside-month' : ''} 
                                 ${isToday(dateObj.day, dateObj.month, dateObj.year) ? 'today' : ''}
                                 ${isSelected(dateObj.day, dateObj.month, dateObj.year) ? 'selected' : ''}`}
                      onClick={() => selectDay(dateObj.day, dateObj.month, dateObj.year)}
                    >
                      {dateObj.day}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="calendar-footer">
              <button onClick={clearSelection}>Clear</button>
              <button onClick={goToToday}>Today</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
