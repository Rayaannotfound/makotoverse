import React, { useState, useEffect } from "react";
import DiaryEntry from "./DiaryEntries";
import axios from "axios";
import "../../styling/diary.css";
import { Link } from "react-router-dom";
import "../../styling/button.css";

const DiaryGrid = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getDiary");
        setEntries(response.data);
      } catch (error) {
        console.error("Error fetching diary entries:", error);
      }
    };

    fetchEntries();
  }, []);
  const safeEntries = entries || [];

  return (
    <div>
      <p>
        {" "}
        Add a diary item each day. Each diary entry earns you 1000xp. Make sure
        to document towards the end of the day
      </p>
      <div className="diary-grid">
        <Link to="/create-diary">
          <button className="button-info">Create new entry</button>
        </Link>
        {safeEntries.length > 0 ? (
          safeEntries.map((entry) => (
            <DiaryEntry key={entry.ID} entry={entry} />
          ))
        ) : (
          <p>No diary entries found.</p>
        )}
      </div>
    </div>
  );
};

export default DiaryGrid;
