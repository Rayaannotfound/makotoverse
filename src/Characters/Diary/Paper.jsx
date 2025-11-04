import React from "react";
import "../../styling/paper.css";

const Paper = ({ title, morning, afternoon, evening, night, midnight, notes }) => {
  const labels = ["Morning", "Afternoon", "Evening", "Night", "Midnight", "Notes"];
  const items = [morning, afternoon, evening, night, midnight, notes];

  // Build a single text block
  const bodyText = items
    .map((val, i) => (val ? `${labels[i]}:\n${val.trim()}` : ""))
    .filter(Boolean)
    .join("\n\n");

  return (
    <div className="paper-shell">
      <div className="paper">
        {title && <h1 className="paper-title">{title}</h1>}
        {bodyText && <div className="paper-body">{bodyText}</div>}
      </div>
    </div>
  );
};

export default Paper;
