import React from "react";
import styled from "styled-components";

const StyledLink = styled.a`
  text-decoration: none;
  padding: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Footer = ({ className }) => 
  <footer className={className}>
    <StyledLink href="https://github.com/mikhailsinyakov">
      Github
    </StyledLink>
    <StyledLink href="https://firebase.google.com/">Firebase</StyledLink>
    <StyledLink href="https://reacttraining.com/react-router">
      React Router
    </StyledLink>
  </footer>;
  
const StyledFooter = styled(Footer)`
  display: flex;
  justify-content: space-around;
  background-color: #b5919d;
  margin-top: auto;
  padding: 0.5rem;
  border-radius: 0.3rem;
`;
  
export default StyledFooter;
