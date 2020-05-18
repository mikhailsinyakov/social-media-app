import React, { useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { compose } from "recompose";
import { FirebaseContext, withFirebaseContext } from "./Firebase";
import { UserContext, withUserContext } from "./User";
import Loader from "shared/Loader";
import LoginPage from "screens/Login";
import FeedPage from "screens/Feed";
import ProfilePage from "screens/Profile";

const StyledLoader = styled(Loader)`
  margin: 5rem auto;
`;

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

const App = () => {
  const { t, ready, i18n: { language } } = useTranslation();
  const firebase = useContext(FirebaseContext);
  const { user } = useContext(UserContext);
  
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
      <CustomRoute user={user} exact path="/login">
        <LoginPage />
      </CustomRoute>
      <CustomRoute user={user} exact path="/">
        <FeedPage />
      </CustomRoute>
      <CustomRoute user={user} exact path="/profile">
        <ProfilePage />
      </CustomRoute>
    </Router>
  );
};

export default compose(withFirebaseContext, withUserContext)(App);
