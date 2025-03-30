# Weather Dashboard

A beautiful, responsive weather dashboard built with React and Vite. Get real-time weather data for any city around the world.

## Features

- Current weather conditions
- Temperature in Celsius or Fahrenheit
- Weather forecasts
- City search
- Weather highlights (feels like, humidity, wind speed, etc.)
- Other cities quick view

## Screenshots

*Add your screenshots here after running the application*

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/weather-dashboard.git
   cd weather-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Get an API key from OpenWeatherMap:
   - Sign up at [OpenWeatherMap](https://openweathermap.org/api)
   - Generate an API key from your account dashboard

4. Create a `.env` file in the root directory:
   ```
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Building for Production

To build the app for production:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Technologies Used

- React 19
- Vite
- OpenWeatherMap API
- CSS with Flexbox and Grid
- Ionicons

## Future Enhancements

- Geolocation support to detect user's city
- Historical weather data visualization
- Weather alerts
- Detailed hourly forecasts
- Dark/light theme toggle

## License

MIT

## Credits

- Weather icons from [OpenWeatherMap](https://openweathermap.org/weather-conditions)
- UI design inspiration from various weather apps

---

Happy weather tracking! 🌦️🌈
