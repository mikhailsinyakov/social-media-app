import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next"

import Modal, { ModalContext } from "context/Modal";

const ErrorModal = ({children}) => {
  const { t } = useTranslation();
  const { hideModal } = useContext(ModalContext);
  
  return  (
    <Modal 
      size="small"
      title={t("errorOccurred")} 
      buttons={[{name: t("close"), action: () => hideModal()}]}
    >
      {children}
    </Modal>
  );
};
  
ErrorModal.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorModal;
