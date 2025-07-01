import React, { useState, useEffect } from "react";
import "../styling/practice.css";

const Tooltip = () => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.keyCode || e.which) === 27) {
        setTooltipVisible(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleMouseOver = () => {
    setTooltipVisible(true);
  };

  const handleMouseOut = () => {
    setTooltipVisible(false);
  };

  const handleFocus = () => {
    setTooltipVisible(true);
  };

  const handleBlur = () => {
    setTooltipVisible(false);
  };

  return (
    <p>
      This is the
      <a
        className="a-and-tooltip"
        id="parent"
        href="index.html"
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        trigger
        <span
          id="popup"
          role="tooltip"
          style={{ display: isTooltipVisible ? "block" : "none" }}
        >
          And this additional text gives additional context on the trigger term
        </span>
      </a>
      . Text and popup are <strong>in one link (a)</strong> element.
    </p>
  );
};

export default Tooltip;
