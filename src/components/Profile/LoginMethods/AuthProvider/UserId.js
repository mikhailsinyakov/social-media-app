import styled from "styled-components";

const UserId = styled.div`
  margin: 0 0.5rem;
  flex-grow: 1;
  font-family: monospace;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &.linked {
    font-family: inherit;
  }
`;

export default UserId;
