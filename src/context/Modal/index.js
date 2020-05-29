import React, { useContext, useRef, useEffect } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import ModalContext from "./context";
import withModalContext from "./withContext";

import Scale from "shared/Transitions/Scale";
import Title from "./Title";
import Body from "./Body";
import Actions from "./Actions";
import Button from "./Button";

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Modal = ({title, buttons, children, className}) => {
  const { hideModal, show } = useContext(ModalContext);
  const { t } = useTranslation();
  const modalRef = useRef(null);
  
  const handleClick = e => {
    if (modalRef.current && !modalRef.current.contains(e.target)) hideModal();
  };
  
  useEffect(() => {
    const html = window.document.documentElement;
    const scrollbarWidth = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    html.style.paddingRight = scrollbarWidth + "px";
    
    return () => {
      html.style.overflow = "auto";
      html.style.paddingRight = "0";
    };
  }, []);

  return (
    <Container onClick={handleClick}>
      <Scale in={show}>
        <div className={className} ref={modalRef}>
          <Title>{title}</Title>
          <Body>{children}</Body>
          <Actions>
            {
              buttons.map((btn, i) => 
                <Button 
                  onClick={btn.action} 
                  className={i === 0 ? "confirm" : ""}
                  key={btn.name}
                >
                  {t(btn.name)}
                </Button>
              )
            }
          </Actions>
        </div>
      </Scale>
    </Container>
  );
};

Modal.propTypes = {
  size: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  buttons: PropTypes.arrayOf(PropTypes.shape(
    {name: PropTypes.string, action: PropTypes.func})
  ).isRequired,
  children: PropTypes.node.isRequired
};

const StyledModal = styled(Modal)`
  position: absolute;
  top: ${({size}) => size === "small" ? "10rem": "7rem"};
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  width: ${({size}) => size === "small" ? "80%": "90%"};
  max-width: ${({size}) => size === "small" ? "350px": "400px"};
  text-align: left;
  background-color: #fffdff;
  border-radius: 0.5rem;
  border: 1px solid #988686;
`;
  
export { ModalContext, withModalContext };
export default StyledModal;
