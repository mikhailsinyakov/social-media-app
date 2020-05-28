import React from 'react';
import { Redirect, useLocation } from "react-router-dom";
import { Route } from "react-tiger-transition";

const CustomRoute = ({children, user, ...rest}) => {
  const location = useLocation();
  
  return (
    <Route {...rest}>
      {
        user ? 
          user.username ? 
            location.pathname === "/login" ? <Redirect to="/" /> : children :
            location.pathname === "/profile" ? children : <Redirect to="/profile" /> :
          location.pathname === "/login" ? children : <Redirect to="/login" />
      }
    </Route>
  );
};

export default CustomRoute;
