import React from "react";
import ReactDOM from "react-dom";
import { render, fireEvent, act, cleanup, wait } from "@testing-library/react";

import Footer from "./Footer";

it("renders without crashing", () => {
  render(<Footer />);
});

it("renders correctly", () => {
  const {getByText } = render(<Footer />);
  
  expect(getByText(/github/i)).toBeInTheDocument();
  expect(getByText(/firebase/i)).toBeInTheDocument();
  expect(getByText(/react router/i)).toBeInTheDocument();
});
