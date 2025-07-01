import React, { useState } from "react";
import "../../styling/content-list.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { pageTransition, pageVariants } from "../../utilities/transitions";
import flashcardspic from "../../photos/flashcard.jpg";
import "../../styling/flashcards.css";
import "../../styling/tasks.css";
import "../../styling/button.css";

const AddFlashcardModal = ({ isOpen, onClose, onAddFlashcard }) => {
  const [newFlashcard, setNewFlashcard] = useState({
    Question: "",
    Answer: "",
    Hint: "",
    Category: "",
    isMultipleChoice: false,
    Options: ["", "", "", ""],
    Link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewFlashcard({ ...newFlashcard, [name]: value });
  };

  const handleToggleMultipleChoice = () => {
    setNewFlashcard((prev) => ({
      ...prev,
      isMultipleChoice: !prev.isMultipleChoice,
      Answer: "", // reset selected answer
    }));
  };

  const handleOptionChange = (e, index) => {
    const updatedOptions = [...newFlashcard.Options];
    updatedOptions[index] = e.target.value;
    setNewFlashcard({ ...newFlashcard, Options: updatedOptions });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      Question: newFlashcard.Question,
      Hint: newFlashcard.Hint,
      Category: newFlashcard.Category,
      isMultipleChoice: newFlashcard.isMultipleChoice,
      Link: newFlashcard.Link,
      Answer: newFlashcard.Answer,
    };

    if (newFlashcard.isMultipleChoice) {
      formData.Options = newFlashcard.Options.filter((o) => o.trim() !== "");
    }

    onAddFlashcard(formData);
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
              value={newFlashcard.Question}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Link for resource:
            <textarea
              name="Link"
              value={newFlashcard.Link}
              onChange={handleChange}
            />
          </label>

          <label>
            Is Multiple Choice:
            <input
              type="checkbox"
              checked={newFlashcard.isMultipleChoice}
              onChange={handleToggleMultipleChoice}
            />
          </label>

          {!newFlashcard.isMultipleChoice ? (
            <label>
              Answer:
              <textarea
                name="Answer"
                value={newFlashcard.Answer}
                onChange={handleChange}
                required
              />
            </label>
          ) : (
            <div>
              {newFlashcard.Options.map((option, index) => (
                <label key={index}>
                  Option {index + 1}:
                  <textarea
                    value={option}
                    onChange={(e) => handleOptionChange(e, index)}
                  />
                </label>
              ))}
              <label>
                Correct Answer:
                <select
                  name="Answer"
                  value={newFlashcard.Answer}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select the correct answer</option>
                  {newFlashcard.Options.map(
                    (option, index) =>
                      option.trim() && (
                        <option key={index} value={option}>
                          {option}
                        </option>
                      )
                  )}
                </select>
              </label>
            </div>
          )}

          <label>
            Hint:
            <textarea
              name="Hint"
              value={newFlashcard.Hint}
              onChange={handleChange}
            />
          </label>

          <label>
            Category:
            <select
              name="Category"
              value={newFlashcard.Category}
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

          <button type="submit">Add Flashcard</button>
        </form>
      </div>
    </div>
  );
};

export default AddFlashcardModal;
