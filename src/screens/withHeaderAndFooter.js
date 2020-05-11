import React from "react";
import styled from "styled-components";
import Header from "components/Header";
import Footer from "components/Footer";

const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const withHeaderAndFooter = Component => props => 
  <Page>
    <Header />
    <Component {...props} />
    <Footer />
  </Page>;
  
export default withHeaderAndFooter;
