import styled from "styled-components";
import { Link } from "react-tiger-transition";

const StyledLink = styled(Link)`
  text-decoration: none;
  padding: 0.5rem;
  border: none;
  background-color: transparent;
  font: inherit;
  cursor: pointer;
  color: #051fcf;
  
  &:hover {
    text-decoration: underline;
  }
  
  &:focus {
    outline: none;
  }
`;

export default StyledLink;
