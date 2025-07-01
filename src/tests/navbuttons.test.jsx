import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import NavButtons from "../Navigation/navbuttons"; 

describe("NavButtons Component", () => {
  it("renders the correct number of links based on the dictionary", () => {
    const dictionary = {
      "/home": "Home",
      "/about": "About",
      "/contact": "Contact",
    };

    const { container } = render(
      <BrowserRouter>
        <NavButtons dictionary={dictionary} />
      </BrowserRouter>
    );


    const links = container.querySelectorAll("a");
    expect(links.length).toBe(3);
  });

  it("renders the correct text and 'to' attribute for each link", () => {
    const dictionary = {
      "/home": "Home",
      "/about": "About",
      "/contact": "Contact",
    };

    const { getByText } = render(
      <BrowserRouter>
        <NavButtons dictionary={dictionary} />
      </BrowserRouter>
    );

    expect(getByText("Home").closest("a")).toHaveAttribute("href", "/home");
    expect(getByText("About").closest("a")).toHaveAttribute("href", "/about");
    expect(getByText("Contact").closest("a")).toHaveAttribute(
      "href",
      "/contact"
    );
  });

  it("renders all 3 buttons", () => {
    const dictionary = {
      "/home": "Home",
      "/about": "About",
      "/contact": "Contact",
    };

    const { container } = render(
      <BrowserRouter>
        <NavButtons dictionary={dictionary} />
      </BrowserRouter>
    );

    const buttons = container.querySelectorAll("a");

    expect(buttons).toHaveLength(3);
  });

  it("renders an empty div when dictionary is empty", () => {
    const dictionary = {};

    const { container } = render(
      <BrowserRouter>
        <NavButtons dictionary={dictionary} />
      </BrowserRouter>
    );
    const links = container.querySelectorAll("a");
    expect(links.length).toBe(0);
  });
});
