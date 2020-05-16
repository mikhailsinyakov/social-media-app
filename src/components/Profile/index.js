import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FirebaseContext } from "components/Firebase";
import { UserContext } from "components/User";
import Username from "./Username";
import LoginMethods from "./LoginMethods";
import ModalError from "shared/ModalError";
import CheckPhoneNumber from "./CheckPhoneNumber";

const Profile = ({className}) => {
  const { t } = useTranslation();
  const firebase = useContext(FirebaseContext);
  const user = useContext(UserContext);
  const [providers, setProviders] = useState(user.providerData);
  const [error, setError] = useState(null);
  
  const [linkingPhoneNumber, setLinkingPhoneNumber] = useState(false);
  const active = !error && !linkingPhoneNumber;
  
  const removeProvider = id => {
    setProviders(providers.filter(data => data.providerId !== id));
  }; 
  
  const addPhoneProvider = phoneNum => {
    setProviders([...providers, {providerId: "phone", uid: phoneNum} ]);
  };
  
  const phoneNumberHasLinked = number => {
    setLinkingPhoneNumber(false);
    addPhoneProvider(number);
  };
  
  useEffect(() => {
    (async () => {
      const result = await firebase.getRedirectResult();
      if (result.outcome === "failure") {
        const { providerId, cause } = result;
        setError(`${t("couldntLink")} ${providerId}. ${t(cause)}`);
      }
    })();
  }, [t, firebase]);

  return (
    <div className={className}>
      <Username currUsername={user.displayName} active={active} />
      <LoginMethods 
        active={active} 
        providers={providers}
        removeProvider={removeProvider}
        setError={setError} 
        setLinkingPhoneNumber={setLinkingPhoneNumber}
      />
      {error && 
        <ModalError 
          message={error} 
          close={() => setError(null)}
        />
      }
      {linkingPhoneNumber &&
        <CheckPhoneNumber 
          close={() => setLinkingPhoneNumber(false)} 
          onSuccess={phoneNumberHasLinked}
        />
      }
    </div>
  );
};

const StyledProfile = styled(Profile)`
  margin: 1rem 0;
  text-align: center;
`;

export default StyledProfile;
