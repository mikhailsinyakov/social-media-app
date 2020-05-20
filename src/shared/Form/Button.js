import styled from "styled-components";

const Button = styled.button`
  padding: 0.5rem;
  border: none;
  background-color: #ebebe4;
  font-family: 'Baloo 2',cursive;
  border-radius: 0.3rem;
  font-size: 0.8rem;
  min-width: 4.5rem;
  position: relative;
  
  &.active {
    cursor: pointer;
    background-color: sandybrown;
  }
  
  &:focus {
    outline: none;
  }
  
  &::after {
    content: "${({message}) => message}";
    position: absolute;
    top: 1.5rem;
    left: -9rem;
    font-size: 0.6rem;
    margin: 0.4rem 0;
    color: brown;
    width: 8rem;
    text-align: center;
    opacity: ${({showMsg}) => showMsg ? "1" : "0"};
  }
  
  @media screen and (min-width: 400px) {
    font-size: 0.9rem;
    &::after {
      left: -13rem;
      width: 12rem;
      top: 1.8rem;
    }
  }
`;

export default Button;
