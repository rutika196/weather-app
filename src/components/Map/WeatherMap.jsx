import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './WeatherMap.css';
import { useWeather } from '../../context/WeatherContext';

// Import OpenWeatherMap tile URLs
const TILE_URL = {
  temperature: 'https://{s}.tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=',
  precipitation: 'https://{s}.tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=',
  clouds: 'https://{s}.tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=',
  wind: 'https://{s}.tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=',
  pressure: 'https://{s}.tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid='
};

const WeatherMap = ({ isVisible }) => {
  const { currentWeather, otherCities } = useWeather();
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const weatherLayerRef = useRef(null);
  
  const [activeLayer, setActiveLayer] = useState('temperature');
  
  // Initialize map when component mounts
  useEffect(() => {
    if (!isVisible || !mapRef.current || !apiKey || !currentWeather) return;
    
    // If a map instance already exists, remove it
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }
    
    // Create map centered on current weather location
    const lat = currentWeather.coord?.lat || 51.505;
    const lon = currentWeather.coord?.lon || -0.09;
    
    const map = L.map(mapRef.current, {
      center: [lat, lon],
      zoom: 6,
      zoomControl: true,
      attributionControl: true
    });
    
    // Add the base tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add a marker for the current location
    L.marker([lat, lon])
      .addTo(map)
      .bindPopup(`
        <div class="map-popup">
          <strong>${currentWeather.name}</strong>
          <p>${currentWeather.weather?.[0]?.description || 'Weather data'}</p>
          <p>${Math.round(currentWeather.main?.temp || 0)}°</p>
          ${currentWeather.rain?.['1h'] ? `<p>Rain: ${currentWeather.rain['1h']} mm</p>` : ''}
        </div>
      `)
      .openPopup();
    
    // Add markers for other cities
    otherCities.forEach(city => {
      if (city.data && city.data.coord) {
        L.marker([city.data.coord.lat, city.data.coord.lon])
          .addTo(map)
          .bindPopup(`
            <div class="map-popup">
              <strong>${city.name}</strong>
              <p>${city.data.weather?.[0]?.description || 'Weather data'}</p>
              <p>${Math.round(city.data.main?.temp || 0)}°</p>
              ${city.data.rain?.['1h'] ? `<p>Rain: ${city.data.rain['1h']} mm</p>` : ''}
            </div>
          `);
      }
    });
    
    // Add the weather layer
    weatherLayerRef.current = L.tileLayer(TILE_URL[activeLayer] + apiKey, {
      attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
      opacity: 0.7
    }).addTo(map);
    
    // Store map instance for cleanup
    mapInstanceRef.current = map;
    
    // Fix for rendering issues - force a resize event
    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 100);
    
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isVisible, apiKey, currentWeather, otherCities, activeLayer]);
  
  // Handle layer change
  const handleLayerChange = (layer) => {
    setActiveLayer(layer);
    
    // Update the weather layer if map exists
    if (mapInstanceRef.current && weatherLayerRef.current) {
      mapInstanceRef.current.removeLayer(weatherLayerRef.current);
      weatherLayerRef.current = L.tileLayer(TILE_URL[layer] + apiKey, {
        attribution: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
        opacity: 0.7
      }).addTo(mapInstanceRef.current);
    }
  };
  
  // Force resize when visibility changes
  useEffect(() => {
    if (isVisible && mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current.invalidateSize();
      }, 100);
    }
  }, [isVisible]);
  
  if (!isVisible) return null;
  
  return (
    <div className="weather-map-section">
      <h2>Weather Map</h2>
      <div className="map-controls">
        <button 
          className={`layer-button ${activeLayer === 'temperature' ? 'active' : ''}`}
          onClick={() => handleLayerChange('temperature')}
        >
          Temperature
        </button>
        <button 
          className={`layer-button ${activeLayer === 'precipitation' ? 'active' : ''}`}
          onClick={() => handleLayerChange('precipitation')}
        >
          Precipitation
        </button>
        <button 
          className={`layer-button ${activeLayer === 'clouds' ? 'active' : ''}`}
          onClick={() => handleLayerChange('clouds')}
        >
          Clouds
        </button>
        <button 
          className={`layer-button ${activeLayer === 'wind' ? 'active' : ''}`}
          onClick={() => handleLayerChange('wind')}
        >
          Wind
        </button>
        <button 
          className={`layer-button ${activeLayer === 'pressure' ? 'active' : ''}`}
          onClick={() => handleLayerChange('pressure')}
        >
          Pressure
        </button>
      </div>
      <div ref={mapRef} style={{ height: '300px', width: '100%' }}></div>
    </div>
  );
};

export default WeatherMap; 