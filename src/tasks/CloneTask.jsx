import React, { useState, useEffect } from "react";
import "../styling/modal.css";
import "../styling/button.css";
import "../styling/tasks.css";
import "../styling/icon.css";

const categoryOptions = [
  "WPA4", "WPS", "Extended Reality", "Startup growth", "Cybersecurity course",
  "Reading", "Watching", "Playing", "Creating", "Daily life", "Relationships",
  "Eating", "Work", "DQ DLC", "Self care", "Other", "Essay", "Exercise",
  "Daily Quest", "Secret", "Orange Islands"
];

const masteryOptions = [
  "Snowflake", "Jenkins", "xr", "Makefiles", "Java", "React", "React Testing",
  "Java testing", "Python", "Python Testing", "Javascript", "Unity", "Opsec",
  "Writing", "Fiction", "Literature", "Ai Development", "Swift", "C", "SQL",
  "Music", "Pandas", "AWS", "Investing", "Life"
];

const attributeOptions = [
  "VI", "ST", "MA", "AT", "RES", "DEX", "LOVE", "EN", "INTELLIGENCE",
  "FAI", "INS", "ARC", "HONOUR", "DOM", "ECHOES"
];

const difficultyOptions = [
  "Super Easy", "Very Easy", "Easy", "Normal",
  "Hard", "Very Hard", "Super Hard"
];

const CloneTask = ({ isOpen, onClose, onSubmit, taskData }) => {
  const [updatedTaskData, setUpdatedTaskData] = useState(taskData || {});
  const [isChecked, setIsChecked] = useState(taskData?.Important === 1);
  const [includeProgressBar, setIncludeProgressBar] = useState(taskData?.Progress > 0);

  useEffect(() => {
    setUpdatedTaskData(taskData || {});
    setIsChecked(taskData?.Important === 1);
    setIncludeProgressBar(taskData?.Progress > 0);
  }, [taskData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleProgressBarToggle = (e) => {
    setIncludeProgressBar(e.target.checked);
    if (!e.target.checked) {
      setUpdatedTaskData(prev => ({ ...prev, Progress: 0 }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const taskToSubmit = {
      ...updatedTaskData,
      Important: isChecked ? 1 : 0,
    };
    onSubmit(taskToSubmit);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup">
      <div className="popup-inner">
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-field">
            <label>Task Name:</label>
            <input
              type="text"
              name="Title"
              value={updatedTaskData.Title || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Description:</label>
            <textarea
              name="Description"
              value={updatedTaskData.Description || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>XP Value:</label>
            <input
              type="number"
              name="XP"
              value={updatedTaskData.XP || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-field">
            <label>Locked until Mission no is completed (optional):</label>
            <input
              type="number"
              name="Locked"
              value={updatedTaskData.Locked || ""}
              onChange={handleChange}
            />
          </div>

          <div className="custom-checkbox">
            <label>Important:</label>
            <input
              type="checkbox"
              id="customCheckbox"
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="customCheckbox" className="checkbox-custom"></label>
          </div>

          <label>
            Category:
            <select
              name="Category"
              value={updatedTaskData.Category || ""}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categoryOptions.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>

          <label>
            Mastery:
            <select
              name="Mastery"
              value={updatedTaskData.Mastery || ""}
              onChange={handleChange}
            >
              <option value="">Select a mastery</option>
              {masteryOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </label>

          <div className="form-field">
            <label>Attribute:</label>
            <select
              name="Attribute"
              value={updatedTaskData.Attribute || ""}
              onChange={handleChange}
            >
              <option value="">Select an attribute</option>
              {attributeOptions.map((attr) => (
                <option key={attr} value={attr}>{attr}</option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label>Attribute Points:</label>
            <input
              type="number"
              name="AttributePoints"
              value={updatedTaskData.AttributePoints || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label>Difficulty Level:</label>
            <select
              name="Difficulty"
              value={updatedTaskData.Difficulty || ""}
              onChange={handleChange}
            >
              <option value="">Select difficulty</option>
              {difficultyOptions.map((diff) => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>

          <div className="custom-checkbox">
            <label>Include Progress Bar:</label>
            <input
              type="checkbox"
              id="progressCheckbox"
              checked={includeProgressBar}
              onChange={handleProgressBarToggle}
            />
          </div>

          {includeProgressBar && (
            <div className="form-field">
              <label>Progress (0–100):</label>
              <input
                type="number"
                name="Progress"
                value={updatedTaskData.Progress || ""}
                onChange={handleChange}
                min="0"
                max="100"
              />
            </div>
          )}

          <button type="submit" className="form-button">Clone Task</button>
        </form>
        <button className="close-modal" onClick={onClose}>&times;</button>
      </div>
    </div>
  );
};

export default CloneTask;
