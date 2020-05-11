import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import PhoneNumberLib from "awesome-phonenumber";
import { useTranslation } from "react-i18next";
import { FirebaseContext } from "components/Firebase";
import HelpMessage from "./HelpMessage";
import Form from "./Form";
import Resend from "./Resend";

const LogInByPhoneNumber = ({className}) => {
  const { t } = useTranslation();
  const firebase = useContext(FirebaseContext);
  
  const [phoneNum, setPhoneNum] = useState("");
  const [isPhoneNumValid, setIsPhoneNumValid] = useState(false);
  const [showVerifyForm, setShowVerifyForm] = useState(false);
  const [phoneNumSubmitErrorMsg, setPhoneNumSubmitErrorMsg] = useState("");
  const [SMSSubmitErrorMsg, setSMSSubmitErrorMsg] = useState("");
  const [isPhoneNumSubmitting, setIsPhoneNumSubmitting] = useState(false);
  const [isSMSSubmitting, setIsSMSSubmitting] = useState(false);
  const [wasPhoneNumUsed, setWasPhoneNumUsed] = useState(false);
  
  const changePhoneNumber = num => {
    const ayt = PhoneNumberLib.getAsYouType();
    for (let i = 0; i < num.length; i++) {
      const char = num[i];
      if (i === 0) ayt.addChar("+");
      if (char.match(/\d/)) ayt.addChar(char);
    }
    setPhoneNum(ayt.getPhoneNumber().getNumber());
    setIsPhoneNumValid(ayt.getPhoneNumber().isValid());
    if (showVerifyForm) setShowVerifyForm(false);
    if (wasPhoneNumUsed) setWasPhoneNumUsed(false);
    
    return ayt.number().trim();
  };
  
  const phoneNumHasChanged = () => {
    if (phoneNumSubmitErrorMsg) setPhoneNumSubmitErrorMsg("");
  };
  
  const SMSCodeHasChanged = () => {
    if (SMSSubmitErrorMsg) setSMSSubmitErrorMsg("");
  }
  
  const sendSMS = () => {
    setIsPhoneNumSubmitting(true);
    setWasPhoneNumUsed(true);
    firebase.sendSMSCode(phoneNum)
      .then(() => {
        setShowVerifyForm(true);
        setIsPhoneNumSubmitting(false);
      }).catch(e => {
        setPhoneNumSubmitErrorMsg(t(e.message));
        setIsPhoneNumSubmitting(false);
      });
  };
  
  const checkVerifyCode = verifyCode => {
    setIsSMSSubmitting(true);
    firebase.confirmCode(verifyCode)
      .then(() => {
        setIsSMSSubmitting(false);
      }).catch(() => {
        setSMSSubmitErrorMsg(t("badVerificationCode"));
        setIsSMSSubmitting(false);
      });
  };
  
  useEffect(() => {
    firebase.createRecaptchaVerifier();
  }, [firebase]);
  
  return (
    <div className={className}>
      <p>{t("loginByPhoneNumber")}</p>
      <HelpMessage>{t("loginByPhoneNumberMsg")}</HelpMessage>
      <Form
        show={true}
        type="tel"
        placeholder={t("phoneNumber")}
        changeValue={changePhoneNumber}
        isButtonActive={
          !wasPhoneNumUsed && !phoneNumSubmitErrorMsg && isPhoneNumValid
        }
        showMsg={!!(phoneNumSubmitErrorMsg || !isPhoneNumValid)}
        buttonName={t("getCode")}
        action={sendSMS}
        defaultMsg={t("phoneNumberDefaultMsg")}
        submitErrorMsg={phoneNumSubmitErrorMsg}
        valueHasChanged={phoneNumHasChanged}
        isSubmitting={isPhoneNumSubmitting}
      />
      <Form
        show={showVerifyForm}
        type="number"
        placeholder={t("smsCode")}
        isButtonActive={!SMSSubmitErrorMsg}
        showMsg={!!SMSSubmitErrorMsg}
        buttonName={t("login")}
        action={checkVerifyCode}
        defaultMsg=""
        submitErrorMsg={SMSSubmitErrorMsg}
        valueHasChanged={SMSCodeHasChanged}
        isSubmitting={isSMSSubmitting}
      />
      { showVerifyForm && <Resend onClick={sendSMS} /> }
      <div id="recaptcha"></div>
    </div>
  );
};

const StyledComponent = styled(LogInByPhoneNumber)`
  margin: 1rem 0;
  text-align: center;
  border-top: 1px solid #b3ab93;
  border-bottom: 1px solid #b3ab93;
`;

export default StyledComponent;
