import React, { Fragment, useContext } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { FirebaseContext } from "components/Firebase";
import HelpMessage from "shared/HelpMessage";
import Form from "shared/Form";

const modifyUsername = value => {
  const newValue = "@" + value.replace(/\W/g, "").toLowerCase();
  return {
    newValue,
    isValid: newValue.length >= 4
  };
};

const Username = ({currUsername, error}) => {
  const { t } = useTranslation();
  const firebase = useContext(FirebaseContext);

  return (
    <Fragment>
      {!currUsername && <HelpMessage>{t("needToAddUsername")}</HelpMessage>}
      <Form
        type="text"
        placeholder={t("username")}
        buttonName={t("save")}
        action={username => !error && firebase.updateUsername(username)}
        modifyValue={modifyUsername}
        autofocus={false}
        initValue={currUsername || ""}
        defaultMsg={t("usernameMinLength")}
        buttonNameSubmitted={t("saved")}
        defaultSubmittedValue={currUsername || ""}
      />
    </Fragment>
  )
};

Username.propTypes = {
  currUsername: PropTypes.string,
  error: PropTypes.string
};

export default Username;
