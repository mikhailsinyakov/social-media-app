import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import Input from "./Input";
import Button from "./Button";
import Loader from "shared/Loader";

const Form = ({
  className,
  show,
  type, 
  placeholder, 
  changeValue, 
  isButtonActive,
  showMsg,
  buttonName, 
  action, 
  defaultMsg,
  submitErrorMsg,
  valueHasChanged,
  isSubmitting
}) => {
  const inputEl = useRef(null);
  const selStart = useRef(0);
  
  const [value, setValue] = useState("");
  
  const updateSelStart = (selIndex, value, changedValue) => {
    const digitsBeforeCursor = value.slice(0, selIndex)
                                      .replace(/\D/g, "").length;
    let digitsPassed = 0, i = 0;
    for (; i < changedValue.length; i++) {
      if (changedValue[i].match(/\d/)) {
        if (digitsBeforeCursor === digitsPassed) break;
        else digitsPassed++;
      }
    }
    
    selStart.current = i;
  };
  
  const updateValue = e => {
    const { selectionStart: selIndex, value } = e.target;
    let changedValue = value;
    if (changeValue) changedValue = changeValue(value);
    updateSelStart(selIndex, value, changedValue);
    valueHasChanged();
    
    setValue(changedValue);
  };
  
  const submit = () => {
    if (value && isButtonActive) action(value);
  };
  
  useEffect(() => {
    if (inputEl.current.type !== "number") {
      const index = selStart.current;
      inputEl.current.setSelectionRange(index, index);
    }
  }, [value]);
  
  useEffect(() => {
    if (show) inputEl.current.focus();
    else setValue("");
  }, [show]);
  
  return (
    <form className={className} onSubmit={e => {e.preventDefault();}}>
      <Input
        type={type} 
        value={value} 
        onChange={updateValue}
        onKeyDown={e => e.key === "Enter" && submit()} 
        placeholder={placeholder}
        ref={inputEl}
      />
      <Button 
        onClick={submit} 
        className={value && isButtonActive ? "active": ""}
        showMsg={value && showMsg}
        message={submitErrorMsg ? submitErrorMsg : defaultMsg}
      >
        {buttonName}
      </Button>
      <Loader size={30} show={isSubmitting} />
    </form>
  );
};

Form.propTypes = {
  show: PropTypes.bool.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  changeValue: PropTypes.func,
  isButtonActive: PropTypes.bool.isRequired,
  showMsg: PropTypes.bool.isRequired,
  buttonName: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  defaultMsg: PropTypes.string.isRequired,
  submitErrorMsg: PropTypes.string.isRequired,
  valueHasChanged: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool.isRequired
};

const StyledForm = styled(Form)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  opacity: ${({show}) => show ? "1" : "0"};
`;

export default StyledForm;
