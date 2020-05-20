import React, { useContext, useRef, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import ModalContext from "./context";
import withModalContext from "./withContext";

import Title from "./Title";
import Body from "./Body";
import Actions from "./Actions";
import Button from "./Button";

const Modal = ({title, buttons, children, className}) => {
  const { setModal } = useContext(ModalContext);
  const { t } = useTranslation();
  const elem = useRef(null);

  useEffect(() => {
    const handleClick = e => {
      if (elem.current && !elem.current.contains(e.target)) setModal(null);
    };
    window.setTimeout(() => {
      window.addEventListener("click", handleClick);
    }, 500);
    
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [setModal]);

  return (
    <div className={className} ref={elem}>
      <Title>{title}</Title>
      <Body>{children}</Body>
      <Actions>
        {
          buttons.map(btn => 
            <Button onClick={btn.action} key={btn.name}>{t(btn.name)}</Button>
          )
        }
      </Actions>
    </div>
  );
};

Modal.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.shape(
    {name: PropTypes.string, action: PropTypes.func})
  ).isRequired,
  children: PropTypes.node.isRequired
};

const StyledModal = styled(Modal)`
  position: fixed;
  top: ${({type}) => type === "error" ? "10rem": "7rem"};
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  width: ${({type}) => type === "error" ? "80%": "90%"};
  max-width: ${({type}) => type === "error" ? "350px": "700px"};
  text-align: left;
  background-color: #fffdff;
  border-radius: 0.5rem;
  border: 1px solid #988686;
`;
  
export { ModalContext, withModalContext };
export default StyledModal;
