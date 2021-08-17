import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ErrorService from "../services/error.service";
import UserService from "../services/user.service";
import { getWeeklyForecast } from "../services/weather.service";
import Navbar from "../components/Navbar";
import Util from "../components/Util";
import Modal from "react-modal";
import SimpleMap from "../components/SimpleMap";

const Home = (props) => {
  const [locationName, setLocationName] = useState("");
  const [cordinate, setCordinate] = useState({});
  const [profile, setProfile] = useState({});
  const [forecast, setForecast] = useState({});
  const [singleForecast, setSingleForecast] = useState(null);
  const [errors, setErrors] = useState(undefined);
  const [modalIsOpen, setIsOpen] = useState(false);

  const getLocation = (location) => {
    const cordinate = {
      latitude: location.cordinate[0],
      longitude: location.cordinate[1],
    };
    UserService.saveUserLocation(cordinate)
      .then((response) => {
        setLocationName(location.location_name);
        setCordinate(cordinate);
        return getWeeklyForecast(cordinate.latitude, cordinate.longitude);
      })
      .then((response) => {
        setForecast(response.data.daily);
      });
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const setUserLocation = (location) => {
    setCordinate({
      latitude: parseInt(location.latitude),
      longitude: parseInt(location.longitude),
    });
    Util.getPlaceName(location.latitude, location.longitude).then((data) => {
      setLocationName(data);
    });
  };

  const getWeatherDetails = (key) => {
    setSingleForecast(forecast[key]);
  };

  const backToForecast = () => {
    setSingleForecast(null);
  };

  useEffect(() => {
    UserService.getUserProfile()
      .then(
        (response) => {
          setProfile(response.data);
          setUserLocation(response.data.location);
          return getWeeklyForecast(
            response.data.location.latitude,
            response.data.location.longitude
          );
        },
        (error) => {
          const errorMessages = ErrorService.getErrorMessages(error);
          setErrors(errorMessages);
        }
      )
      .then((response) => {
        setForecast(response.data.daily);
      });
  }, []);
  console.log(cordinate);
  return (
    <div className="container">
      {errors ? (
        <div align="center">
          <h2 className="text-danger">{errors}</h2>
          <Link to={"/login"} className="nav-link">
            Login
          </Link>
        </div>
      ) : (
        <div>
          {profile.email ? (
            <div>
              <Navbar />
              <header className="jumbotron">
                <h3>Welcome {profile.name}</h3>
                <div>
                  <strong>Email:</strong> {profile.email}
                </div>
              </header>
              <div className="col-md-12">
                <div style={{ marginBottom: 40, textAlign: "center" }}>
                  {singleForecast === null ? (
                    <div>
                      <h4>Showing weather forecast for {locationName}</h4>
                      <div>
                        <button onClick={openModal}>Change Location</button>
                      </div>
                    </div>
                  ) : (
                    <h4>
                      Showing weather forecast for {locationName} on{" "}
                      {Util.getDayName(singleForecast.dt)}
                    </h4>
                  )}
                </div>
                <div className="row">
                  {singleForecast !== null ? (
                    <div style={{ margin: "auto" }}>
                      <h4>{Util.getDayName(singleForecast.dt)}</h4>
                      <div>{singleForecast["weather"][0]["description"]}</div>
                      <div>
                        {" "}
                        <img
                          alt="weatherIcon"
                          src={`http://openweathermap.org/img/wn/${singleForecast["weather"][0].icon}@2x.png`}
                        />{" "}
                      </div>
                      <div>High: {singleForecast["temp"]["max"]} Deg</div>
                      <div>Low: {singleForecast["temp"]["min"]} Deg</div>
                      <div>
                        {" "}
                        Sunrise {Util.getTime(singleForecast["sunrise"])}{" "}
                      </div>
                      <div>
                        {" "}
                        Sunset {Util.getTime(singleForecast["sunset"])}{" "}
                      </div>
                      <div> Humidity {singleForecast["humidity"]} </div>
                      <div style={{ paddingTop: 40 }}>
                        {" "}
                        <button onClick={backToForecast}>
                          Back to Weather list
                        </button>{" "}
                      </div>
                    </div>
                  ) : (
                    forecast.length > 0 &&
                    forecast.map((weather, key) => {
                      return (
                        <div
                          className="col-md-3"
                          key={key}
                          style={{ marginTop: 30 }}
                        >
                          <div>
                            <h4>{Util.getDayName(weather.dt)}</h4>
                          </div>
                          <div>{weather.weather[0].description}</div>
                          <img
                            src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                          />
                          <div>High: {weather.temp.max} Deg</div>
                          <div>Low: {weather.temp.min} Deg</div>
                          <div>
                            <button onClick={() => getWeatherDetails(key)}>
                              View Info
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div align="center" className="m-5">
              <span className="spinner-border spinner-border-lg"></span>
            </div>
          )}
        </div>
      )}
      <Modal isOpen={modalIsOpen} style={customStyles}>
        <SimpleMap
          sendLocation={getLocation}
          longitude={cordinate.longitude}
          latitude={cordinate.latitude}
        ></SimpleMap>
        <div>
          <button onClick={closeModal}>Close Map</button>
        </div>
      </Modal>
    </div>
  );
};

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

export default Home;
