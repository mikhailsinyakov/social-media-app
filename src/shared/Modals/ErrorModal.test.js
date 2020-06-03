import React from "react";
import ReactDOM from "react-dom";
import { render, fireEvent, act, cleanup, wait } from "@testing-library/react";

import { ModalContext } from "context/Modal";
import ErrorModal from "./ErrorModal";

afterEach(cleanup);

it("renders without crashing", () => {
  render(
    <ModalContext.Provider value={{hideModal: jest.fn(), show: true}}>
      <ErrorModal>
        "Unexpected error"
      </ErrorModal>
    </ModalContext.Provider>
  );
});

it("renders correctly", () => {
  const { getByText } = render(
    <ModalContext.Provider value={{hideModal: jest.fn(), show: true}}>
      <ErrorModal>
        "Unexpected error"
      </ErrorModal>
    </ModalContext.Provider>
  );
  
  expect(getByText(/errorOccurred/i)).toBeInTheDocument();
  expect(getByText(/close/i)).toBeInTheDocument();
  expect(getByText(/unexpected error/i)).toBeInTheDocument();
});

it("when the user clicks close button calls hideModal function", async () => {
  const hideModalMock = jest.fn();

  const { getByText } = render(
    <ModalContext.Provider value={{hideModal: hideModalMock, show: true}}>
      <ErrorModal>
        "Unexpected error"
      </ErrorModal>
    </ModalContext.Provider>
  );
  
  await act(async () => {
    await fireEvent.click(getByText(/close/i));
  });
  expect(hideModalMock).toHaveBeenCalledTimes(1);
});
