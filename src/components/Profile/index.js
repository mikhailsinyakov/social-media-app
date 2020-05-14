import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FirebaseContext } from "components/Firebase";
import { UserContext } from "components/User";
import Username from "./Username";
import LoginMethods from "./LoginMethods";
import Modal from "shared/Modal";

const Profile = ({className}) => {
  const { t } = useTranslation();
  const firebase = useContext(FirebaseContext);
  const user = useContext(UserContext);
  const [error, setError] = useState(null);
  
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
      <Username currUsername={user.displayName} error={error} />
      <LoginMethods error={error} setError={setError} />
      {error && 
        <Modal 
          title={t("errorOccurred")}
          description={error} 
          close={() => setError(null)}
        />
      }
    </div>
  );
};

const StyledProfile = styled(Profile)`
  position: relative;
  margin: 1rem 0;
  text-align: center;
`;

export default StyledProfile;
