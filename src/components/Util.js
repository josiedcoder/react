import axios from "axios";

const getPlaceName = async (lat, lon) => {
  const API_URL = process.env.REACT_APP_MAPBOX_API_URL;
  const API_TOKEN = process.env.REACT_APP_MAPBOX_API_TOKEN;

  const url = `${API_URL}/geocoding/v5/mapbox.places/${lat},${lon}.json?access_token=${API_TOKEN}`;

  const promise = axios.get(url);

  const dataPromise = promise.then((response) =>
    response.data.features[0] !== undefined
      ? response.data.features[0].place_name
      : "N/A"
  );

  return dataPromise;
};

const getDayName = (timestamp) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date(timestamp * 1000);
  const dayName = days[date.getDay()];
  return dayName;
};
const getTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString("en-US", { hour: "numeric", hour12: true });
};

export default { getPlaceName, getDayName, getTime };
