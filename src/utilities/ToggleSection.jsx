import React, { useState } from "react";
import TimeDisplay from "../Time/TimeDisplay";
import "../styling/ToggleSection.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";

const ToggleSection = () => {
  const [isToggled, setIsToggled] = useState(false);

  const toggleSection = () => {
    setIsToggled(!isToggled);
  };

  return (
    <div class="checkbox-wrapper-25">
      <button onClick={toggleSection}>
        <FontAwesomeIcon icon={isToggled ? faToggleOn : faToggleOff} />
      </button>
      {isToggled && <TimeDisplay />}
    </div>
  );
};

export default ToggleSection;
