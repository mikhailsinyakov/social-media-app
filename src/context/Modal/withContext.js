import React, { useState, useEffect } from "react";

import ModalContext from "./context";

const withContext = Component => props => {
  const [Modal, setModal] = useState(null);
  const [show, setShow] = useState(false);
  
  const hideModal = () => {
    setShow(false);
    setTimeout(() => setModal(null), 400);
  };
  
  useEffect(() => {
    if (Modal) setShow(true);
  }, [Modal, setShow]);
  
  return (
    <ModalContext.Provider value={{Modal, setModal, hideModal, show}}>
      <Component {...props} />
    </ModalContext.Provider>
  );
};

export default withContext;
