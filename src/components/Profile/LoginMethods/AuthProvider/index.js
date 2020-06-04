import React, { useState, useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { FirebaseContext } from "context/Firebase";
import { UserContext } from "context/User";
import { ModalContext } from "context/Modal";
import ErrorModal from "shared/Modals/ErrorModal";
import PhoneNumberModal from "shared/Modals/PhoneNumberModal";
import AuthWithPhoneNumber from "shared/AuthWithPhoneNumber";

import Icon from "./Icon";
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
  unlinkForbidden, 
  className
}) => {
  const firebase = useContext(FirebaseContext);
  const { updateUser } = useContext(UserContext);
  const { setModal } = useContext(ModalContext);
  const { t } = useTranslation();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const onSuccessChangePhoneNumber = () => {
    setModal(null);
    updateUser();
  };
  
  const updatePhoneNumber = action => {
    setModal(
      <PhoneNumberModal 
        title={
          action === "change" ? t("changePhoneNumber") : t("linkPhoneNumber")
        }
      >
        <AuthWithPhoneNumber 
          type={action}  
          onSuccess={onSuccessChangePhoneNumber} 
        />
      </PhoneNumberModal>
    );
  };
  
  const linkProvider = () => firebase.auth.linkProvider(id);
  
  const unlinkProvider = async () => {
    if (isSubmitting) return;
    if (unlinkForbidden) {
      setModal(<ErrorModal>{t("unlinkForbidden")}</ErrorModal>);
      return;
    }
    setIsSubmitting(true);
    try {
      await firebase.auth.unlinkProvider(id);
      updateUser();
    }
    catch (e) {
      const provider = id === "phone" ? t("phoneNumber") : id;
      setModal(<ErrorModal>{`${t(e.message)} "${provider}"`}</ErrorModal>);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userId) {
    return (
      <div className={className}>
        <Icon name={name} />
        <UserId>{t("notLinked")}</UserId>
        <Button 
          onClick={
            id === "phone" ? () => updatePhoneNumber("link") : linkProvider
          }
          data-testid={`${id}-button`}
        >
          {t("link")}
        </Button>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <Icon name={name} />
      <UserId className="linked">{userId}</UserId>
      <Button 
        className={id === "phone" && unlinkForbidden ? "change" : "linked"}
        onClick={
          id === "phone" && unlinkForbidden ? 
            () => updatePhoneNumber("change") : 
            unlinkProvider
        }
        data-testid={`${id}-button`}
      >
        {id === "phone" && unlinkForbidden ? t("change") : t("unlink")}
      </Button>
      <StyledLoader size={25} show={isSubmitting} expand={false} />
    </div>
  );
};

AuthProvider.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  userId: PropTypes.string,
  unlinkForbidden: PropTypes.bool.isRequired
};

const StyledAuthProvider = styled(AuthProvider)`
  position: relative;
  font-size: 0.8rem;
  display: flex;
  padding: 0.5rem;
  align-items: center;
  border: 1px solid transparent;
  max-width: 400px;
  margin: 0.5rem auto;
  border-radius: 1rem;
  cursor: default;
  
  &:hover {
    background-image: linear-gradient(to right, 
                                      rgba(0,0,0,0.1) 3rem, 
                                      rgba(0,0,0,0.05) 3rem);
    border-color: #bbaaaa;
  }
  
  @media screen and (min-width: 400px) {
    font-size: 1rem;
  }
`;

export default StyledAuthProvider;
