import React from "react";
import { Redirect, Route } from "react-router-dom";
import AuthService from "../services/auth.service";

const PrivateRoute = ({ component: Component, ...rest }) => {
    
  const currentUser = AuthService.getCurrentUser();

  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
