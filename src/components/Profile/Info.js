import React, { useContext } from "react";
import styled from "styled-components";

import { UserContext } from "context/User";

const Photo = styled.img`
  width: 5rem;
  border-radius: 50%;
  margin-right: 2rem;
`;

const Username = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Info = ({className}) => {
  const { user } = useContext(UserContext);
  const photoURL = user.photoURL || "img/default-photo.png";
  const username = user.username || "";
  
  return (
    <div className={className}>
      <Photo src={photoURL} alt="" />
      <Username><b>{username}</b></Username>
    </div>
  )
};

const StyledInfo = styled(Info)`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

export default StyledInfo;
