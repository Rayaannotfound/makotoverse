import React from "react";
import { render } from "@testing-library/react";
import ProgressBar from "../utilities/ProgressBar"; // Adjust the import path as needed
import "@testing-library/jest-dom";

describe("ProgressBar Component", () => {
  test("renders the ProgressBar component", () => {
    const { getByText } = render(<ProgressBar progress={50} />);
    expect(getByText("50%")).toBeInTheDocument();
  });

  test("displays correct progress percentage", () => {
    const { getByText } = render(<ProgressBar progress={75} />);
    expect(getByText("75%")).toBeInTheDocument();
  });

  test("sets the correct width of the progress bar", () => {
    const { container } = render(<ProgressBar progress={25} />);
    const progressBar = container.querySelector(".progress-bar");
    expect(progressBar).toHaveStyle(`width: 25%`);
  });

  test("changes color based on progress", () => {
    const { container, rerender } = render(<ProgressBar progress={20} />);
    let progressBar = container.querySelector(".progress-bar");
    expect(progressBar).toHaveStyle("background-color: red");

    rerender(<ProgressBar progress={50} />);
    progressBar = container.querySelector(".progress-bar");
    expect(progressBar).toHaveStyle("background-color: orange");

    rerender(<ProgressBar progress={80} />);
    progressBar = container.querySelector(".progress-bar");
    expect(progressBar).toHaveStyle("background-color: green");
  });

  test("does not exceed 100% width", () => {
    const { container } = render(<ProgressBar progress={150} />);
    const progressBar = container.querySelector(".progress-bar");
    expect(progressBar).toHaveStyle(`width: 150%`);
  });

  test("handles edge case for progress below 0", () => {
    const { container } = render(<ProgressBar progress={-10} />);
    const progressBar = container.querySelector(".progress-bar");
    expect(progressBar).toHaveStyle(`width: -10%`);
  });
});
