import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

const Button = styled.button`
  background-color: transparent;
  border: none;
  font: inherit;
  color: #37379c;
  
  &:hover {
    text-decoration: underline;
  }
  
  &:focus {
    outline: none;
  }
`;

const Resend = ({onClick, className}) => {
  const { t } = useTranslation();
  
  return (
    <p className={className}>
      {t("didntGetCode")}
      <Button onClick={onClick}>
        {t("sendAgain")}
      </Button>
    </p>
  );
}

Resend.propTypes = {
  onClick: PropTypes.func.isRequired
};

const StyledResend = styled(Resend)`
  font-size: 0.8rem;
`;

export default StyledResend;
