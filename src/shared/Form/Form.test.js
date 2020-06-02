import React from "react";
import ReactDOM from "react-dom";
import { render, fireEvent, act, cleanup, wait } from "@testing-library/react";

import Form from "./index";

afterEach(cleanup);

it ("renders without crashing", () => {
  render(
    <Form
      type="text"
      placeholder="Enter a text here"
      buttonName="Submit"
      action={() => {}}
    />
  );
});

it("renders initial form correctly", () => {
  const { getByPlaceholderText, getByText } = render(
    <Form
      type="text"
      placeholder="Enter a text here"
      buttonName="Submit"
      action={jest.fn()}
    />
  );
  
  expect(getByPlaceholderText(/enter/i)).toHaveValue("");
  expect(getByPlaceholderText(/enter/i).placeholder).toBe("Enter a text here");
  expect(getByText(/submit/i)).toHaveTextContent("Submit");
  expect(getByPlaceholderText(/enter/i)).toHaveFocus();
  expect(getByText(/submit/i)).toBeDisabled();
});

it("inputing text updates input value", () => {
  const { getByPlaceholderText, getByText } = render(
    <Form
      type="text"
      placeholder="Enter a text here"
      buttonName="Submit"
      action={() => {}}
    />
  );
  
  expect(getByPlaceholderText(/enter/i)).toHaveValue("");
  fireEvent.change(getByPlaceholderText(/enter/i), { target: { value: "Text" }});
  expect(getByPlaceholderText(/enter/i)).toHaveValue("Text");
});

it("modifyValue modifies value and don't make the button active", async () => {
  const modifyValueMock = jest.fn(value => ({
    newValue: value.toUpperCase(),
    isValid: value.length > 3
  }));
  
  const { getByPlaceholderText, getByText } = render(
    <Form
      type="text"
      placeholder="Enter a text here"
      buttonName="Submit"
      action={jest.fn()}
      modifyValue={modifyValueMock}
      defaultMsg="Default message"
    />
  );
  
  expect(getByPlaceholderText(/enter/i)).toHaveValue("");
  expect(getByText(/default message/i)).not.toBeVisible();
  fireEvent.change(getByPlaceholderText(/enter/i), { target: { value: "hi" }});
  expect(modifyValueMock).toHaveBeenCalledTimes(1);
  expect(modifyValueMock).toHaveBeenCalledWith("hi");
  expect(getByText(/default message/i)).toBeVisible();
  expect(getByPlaceholderText(/enter/i)).toHaveValue("HI");
  expect(getByText(/submit/i)).toBeDisabled();
});

it("modifyValue modifies value and make the button active", async () => {
  const actionMock = jest.fn(() => Promise.resolve());
  const modifyValueMock = jest.fn(value => ({
    newValue: value.toUpperCase(),
    isValid: value.length > 3
  }));
  
  const { getByPlaceholderText, getByText } = render(
    <Form
      type="text"
      placeholder="Enter a text here"
      buttonName="Submit"
      action={jest.fn()}
      modifyValue={modifyValueMock}
    />
  );
  
  fireEvent.change(getByPlaceholderText(/enter/i), { target: { value: "hello" }});
  expect(modifyValueMock).toHaveBeenCalledTimes(1);
  expect(modifyValueMock).toHaveBeenCalledWith("hello");
  expect(getByPlaceholderText(/enter/i)).toHaveValue("HELLO");
  expect(getByText(/submit/i)).toBeEnabled();
});

it("correct behavior when action call was successful", async () => {
  const actionMock = jest.fn(() => Promise.resolve());
  const onSubmitSucceedMock = jest.fn();
  
  const { getByPlaceholderText, getByText, getByTestId } = render(
    <Form
      type="text"
      placeholder="Enter a text here"
      buttonName="Submit"
      action={actionMock}
      onSubmitSucceed={onSubmitSucceedMock}
    />
  );
  
  fireEvent.change(getByPlaceholderText(/enter/i), { target: { value: "hello" }});
  expect(getByText(/submit/i)).toBeEnabled();
  expect(getByTestId("loader")).not.toBeVisible();
  fireEvent.click(getByText(/submit/i));
  expect(getByTestId("loader")).toBeVisible();
  await wait(() => {
    expect(getByTestId("loader")).not.toBeVisible();
  });
  expect(actionMock).toHaveBeenCalledTimes(1);
  expect(actionMock).toHaveBeenCalledWith("hello");
  expect(onSubmitSucceedMock).toHaveBeenCalledTimes(1);
  
  expect(getByPlaceholderText(/enter/i)).not.toHaveFocus();
  expect(getByText(/submit/i)).toBeDisabled();
});

