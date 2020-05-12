import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { compose } from "recompose";
import { FirebaseContext, withFirebaseContext } from "./Firebase";
import { UserContext, withUserContext } from "./User";
import Loader from "shared/Loader";
import LogInPage from "screens/LogIn";
import FeedPage from "screens/Feed";
import ProfilePage from "screens/Profile";

const StyledLoader = styled(Loader)`
  margin: 5rem auto;
`;

const App = () => {
  const { t, ready, i18n: { language } } = useTranslation();
  const firebase = useContext(FirebaseContext);
  const user = useContext(UserContext);
  
  useEffect(() => { 
    if (ready) {
      window.document.documentElement.lang = language;
      window.document.title = t("appName");
      firebase.setLanguage(language);
    }
   }, [t, language, ready, firebase]);
  
  if (!ready || user === undefined) {
    return <StyledLoader size={50} show={true} />;
  }
  
  return (
    <Router>
      {
        user ? (
          <Switch>
            <Route exact path="/login">
              <Redirect to="/" />
            </Route>
            <Route exact path="/profile">
              <ProfilePage />
            </Route>
            {
              user.displayName ? (
                <Route exact path="/">
                  <FeedPage />
                </Route>
              ) : <Redirect to="/profile" />
            }
          </Switch>
          ) : (
            <Switch>
              <Route exact path="/login">
                <LogInPage />
              </Route>
              <Route>
                <Redirect to="/login" />
              </Route>
            </Switch>
          )
      }
    </Router>
  );
};

export default compose(withFirebaseContext, withUserContext)(App);
