import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FirebaseContext } from "components/Firebase";
import { UserContext } from "components/User";
import Name from "./Name";
import UserId from "./UserId";
import Button from "./Button";
import Loader from "shared/Loader";

const StyledLoader = styled(Loader)`
  position: absolute;
  right: -23px;
`;

const AuthProvider = ({
  id, 
  name, 
  userId, 
  active, 
  setError, 
  unlinkForbidden, 
  checkPhoneNumber,
  className
}) => {
  const firebase = useContext(FirebaseContext);
  const { updateUser } = useContext(UserContext);
  const { t } = useTranslation();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const linkProvider = () => {
    if (active) {
      if (id === "phone") checkPhoneNumber("link");
      else firebase.linkProvider(id);
    }
  };
  
  const unlinkProvider = async () => {
    if (isSubmitting || !active) return;
    if (unlinkForbidden) {
      setError(t("unlinkForbidden"));
      return;
    }
    setIsSubmitting(true);
    try {
      await firebase.unlinkProvider(id);
      updateUser();
    }
    catch (e) {
      const provider = id === "phone" ? t("phoneNumber") : id;
      setError(`${t(e.message)} "${provider}"`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const changePhoneNumber = () => {
    if (active) checkPhoneNumber("change");
  };
  
  const ableToChangePhoneNumber = id === "phone" && unlinkForbidden;

  if (!userId) {
    return (
      <div className={className}>
        <Name>{name}</Name>
        <UserId>{t("notLinked")}</UserId>
        <Button onClick={linkProvider}>{t("link")}</Button>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <Name>{name}</Name>
      <UserId className="linked">{userId}</UserId>
      <Button 
        className="linked" 
        onClick={ableToChangePhoneNumber ? changePhoneNumber : unlinkProvider}
      >
        {ableToChangePhoneNumber ? t("change") : t("unlink")}
      </Button>
      <StyledLoader size={25} show={isSubmitting} increaseSize={false} />
    </div>
  );
};

AuthProvider.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  userId: PropTypes.string,
  active: PropTypes.bool.isRequired,
  setError: PropTypes.func.isRequired,
  unlinkForbidden: PropTypes.bool.isRequired,
  checkPhoneNumber: PropTypes.func.isRequired
};

const StyledAuthProvider = styled(AuthProvider)`
  position: relative;
  font-size: 0.8rem;
  display: flex;
  padding: 0.5rem;
  align-items: center;
  border-bottom: 1px solid #bbaaaa;
  max-width: 450px;
  margin: 0 auto;
  
  @media screen and (min-width: 400px) {
    font-size: 1rem;
  }
`;

export default StyledAuthProvider;
