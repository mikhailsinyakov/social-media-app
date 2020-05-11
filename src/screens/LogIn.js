import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import LogInByPhoneNumber from "components/LogInByPhoneNumber";

const Title = styled.h3`
  text-align: center;
`;

const SignIn = ({className}) => {
  const { t } = useTranslation();
  return (
    <main>
      <div className={className}>
        <Title>{t("appName")}</Title>
        <LogInByPhoneNumber />
      </div>
    </main>
  );
};
  
  
const StyledSignIn = styled(SignIn)`
  border: 1px solid #d8c9c9;
  margin: 2rem 1rem;
  padding: 1rem;
  background-color: aqua;
  border-radius: 0.2rem;
`;

export default StyledSignIn;
