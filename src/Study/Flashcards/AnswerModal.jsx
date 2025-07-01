import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styling/content-list.css";
import "../../styling/flashcards.css";
import "../../styling/tasks.css";
import "../../styling/button.css";
import "../../styling/flashcardmodal.css";

const AnswerModal = ({ isOpen, onClose, flashcard }) => {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  useEffect(() => {
    if (isOpen && flashcard?.isMultipleChoice === 1) {
      axios
        .get(
          `http://localhost:5000/api/flashcards/options/flashcardID=${flashcard.ID}`
        )
        .then((res) => setOptions(res.data))
        .catch((err) => console.error("Fetching options failed: ", err));

      axios
        .post("http://localhost:5000/api/flashcardsexp")
        .catch((error) => console.error("EXP error:", error));
    }
  }, [isOpen, flashcard]);

  const handleOptionChange = (e) => {
    const selected = e.target.value;
    setSelectedOption(selected);

    const isCorrect = options.find(
      (option) => option.OptionText === selected
    )?.IsCorrect;

    setFeedbackMessage({
      text: isCorrect ? "Good weird human!" : "This is why you got a C for that poster.",
      isCorrect,
    });
  };

  if (!isOpen || !flashcard) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        <h2>{flashcard.Question}</h2>

        {flashcard.isMultipleChoice === 1 && (
          <div className="ohboy">
            <form>
              {options.map((option, index) => (
                <label key={index}>
                  <input
                    type="radio"
                    name="options"
                    value={option.OptionText}
                    checked={selectedOption === option.OptionText}
                    onChange={handleOptionChange}
                  />
                  {option.OptionText}
                </label>
              ))}
            </form>
            {feedbackMessage && (
              <p style={{ color: feedbackMessage.isCorrect ? "green" : "red" }}>
                {feedbackMessage.text}
              </p>
            )}
          </div>
        )}

        {flashcard.isMultipleChoice === 0 && (
          <p>Answer: {flashcard.Answer}</p>
        )}

        <p>Flashcard No: {flashcard.ID}</p>

        {flashcard.Link && (
          <a
            href={flashcard.Link}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="button-info">More info</button>
          </a>
        )}
      </div>
    </div>
  );
};

export default AnswerModal;
