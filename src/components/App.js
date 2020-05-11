import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { compose } from "recompose";
import { withFirebaseContext } from "./Firebase";
import { UserContext, withUserContext } from "./User";
import Loader from "shared/Loader";
import LogInPage from "screens/LogIn";

const StyledLoader = styled(Loader)`
  margin: 5rem auto;
`;

const App = () => {
  const { t, ready, i18n: { language } } = useTranslation();
  const user = useContext(UserContext);
  
  useEffect(() => { 
    if (ready) {
      window.document.documentElement.lang = language;
      window.document.title = t("appName");
    }
   }, [t, language, ready]);
  
  if (!ready || user === undefined) {
    return <StyledLoader size={50} show={true} />;
  }
  
  return (
    <Router>
      <Route exact path="/">
        {!user && <Redirect to="/login" />}
      </Route>
      <Route exact path="/login">
        {user ? <Redirect to="/" /> : <LogInPage />}
      </Route>
    </Router>
  );
};

export default compose(withFirebaseContext, withUserContext)(App);
