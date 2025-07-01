import React from "react";
import "../styling/progressbar.css";

const ProgressBar = ({ progress }) => {
  const getProgressBarColor = (progress) => {
    if (progress <= 30) return "red";
    if (progress <= 70) return "orange";
    return "green";
  };

  return (
    <>
      <div className="w3-light-grey progress-container">
        <div
          className="w3-container w3-center progress-bar"
          style={{
            width: `${progress}%`,
            backgroundColor: getProgressBarColor(progress),
          }}
        ></div>
      </div>
      <p> {progress}%</p>
    </>
  );
};

export default ProgressBar;
