import styled from "styled-components";

const Input = styled.input`
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2&display=swap');
  
  padding: 0.3rem 0.6rem;
  border-radius: 0.4rem;
  width: 8rem;
  margin-right: 1rem;
  border: none;
  font-family: 'Baloo 2', cursive;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    background-color: blanchedalmond;
  }
  
  @media screen and (min-width: 400px) {
    font-size: 1.05rem;
    width: 12rem;
  }
`;

export default Input;
