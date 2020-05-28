import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import Login from "components/Login";

const LoginPage = ({className}) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={className}>
        <h3>{t("appName")}</h3>
        <Login />
      </div>
    </>
  );
};
  
  
const StyledLoginPage = styled(LoginPage)`
  border: 1px solid #d8c9c9;
  margin: 2rem 1rem;
  padding: 1rem;
  background-color: aqua;
  border-radius: 0.2rem;
`;

export default StyledLoginPage;
