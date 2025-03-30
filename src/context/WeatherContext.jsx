import { createContext, useState, useContext, useEffect } from 'react';
import { fetchCurrentWeather, fetchForecast } from '../services/weatherService';

// Create the context
const WeatherContext = createContext();

// Custom hook for using the weather context
export const useWeather = () => useContext(WeatherContext);

// Cache expiration time in milliseconds (30 minutes)
const CACHE_EXPIRATION = 30 * 60 * 1000;

// Weather provider component
export const WeatherProvider = ({ children }) => {
  const [currentCity, setCurrentCity] = useState('London');
  const [units, setUnits] = useState('metric');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [otherCities, setOtherCities] = useState([
    { name: 'Manchester', data: null },
    { name: 'Edinburgh', data: null },
    { name: 'Bristol', data: null },
    { name: 'York', data: null },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usingGeolocation, setUsingGeolocation] = useState(false);
  // Weather data cache
  const [weatherCache, setWeatherCache] = useState({});
  const [forecastCache, setForecastCache] = useState({});
  // Theme state
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('weatherAppTheme');
    return savedTheme || 'light';
  });

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('weatherAppTheme', theme);
  }, [theme]);

  // Listen for custom events
  useEffect(() => {
    const handleWeatherAction = (event) => {
      const { action, date, show } = event.detail;
      
      if (action === 'setDate' && date) {
        setSelectedDate(new Date(date));
      }
      // Other actions can be handled here
    };
    
    window.addEventListener('weather-action', handleWeatherAction);
    
    return () => {
      window.removeEventListener('weather-action', handleWeatherAction);
    };
  }, []);

  // Get user location on initial load
  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`
              );
              
              if (!response.ok) {
                throw new Error(`Geolocation weather error: ${response.status}`);
              }
              
              const data = await response.json();
              setCurrentCity(data.name);
              setUsingGeolocation(true);
            } catch (err) {
              console.error("Error getting location weather:", err);
              // Fall back to default city
            } finally {
              setLoading(false);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setLoading(false);
          },
          { timeout: 10000 }
        );
      }
    };
    
    getUserLocation();
  }, []);

  // Check if cached data is valid
  const isCacheValid = (cacheKey, cache) => {
    return (
      cache[cacheKey] && 
      (Date.now() - cache[cacheKey].timestamp) < CACHE_EXPIRATION
    );
  };

  // Fetch weather for current city
  useEffect(() => {
    const fetchData = async () => {
      if (!currentCity) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // Check weather cache
        const weatherCacheKey = `${currentCity}-${units}-${selectedDate.toDateString()}`;
        let weatherData;
        
        if (isCacheValid(weatherCacheKey, weatherCache)) {
          weatherData = weatherCache[weatherCacheKey].data;
        } else {
          // For historical data, we'd use a different API endpoint
          // For this demo, we'll use the current weather API
          weatherData = await fetchCurrentWeather(currentCity, units);
          // Update cache
          setWeatherCache(prev => ({
            ...prev,
            [weatherCacheKey]: {
              data: weatherData,
              timestamp: Date.now()
            }
          }));
        }
        
        setCurrentWeather(weatherData);
        
        // Check forecast cache
        const forecastCacheKey = `${currentCity}-${units}-${selectedDate.toDateString()}`;
        let forecastData;
        
        if (isCacheValid(forecastCacheKey, forecastCache)) {
          forecastData = forecastCache[forecastCacheKey].data;
        } else {
          forecastData = await fetchForecast(currentCity, units);
          // Update cache
          setForecastCache(prev => ({
            ...prev,
            [forecastCacheKey]: {
              data: forecastData,
              timestamp: Date.now()
            }
          }));
        }
        
        setForecast(forecastData);
      } catch (err) {
        setError(`Failed to fetch weather for ${currentCity}: ${err.message}`);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [currentCity, units, selectedDate]);

  // Fetch weather for other cities
  useEffect(() => {
    const fetchOtherCitiesData = async () => {
      const updatedCities = [...otherCities];
      
      for (let i = 0; i < updatedCities.length; i++) {
        try {
          const cacheKey = `${updatedCities[i].name}-${units}`;
          
          if (isCacheValid(cacheKey, weatherCache)) {
            updatedCities[i].data = weatherCache[cacheKey].data;
          } else {
            const data = await fetchCurrentWeather(updatedCities[i].name, units);
            updatedCities[i].data = data;
            
            // Update cache
            setWeatherCache(prev => ({
              ...prev,
              [cacheKey]: {
                data,
                timestamp: Date.now()
              }
            }));
          }
        } catch (err) {
          console.error(`Error fetching data for ${updatedCities[i].name}:`, err);
        }
      }
      
      setOtherCities(updatedCities);
    };
    
    fetchOtherCitiesData();
  }, [units]); // Only refetch when units change
  
  // Search for a city
  const searchCity = (city) => {
    setCurrentCity(city);
    setUsingGeolocation(false);
  };
  
  // Set the selected date
  const setDate = (date) => {
    setSelectedDate(new Date(date));
  };
  
  // Toggle temperature units
  const toggleUnits = () => {
    setUnits(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  // Toggle theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Context value
  const value = {
    currentCity,
    units,
    currentWeather,
    forecast,
    otherCities,
    loading,
    error,
    searchCity,
    toggleUnits,
    usingGeolocation,
    theme,
    toggleTheme,
    selectedDate,
    setDate
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}; 