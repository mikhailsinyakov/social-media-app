import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import PhoneNumberLib from "awesome-phonenumber";
import { useTranslation } from "react-i18next";
import { FirebaseContext } from "components/Firebase";
import HelpMessage from "shared/HelpMessage";
import Form from "shared/Form";
import Resend from "./Resend";

const AuthWithPhoneNumber = ({type, onSuccess, phoneNumber, className}) => {
  const { t } = useTranslation();
  const firebase = useContext(FirebaseContext);
  
  const [phoneNum, setPhoneNum] = useState("");
  const [submittedPhoneNum, setSubmittedPhoneNum] = useState(null);
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  
  const modifyPhoneNumber = num => {
    const ayt = PhoneNumberLib.getAsYouType();
    for (let i = 0; i < num.length; i++) {
      const char = num[i];
      if (i === 0) ayt.addChar("+");
      if (char.match(/\d/)) ayt.addChar(char);
    }
    const newPhoneNum = ayt.getPhoneNumber().getNumber();
    setPhoneNum(newPhoneNum);
    if (showVerifyForm) setShowVerifyForm(false);
    else if (submittedPhoneNum === newPhoneNum) setShowVerifyForm(true);
    
    return {
      newValue: ayt.number().trim(),
      isValid: ayt.getPhoneNumber().isValid()
    };
  };
  
  const sendSMS = async () => {
    await firebase.sendSMSCode(phoneNumber || phoneNum);
    setSubmittedPhoneNum(phoneNum);
    setShowVerifyForm(true);
  };
  
  const checkCode = async code => {
    if (type === "login") await firebase.confirmCode(code);
    else if (type === "change") await firebase.changePhoneNumber(code);
    else if (type === "link") await firebase.linkPhoneNumber(code);
    else if (type === "check") {
      await firebase.reauthenticate(code);
      await firebase.deleteAccount();
    }
    if (onSuccess) onSuccess(phoneNum);
  };
  
  useEffect(() => {
    firebase.createRecaptchaVerifier();
  }, [firebase]);
  
  return (
    <div className={className}>
      <HelpMessage>{t("loginByPhoneNumberMsg")}</HelpMessage>
      <Form
        type="tel"
        placeholder={t("phoneNumber")}
        buttonName={t("getCode")}
        action={sendSMS}
        modifyValue={modifyPhoneNumber}
        defaultMsg={t("phoneNumberDefaultMsg")}
        initValue={phoneNumber || ""}
        disabled={!!phoneNumber}
      />
      <Form
        type="number"
        placeholder={t("smsCode")}
        buttonName={t(type)}
        action={checkCode}
        show={showVerifyForm}
      />
      { showVerifyForm && <Resend onClick={sendSMS} /> }
      <div id="recaptcha"></div>
    </div>
  );
};

AuthWithPhoneNumber.propTypes = {
  type: PropTypes.string.isRequired,
  onSuccess: PropTypes.func,
  phoneNumber: PropTypes.string
};

export default AuthWithPhoneNumber;
