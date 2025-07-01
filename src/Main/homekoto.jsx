import React from "react";
import "../styling/title.css";
import "../styling/button.css";
import NavButtons from "../Navigation/navbuttons";
import ToggleSection from "../utilities/ToggleSection";

import "../styling/NewsBanner.css";
import NewsBanner from "../News/NewsBanner";
import "../styling/notification.css";
import "../styling/button.css";
import "../styling/home.css";
import { ButtonLinks } from "../utils/ButtonLinks";
const Homepage = () => {
  return (
    <div className="homepageback">
      <h1 className="tracking-in-expand-fwd-top ">
        Welcome to the Makoto-Verse!
      </h1>
      <div className="bravetarnished">
        <p className="rainbow-text">
          {" "}
          This is a data portal that contains stuff for real life. Character page does not work because its just data. 
        </p>
      </div>
      <div className="erdtree">
        <NavButtons dictionary={ButtonLinks}></NavButtons>
      </div>
      <div>
        <ToggleSection />
      </div>
      <NewsBanner />
    </div>
  );
};

export default Homepage;
