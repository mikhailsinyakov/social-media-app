import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next"

import Modal, { ModalContext } from "context/Modal";

const ConfirmationModal = ({title, confirmBtnAction, children}) => {
  const { t } = useTranslation();
  const { hideModal } = useContext(ModalContext);
  
  const confirm = () => {
    confirmBtnAction();
    hideModal();
  };
  
  return  (
    <Modal 
      size="small"
      title={title} 
      buttons={[
        {name: t("yes"), action: confirm},
        {name: t("cancel"), action: hideModal}
      ]}
    >
      {children}
    </Modal>
  );
};
  
ConfirmationModal.propTypes = {
  title: PropTypes.string.isRequired,
  confirmBtnAction: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

export default ConfirmationModal;
