import PropTypes from "prop-types";
import styled from "styled-components";

const Message = styled.div`
  cursor: default;
  position: absolute;
  top: ${({msgPos}) => msgPos.top + "px"};
  left: ${({msgPos}) => msgPos.left + "px"};
  font-size: 0.6rem;
  margin: 0.4rem 0;
  color: brown;
  width: ${({msgPos}) => msgPos.width + "px"};
  text-align: center;
  opacity: ${({showMsg}) => showMsg ? "1" : "0"};
`;

Message.propTypes = {
  showMsg: PropTypes.bool.isRequired,
  msgPos: PropTypes.object.isRequired
};

export default Message;