it("correct behavior when action function throws an error", async () => {
  const actionMock = jest.fn(() => Promise.reject(new Error("Fatal error")));
  
  const { getByPlaceholderText, queryByText, getByText, getByTestId } = render(
    <Form
      type="text"
      placeholder="Enter a text here"
      buttonName="Submit"
      action={actionMock}
    />
  );
  
  fireEvent.change(getByPlaceholderText(/enter/i), { target: { value: "hello" }});
  expect(getByText(/submit/i)).toBeEnabled();
  expect(getByTestId("loader")).not.toBeVisible();
  expect(queryByText(/fatal error/i)).not.toBeInTheDocument();
  fireEvent.click(getByText(/submit/i));
  expect(getByTestId("loader")).toBeVisible();
  await wait(() => {
    expect(getByTestId("loader")).not.toBeVisible();
  });
  expect(actionMock).toHaveBeenCalledTimes(1);
  expect(actionMock).toHaveBeenCalledWith("hello");
  
  expect(getByTestId("loader")).not.toBeVisible();
  expect(getByPlaceholderText(/enter/i)).toHaveFocus();
  expect(getByText(/submit/i)).toBeDisabled();
  expect(getByText(/fatal error/i)).toBeInTheDocument();
});

it("input doesn't have focus when autofocus is false", () => {
  const { getByPlaceholderText } = render(
    <Form
      type="text"
      placeholder="Enter a text here"
      buttonName="Submit"
      action={jest.fn()}
      autofocus={false}
    />
  );
  
  expect(getByPlaceholderText(/enter/i)).not.toHaveFocus();
});

it("input has initial value", () => {
  const { getByPlaceholderText } = render(
    <Form
      type="text"
      placeholder="Enter a text here"
      buttonName="Submit"
      action={jest.fn()}
      initValue="Initial value"
    />
  );
  
  expect(getByPlaceholderText(/enter/i)).toHaveValue("Initial value");
});

it("button changes name when the form was submitted", async () => {
  const { getByText, getByPlaceholderText } = render(
    <Form
      type="text"
      placeholder="Enter a text here"
      buttonName="Submit"
      action={jest.fn()}
      buttonNameSubmitted="Submitted"
    />
  );
  
  expect(getByText(/submit/i)).toHaveTextContent("Submit");
  fireEvent.change(getByPlaceholderText(/enter/i), { target: { value: "Hey" }});
  await act(async () => {
    await fireEvent.click(getByText(/submit/i));
  });
  expect(getByText(/submit/i)).toHaveTextContent("Submitted");
});

it("button changes name when the input value is the defaultSubmittedValue", async () => {
  const { getByText, getByPlaceholderText } = render(
    <Form
      type="text"
      placeholder="Enter a text here"
      buttonName="Submit"
      action={jest.fn()}
      buttonNameSubmitted="Submitted"
      defaultSubmittedValue="I am already submitted"
    />
  );
  
  expect(getByText(/submit/i)).toHaveTextContent("Submit");
  fireEvent.change(
    getByPlaceholderText(/enter/i), 
    { target: { value: "I am already submitted" }}
  );
  expect(getByText(/submit/i)).toHaveTextContent("Submitted");
});

it("input is disabled if disabled prop is true", async () => {
  const { getByText, getByPlaceholderText } = render(
    <Form
      type="text"
      placeholder="Enter a text here"
      buttonName="Submit"
      action={jest.fn()}
      disabled={true}
    />
  );
  
  expect(getByPlaceholderText(/enter/i)).toBeDisabled();
});
