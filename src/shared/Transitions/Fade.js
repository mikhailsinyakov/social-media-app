import React from "react";
import PropTypes from "prop-types";
import Transitions from "./index";

const Fade = ({in: inProp, children}) => (
  <Transitions 
    in={inProp} 
    cssProp="opacity"
    exitValue="0" 
    enterValue="1"
  >
    { children }
  </Transitions>
);

Fade.propTypes = {
  in: PropTypes.bool.isRequired
};

export default Fade;
