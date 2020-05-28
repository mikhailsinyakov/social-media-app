import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Screen } from "react-tiger-transition";

import Header from "components/Header";
import Footer from "components/Footer";

const MyScreen = ({addHeaderFooter, children, className}) => (
  <Screen className={className}>
    {addHeaderFooter && <Header />}
    {children}
    {addHeaderFooter && <Footer />}
  </Screen>
);

MyScreen.propTypes = {
  addHeaderFooter: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired
};

const StyledScreen = styled(MyScreen)`
  display: flex;
  flex-direction: column;
  padding: 0 0.5rem;
  overflow-y: auto;
  
  @media screen and (min-width: 400px) {
    padding: 0 1rem;
  }
  
  @media screen and (min-width: 650px) {
    padding-left: calc(1rem + (100vw - 650px) / 2);
    padding-right: calc(1rem + (100vw - 650px) / 2);
  }
`;

export default StyledScreen;
