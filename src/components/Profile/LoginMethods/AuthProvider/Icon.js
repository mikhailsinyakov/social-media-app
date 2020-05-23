import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Icon = ({className, name}) => (
  <img className={className} src={`img/icons/${name}.png`} alt={name} />
);

Icon.propTypes = {
  name: PropTypes.string.isRequired
};

const StyledIcon = styled(Icon)`
  width: 32px;
`;

export default StyledIcon;
