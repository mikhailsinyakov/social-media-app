import React, { useContext } from "react";
import styled from "styled-components";

import { UserContext } from "context/User";

const Photo = styled.img`
  width: 5rem;
  border-radius: 50%;
  margin-left: 1rem;
`;

const UsernameContainer = styled.p`
  flex-grow: 1;
`;

const Username = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media screen and (min-width: 400px) {
    font-size: 1.3rem;
  }
`;

const Info = ({className}) => {
  const { user } = useContext(UserContext);
  const photoURL = user.photoURL || "img/default-photo.png";
  const username = user.username || "";
  
  return (
    <div className={className}>
      <Photo src={photoURL} alt="" data-testid="photo" />
      <UsernameContainer>
        <Username><b>{username}</b></Username>
      </UsernameContainer>
    </div>
  )
};

const StyledInfo = styled(Info)`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  max-width: 400px;
  margin: 0 auto;
`;

export default StyledInfo;
