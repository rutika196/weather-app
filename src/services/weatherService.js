const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Fetch current weather data for a city
 * @param {string} city - City name (e.g., "London")
 * @param {string} units - Units of measurement: metric (Celsius) or imperial (Fahrenheit)
 * @returns {Promise} - Weather data promise
 */
export const fetchCurrentWeather = async (city, units = "metric") => {
  try {
    const response = await fetch(
      `${BASE_URL}/weather?q=${city}&units=${units}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
};

/**
 * Fetch 5-day weather forecast for a city
 * @param {string} city - City name (e.g., "London")
 * @param {string} units - Units of measurement: metric (Celsius) or imperial (Fahrenheit)
 * @returns {Promise} - Forecast data promise
 */
export const fetchForecast = async (city, units = "metric") => {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast?q=${city}&units=${units}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Forecast API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
};

/**
 * Get weather icon URL from icon code
 * @param {string} iconCode - Weather icon code from API
 * @returns {string} - URL to the weather icon
 */
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

/**
 * Format date to day name (e.g., "Monday")
 * @param {number} timestamp - Unix timestamp
 * @returns {string} - Day name
 */
export const formatToDay = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    weekday: "long",
  });
};

/**
 * Get UV index description based on value
 * @param {number} uvIndex - UV index value
 * @returns {string} - UV index description (Low, Moderate, High, etc.)
 */
export const getUVIndexDescription = (uvIndex) => {
  if (uvIndex <= 2) return "Low";
  if (uvIndex <= 5) return "Moderate";
  if (uvIndex <= 7) return "High";
  if (uvIndex <= 10) return "Very High";
  return "Extreme";
}; 