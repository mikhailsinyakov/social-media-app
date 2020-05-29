import styled from "styled-components";

const Button = styled.button`
  padding: 0.5rem;
  border: none;
  background-color: var(--btn-primary-color-active);
  cursor: pointer;
  font-family: 'Baloo 2',cursive;
  border-radius: 0.3rem;
  font-size: 0.8rem;
  width: 5rem;
  position: relative;
  
  &:hover {
    background-color: var(--btn-primary-color-hover);
  }
  
  &:focus {
    outline: none;
  }
  
  &.linked {
    background-color: var(--btn-warning-color-active); 
  }
  
  &.linked:hover {
    background-color: var(--btn-warning-color-hover);
  }
  
  &.change {
    background-color: var(--btn-neutral-color-active); 
  }
  
  &.change:hover {
    background-color: var(--btn-neutral-color-hover);
  }
  
  @media screen and (min-width: 400px) {
    font-size: 0.9rem;
  }
`;

export default Button;
