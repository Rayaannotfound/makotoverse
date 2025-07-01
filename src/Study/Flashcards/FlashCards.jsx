import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styling/content-list.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import flashcardspic from "../../photos/flashcard.jpg";
import "../../styling/flashcards.css";
import "../../styling/tasks.css";
import "../../styling/button.css";

import AnswerModal from "./AnswerModal";
import AddFlashcardModal from "./AddFlashcardModal";
import EditFlashcardModal from "./EditFlashcardModal";

const FlashCards = () => {
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState(null);
  const [flashcardToEdit, setFlashcardToEdit] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/flashcards");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addFlashcard = async (flashcard) => {
    try {
      await axios.post("http://localhost:5000/api/addflashcard", flashcard);
      fetchItems();
    } catch (error) {
      console.error("Nah lil bro backend said no:", error);
    }
  };

  const handleEditFlashcard = async (editedFlashcard) => {
    try {
      await axios.put(
        `http://localhost:5000/api/flashcards/${editedFlashcard.ID}`,
        editedFlashcard
      );
      fetchItems();
    } catch (error) {
      console.error("So much errors:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/deleteflashcards/ID=${id}`);
      fetchItems();
    } catch (error) {
      console.error("womp womp backend wont delete check ur code lil bro:", error);
    }
  };

  const handleItemClick = async (flashcard) => {
    if (flashcard.isMultipleChoice === 1) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/flashcards/${flashcard.ID}`
        );
        setSelectedFlashcard(response.data);
      } catch (error) {
        console.error("womp womp backend said no:", error);
      }
    } else {
      setSelectedFlashcard(flashcard);
    }
    setIsModalOpen(true);
  };

  const openEditModal = (flashcard) => {
    setFlashcardToEdit(flashcard);
    setShowEditModal(true);
  };

  return (
    <div className="imagel-container">
      <button className="button-link" onClick={() => setShowAddModal(true)}>
        Add Flashcard
      </button>

      <AddFlashcardModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddFlashcard={addFlashcard}
      />

      {items.length > 0 ? (
        <div className="items-container">
          {items.map((item, index) => (
            <div
              key={item.ID}
              className="item"
              style={{ backgroundImage: `url(${flashcardspic})` }}
              onClick={() => handleItemClick(item)}
            >
              <p>{item.Question}</p>
              <p>Hint: {item.Hint}</p>
              <p>Category: {item.Category}</p>
              <p>Type: {item.isMultipleChoice ? "multiple choice" : "normal"}</p>

              {index > 0 && (
                <FontAwesomeIcon
                  icon={faTrash}
                  className="deletecard"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.ID);
                  }}
                />
              )}

              <FontAwesomeIcon
                icon={faPencil}
                className="editcard"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(item);
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div>Create some flashcards deliquent</div>
      )}

      <AnswerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        flashcard={selectedFlashcard}
      />

      <EditFlashcardModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onEditFlashcard={handleEditFlashcard}
        flashcardToEdit={flashcardToEdit}
      />
    </div>
  );
};

export default FlashCards;
