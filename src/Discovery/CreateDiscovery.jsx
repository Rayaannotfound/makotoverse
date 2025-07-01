import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "../styling/flashcards.css";
import "../styling/discovery.css";

const DiscoveryModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/newdiscovery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, photo, description }),
      });

      if (response.ok) {
        onClose();
      } else {
        console.error("Error:", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-content">
      <form onSubmit={handleSubmit}>
        <div className="input-container">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label className="label">Enter Your Name</label>
          <div className="topline"></div>
          <div className="underline"></div>
        </div>

        <div className="input-container">
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="topline"></div>
          <div className="underline"></div>
        </div>

        <label>
          Photo:
          <ReactQuill theme="snow" value={photo} onChange={setPhoto} />
        </label>

        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </form>
    </div>
  );
};

export default DiscoveryModal;
