import { SearchBox } from "../SearchBox/SearchBox";
import { InfoBox } from "../InfoBox/InfoBox";
import { useState } from "react";
export const WeatherApp = () => {
    const [weatherInfo, setWeatherInfo] = useState({
        city:"",
        temp: 0.00,
        temMin: 0.00,
        tempMax: 0.00,
        humidity: 0,
        feelsLike: 0.00,
        weather: "", 
    });

    let updateInfo = (result) => {
        if (result && Object.keys(result).length > 0) {
            setWeatherInfo(result);
        } else {
            setWeatherInfo(null); // Set to null if result is invalid
        }
    }

    return(
        <div>
            <h1>Weather App</h1>
            <SearchBox updateInfo={updateInfo}/>
            <InfoBox info={weatherInfo}/>
        </div>
    );
};