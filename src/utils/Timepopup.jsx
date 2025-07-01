import React from "react";

const Popup = () => {
  const closePopup = () => {
    document.querySelector(".popup").style.display = "none";
  };

  return (
    <div className="popup">
      <div className="popup-inner">
        <h2>Why are you still up?</h2>
        <p>
          It's past 11 PM! Remember to get some rest. Lack of rest can cause
          fatigue, irritation, sadness, and reduce experience points earned.
        </p>
        <button className="button-close" onClick={closePopup}>
          I understand the risks and will sleep soon
        </button>
      </div>
    </div>
  );
};

export default Popup;
