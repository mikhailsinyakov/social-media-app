import React from 'react';
import { Route, Redirect } from "react-router-dom";

const CustomRoute = ({children, user, ...rest}) => (
  <Route 
    {...rest}
    render={({location}) => 
      user ? 
        user.username ? 
          location.pathname === "/login" ? <Redirect to="/" /> : children :
          location.pathname === "/profile" ? children : <Redirect to="/profile" /> :
        location.pathname === "/login" ? children : <Redirect to="/login" />
    }
  />
);

export default CustomRoute;
