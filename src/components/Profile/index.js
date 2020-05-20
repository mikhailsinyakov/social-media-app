import React from "react";
import styled from "styled-components";

import Username from "./Username";
import LoginMethods from "./LoginMethods";
import DeleteAccount from "./DeleteAccount";

const Profile = ({className}) => (
  <div className={className}>
    <Username />
    <LoginMethods />
    <DeleteAccount />
  </div>
);

const StyledProfile = styled(Profile)`
  margin: 1rem 0;
  text-align: center;
`;

export default StyledProfile;
