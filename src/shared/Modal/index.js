import React, { useEffect, useRef} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Title from "./Title";
import Body from "./Body";
import Actions from "./Actions";
import CloseButton from "./CloseButton";

const Modal = ({type, title, body, close, closeBtnName, className}) => {
  const elem = useRef(null);

  useEffect(() => {
    const handleClick = e => {
      if (elem.current && !elem.current.contains(e.target)) close();
    };
    window.setTimeout(() => {
      window.addEventListener("click", handleClick);
    }, 500);
    
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [close]);

  return (
    <div className={className} ref={elem}>
      <Title>{title}</Title>
      <Body>{body}</Body>
      <Actions>
        <CloseButton onClick={close}>{closeBtnName}</CloseButton>
      </Actions>
    </div>
  );
};

Modal.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  close: PropTypes.func.isRequired,
  closeBtnName: PropTypes.string.isRequired
};

const StyledModal = styled(Modal)`
  position: absolute;
  top: ${({type}) => type === "error" ? "5rem": "2rem"};
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  width: ${({type}) => type === "error" ? "80%": "100%"};
  ${({type}) => type === "error" && "max-width: 350px"};
  text-align: left;
  background-color: #fffdff;
  border-radius: 0.5rem;
  border: 1px solid #988686;
`;

export default StyledModal;
