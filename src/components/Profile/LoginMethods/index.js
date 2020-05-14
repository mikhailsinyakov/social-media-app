import React, { Fragment, useContext } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { UserContext } from "components/User";
import AuthProvider from "./AuthProvider";

const getUserId = (user, providerId) => {
  const provider = user.providerData.filter(data => 
                    data.providerId === providerId)[0];
  return provider && (provider.displayName || provider.uid);
};

const LoginMethods = ({error, setError}) => {
  const { t } = useTranslation();
  const user = useContext(UserContext);

  const authProviders = [
    {id: "phone", name: t("phoneNumber")},
    {id: "google.com", name: "Google"},
    {id: "github.com", name: "Github"}
  ];
  
  return (
    <Fragment>
      <h4>{t("loginMethods")}</h4>
      {
        authProviders.map(({id, name}) => 
          <AuthProvider 
            id={id} 
            name={name} 
            userId={getUserId(user, id)} 
            error={error}
            setError={setError}
            key={id} 
          />
        )
      }
    </Fragment>
  );
};

LoginMethods.propTypes = {
  error: PropTypes.string,
  setError: PropTypes.func.isRequired
};

export default LoginMethods;
