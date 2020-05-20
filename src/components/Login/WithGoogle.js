import React, { useContext, useRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FirebaseContext } from "context/Firebase";

const WithGoogle = ({className}) => {
  const firebase = useContext(FirebaseContext);
  const { t } = useTranslation();
  const imgElem = useRef(null);
  
  const changeImg = state => {
    imgElem.current.src = `img/logos/google-${state}.svg`;
  };

  return (
    <button 
      className={className} 
      onClick={() => firebase.auth.loginWithGoogle()}
      onFocus={() => changeImg("focus")}
      onBlur={() => changeImg("normal")}
    >
      <img 
        src="img/logos/google-normal.svg" 
        alt="google-logo" 
        style={{marginRight: "10px"}}
        ref={imgElem}
      />
      {t("signInWithGoogle")}
    </button>
  );
};

const StyledWithGoogle = styled(WithGoogle)`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');
  
  display: flex;
  background-color: white;
  font-family: 'Roboto',sans-serif;
  font-size: 14px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.54);
  padding: 0;
  padding-right: 8px;
  border: none;
  line-height: 46px;
  margin: 0 auto 0.5rem auto;
  cursor: pointer;
  border-radius: 0.5rem;
  
  &:active {
    background-color: rgb(238, 238, 238);
  }
  
  &:hover {
    box-shadow: 0 0 3px 0 #8c8686;
  }
`;

export default StyledWithGoogle;
