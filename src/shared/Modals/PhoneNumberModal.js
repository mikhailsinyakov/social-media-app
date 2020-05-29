import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next"

import Modal, { ModalContext } from "context/Modal";

const PhoneNumberModal = ({title, children}) => {
  const { t } = useTranslation();
  const { hideModal } = useContext(ModalContext);
  
  return  (
    <Modal 
      size="large"
      title={title}
      buttons={[{name: t("cancel"), action: hideModal}]}
    >
      {children}
    </Modal>
  );
};

PhoneNumberModal.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired
};

export default PhoneNumberModal;
