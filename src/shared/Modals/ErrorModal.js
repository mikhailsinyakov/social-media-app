import React, { useContext } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next"

import Modal, { ModalContext } from "context/Modal";

const ErrorModal = ({children}) => {
  const { t } = useTranslation();
  const { setModal } = useContext(ModalContext);
  
  return  (
    <Modal 
      type="error"
      title={t("errorOccurred")} 
      buttons={[{name: t("close"), action: () => setModal(null)}]}
    >
      {children}
    </Modal>
  );
};
  
ErrorModal.propTypes = {
  children: PropTypes.node.isRequired
};

export default ErrorModal;
