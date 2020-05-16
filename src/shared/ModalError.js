import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Modal from "./Modal";

const ModalError = ({message, close}) => {
  const { t } = useTranslation();
  
  return (
    <Modal 
      type="error"
      title={t("errorOccurred")} 
      body={message}
      close={close}
      closeBtnName={t("close")}
    />
  );
};

ModalError.propTypes = {
  message: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired
};

export default ModalError;
