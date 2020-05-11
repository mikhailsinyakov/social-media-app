import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled(Link)`
  text-decoration: none;
  padding: 0.5rem;
`;

const Header = ({ className }) => 
  <header className={className}>
    <StyledLink to="/auth">Log in</StyledLink>
  </header>;
  
const StyledHeader = styled(Header)`
  display: flex;
  justify-content: flex-end;
  background-color: lightblue;
  padding: 0.5rem;
  border-radius: 0.3rem;
`;
  
export default StyledHeader;
