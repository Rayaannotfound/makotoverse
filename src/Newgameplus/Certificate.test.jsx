import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";
import Certificate from "./Certificate"; 
import finalstats from "../photos/finalstats.PNG";
import finaldb from "../photos/finaldb.PNG";

describe("Certificate Component", () => {
  test("renders the Certificate component without crashing", () => {
    const { getByText } = render(<Certificate />);
    expect(getByText("CONGRATULATIONS")).toBeInTheDocument();
  });

  test("renders the congratulatory message", () => {
    const { getByText } = render(<Certificate />);
    expect(getByText("CONGRATULATIONS")).toBeInTheDocument();
  });

  test("renders both images", () => {
    const { container } = render(<Certificate />);
    const images = container.querySelectorAll("img");
    expect(images.length).toBe(2);
  });

  test("renders the finalstats image with correct src", () => {
    const { container } = render(<Certificate />);
    const img = container.querySelector(`img[src="${finalstats}"]`);
    expect(img).toBeInTheDocument();
  });

  test("renders the finaldb image with correct src", () => {
    const { container } = render(<Certificate />);
    const img = container.querySelector(`img[src="${finaldb}"]`);
    expect(img).toBeInTheDocument();
  });

  test("images have alt attributes for accessibility", () => {
    const { container } = render(<Certificate />);
    const images = container.querySelectorAll("img");
    images.forEach((img) => {
      expect(img).toHaveAttribute("alt");
    });
  });
});
