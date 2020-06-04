import React from "react";
import ReactDOM from "react-dom";
import { render, fireEvent, cleanup, act, wait } from "@testing-library/react";

import { UserContext } from "context/User";
import { FirebaseContext } from "context/Firebase";
import { ModalContext } from "context/Modal";
import Profile from "./index";

const user = {
  username: "@username",
  photoURL: "http://path/to/photo",
  providerData: [
    { providerId: "phone", uid: "+79150000000" },
    { providerId: "github.com", displayName: "Test github user" }
  ]
};

const firebase = {
  auth: {
    updateUsername: jest.fn(),
    linkProvider: jest.fn(),
    unlinkProvider: jest.fn(() => Promise.resolve())
  }
};

const modal = {
  setModal: jest.fn()
};

afterEach(cleanup);

it("renders without crashing", () => {
  render(
    <UserContext.Provider value={{user}}>
      <FirebaseContext.Provider value={firebase}>
        <ModalContext.Provider value={modal}>
          <Profile />
        </ModalContext.Provider>
      </FirebaseContext.Provider>
    </UserContext.Provider>
  );
});

it("renders correctly", () => {
  const { 
    getByTestId, getByText, getByPlaceholderText, getByAltText } = render(
    <UserContext.Provider value={{user}}>
      <FirebaseContext.Provider value={firebase}>
        <ModalContext.Provider value={modal}>
          <Profile />
        </ModalContext.Provider>
      </FirebaseContext.Provider>
    </UserContext.Provider>
  );
  
  expect(getByTestId(/photo/i)).toBeInTheDocument();
  expect(getByTestId(/photo/i).src).toBe("http://path/to/photo");
  expect(getByText(/@username/i)).toBeInTheDocument();
  expect(getByPlaceholderText(/username/i)).toHaveValue("@username");
  expect(getByText(/saved/i)).toBeInTheDocument();
  expect(getByText(/saved/i)).toBeDisabled();
  expect(getByText(/loginMethods/i)).toBeInTheDocument();
  expect(getByAltText(/phone/i)).toBeInTheDocument();
  expect(getByText(/79150000000/i)).toBeInTheDocument();
  expect(getByTestId(/phone-button/i)).toHaveTextContent("unlink");
  expect(getByAltText(/google/i)).toBeInTheDocument();
  expect(getByText(/notLinked/i)).toBeInTheDocument();
  expect(getByTestId(/google\.com-button/i)).toHaveTextContent("link");
  expect(getByAltText(/github/i)).toBeInTheDocument();
  expect(getByText(/test github user/i)).toBeInTheDocument();
  expect(getByTestId(/github\.com-button/i)).toHaveTextContent("unlink");
  expect(getByText(/deleteAccount/i)).toBeInTheDocument();
});

it("renders correctly if username is null", () => {
  const { getByText, getByPlaceholderText } = render(
    <UserContext.Provider value={{user: {...user, username: null}}}>
      <FirebaseContext.Provider value={firebase}>
        <ModalContext.Provider value={modal}>
          <Profile />
        </ModalContext.Provider>
      </FirebaseContext.Provider>
    </UserContext.Provider>
  );
  
  expect(getByText(/needToAddUsername/i)).toBeInTheDocument();
  expect(getByPlaceholderText(/username/i)).toHaveValue("");
  expect(getByText(/saved/i)).toBeInTheDocument();
  expect(getByText(/saved/i)).toBeDisabled();
});

it("renders correctly if photo was not added", () => {
  const { getByTestId } = render(
    <UserContext.Provider value={{user: {...user, photoURL: null}}}>
      <FirebaseContext.Provider value={firebase}>
        <ModalContext.Provider value={modal}>
          <Profile />
        </ModalContext.Provider>
      </FirebaseContext.Provider>
    </UserContext.Provider>
  );
  
  expect(getByTestId(/photo/i)).toBeInTheDocument();
  expect(getByTestId(/photo/i).src).toBe("http://localhost/img/default-photo.png");
});

it("the user can change username", async () => {
  const { getByText, queryByText, getByPlaceholderText } = render(
    <UserContext.Provider value={{user: {...user, username: null}}}>
      <FirebaseContext.Provider value={firebase}>
        <ModalContext.Provider value={modal}>
          <Profile />
        </ModalContext.Provider>
      </FirebaseContext.Provider>
    </UserContext.Provider>
  );
  const usernameInput = getByPlaceholderText(/username/i);
  expect(usernameInput).toHaveValue("");
  expect(queryByText(/^save$/i)).not.toBeInTheDocument();
  fireEvent.change(usernameInput, { target: { value: "HI" }});
  expect(usernameInput).toHaveValue("@hi");
  expect(getByText(/^save$/i)).toBeInTheDocument();
  expect(getByText(/^save$/i)).toBeDisabled();
  fireEvent.change(usernameInput, { target: { value: "Hello" }});
  expect(usernameInput).toHaveValue("@hello");
  expect(getByText(/^save$/i)).toBeEnabled();
  await act(async () => {
    fireEvent.click(getByText(/^save$/i));
  });
  expect(firebase.auth.updateUsername).toHaveBeenCalledTimes(1);
  expect(firebase.auth.updateUsername).toHaveBeenCalledWith("@hello");
  expect(getByText(/saved/i)).toBeInTheDocument();
  expect(getByText(/saved/i)).toBeDisabled();
});

