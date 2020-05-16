import React from "react";
import styled from "styled-components";
import withHeaderAndFooter from "./withHeaderAndFooter";
import { useTranslation } from "react-i18next";
import Profile from "components/Profile";

const ProfilePage = ({className}) => {
  const { t } = useTranslation();
  
  return (
    <main>
      <div className={className}>
        <h3>{t("profile")}</h3>
        <Profile />
      </div>
    </main>
  );
}
  
const StyledProfilePage = styled(ProfilePage)`
  position: relative;
  border: 1px solid #d8c9c9;
  margin: 2rem 1rem;
  padding: 1rem;
  background-color: aqua;
  border-radius: 0.2rem;
`;

export default withHeaderAndFooter(StyledProfilePage);
