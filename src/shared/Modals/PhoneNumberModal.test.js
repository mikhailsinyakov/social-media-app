import React from "react";
import ReactDOM from "react-dom";
import { render, fireEvent, act, cleanup, wait } from "@testing-library/react";

import { ModalContext } from "context/Modal";
import PhoneNumberModal from "./PhoneNumberModal";

afterEach(cleanup);

it("renders without crashing", () => {
  render(
    <ModalContext.Provider value={{hideModal: jest.fn(), show: true}}>
      <PhoneNumberModal title="Phone number">
        <p>Change phone number</p>
      </PhoneNumberModal>
    </ModalContext.Provider>
  );
});

it("renders correctly", () => {
  const { getByText } = render(
    <ModalContext.Provider value={{hideModal: jest.fn(), show: true}}>
      <PhoneNumberModal title="Phone number">
        <p>Change phone number</p>
      </PhoneNumberModal>
    </ModalContext.Provider>
  );
  
  expect(getByText(/^phone number$/i)).toBeInTheDocument();
  expect(getByText(/cancel/i)).toBeInTheDocument();
  expect(getByText(/change phone number/i)).toBeInTheDocument();
});

it("when the user clicks close button calls hideModal function", async () => {
  const hideModalMock = jest.fn();

  const { getByText } = render(
    <ModalContext.Provider value={{hideModal: hideModalMock, show: true}}>
      <PhoneNumberModal title="Phone number">
        <p>Change phone number</p>
      </PhoneNumberModal>
    </ModalContext.Provider>
  );
  
  await act(async () => {
    await fireEvent.click(getByText(/cancel/i));
  });
  expect(hideModalMock).toHaveBeenCalledTimes(1);
});
