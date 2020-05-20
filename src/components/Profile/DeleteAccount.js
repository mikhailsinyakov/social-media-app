import React, { useContext } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import { FirebaseContext } from "context/Firebase";
import { UserContext } from "context/User";
import { ModalContext } from "context/Modal";

import ErrorModal from "shared/Modals/ErrorModal";
import PhoneNumberModal from "shared/Modals/PhoneNumberModal";
import AuthWithPhoneNumber from "shared/AuthWithPhoneNumber";

const DeleteAccount = ({className}) => {
  const firebase = useContext(FirebaseContext);
  const { user } = useContext(UserContext);
  const { Modal, setModal } = useContext(ModalContext);
  const { t } = useTranslation();
  
  const phoneProvider = user.providerData.filter(p => p.providerId === "phone")[0];
  const phoneNumber = phoneProvider && phoneProvider.uid;
  
  const deleteAccount = async () => {
    if (Modal) return;
    try {
      await firebase.auth.deleteAccount();
    } catch (e) {
      if (e.message === "Requires recent login") {
        if (user.providerData.find(provider => provider.providerId === "phone")) {
          setModal(
            <PhoneNumberModal title={t("checkPhoneNumber")}>
              <AuthWithPhoneNumber 
                type={"check"}  
                phoneNumber={phoneNumber} 
              />
            </PhoneNumberModal>
          );
        } else {
          setModal(<ErrorModal>{t("youNeedToLinkPhoneNumber")}</ErrorModal>);
        }
      } else setModal(<ErrorModal>t(e.message)</ErrorModal>);
    }
  }; 

  return (
    <button className={className} onClick={deleteAccount}>
      {t("deleteAccount")}
    </button>
  );
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
