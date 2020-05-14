import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FirebaseContext } from "components/Firebase";
import Name from "./Name";
import UserId from "./UserId";
import Button from "./Button";
import Loader from "shared/Loader";

const StyledLoader = styled(Loader)`
  position: absolute;
  right: -23px;
`;

const AuthProvider = ({id, name, userId, error, setError, className}) => {
  const firebase = useContext(FirebaseContext);
  const { t } = useTranslation();
  
  const [currUserId, setCurrUserId] = useState(userId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const linkProvider = () => {
    if (!error) firebase.linkProvider(id);
  };
  
  const unlinkProvider = async () => {
    if (isSubmitting || error) return;
    setIsSubmitting(true);
    try {
      await firebase.unlinkProvider(id);
      setCurrUserId(null);
    }
    catch (e) {
      const provider = id === "phone" ? t("phoneNumber") : id;
      setError(`${t(e.message)} "${provider}"`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currUserId) {
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
      <UserId className="linked">{currUserId}</UserId>
      <Button className="linked" onClick={unlinkProvider}>
        {t("unlink")}
      </Button>
      <StyledLoader size={25} show={isSubmitting} increaseSize={false} />
    </div>
  );
};

AuthProvider.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  userId: PropTypes.string,
  error: PropTypes.string,
  setError: PropTypes.func.isRequired
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
