import React from "react";
import PropTypes from "prop-types";
import Transitions from "./index";

const Scale = ({in: inProp, children}) => (
  <Transitions 
    in={inProp} 
    cssProp="transform" 
    exitValue="scale(0)" 
    enterValue="scale(1)"
  >
    { children }
  </Transitions>
);

Scale.propTypes = {
  in: PropTypes.bool.isRequired
};

export default Scale;
