import styled from "styled-components";

const Button = styled.button`
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2&display=swap');
  
  padding: 0.5rem;
  background-color: #ebebe4;
  border: none;
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
    top: 2rem;
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
    }
  }
`;

export default Button;