it("the user can link provider", () => {
  const { getByTestId } = render(
    <UserContext.Provider value={{user}}>
      <FirebaseContext.Provider value={firebase}>
        <ModalContext.Provider value={modal}>
          <Profile />
        </ModalContext.Provider>
      </FirebaseContext.Provider>
    </UserContext.Provider>
  );
  
  expect(getByTestId(/google\.com-button/i)).toHaveTextContent("link");
  fireEvent.click(getByTestId(/google\.com-button/i));
  expect(firebase.auth.linkProvider).toHaveBeenCalledTimes(1);
  expect(firebase.auth.linkProvider).toHaveBeenCalledWith("google.com");
});

it("the user can unlink provider", async () => {
  const updateUser = jest.fn();
  
  const { getByTestId, getAllByTestId } = render(
    <UserContext.Provider value={{user, updateUser}}>
      <FirebaseContext.Provider value={firebase}>
        <ModalContext.Provider value={modal}>
          <Profile />
        </ModalContext.Provider>
      </FirebaseContext.Provider>
    </UserContext.Provider>
  );
  
  expect(getByTestId(/github\.com-button/i)).toHaveTextContent("unlink");
  fireEvent.click(getByTestId(/github\.com-button/i));
  expect(getAllByTestId("loader")).toHaveLength(3);
  expect(getAllByTestId("loader")[2]).toBeVisible();
  expect(firebase.auth.unlinkProvider).toHaveBeenCalledTimes(1);
  expect(firebase.auth.unlinkProvider).toHaveBeenCalledWith("github.com");
  await wait(() => expect(getAllByTestId("loader")[2]).not.toBeVisible());
  expect(updateUser).toHaveBeenCalledTimes(1);
  firebase.auth.unlinkProvider.mockClear();
});

it("if error occured when trying to unlink provider, call setModal", async () => {
  const firebase = {
    auth: {
      unlinkProvider: jest.fn(() => Promise.reject(new Error("Fatal error")))
    }
  };
  
  const { getByTestId, getAllByTestId } = render(
    <UserContext.Provider value={{user}}>
      <FirebaseContext.Provider value={firebase}>
        <ModalContext.Provider value={modal}>
          <Profile />
        </ModalContext.Provider>
      </FirebaseContext.Provider>
    </UserContext.Provider>
  );
  
  expect(getByTestId(/phone-button/i)).toHaveTextContent("unlink");
  fireEvent.click(getByTestId(/phone-button/i));
  expect(getAllByTestId("loader")).toHaveLength(3);
  expect(getAllByTestId("loader")[1]).toBeVisible();
  expect(firebase.auth.unlinkProvider).toHaveBeenCalledTimes(1);
  expect(firebase.auth.unlinkProvider).toHaveBeenCalledWith("phone");
  await wait(() => expect(getAllByTestId("loader")[1]).not.toBeVisible());
  expect(modal.setModal).toHaveBeenCalledTimes(1);
  modal.setModal.mockClear();
});

it("the user cannot unlink last provider", () => {
  const user = {
    providerData: [
      { providerId: "github.com", displayName: "Test github user" }
    ]
  };
  const updateUser = jest.fn();

  const { getByTestId } = render(
    <UserContext.Provider value={{user}}>
      <FirebaseContext.Provider value={firebase}>
        <ModalContext.Provider value={modal}>
          <Profile />
        </ModalContext.Provider>
      </FirebaseContext.Provider>
    </UserContext.Provider>
  );
  
  expect(getByTestId(/github\.com/i)).toHaveTextContent("unlink");
  fireEvent.click(getByTestId(/github\.com/i));
  expect(modal.setModal).toHaveBeenCalledTimes(1);
  expect(getByTestId(/github\.com/i)).toHaveTextContent("unlink");
  modal.setModal.mockClear();
});

it("when the user clicks link phone number, setModal is called", () => {
  const user = {
    providerData: [
      { providerId: "github.com", displayName: "Test github user" }
    ]
  };
  const updateUser = jest.fn();

  const { getByTestId } = render(
    <UserContext.Provider value={{user}}>
      <FirebaseContext.Provider value={firebase}>
        <ModalContext.Provider value={modal}>
          <Profile />
        </ModalContext.Provider>
      </FirebaseContext.Provider>
    </UserContext.Provider>
  );
  
  expect(getByTestId(/phone/i)).toHaveTextContent("link");
  fireEvent.click(getByTestId(/phone/i));
  expect(modal.setModal).toHaveBeenCalledTimes(1);
  modal.setModal.mockClear();
});

it("if phone number is the only provider, the user can change phone number", () => {
  const user = {
    providerData: [
      { providerId: "phone", uid: "+79150000000" }
    ]
  };
  const updateUser = jest.fn();

  const { getByTestId } = render(
    <UserContext.Provider value={{user}}>
      <FirebaseContext.Provider value={firebase}>
        <ModalContext.Provider value={modal}>
          <Profile />
        </ModalContext.Provider>
      </FirebaseContext.Provider>
    </UserContext.Provider>
  );
  
  expect(getByTestId(/phone/i)).toHaveTextContent("change");
  fireEvent.click(getByTestId(/phone/i));
  expect(modal.setModal).toHaveBeenCalledTimes(1);
  modal.setModal.mockClear();
});

it("if the user wants to delete account, setModal is called", () => {
  const user = {
    providerData: [
      { providerId: "phone", uid: "+79150000000" }
    ]
  };
  const updateUser = jest.fn();

  const { getByText } = render(
    <UserContext.Provider value={{user}}>
      <FirebaseContext.Provider value={firebase}>
        <ModalContext.Provider value={modal}>
          <Profile />
        </ModalContext.Provider>
      </FirebaseContext.Provider>
    </UserContext.Provider>
  );
  
  fireEvent.click(getByText(/deleteAccount/i));
  expect(modal.setModal).toHaveBeenCalledTimes(1);
  modal.setModal.mockClear();
});
