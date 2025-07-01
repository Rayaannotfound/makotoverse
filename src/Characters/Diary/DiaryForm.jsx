import React, { useState } from "react";
import axios from "axios";
import "../../styling/diary.css";

function DiaryForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    Title: "",
    Morning: "",
    Afternoon: "",
    Evening: "",
    Night: "",
    Midnight: "",
    Notes: "",
  });

  const handleChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:5000/api/postdiaryentry", formData)
      .then(() => {
        onSubmit(formData);
      })
      .catch((error) => {
        console.error("Error posting diary entry:", error);
      });

    axios.post("http://localhost:5000/api/diaryexp").catch((error) => {
      console.error("Error triggering diary export:", error);
    });

    window.location.replace("/diary");
  };

  const fields = [
    "Title",
    "Morning",
    "Afternoon",
    "Evening",
    "Night",
    "Midnight",
    "Notes",
  ];

  return (
    <form onSubmit={handleSubmit}>
      <h2>Diary</h2>
      {fields.map((field) => (
        <textarea
          key={field}
          rows="4"
          cols="50"
          name={field}
          value={formData[field]}
          onChange={handleChange}
          placeholder={field}
        />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}

export default DiaryForm;
