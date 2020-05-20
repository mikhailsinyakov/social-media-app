import React, { useState } from "react";

import ModalContext from "./context";

const withContext = Component => props => {
  const [Modal, setModal] = useState(null);
  
  /*const setModalError = message => 
    setModal({
      type: "error", 
      title: "errorOccurred", 
      body: message, 
      buttons: [{name: "close", action: () => setModal(null)}]
    });
    
  const setCheckPhoneNumber = ({action, phoneNumber = null, onSuccess = null}) => {
    let title;
    if (action === "link") title = "linkPhoneNumber";
    else if (action === "change") title = "changePhoneNumber";
    else if (action === "check") title = "checkPhoneNumber";
    const body = (
      <AuthWithPhoneNumber 
        type={action} 
        onSuccess={onSuccess} 
        phoneNumber={phoneNumber}
      />
    );
    setModal({ 
      type: "action", 
      title, 
      body, 
      buttons: [{name: "cancel", action: () => setModal(null)}]
    });
  };*/
  
  return (
    <ModalContext.Provider value={{Modal, setModal}}>
      <Component {...props} />
    </ModalContext.Provider>
  );
};

export default withContext;
