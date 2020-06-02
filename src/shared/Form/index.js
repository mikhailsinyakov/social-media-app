import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { useTranslation } from "react-i18next";

import Input from "./Input";
import Button from "./Button";
import Message from "./Message";
import Loader from "shared/Loader";

const Form = ({
  className,
  type, 
  placeholder, 
  buttonName, 
  action, 
  modifyValue,
  show = true,
  autofocus = true,
  initValue = "",
  defaultMsg = "",
  buttonNameSubmitted = null,
  defaultSubmittedValue = null,
  onSubmitSucceed = null,
  disabled = false
}) => {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const inputRef = useRef(null);
  const selStart = useRef(null);
  const isMount = useRef(false);
  
  const [value, setValue] = useState(initValue);
  const [isValueValid, setIsValueValid] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedValue, setSubmittedValue] = useState(defaultSubmittedValue);
  const [msgPos, setMsgPos] = useState({width: 0, left: 0, top: 0});
  
  const isValueNew = submittedValue !== value;
  const isButtonActive = value && isValueValid && isValueNew && !errorMsg;
  const showMsg = Boolean(value && (!isValueValid || !!errorMsg));
  if (buttonNameSubmitted) {
    buttonName = submittedValue === value ? buttonNameSubmitted : buttonName;
  }
  
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
    let newValue = value, isValid = isValueValid;
    if (modifyValue) {
      ({ newValue, isValid } = modifyValue(value));
      updateSelStart(selIndex, value, newValue);
    }
    
    setValue(newValue);
    setIsValueValid(isValid);
    setErrorMsg(null);
  };
  
  const submit = async () => {
    if (value && isButtonActive) {
      setIsSubmitting(true);
      try {
        await action(value);
        if (isMount.current) {
          setSubmittedValue(value);
          inputRef.current.blur();
        }
        if (onSubmitSucceed) onSubmitSucceed();
      } catch (e) {
        setErrorMsg(t(e.message));
      } finally {
        isMount.current && setIsSubmitting(false);
      }
    }
  };
  
  const updateMsgPos = useCallback(() => {
    if (showMsg) {
      const formPos = formRef.current.getBoundingClientRect();
      const inputPos = inputRef.current.getBoundingClientRect();
      setMsgPos({ 
        width: inputPos.width, 
        left: inputPos.left - formPos.left, 
        top: inputPos.bottom - formPos.top 
      });
    }
  }, [showMsg, setMsgPos]);
  
  useEffect(() => {
    isMount.current = true;
    return () => {
      isMount.current = false;
    };
  }, []);
  
  useEffect(() => {
    if (selStart.current !== null) {
      const index = selStart.current;
      inputRef.current.setSelectionRange(index, index);
    }
  }, [value]);
  
  useEffect(() => {
    if (show && autofocus) inputRef.current.focus();
    else if (!show) setValue("");
  }, [show, autofocus]);
  
  useEffect(() => {
    updateMsgPos();
    window.addEventListener("resize", updateMsgPos);
    return () => window.removeEventListener("resize", updateMsgPos);
  }, [updateMsgPos]);
  
  return (
    <form 
      ref={formRef}
      className={className} 
      onSubmit={e => {e.preventDefault();}}
    >
      <Input
        type={type} 
        value={value} 
        onChange={updateValue}
        onKeyDown={e => e.key === "Enter" && submit()} 
        placeholder={placeholder}
        disabled={disabled}
        ref={inputRef}
      />
      <Button 
        disabled={!value || !isButtonActive}
        onClick={submit}
      >
        {buttonName}
      </Button>
      <Message 
        showMsg={showMsg} 
        msgPos={msgPos}
      >
        {errorMsg ? errorMsg : defaultMsg}
      </Message>
      <Loader size={30} show={isSubmitting} />
    </form>
  );
};

Form.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  buttonName: PropTypes.string.isRequired,
  action: PropTypes.func.isRequired,
  modifyValue: PropTypes.func,
  show: PropTypes.bool,
  autofocus: PropTypes.bool,
  initValue: PropTypes.string,
  defaultMsg: PropTypes.string,
  buttonNameSubmitted: PropTypes.string,
  defaultSubmittedValue: PropTypes.string,
  onSubmitSucceed: PropTypes.func,
  disabled: PropTypes.bool
};

const StyledForm = styled(Form)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

export default StyledForm;
