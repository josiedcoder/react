import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import SimpleMap from "../components/SimpleMap";
import Modal from "react-modal";
import Util from "../components/Util";
import ErrorService from "../services/error.service";
import AuthService from "../services/auth.service";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vfullname = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="alert alert-danger" role="alert">
        The Fullname must be between 3 and 20 characters.
      </div>
    );
  }
};

const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [locationName, setLocationName] = useState("");
  const [cordinate, setCordinate] = useState({
    latitude: 55.3781,
    longitude: 3.436,
  });
  const [modalIsOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errors, setErrors] = useState([]);
  const form = useRef();
  const checkBtn = useRef();

  const getLocation = (location) => {
    setLocationName(location.location_name);
    setCordinate({
      latitude: location.cordinate[0],
      longitude: location.cordinate[1],
    });
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const onChangeFullname = (e) => {
    const fullname = e.target.value;
    setFullname(fullname);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  navigator.geolocation.getCurrentPosition(function (position) {
    setCordinate({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
    Util.getPlaceName(position.coords.latitude, position.coords.longitude).then(
      (data) => {
        setLocationName(data);
      }
    );
  });

  const handleRegister = (e) => {
    e.preventDefault();

    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(fullname, email, password, cordinate).then(
        (response) => {
          console.log(response);
          setSuccessMessage(response.data.message);
        },
        (error) => {
          console.error(error);
          const errorMessages = ErrorService.getErrorMessages(error);
          setErrors(errorMessages);
          setLoading(false);
        }
      );
    } else {
      setLoading(false);
    }
  };
  return (
    <div className="col-md-12">
      <div className="card card-container">
        <Form onSubmit={handleRegister} ref={form}>
          {!successMessage && (
            <div>
              <div className="form-group">
                <label htmlFor="fullname">Fullname</label>
                <Input
                  type="text"
                  className="form-control"
                  name="fullname"
                  value={fullname}
                  onChange={onChangeFullname}
                  validations={[required, vfullname]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required, validEmail]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required, vpassword]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <Input
                  readOnly={true}
                  onClick={openModal}
                  type="text"
                  className="form-control"
                  name="location"
                  value={locationName}
                  validations={[required]}
                />
              </div>

              <div className="form-group">
                <button
                  className="btn btn-primary btn-block"
                  disabled={loading}
                >
                  {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                  )}
                  <span>Sign up</span>
                </button>
              </div>
            </div>
          )}

          {errors && (
            <div className="form-group">
              {errors.map((item, key) => (
                <div className="alert alert-danger" role="alert" key={key}>
                  {item}
                </div>
              ))}
            </div>
          )}

          {successMessage && (
            <div className="form-group">
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
        <div align="center">
          <Link to={"/login"} className="nav-link">
            Login
          </Link>

          <div>
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
        </div>
      </div>
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

export default Register;
