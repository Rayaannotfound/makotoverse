import React, { useState, useEffect } from "react";
import "../../styling/content-list.css";
import "../../styling/flashcards.css";
import "../../styling/tasks.css";
import "../../styling/button.css";

const EditFlashcardModal = ({ isOpen, onClose, onEditFlashcard, flashcardToEdit }) => {
  const [editedFlashcard, setEditedFlashcard] = useState({
    ID: "",
    Question: "",
    Answer: "",
    Hint: "",
    Category: "",
    Link: "",
  });

  useEffect(() => {
    if (flashcardToEdit) {
      setEditedFlashcard(flashcardToEdit);
    }
  }, [flashcardToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedFlashcard((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditFlashcard(editedFlashcard);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <form onSubmit={handleSubmit}>
          <label>
            Question:
            <textarea
              name="Question"
              value={editedFlashcard.Question}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Answer:
            <textarea
              name="Answer"
              value={editedFlashcard.Answer}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Hint:
            <textarea
              name="Hint"
              value={editedFlashcard.Hint}
              onChange={handleChange}
            />
          </label>

          <label>
            Further Resource:
            <textarea
              name="Link"
              value={editedFlashcard.Link}
              onChange={handleChange}
            />
          </label>

          <label>
            Category:
            <select
              name="Category"
              value={editedFlashcard.Category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              <option value="Xtended Reality">Xtended Reality</option>
              <option value="Startup growth">Startup growth</option>
              <option value="Secured Cybersecurity engineering">
                Secured Cybersecurity engineering
              </option>
              <option value="Cybersecurity cert">Cybersecurity cert</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditFlashcardModal;
