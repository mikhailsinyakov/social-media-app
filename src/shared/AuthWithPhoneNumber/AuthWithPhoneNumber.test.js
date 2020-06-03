import React from "react";
import ReactDOM from "react-dom";
import { render, fireEvent, act, cleanup, wait } from "@testing-library/react";

import { FirebaseContext } from "context/Firebase";
import AuthWithPhoneNumber from "./index";

afterEach(cleanup);

const checkCode = code => {
  return new Promise((resolve, reject) => {
    if (code === "123456") resolve();
    else reject(new Error("Not valid code"));
  });
};

const firebase = {
  auth: {
    sendSMSCode: jest.fn(),
    loginWithPhoneNumber: jest.fn(checkCode),
    changePhoneNumber: jest.fn(checkCode),
    linkPhoneNumber: jest.fn(checkCode),
    reauthenticate: jest.fn(checkCode),
    deleteAccount: jest.fn(),
    createRecaptchaVerifier: jest.fn()
  }
};

it("renders without crashing", () => {
  render(
    <FirebaseContext.Provider value={firebase}>
      <AuthWithPhoneNumber
        type="login"
      />
    </FirebaseContext.Provider>
  );
});

it("renders correctly", () => {
  const { getByText, getByPlaceholderText, getByTestId } = render(
    <FirebaseContext.Provider value={firebase}>
      <AuthWithPhoneNumber
        type="login"
      />
    </FirebaseContext.Provider>
  );
  
  expect(getByText(/loginByPhoneNumberMsg/i)).toBeInTheDocument();
  expect(getByPlaceholderText(/phoneNumber/i)).toBeVisible();
  expect(getByText(/^getCode$/i)).toBeVisible();
  expect(getByTestId(/transform/i)).toHaveStyle("transform: scale(0)");
});

it("if phoneNumber prop is exist, input value is phoneNumber and input is disabled", () => {
  const { getByPlaceholderText } = render(
    <FirebaseContext.Provider value={firebase}>
      <AuthWithPhoneNumber
        type="login"
        phoneNumber="+79150000000"
      />
    </FirebaseContext.Provider>
  );
  
  expect(getByPlaceholderText(/phoneNumber/i)).toHaveValue("+79150000000");
  expect(getByPlaceholderText(/phoneNumber/i)).toBeDisabled();
});

it("when phone number is valid, the user can send SMS", async () => {
  const { getByText, getByPlaceholderText, getByTestId } = render(
    <FirebaseContext.Provider value={firebase}>
      <AuthWithPhoneNumber
        type="login"
      />
    </FirebaseContext.Provider>
  );
  
  const phoneNumInput = getByPlaceholderText(/phoneNumber/i);
  expect(phoneNumInput).toHaveValue("");
  fireEvent.change(phoneNumInput, {target: {value: "+79150000000"}});
  expect(phoneNumInput).toHaveValue("+79150000000");
  expect(getByText(/^getCode$/i)).toBeEnabled();
  await act(async () => {
    await fireEvent.click(getByText(/^getCode$/i));
  });
  expect(firebase.auth.sendSMSCode).toHaveBeenCalledTimes(1);
  expect(firebase.auth.sendSMSCode).toHaveBeenCalledWith("+79150000000");
  expect(getByText(/^getCode$/i)).toBeDisabled();
  expect(getByTestId(/transform/i)).toHaveStyle("transform: scale(1)");
  
  // When the user changes phone number second form should be hide
  fireEvent.change(phoneNumInput, {target: {value: "+7915000000"}});
  expect(getByTestId(/transform/i)).toHaveStyle("transform: scale(0)");
  // When the user returns to submitted phone number second form should be visible
  fireEvent.change(phoneNumInput, {target: {value: "+79150000000"}});
  expect(getByTestId(/transform/i)).toHaveStyle("transform: scale(1)");
  expect(getByPlaceholderText(/smscode/i)).toBeEnabled();
  
  firebase.auth.sendSMSCode.mockClear();
});

it("if the user entered not correct code, loginWithPhoneNumber called and error message is shown", async () => {
  const { getByText, getByPlaceholderText } = render(
    <FirebaseContext.Provider value={firebase}>
      <AuthWithPhoneNumber
        type="login"
        phoneNumber="+79150000000"
      />
    </FirebaseContext.Provider>
  );
  
  expect(getByText(/^getCode$/i)).toBeEnabled();
  await act(async () => {
    await fireEvent.click(getByText(/^getCode$/i));
  });
  expect(getByPlaceholderText(/smscode/i)).toBeEnabled();
  expect(getByText(/^login$/i)).toBeDisabled();
  fireEvent.change(getByPlaceholderText(/smscode/i), { target: { value: "545" }});
  expect(getByText(/^login$/i)).toBeEnabled();
  await act(async () => {
    await fireEvent.click(getByText(/^login$/i));
  });
  expect(firebase.auth.loginWithPhoneNumber).toHaveBeenCalledTimes(1);
  expect(firebase.auth.loginWithPhoneNumber).toHaveBeenCalledWith("545");
  expect(getByText(/not valid code/i)).toBeInTheDocument();
  expect(getByText(/not valid code/i)).toBeVisible();
  
  firebase.auth.sendSMSCode.mockClear();
});

