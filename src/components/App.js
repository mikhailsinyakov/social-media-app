import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { withFirebaseContext } from "./Firebase";
import LogInPage from "screens/LogIn";

  
const App = () => {
  return (
    <Router>
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
      <Route exact path="/login">
        <LogInPage />
      </Route>
    </Router>
  );
};

export default withFirebaseContext(App);
