import React, { Fragment, useContext } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { FirebaseContext } from "components/Firebase";
import { UserContext } from "components/User";
import Button from "./Button";
import Link from "./Link";

const Header = ({ className }) => {
  const { t } = useTranslation();
  const firebase = useContext(FirebaseContext);
  const { user } = useContext(UserContext);
  
  const handleClick = e => {
    e.preventDefault();
    firebase.logOut();
  };
  
  return (
    <header className={className}>
      {
        user.username && (
          <Fragment>
            <Link to="/">{t("feed")}</Link>
            <Link to="/profile">{t("profile")}</Link>
          </Fragment>
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
