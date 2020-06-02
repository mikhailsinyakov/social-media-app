import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Fade from "shared/Transitions/Fade";

const Loader = ({show, className}) => (
  <Fade in={show}>
    <div className={className} data-testid="loader"></div>
  </Fade>
);

Loader.propTypes = {
  show: PropTypes.bool.isRequired,
  size: PropTypes.number.isRequired,
  expand: PropTypes.bool
};

const StyledLoader = styled(Loader)`
  flex-shrink: 0;
  margin: 0 0.5rem;
  border: ${({size}) => size / 7.5 * 0.8}px solid #f3f3f3;
  border-top-color: #3498db;
  border-radius: 50%;
  width: ${({size}) => size * 0.8}px;
  height: ${({size}) => size * 0.8}px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  ${({expand, size}) => (expand === undefined || expand) && 
    `
      @media screen and (min-width: 400px) {
        border: ${size / 7.5}px solid #f3f3f3;
        border-top-color: #3498db;
        width: ${size}px;
        height: ${size}px;
      }
    `
  }
`;

export default StyledLoader;
