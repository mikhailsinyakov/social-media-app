import React from "react";
import styled from "styled-components";
import { useTranslation} from "react-i18next";

import Username from "./Username";
import Info from "./Info";
import LoginMethods from "./LoginMethods";
import DeleteAccount from "./DeleteAccount";

const Profile = ({className}) => {
  const { t } = useTranslation();
  
  return (
    <div className={className}>
      <Info />
      <h4>{t("editProfile")}</h4>
      <Username />
      <LoginMethods />
      <DeleteAccount />
    </div>
  );
};

const StyledProfile = styled(Profile)`
  margin: 1rem 0;
  text-align: center;
`;

export default StyledProfile;
