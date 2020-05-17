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
  
  const [checkingPhoneNumber, setCheckingPhoneNumber] = useState(false);
  const [checkingType, setCheckingType] = useState(null);
  const active = !error && !checkingPhoneNumber;
  
  const removeProvider = id => {
    setProviders(providers.filter(data => data.providerId !== id));
  }; 
  
  const addPhoneProvider = phoneNum => {
    setProviders([...providers, {providerId: "phone", uid: phoneNum} ]);
  };
  
  const updatePhoneProvider = phoneNum => {
    setProviders(providers.map(provider => 
      provider.providerId === "phone" ? ({ ...provider, uid: phoneNum}) : provider
    ));
  };
  
  const checkPhoneNumber = type => {
    setCheckingPhoneNumber(true);
    setCheckingType(type);
  };
  
  const stopCheckingPhoneNumber = () => {
    setCheckingPhoneNumber(false);
    setCheckingType(null);
  };
  
  const phoneNumberHasLinked = number => {
    if (checkingType === "link") addPhoneProvider(number);
    else updatePhoneProvider(number);
    stopCheckingPhoneNumber();
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
        checkPhoneNumber={checkPhoneNumber}
      />
      {error && 
        <ModalError 
          message={error} 
          close={() => setError(null)}
        />
      }
      {checkingPhoneNumber &&
        <CheckPhoneNumber 
          type={checkingType}
          close={stopCheckingPhoneNumber} 
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
