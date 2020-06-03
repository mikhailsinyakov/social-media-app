import React from "react";
import ReactDOM from "react-dom";
import { render, fireEvent, cleanup } from "@testing-library/react";

import { FirebaseContext } from "context/Firebase";
import { UserContext } from "context/User";
import Header from "./index";

const firebase = {
  auth: {
    logOut: jest.fn()
  }
};

const user = {
  username: "@username"
};

afterEach(cleanup);

it("renders without crashing", () => {
  render(
    <FirebaseContext.Provider value={firebase}>
      <UserContext.Provider value={{user}}>
        <Header />
      </UserContext.Provider>
    </FirebaseContext.Provider>
  );
});

it("renders correctly", () => {
  const {getByText, getByAltText } = render(
    <FirebaseContext.Provider value={firebase}>
      <UserContext.Provider value={{user}}>
        <Header />
      </UserContext.Provider>
    </FirebaseContext.Provider>
  );
  
  expect(getByAltText(/app-logo/i)).toBeInTheDocument();
  expect(getByText(/feed/i)).toBeInTheDocument();
  expect(getByText(/profile/i)).toBeInTheDocument();
  expect(getByText(/logout/i)).toBeInTheDocument();
});

it("if user is not logged in don't show component", () => {
  const {queryByText, queryByAltText } = render(
    <FirebaseContext.Provider value={firebase}>
      <UserContext.Provider value={{user: null}}>
        <Header />
      </UserContext.Provider>
    </FirebaseContext.Provider>
  );
  
  expect(queryByAltText(/app-logo/i)).not.toBeInTheDocument();
  expect(queryByText(/feed/i)).not.toBeInTheDocument();
  expect(queryByText(/profile/i)).not.toBeInTheDocument();
  expect(queryByText(/logout/i)).not.toBeInTheDocument();
});

it("if the user clicks logout button calls firebase.auth.logOut", () => {
  const { getByText } = render(
    <FirebaseContext.Provider value={firebase}>
      <UserContext.Provider value={{user}}>
        <Header />
      </UserContext.Provider>
    </FirebaseContext.Provider>
  );
  
  expect(getByText(/logout/i)).toBeInTheDocument();
  fireEvent.click(getByText(/logout/i));
  expect(firebase.auth.logOut).toHaveBeenCalledTimes(1);
});
