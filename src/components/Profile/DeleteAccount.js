import React, { useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { FirebaseContext } from "components/Firebase";
import { UserContext } from "components/User";
import { useTranslation } from "react-i18next";

const DeleteAccount = ({active, setError, setModal, className}) => {
  const firebase = useContext(FirebaseContext);
  const { user } = useContext(UserContext);
  const { t } = useTranslation();
  
  const deleteAccount = async () => {
    if (!active) return;
    try {
      await firebase.deleteAccount();
    } catch (e) {
      if (e.message === "Requires recent login") {
        if (user.providerData.find(provider => provider.providerId === "phone")) {
          setModal({ type: "check" });
        } else setError(t("youNeedToLinkPhoneNumber"));
      } else setError(e.message);
    }
  }; 

  return (
    <button className={className} onClick={deleteAccount}>
      {t("deleteAccount")}
    </button>
  );
};

DeleteAccount.propTypes = {
  active: PropTypes.bool.isRequired,
  setError: PropTypes.func.isRequired,
  setModal: PropTypes.func.isRequired
};

const StyledDeleteAccount = styled(DeleteAccount)`
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2&display=swap');
  
  padding: 0.5rem;
  border: none;
  font-family: 'Baloo 2',cursive;
  border-radius: 0.3rem;
  font-size: 0.8rem;
  min-width: 4.5rem;
  position: relative;
  cursor: pointer;
  background-color: #f59948;
  margin-top: 1rem;
  
  &:hover {
    background-color: #f38e35;
  }
  
  &:focus {
    outline: none;
  }
`;

export default StyledDeleteAccount;
