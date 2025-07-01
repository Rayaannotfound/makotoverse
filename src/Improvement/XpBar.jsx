import React from "react";
import "../styling/xpbar.css";

const XPBar = ({ current, needed }) => {
  console.log(current, "     ", needed);
  const percent = Math.min((current / needed) * 100, 100);
  console.log(percent);

  return (
    <div className="xp-bar-container">
      <div className="xp-bar-fill" style={{ width: `${percent}%` }}></div>
    </div>
  );
};

export default XPBar;
