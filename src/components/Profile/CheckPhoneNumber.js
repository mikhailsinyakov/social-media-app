import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Modal from "shared/Modal";
import AuthWithPhoneNumber from "shared/AuthWithPhoneNumber";

const CheckPhoneNumber = ({close, onSuccess}) => {
  const { t } = useTranslation();
  return (
    <Modal 
      type="action"
      title={t("linkPhoneNumber")}
      body={<AuthWithPhoneNumber type="link" onSuccess={onSuccess} />}
      close={close}
      closeBtnName={t("cancel")}
    />
  );
};

CheckPhoneNumber.propTypes = {
  close: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default CheckPhoneNumber;
