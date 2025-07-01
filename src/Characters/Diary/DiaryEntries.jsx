import React, { useState } from "react";
import Modal from "../../utils/UseModal";
import "../../styling/diary.css";

const DiaryEntry = ({ entry }) => {
  const [showModal, setShowModal] = useState(false);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      <div className="diary-square" onClick={() => setShowModal(true)}>
        {entry.Title}
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 style={{ textDecoration: "underline" }}>{entry.Title}</h2>
          <div>Morning: {entry.Morning}</div>
          <div>Afternoon: {entry.Afternoon}</div>
          <div>Evening: {entry.Evening}</div>
          <div>Night: {entry.Night}</div>
          <div>Midnight: {entry.Midnight}</div>
          <div>Notes: {entry.Notes}</div>
          <div>Submitted: {formatDate(entry.Date)}</div>
        </Modal>
      )}
    </div>
  );
};

DiaryEntry.defaultProps = {
  entry: {
    Title: "",
    Morning: "",
    Afternoon: "",
    Evening: "",
    Night: "",
    Midnight: "",
    Notes: "",
    Date: new Date().toISOString(),
  },
};

export default DiaryEntry;
