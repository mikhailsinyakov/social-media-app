import React, { useContext } from "react";
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

  const modifyUsername = value => {
    const newValue = "@" + value.replace(/\W/g, "").toLowerCase();
    return {
      newValue,
      isValid: newValue.length >= 4
    };
  }

  return (
    <div className={className}>
      {!user.displayName && <HelpMessage>{t("needToAddUsername")}</HelpMessage>}
      <Form
        type="text"
        placeholder={t("username")}
        buttonName={t("save")}
        action={username => firebase.updateUsername(username)}
        modifyValue={modifyUsername}
        autofocus={false}
        initValue={user.displayName}
        defaultMsg={t("usernameMinLength")}
        buttonNameSubmitted={t("saved")}
        defaultSubmittedValue={user.displayName}
      />
    </div>
  );
};

const StyledProfile = styled(Profile)`
  margin: 1rem 0;
  text-align: center;
`;

export default StyledProfile;
