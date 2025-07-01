import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

import "../styling/content-list.css";
import "../styling/button.css";
import { motion } from "framer-motion";
import { pageTransition, pageVariants } from "../utilities/transitions";

function StudyHomePage({ component }) {
  const [editorHtml, setEditorHtml] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const content = { title, type, body: editorHtml };
      await axios.post("http://localhost:5000/api/studying", { content });
    } catch (error) {
      console.error("Error storing notes:", error);
    }
  };
    // choices to study from
  const choices = [
    "Select a car",
    "Constraint Programming",
    "professional issues in the workplace",
    "workplace assessment",
    "Patient Health tech",
    "other",
    "MHCI",
    "Interactive Systems",
    "Memes",
    "Robotic FFoundations",
  ];

  const formats = [
    "link",
    "image",
    "bold",
    "italic",
    "underline",
    "strike",
    "code",
    "blockquote",
    "list",
    "header",
    "align",
    "color",
    "background",
    "script",
  ];

  return (
    <div className="imstudying">
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        className="page"
      >
        <div className="content">
          <h1 className="rainbow-text">Studying</h1>

          <input
            type="text"
            className="rainbow-text"
            placeholder="Title"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />

          <div style={{ margin: "1rem 0" }}>
            <select value={type} onChange={(e) => setType(e.target.value)} required>
              {choices.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <ReactQuill
            value={editorHtml}
            required
            onChange={setEditorHtml}
            formats={formats}
            modules={{ toolbar: formats }}
          />
        </div>

        <div className="content" style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button className="button-link" onClick={handleSubmit}>
            Submit
          </button>
          <button className="button-link" onClick={() => navigate("/study/flashcards")}>
            Go to Flashcards
          </button>
          <button className="button-link" onClick={() => navigate("/study/all")}>
            View All Notes
          </button>
        </div>

        {component}
      </motion.div>
    </div>
  );
}

export default StudyHomePage;
