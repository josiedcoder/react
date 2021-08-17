import axios from "axios";
import authHeader from "./auth-header";

const API_URL = process.env.REACT_APP_API_URL;

const register = (name, email, password, location) => {
  return axios.post(API_URL + "register", {
    name,
    email,
    password,
    location,
  });
};

const login = (email, password) => {
  return axios
    .post(API_URL + "login", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
    });
};

const logout = () => {
  return axios
    .post(API_URL + "user/logout", null, { headers: authHeader() })
    .then((response) => {
      if (response.data) {
        deleteUser();
      }
    });
};

const deleteUser = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export default {
  register,
  login,
  logout,
  deleteUser,
  getCurrentUser,
};
