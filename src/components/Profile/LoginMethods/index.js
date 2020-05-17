import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import AuthProvider from "./AuthProvider";

const LoginMethods = ({
  active, 
  providers, 
  removeProvider, 
  setError, 
  checkPhoneNumber
}) => {
  const { t } = useTranslation();
  
  const getUserId = providerId => {
    const provider = providers.filter(data => 
                      data.providerId === providerId)[0];
    return provider && (provider.displayName || provider.uid);
  };

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
            userId={getUserId(id)} 
            active={active}
            setError={setError}
            unlinkForbidden={providers.length < 2}
            unlinked={removeProvider}
            checkPhoneNumber={checkPhoneNumber}
            key={id} 
          />
        )
      }
    </Fragment>
  );
};

LoginMethods.propTypes = {
  active: PropTypes.bool.isRequired,
  providers: PropTypes.array.isRequired,
  removeProvider: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  checkPhoneNumber: PropTypes.func.isRequired
};

export default LoginMethods;
