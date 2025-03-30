import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useWeather } from "../../context/WeatherContext";
import { getWeatherIconUrl, formatToDay, getUVIndexDescription } from "../../services/weatherService";
import WeatherMap from "../Map/WeatherMap";

// Maps weather conditions to Phosphor icon names
const getWeatherIcon = (condition) => {
  if (!condition) return "ph-cloud-sun";
  
  condition = condition.toLowerCase();
  if (condition.includes('rain') || condition.includes('drizzle')) 
    return "ph-cloud-rain";
  if (condition.includes('thunderstorm')) 
    return "ph-lightning";
  if (condition.includes('snow')) 
    return "ph-snowflake";
  if (condition.includes('clear')) 
    return "ph-sun";
  if (condition.includes('cloud')) 
    return "ph-cloud-sun";
  if (condition.includes('fog') || condition.includes('mist')) 
    return "ph-cloud-fog";
  if (condition.includes('wind')) 
    return "ph-wind";
  
  return "ph-cloud-sun";
};

// Function to format time from Unix timestamp
const formatTime = (timestamp) => {
  if (!timestamp) return "--:--";
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const Dashboard = () => {
  const { 
    currentWeather, 
    forecast, 
    otherCities, 
    loading, 
    error, 
    units,
    usingGeolocation,
    selectedDate
  } = useWeather();

  // State for additional cities
  const [showAllCities, setShowAllCities] = useState(true);
  // State for showing the map
  const [showMap, setShowMap] = useState(false);
  
  // Effect to adjust cities display when map is shown/hidden
  useEffect(() => {
    // When map is shown, collapse the cities list
    if (showMap) {
      setShowAllCities(false);
    } else {
      // When map is hidden, expand the cities list
      setShowAllCities(true);
    }
  }, [showMap]);
  
  // Cities to display - initially show all, but when map is shown only show 2
  const displayCities = showAllCities ? otherCities : otherCities.slice(0, 2);

  // Unit displays
  const tempUnit = units === 'metric' ? '°C' : '°F';
  const speedUnit = units === 'metric' ? 'km/h' : 'mph';

  // Format forecast day name
  const formatDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  // Listen for map icon clicks from Header
  useEffect(() => {
    const handleMapToggle = (e) => {
      if (e.detail && e.detail.action === 'toggleMap') {
        setShowMap(e.detail.show);
      }
    };
    
    window.addEventListener('weather-action', handleMapToggle);
    return () => window.removeEventListener('weather-action', handleMapToggle);
  }, []);

  // Loading state
  if (loading) {
    return (
      <section className="dashboard-section">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading weather data...</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="dashboard-section">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </section>
    );
  }

  // If no data yet
  if (!currentWeather) {
    return (
      <section className="dashboard-section">
        <div className="loading-container">
          <p>Waiting for weather data...</p>
        </div>
      </section>
    );
  }

  // Extract the forecast days (exclude current day and take next 2 days)
  const forecastDays = forecast?.list ? 
    forecast.list.filter((item, index, self) => {
      const date = new Date(item.dt * 1000).toDateString();
      const today = new Date().toDateString();
      return date !== today && index === self.findIndex(i => 
        new Date(i.dt * 1000).toDateString() === date
      );
    }).slice(0, 2) : [];

  return (
    <section className="dashboard-section">
      <div className="home">
        {/* Main weather card with current temp */}
        <div className="feed-1">
          <div className="feeds">
            <i className={`ph ${getWeatherIcon(currentWeather.weather?.[0]?.main)}`}></i>
            <div>
              <div>
                <span>{currentWeather.name}</span>
                <span>{currentWeather.weather?.[0]?.description || "Weather condition"}</span>
              </div>
              <div>
                <span>{Math.round(currentWeather.main?.temp || 0)}<sup>{tempUnit}</sup></span>
              </div>
              <div className="selected-date">
                {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>

          <div className="feed">
            {forecastDays.map((day, index) => (
              <div key={index}>
                <div>
                  <i className={`ph ${getWeatherIcon(day.weather?.[0]?.main)}`}></i>
                  <span>{Math.round(day.main?.temp || 0)}<sup>{tempUnit}</sup></span>
                </div>
                <div>
                  <span>{formatDayName(day.dt)}</span>
                  <span>{day.weather?.[0]?.description || "Weather condition"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Highlights section */}
        <div className="highlights">
          <h2>Today's Highlights</h2>
          <div className="all-highlights">
            <div>
              <div>
                <i className="ph ph-sun-horizon sunrise-icon"></i>
                <span>
                  <span>Sunrise</span>
                  <span>Morning</span>
                </span>
              </div>
              <div>
                <span>{formatTime(currentWeather.sys?.sunrise)}</span>
              </div>
            </div>

            <div>
              <div>
                <i className="ph ph-moon-stars sunset-icon"></i>
                <span>
                  <span>Sunset</span>
                  <span>Evening</span>
                </span>
              </div>
              <div>
                <span>{formatTime(currentWeather.sys?.sunset)}</span>
              </div>
            </div>

            <div>
              <div>
                <i className="ph ph-thermometer-hot"></i>
                <span>
                  <span>Feel Like</span>
                  <span>{currentWeather.main?.feels_like > currentWeather.main?.temp ? "Warmer" : "Cooler"}</span>
                </span>
              </div>
              <div>
                <span>{Math.round(currentWeather.main?.feels_like || 0)}<sup>{tempUnit}</sup></span>
              </div>
            </div>

            <div>
              <div>
                <i className="ph ph-cloud"></i>
                <span>
                  <span>Cloud</span>
                  <span>{currentWeather.clouds?.all > 50 ? "Heavy" : "Light"}</span>
                </span>
              </div>
              <div>
                <span>{currentWeather.clouds?.all || 0}<sup>%</sup></span>
              </div>
            </div>

            <div>
              <div>
                <i className="ph ph-drop"></i>
                <span>
                  <span>Rain</span>
                  <span>
                    {currentWeather.rain?.["1h"] ? 
                      (currentWeather.rain["1h"] > 5 ? "Heavy" : "Light") : 
                      "None"}
                  </span>
                </span>
              </div>
              <div>
                <span>{currentWeather.rain?.["1h"] || 0}<sup>mm</sup></span>
              </div>
            </div>

            <div>
              <div>
                <i className="ph ph-wind"></i>
                <span>
                  <span>Wind</span>
                  <span>{currentWeather.wind?.speed > 20 ? "Strong" : "Normal"}</span>
                </span>
              </div>
              <div>
                <span>{Math.round(currentWeather.wind?.speed || 0)}<sup>{speedUnit}</sup></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="side-container">
        {/* Other Cities section */}
        <div className="cities">
          <h2>Other Cities</h2>
          <div className="all-cities">
            {displayCities.map((city, index) => (
              city.data && (
                <div key={index}>
                  <div>
                    <i className={`ph ${getWeatherIcon(city.data.weather?.[0]?.main)}`}></i>
                    <div>
                      <span>{city.name}</span>
                      <span>{city.data.weather?.[0]?.description || "Weather condition"}</span>
                    </div>
                  </div>
                  <div>
                    <span>{Math.round(city.data.main?.temp || 0)}<sup>{tempUnit}</sup></span>
                  </div>
                </div>
              )
            ))}
            {otherCities.length > 2 && (
              <button onClick={() => setShowAllCities(!showAllCities)}>
                {showAllCities ? 'Show Less' : 'Show More'}
                <i className={`ph ${showAllCities ? 'ph-caret-up' : 'ph-caret-down'}`}></i>
              </button>
            )}
          </div>
        </div>

        {/* Weather Map section - conditionally rendered */}
        {showMap && (
          <div className="map-container">
            <WeatherMap isVisible={true} />
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;


