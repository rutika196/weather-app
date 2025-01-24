import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import "./SearchBox.css";

export const SearchBox = ({ updateInfo }) => {
  let [error, setError] = useState(false);
  const API_URL = "https://api.openweathermap.org/data/2.5/weather";
  //?q={city name}&appid={API key}
  const API_KEY = "ae51d208d36cbced5dc6d58e9fbb4114";

  let getWeatherInfo = async () => {
    try {
      let response = await fetch(
        `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`
      );
      let data = await response.json();
      console.log(data);
      let result = {
        city: city,
        temp: data.main.temp,
        temMin: data.main.temp_min,
        tempMax: data.main.temp_max,
        humidity: data.main.humidity,
        feelsLike: data.main.feels_like,
        weather: data.weather[0].description,
      };
      console.log(result);
      return result;
    } catch (error) {
      throw error;
    }
  };

  let [city, setCity] = useState("");

  let handleChange = (e) => {
    setCity(e.target.value);
  };
  let handleSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log(city);
      setCity("");
      let newInfo = await getWeatherInfo();
      updateInfo(newInfo);
    } catch (error) {
      setError(true);
    }
  };
  return (
    <div className="search-form">
      <form onSubmit={handleSubmit}>

        <TextField
          id="city"
          label="City Name"
          variant="outlined"
          required
          value={city}
          onChange={handleChange}
        />
        <br /> <br />
        <Button variant="contained" type="submit">
          Submit
        </Button>
        {error && <p style={{ color: "red" }}>No such Place is in our API</p>}
      </form>
    </div>
  );
};
