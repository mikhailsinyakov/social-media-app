import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Modal from "shared/Modal";
import AuthWithPhoneNumber from "shared/AuthWithPhoneNumber";

const CheckPhoneNumber = ({type, close, onSuccess}) => {
  const { t } = useTranslation();
  const title = type === "link" ? t("linkPhoneNumber") : t("changePhoneNumber");
  
  return (
    <Modal 
      type="action"
      title={title}
      body={<AuthWithPhoneNumber type={type} onSuccess={onSuccess} />}
      close={close}
      closeBtnName={t("cancel")}
    />
  );
};

CheckPhoneNumber.propTypes = {
  type: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default CheckPhoneNumber;
