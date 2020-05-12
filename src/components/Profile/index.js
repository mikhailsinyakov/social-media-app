import React, { useState, useContext } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FirebaseContext } from "components/Firebase";
import { UserContext } from "components/User";
import HelpMessage from "shared/HelpMessage";
import Form from "shared/Form";

const Profile = ({className}) => {
  const { t } = useTranslation();
  const firebase = useContext(FirebaseContext);
  const user = useContext(UserContext);
  const currUsername = user.displayName || "";
  
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isUsernameSubmitting, setIsUsernameSubmitting] = useState(false);
  const [usernameSubmitErrorMsg, setUsernameSubmitErrorMsg] = useState("");
  const [wasUsernameUsed, setWasUsernameUsed] = useState(false);
  const [usernameSaved, setUsernameSaved] = useState(true);

  const changeUsernameValue = value => {
    if (wasUsernameUsed) setWasUsernameUsed(false);
    const changedValue = "@" + value.replace(/\W/g, "").toLowerCase();
    setUsernameSaved(changedValue === currUsername);
    return changedValue;
  };
  
  const usernameValueHasChanged = value => {
    if (value.length < 4) setIsUsernameValid(false);
    else setIsUsernameValid(true);
    setUsernameSubmitErrorMsg("");
  };
  
  const changeUsername = username => {
    setIsUsernameSubmitting(true);
    setWasUsernameUsed(true);
    firebase.updateUsername(username)
      .then(() => {
        setIsUsernameSubmitting(false);
        setUsernameSaved(true);
      }).catch(e => {
        setUsernameSubmitErrorMsg(t(e.message));
        setIsUsernameSubmitting(false);
      });
  };

  return (
    <div className={className}>
      {!user.displayName && <HelpMessage>{t("needToAddUsername")}</HelpMessage>}
      <Form
        show={true}
        initValue={currUsername}
        type="text"
        placeholder={t("username")}
        changeValue={changeUsernameValue}
        isButtonActive={
          !wasUsernameUsed && !usernameSubmitErrorMsg && 
          isUsernameValid && !usernameSaved
        }
        showMsg={!!(!isUsernameValid || usernameSubmitErrorMsg)}
        buttonName={usernameSaved ? t("saved") : t("save")}
        action={changeUsername}
        defaultMsg={t("usernameMinLength")}
        submitErrorMsg={usernameSubmitErrorMsg}
        valueHasChanged={usernameValueHasChanged}
        isSubmitting={isUsernameSubmitting}
      />
    </div>
  );
};

const StyledProfile = styled(Profile)`
  margin: 1rem 0;
  text-align: center;
`;

export default StyledProfile;
