import React from "react";
import styled from "styled-components";

import withHeaderAndFooter from "./withHeaderAndFooter";

const Feed = ({className}) => 
  <main></main>;
  
const StyledFeed = styled(Feed)`
  border: 1px solid #d8c9c9;
  margin: 2rem 1rem;
  padding: 1rem;
  background-color: aqua;
  border-radius: 0.2rem;
`;

export default withHeaderAndFooter(StyledFeed);
