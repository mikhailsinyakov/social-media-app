import React, { useEffect, useRef} from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Title from "./Title";
import Description from "./Description";
import Actions from "./Actions";
import CloseButton from "./CloseButton";

const Modal = ({title, description, close, className}) => {
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
      <Description>{description}</Description>
      <Actions>
        <CloseButton onClick={close}>Close</CloseButton>
      </Actions>
    </div>
  );
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired
};

const StyledModal = styled(Modal)`
  position: absolute;
  top: 5rem;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  max-width: 350px;
  text-align: left;
  background-color: #fffdff;
  border-radius: 0.5rem;
  border: 1px solid #988686;
`;

export default StyledModal;
