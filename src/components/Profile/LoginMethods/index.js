import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { UserContext } from "context/User";
import AuthProvider from "./AuthProvider";

const LoginMethods = () => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  
  const providers = user.providerData;
  
  const getUserId = providerId => {
    const provider = providers.filter(data => 
                      data.providerId === providerId)[0];
    return provider && (provider.displayName || provider.uid);
  };

  const authProviders = [
    {id: "phone", name: "phone"},
    {id: "google.com", name: "google"},
    {id: "github.com", name: "github"}
  ];
  
  return (
    <>
      <h4>{t("loginMethods")}</h4>
      {
        authProviders.map(({id, name}) => 
          <AuthProvider 
            id={id} 
            name={name} 
            userId={getUserId(id)} 
            unlinkForbidden={providers.length < 2}
            key={id} 
          />
        )
      }
    </>
  );
};

export default LoginMethods;
