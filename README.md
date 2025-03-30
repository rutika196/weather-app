# Weather Dashboard

A modern, feature-rich weather dashboard built with React and Vite that provides detailed weather information including forecasts, city comparisons, and an interactive weather map.

## Features

- **Real-time Weather Data**: Current weather conditions for any city
- **Custom Date Selection**: Calendar widget to view weather data for specific dates
- **Interactive Weather Map**: Toggle between temperature, precipitation, cloud, and wind layers
- **Multiple Cities**: Compare weather across different cities
- **Today's Highlights**: View sunrise/sunset times, feels-like temperature, humidity, and more
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Toggle between light and dark themes

## Screenshots

*Add your screenshots here after running the application*

## Technologies Used

- React.js
- Vite
- OpenWeatherMap API
- Leaflet for interactive maps
- Phosphor Icons
- CSS with custom variables for theming

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rutika196/weather-app.git
   cd weather-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your OpenWeatherMap API key:
   ```
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to http://localhost:5173

## Deployment

The application can be easily deployed to Vercel with the following steps:

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```bash
   vercel
   ```

## License

This project is licensed under the MIT License.

## Acknowledgements

- Weather data provided by [OpenWeatherMap](https://openweathermap.org/)
- Icons by [Phosphor Icons](https://phosphoricons.com/)
- Maps powered by [Leaflet](https://leafletjs.com/)

---

Happy weather tracking! 🌦️🌈
