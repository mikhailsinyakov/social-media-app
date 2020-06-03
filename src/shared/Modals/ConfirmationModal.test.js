import React from "react";
import ReactDOM from "react-dom";
import { render, fireEvent, act, cleanup } from "@testing-library/react";

import { ModalContext } from "context/Modal";
import ConfirmationModal from "./ConfirmationModal";

afterEach(cleanup);

it("renders without crashing", () => {
  render(
    <ModalContext.Provider value={{hideModal: jest.fn(), show: true}}>
      <ConfirmationModal
        title="Confirmation"
        confirmBtnAction={jest.fn()}
      >
        "Are you sure?"
      </ConfirmationModal>
    </ModalContext.Provider>
  );
});

it("renders correctly", () => {
  const { getByText } = render(
    <ModalContext.Provider value={{hideModal: jest.fn(), show: true}}>
      <ConfirmationModal
        title="Confirmation"
        confirmBtnAction={jest.fn()}
      >
        "Are you sure?"
      </ConfirmationModal>
    </ModalContext.Provider>
  );
  
  expect(getByText(/confirmation/i)).toBeInTheDocument();
  expect(getByText(/yes/i)).toBeInTheDocument();
  expect(getByText(/cancel/i)).toBeInTheDocument();
  expect(getByText(/are you sure/i)).toBeInTheDocument();
});

it("when the user clicks confirm button calls appropriate functions", async () => {
  const confirmBtnActionMock = jest.fn();
  const hideModalMock = jest.fn();

  const { getByText } = render(
    <ModalContext.Provider value={{hideModal: hideModalMock, show: true}}>
      <ConfirmationModal
        title="Confirmation"
        confirmBtnAction={confirmBtnActionMock}
      >
        "Are you sure?"
      </ConfirmationModal>
    </ModalContext.Provider>
  );
  
  await act(async () => {
    await fireEvent.click(getByText(/yes/i));
  });
  expect(confirmBtnActionMock).toHaveBeenCalledTimes(1);
  expect(hideModalMock).toHaveBeenCalledTimes(1);
});

it("when the user clicks cancel button calls hideModal function", async () => {
  const hideModalMock = jest.fn();

  const { getByText } = render(
    <ModalContext.Provider value={{hideModal: hideModalMock, show: true}}>
      <ConfirmationModal
        title="Confirmation"
        confirmBtnAction={jest.fn()}
      >
        "Are you sure?"
      </ConfirmationModal>
    </ModalContext.Provider>
  );
  
  await act(async () => {
    await fireEvent.click(getByText(/cancel/i));
  });
  expect(hideModalMock).toHaveBeenCalledTimes(1);
});
