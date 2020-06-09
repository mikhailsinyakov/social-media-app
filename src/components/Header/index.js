import React, { useContext } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { fold } from "react-tiger-transition";

import { FirebaseContext } from "context/Firebase";
import { UserContext } from "context/User";

import Logo from "./Logo";
import Button from "./Button";
import Link from "./Link";

fold({
  name: "fold-left",
  direction: "left"
});

fold({
  name: "fold-right",
  direction: "right"
});


const Header = ({ className }) => {
  const { t } = useTranslation();
  const firebase = useContext(FirebaseContext);
  const { user } = useContext(UserContext);
  
  const handleClick = e => firebase.auth.logOut();
  
  if (!user) return null;
  
  return (
    <header className={className}>
      <Logo src="favicon-32x32.png" alt="app-logo" />
      {
        user.username && (
          <>
            <Link to="/" transition="fold-right">{t("feed")}</Link>
            <Link to="/profile" transition="fold-left">{t("profile")}</Link>
          </>
        )
      }
      <Button onClick={handleClick}>{t("logOut")}</Button>
    </header>
  );
};
  
const StyledHeader = styled(Header)`
  display: flex;
  justify-content: flex-end;
  background-color: lightblue;
  padding: 0.5rem;
  border-radius: 0.3rem;
`;
  
export default StyledHeader;
