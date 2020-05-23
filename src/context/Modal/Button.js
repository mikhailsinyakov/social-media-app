import styled from "styled-components";

const Button = styled.button`
  padding: 0.5rem;
  border: none;
  background-color: var(--btn-warning-color-active);
  cursor: pointer;
  font-family: 'Baloo 2',cursive;
  border-radius: 0.3rem;
  font-size: 0.8rem;
  min-width: 4.5rem;
  position: relative;
  
  &:focus {
    outline: none;
  }
  
  &:hover {
    background-color: var(--btn-warning-color-hover);
  }
  
  &.confirm {
    background-color: var(--btn-primary-color-active);
  }
  
  &.confirm:hover {
    background-color: var(--btn-primary-color-hover);
  }
  
  @media screen and (min-width: 400px) {
    font-size: 0.9rem;
  }
`;

export default Button;
