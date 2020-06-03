import React from "react";
import ReactDOM from "react-dom";
import { render, fireEvent, cleanup } from "@testing-library/react";

import { FirebaseContext } from "context/Firebase";
import Login from "./index";

const firebase = {
  auth: {
    createRecaptchaVerifier: jest.fn(),
    loginWithGoogle: jest.fn(),
    loginWithGithub: jest.fn()
  }
};

afterEach(cleanup);

it("renders without crashing", () => {
  render(
    <FirebaseContext.Provider value={firebase}>
      <Login />
    </FirebaseContext.Provider>
  );
});

it("renders correctly", () => {
  const { getByText, getByPlaceholderText, getByAltText } = render(
    <FirebaseContext.Provider value={firebase}>
      <Login />
    </FirebaseContext.Provider>
  );
  
  expect(getByText(/^loginByPhoneNumber$/i)).toBeInTheDocument();
  expect(getByPlaceholderText(/^phoneNumber$/i)).toBeInTheDocument();
  expect(getByText(/^getCode$/i)).toBeInTheDocument();
  expect(getByAltText(/google-logo/i)).toBeInTheDocument();
  expect(getByText(/^signInWithGoogle$/i)).toBeInTheDocument();
  expect(getByAltText(/github-logo/i)).toBeInTheDocument();
  expect(getByText(/^signInWithGithub$/i)).toBeInTheDocument();
});

it("when the user clicks on buttons calls appropriate functions", () => {
  const { getByText, getByAltText } = render(
    <FirebaseContext.Provider value={firebase}>
      <Login />
    </FirebaseContext.Provider>
  );
  
  fireEvent.click(getByAltText(/google-logo/i));
  expect(firebase.auth.loginWithGoogle).toHaveBeenCalledTimes(1);
  fireEvent.click(getByText(/^signInWithGoogle$/i));
  expect(firebase.auth.loginWithGoogle).toHaveBeenCalledTimes(2);
  fireEvent.click(getByAltText(/github-logo/i));
  expect(firebase.auth.loginWithGithub).toHaveBeenCalledTimes(1);
  fireEvent.click(getByText(/^signInWithGithub$/i));
  expect(firebase.auth.loginWithGithub).toHaveBeenCalledTimes(2);
});
