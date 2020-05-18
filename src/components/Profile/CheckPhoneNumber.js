import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Modal from "shared/Modal";
import AuthWithPhoneNumber from "shared/AuthWithPhoneNumber";

const CheckPhoneNumber = ({type, close, onSuccess, phoneNumber}) => {
  const { t } = useTranslation();
  let title;
  if (type === "link") title = t("linkPhoneNumber");
  else if (type === "change") title = t("changePhoneNumber");
  else if (type === "check") title = t("checkPhoneNumber");
  
  return (
    <Modal 
      type="action"
      title={title}
      body={
        <AuthWithPhoneNumber 
          type={type} 
          onSuccess={onSuccess} 
          phoneNumber={phoneNumber}
        />
        }
      close={close}
      closeBtnName={t("cancel")}
    />
  );
};

CheckPhoneNumber.propTypes = {
  type: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  onSuccess: PropTypes.func,
  phoneNumber: PropTypes.string
};

export default CheckPhoneNumber;
