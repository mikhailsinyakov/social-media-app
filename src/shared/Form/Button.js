import styled from "styled-components";

const Button = styled.button`
  padding: 0.5rem;
  border: none;
  font-family: 'Baloo 2',cursive;
  border-radius: 0.3rem;
  font-size: 0.8rem;
  min-width: 4.5rem;
  cursor: pointer;
  background-color: var(--btn-primary-color-active);
  
  &:hover {
    background-color: var(--btn-primary-color-hover);
  }
  
  &:disabled {
    cursor: not-allowed;
    background-color: var(--btn-color-disabled);
  }
  
  &:focus {
    outline: none;
  }
  
  @media screen and (min-width: 400px) {
    font-size: 0.9rem;
  }
`;

export default Button;
