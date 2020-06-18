import React, { useEffect, useContext } from 'react';
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { compose } from "recompose";
import { Navigation } from "react-tiger-transition";
import "react-tiger-transition/styles/main.min.css";

import { FirebaseContext, withFirebaseContext } from "context/Firebase";
import { UserContext, withUserContext } from "context/User";
import { ModalContext, withModalContext } from "context/Modal";

import CustomRoute from "./CustomRoute";
import Loader from "shared/Loader";

import Screen from "screens/Screen";
import LoginPage from "screens/Login";
import FeedPage from "screens/Feed";
import ProfilePage from "screens/Profile";

import ErrorModal from "shared/Modals/ErrorModal";

const StyledLoader = styled(Loader)`
  margin: 5rem auto;
`;

const routes = [
  { path: "/", Component: FeedPage },
  { path: "/login", Component: LoginPage },
  { path: "/profile", Component: ProfilePage }
];

const App = () => {
  const { t, ready, i18n: { language } } = useTranslation();
  const location = useLocation();
  
  const firebase = useContext(FirebaseContext);
  const { user } = useContext(UserContext);
  const { Modal, setModal } = useContext(ModalContext);
  
  useEffect(() => { 
    if (ready) {
      window.document.documentElement.lang = language;
      window.document.title = t("appName");
      firebase.auth.setLanguage(language);
    }
   }, [t, language, ready, firebase]);
   
  useEffect(() => {
    if (ready && (location.pathname === "/login" || location.pathname === "/profile")) {
      (async () => {
        const result = await firebase.auth.getRedirectResult();
        if (result.outcome === "failure") {
          const { providerId, cause } = result;
          const notCompletedAction = location.pathname === "/login" ? 
                                      t("couldntLoginWith") : 
                                      t("couldntLink");
          console.log(`${notCompletedAction} ${providerId}. ${t(cause)}`)
          console.log(t("couldntLoginWith"))
          setModal(
            <ErrorModal>
              {`${notCompletedAction} ${providerId}. ${t(cause)}`}
            </ErrorModal>
          );
        }
      })();
    }
  }, [t, firebase, setModal, location, ready]);
  
  if (!ready || user === undefined) {
    return <StyledLoader size={50} show={true} />;
  }
  
  return (
    <>
      <Navigation>
        {
          routes.map(({path, Component}) => (
            <CustomRoute key={path} user={user} exact path={path}>
              <Screen addHeaderFooter={path !== "/login"}>
                <Component />
              </Screen>
            </CustomRoute>
          )
        )}
      </Navigation>
      {Modal}
    </>
  );
};

export default compose(
  withModalContext, 
  withFirebaseContext, 
  withUserContext
)(App);