it("if the user entered correct code, onSuccess calls", async () => {
  const onSuccessMock = jest.fn();
  const { getByText, getByPlaceholderText } = render(
    <FirebaseContext.Provider value={firebase}>
      <AuthWithPhoneNumber
        type="login"
        phoneNumber="+79150000000"
        onSuccess={onSuccessMock}
      />
    </FirebaseContext.Provider>
  );
  
  expect(getByText(/^getCode$/i)).toBeEnabled();
  await act(async () => {
    await fireEvent.click(getByText(/^getCode$/i));
  });
  expect(getByPlaceholderText(/smscode/i)).toBeEnabled();
  expect(getByText(/^login$/i)).toBeDisabled();
  fireEvent.change(getByPlaceholderText(/smscode/i), { target: { value: "123456" }});
  expect(getByText(/^login$/i)).toBeEnabled();
  expect(getByPlaceholderText(/phoneNumber/i)).toHaveValue("+79150000000");
  await act(async () => {
    await fireEvent.click(getByText(/^login$/i));
  });
  expect(onSuccessMock).toHaveBeenCalledTimes(1);
  expect(onSuccessMock).toHaveBeenCalledWith("+79150000000");
  
  firebase.auth.sendSMSCode.mockClear();
});

it("the user can send code again", async () => {
  const { getByText, getByPlaceholderText } = render(
    <FirebaseContext.Provider value={firebase}>
      <AuthWithPhoneNumber
        type="login"
        phoneNumber="+79150000000"
      />
    </FirebaseContext.Provider>
  );
  
  expect(getByText(/^getCode$/i)).toBeEnabled();
  await act(async () => {
    await fireEvent.click(getByText(/^getCode$/i));
  });
  expect(getByPlaceholderText(/smscode/i)).toBeEnabled();
  expect(getByText(/sendagain/i)).toBeInTheDocument();
  expect(getByText(/sendagain/i)).toBeVisible();
  await act(async () => {
    await fireEvent.click(getByText(/sendagain/i));
  });
  expect(firebase.auth.sendSMSCode).toHaveBeenCalledTimes(2);
  
  firebase.auth.sendSMSCode.mockClear();
});

it("correctly calls function when type is change", async () => {
  const { getByText, getByPlaceholderText } = render(
    <FirebaseContext.Provider value={firebase}>
      <AuthWithPhoneNumber
        type="change"
        phoneNumber="+79150000000"
      />
    </FirebaseContext.Provider>
  );
  
  expect(getByText(/^getCode$/i)).toBeEnabled();
  await act(async () => {
    await fireEvent.click(getByText(/^getCode$/i));
  });
  expect(getByPlaceholderText(/smscode/i)).toBeEnabled();
  fireEvent.change(getByPlaceholderText(/smscode/i), { target: { value: "123456" }});
  await act(async () => {
    await fireEvent.click(getByText(/^change$/i));
  });
  expect(firebase.auth.changePhoneNumber).toHaveBeenCalledTimes(1);
  expect(firebase.auth.changePhoneNumber).toHaveBeenCalledWith("123456");
  
  firebase.auth.sendSMSCode.mockClear();
});

it("correctly calls function when type is link", async () => {
  const { getByText, getByPlaceholderText } = render(
    <FirebaseContext.Provider value={firebase}>
      <AuthWithPhoneNumber
        type="link"
        phoneNumber="+79150000000"
      />
    </FirebaseContext.Provider>
  );
  
  expect(getByText(/^getCode$/i)).toBeEnabled();
  await act(async () => {
    await fireEvent.click(getByText(/^getCode$/i));
  });
  expect(getByPlaceholderText(/smscode/i)).toBeEnabled();
  fireEvent.change(getByPlaceholderText(/smscode/i), { target: { value: "123456" }});
  await act(async () => {
    await fireEvent.click(getByText(/^link$/i));
  });
  expect(firebase.auth.linkPhoneNumber).toHaveBeenCalledTimes(1);
  expect(firebase.auth.linkPhoneNumber).toHaveBeenCalledWith("123456");
  
  firebase.auth.sendSMSCode.mockClear();
});

it("correctly calls function when type is check", async () => {
  const { getByText, getByPlaceholderText } = render(
    <FirebaseContext.Provider value={firebase}>
      <AuthWithPhoneNumber
        type="check"
        phoneNumber="+79150000000"
      />
    </FirebaseContext.Provider>
  );
  
  expect(getByText(/^getCode$/i)).toBeEnabled();
  await act(async () => {
    await fireEvent.click(getByText(/^getCode$/i));
  });
  expect(getByPlaceholderText(/smscode/i)).toBeEnabled();
  fireEvent.change(getByPlaceholderText(/smscode/i), { target: { value: "123456" }});
  await act(async () => {
    await fireEvent.click(getByText(/^check$/i));
  });
  expect(firebase.auth.reauthenticate).toHaveBeenCalledTimes(1);
  expect(firebase.auth.reauthenticate).toHaveBeenCalledWith("123456");
  expect(firebase.auth.deleteAccount).toHaveBeenCalledTimes(1);
  
  firebase.auth.sendSMSCode.mockClear();
});
