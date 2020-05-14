import styled from "styled-components";

const Loader = styled.div`
  flex-shrink: 0;
  margin: 0 0.5rem;
  border: ${({size}) => size / 7.5 * 0.8}px solid #f3f3f3;
  border-top-color: #3498db;
  border-radius: 50%;
  width: ${({size}) => size * 0.8}px;
  height: ${({size}) => size * 0.8}px;
  animation: spin 2s linear infinite;
  opacity: ${({show}) => show ? "1" : "0"};

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  ${({increaseSize, size}) => (increaseSize === undefined || increaseSize) && 
    `
      @media screen and (min-width: 400px) {
        border: ${size / 7.5}px solid #f3f3f3;
        border-top-color: #3498db;
        width: ${size}px;
        height: ${size}px;
      }
    `
  }
`;

export default Loader;
