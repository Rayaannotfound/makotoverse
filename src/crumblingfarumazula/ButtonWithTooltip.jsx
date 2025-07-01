import React, { useState, useEffect } from "react";
import Tooltip from "./Tooltip";
import TooltipContent from "./TooltipContent";
import "./Tooltip.css";

const LinkWithTooltip = () => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, top: 0 });
  const buttonRef = useRef(null);

  const handleMouseEnter = () => {
    setTooltipVisible(true);
    updateTooltipPosition();
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  const handleFocus = () => {
    setTooltipVisible(true);
    updateTooltipPosition();
  };

  const handleBlur = () => {
    setTooltipVisible(false);
  };

  const updateTooltipPosition = () => {
    const buttonElement = buttonRef.current;
    if (!buttonElement) return;

    const rect = buttonElement.getBoundingClientRect();
    setTooltipPosition({
      left: rect.left,
      top: rect.bottom,
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setTooltipVisible(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <p>
      This is the
      <button
        className="a-and-tooltip"
        ref={buttonRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        trigger
        <Tooltip visible={tooltipVisible} position={tooltipPosition} />
      </button>
      . Text and popup are <strong>in one link (a)</strong> element.
    </p>
  );
};

export default LinkWithTooltip;
