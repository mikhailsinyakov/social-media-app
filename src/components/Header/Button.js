import styled from "styled-components";

const Button = styled.button`
  padding: 0.5rem;
  border: none;
  background-color: transparent;
  cursor: pointer;
  font: inherit;
  color: #051fcf;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
  
  &:focus {
    outline: none;
  }
`;

export default Button;
