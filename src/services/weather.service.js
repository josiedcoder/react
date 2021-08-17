import axios from "axios";

const API_URL = process.env.REACT_APP_OPENWEATHER_API;
const APP_ID = process.env.REACT_APP_OPENWEATHER_APP_ID;

const getWeeklyForecast = (lat, lon) => {
  return axios.get(
    `${API_URL}/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&units=metric&appid=${APP_ID}`
  );
};

export { getWeeklyForecast };
