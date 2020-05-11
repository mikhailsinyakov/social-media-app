import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { withFirebaseContext } from "./Firebase";
import LogInPage from "screens/LogIn";

const App = () => {
  const { t, ready, i18n: { language } } = useTranslation();
  
  useEffect(() => { 
    window.document.documentElement.lang = language;
    window.document.title = t("appName");
   }, [t, language]);
  
  if (!ready) return null;
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
