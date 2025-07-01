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
              Modals are used for user interaction before returning to the main
              UI and usually are triggered through clicking or automatically by
              a system event. It might be used to confirm a decision by a user
              and it blocks out all the other interactive parts of a page until
              the user makes a confirmation or exits out of the modal
            </p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PopoverExample;
