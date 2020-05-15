import React, { useContext } from "react";
import styled from "styled-components";
import { FirebaseContext } from "components/Firebase";
import { useTranslation } from "react-i18next";

const Logo = styled.img`
  margin-left: 15px;
  margin-right: 20px;
  width: 20px;
`;

const WithGithub = ({className}) => {
  const firebase = useContext(FirebaseContext);
  const { t } = useTranslation();

  return (
    <button className={className} onClick={() => firebase.loginWithGithub()}>
      <Logo 
        src="img/logos/github.png" 
        alt="github-logo" 
      />
      {t("signInWithGithub")}
    </button>
  );
};

const StyledWithGithub = styled(WithGithub)`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');
  
  display: flex;
  align-items: center;
  background-color: rgb(68, 68, 68);
  font-family: 'Roboto',sans-serif;
  font-size: 14px;
  font-weight: bold;
  color: rgba(248, 248, 248, 0.7);
  padding: 0;
  padding-right: 12px;
  border: none;
  line-height: 46px;
  margin: 0 auto 0.5rem auto;
  cursor: pointer;
  border-radius: 0.5rem;
  
  &:active {
    background-color: rgb(47, 47, 47);
  }
  
  &:hover {
    box-shadow: 0 0 3px 0 black;
  }
`;

export default StyledWithGithub;
