import React from "react";
import PropTypes from "prop-types";
import { Transition } from "react-transition-group";

const duration = 300;

const Transitions = ({in: inProp, cssProp, exitValue, enterValue, children}) => {
  const defaultStyle = {
    transition: `${cssProp} ${duration}ms ease-in-out`,
    [cssProp]: exitValue
  };

  const transitionStyles = {
    entering: { [cssProp]: enterValue },
    entered:  { [cssProp]: enterValue },
    exiting:  { [cssProp]: exitValue },
    exited:  { [cssProp]: exitValue }
  };
  
  return (
    <Transition in={inProp} timeout={duration}>
      {
        state => (
          <div style={{
            ...defaultStyle,
            ...transitionStyles[state]
          }}>
            {children}
          </div>
        )
      }
    </Transition>
  );
};

Transitions.propTypes = {
  in: PropTypes.bool.isRequired,
  cssProp: PropTypes.string.isRequired,
  exitValue: PropTypes.string.isRequired,
  enterValue: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
}

export default Transitions;
