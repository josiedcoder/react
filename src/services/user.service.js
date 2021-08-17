import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL;

const getUserProfile = async () => {
  return await axios.get(API_URL + "user/profile", { headers: authHeader() });
};

const saveUserLocation = location => {
    return axios.post(API_URL + "user/save-user-location", {
      location,
    }, { headers: authHeader() });
}

export default {
  getUserProfile, saveUserLocation
};
