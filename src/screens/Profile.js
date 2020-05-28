import React from "react";
import styled from "styled-components";

import Profile from "components/Profile";

const ProfilePage = ({className}) => (
  <>
    <div className={className}>
      <Profile />
    </div>
  </>
);

const StyledProfilePage = styled(ProfilePage)`
  border: 1px solid #d8c9c9;
  margin: 2rem 0;
  padding: 1rem;
  background-color: aqua;
  border-radius: 0.2rem;
`;

export default StyledProfilePage;
