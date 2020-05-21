import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import { FirebaseContext } from "context/Firebase";
import { UserContext } from "context/User";

import HelpMessage from "shared/HelpMessage";
import Form from "shared/Form";

const modifyUsername = value => {
  const newValue = "@" + value.replace(/\W/g, "").toLowerCase();
  return {
    newValue,
    isValid: newValue.length >= 4
  };
};

const Username = () => {
  const { t } = useTranslation();
  const firebase = useContext(FirebaseContext);
  const { user: {username: currUsername}, updateUser } = useContext(UserContext);

  return (
    <>
      {!currUsername && <HelpMessage>{t("needToAddUsername")}</HelpMessage>}
      <Form
        type="text"
        placeholder={t("username")}
        buttonName={t("save")}
        action={username => firebase.auth.updateUsername(username)}
        modifyValue={modifyUsername}
        autofocus={false}
        initValue={currUsername || ""}
        defaultMsg={t("usernameMinLength")}
        buttonNameSubmitted={t("saved")}
        defaultSubmittedValue={currUsername || ""}
        onSubmitSucceed={() => updateUser()}
      />
    </>
  )
};

export default Username;
