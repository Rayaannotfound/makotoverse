import React from "react";
import "../styling/button.css";
import axios from "axios";
const ManualCron = () => {
  const handleAddQuests = async () => {
    try {
      await axios.post("http://localhost:5000/api/add-daily-quests");
      alert("Quests added successfully");
      window.location.reload(); 
    } catch (error) {
      console.error("Error adding quests:", error);
      alert("Failed to add quests");
    }
  };
  return (
    <button className="button-close" onClick={handleAddQuests}>
      Add Quests if the cron did not run
    </button>
  );
};
export default ManualCron;
