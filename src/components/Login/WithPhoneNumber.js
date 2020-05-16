import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import AuthWithPhoneNumber from "shared/AuthWithPhoneNumber";

const WithPhoneNumber = ({className}) => {
  const { t } = useTranslation();
  
  return (
    <div className={className}>
      <p>{t("loginByPhoneNumber")}</p>
      <AuthWithPhoneNumber type="login" />
    </div>
  );
};

const StyledComponent = styled(WithPhoneNumber)`
  margin: 1rem 0;
  text-align: center;
  border-top: 1px solid #b3ab93;
  border-bottom: 1px solid #b3ab93;
`;

export default StyledComponent;
