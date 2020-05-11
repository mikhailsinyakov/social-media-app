import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Button = styled.button`
  background-color: transparent;
  border: none;
  font: inherit;
  color: #37379c;
  
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  
  &:focus {
    outline: none;
  }
`;

const Resend = ({onClick, className}) => (
  <p className={className}>
    Didn't get code?
    <Button onClick={onClick}>Send again</Button>
  </p>
);

Resend.propTypes = {
  onClick: PropTypes.func.isRequired
};

const StyledResend = styled(Resend)`
  font-size: 0.8rem;
`;

export default StyledResend;
