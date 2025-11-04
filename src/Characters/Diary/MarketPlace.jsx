import React, { useState } from "react";
import "../../styling/tooltipexample.css";

function PopoverExample() {
  const [showModal, setShowModal] = useState(false);



  return (
    <div className="modal-page">
      <button> You can't click on me when the modal is open</button>
      <button onClick={() => setShowModal(true)} className="modal-open-button">
        Open Modal
      </button>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Modal definitions</h2>
            <p>
              Oh I'm still making this. Come back in 8 years
            </p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PopoverExample;
