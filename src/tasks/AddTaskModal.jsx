import React, { useState, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleInfo
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Draggable from "react-draggable";
import StatPopup from "../Improvement/StatPopup";
import "../styling/modal.css";
import "../styling/button.css";
import "../styling/tasks.css";
import "../styling/notification.css";
import "../styling/news.css";
import "../styling/icon.css";

const AddTaskModal = ({ isOpen, onClose, onSubmit }) => {
  const [taskData, setTaskData] = useState({
    Title: "",
    Description: "",
    XP: 0,
    Locked: 0,
    Important: 0,
    Deadline: "",
    Category: "",
    Attribute: "",
    AttributePoints: 0,
    Mastery: "",
    Difficulty: "",
    Progress: 0,
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isChecked, setIsChecked] = useState(false);
  const [includeProgressBar, setIncludeProgressBar] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleChangeDate = (date) => {
    setSelectedDate(date);
    const formatted = moment(date).format("YYYY-MM-DD");
    setTaskData((prev) => ({ ...prev, Deadline: formatted }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { Attribute, AttributePoints } = taskData;

    if ((Attribute && !AttributePoints) || (!Attribute && AttributePoints)) {
      alert("Please fill in both 'Attribute' and 'Attribute Points'.");
      return;
    }

    const finalTask = { ...taskData, Important: isChecked ? 1 : 0 };
    onSubmit(finalTask);
    onClose();
  };

  const Checkbox = ({ label, checked, onChange, id }) => (
    <div className="custom-checkbox">
      <label className="container">
        {label}
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={onChange}
          style={{ display: "none" }}
        />
        <div className="checkmark"></div>
      </label>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="popup">
      <Draggable handle=".drag-handle">
        <div className="popup-inner">
          <div className="drag-handle" style={{ cursor: "move" }}>
            <button className="close-modal" onClick={onClose}>
              &times;
            </button>
            <h1>Create a new task</h1>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-field">
              <label>Task Name:</label>
              <input type="text" name="Title" value={taskData.Title} onChange={handleChange} required />
            </div>

            <div className="form-field">
              <label>Description:</label>
              <textarea name="Description" value={taskData.Description} onChange={handleChange} />
            </div>

            <div className="form-field">
              <label>XP Value:</label>
              <input type="number" name="XP" value={taskData.XP} onChange={handleChange} required />
            </div>

            <div>
              <label>Deadline (if applicable):</label>
              <DatePicker selected={selectedDate} onChange={handleChangeDate} dateFormat="yyyy-MM-dd" />
            </div>

            <div className="form-field">
              <label>(optional) Locked until Mission no is completed:</label>
              <input type="number" name="Locked" value={taskData.Locked} onChange={handleChange} />
            </div>

            <Checkbox label="Important:" checked={isChecked} onChange={() => setIsChecked(!isChecked)} id="important" />

            <label>
              Category:
              <select name="Category" value={taskData.Category} onChange={handleChange} required>
                <option value="">Select a category</option>
                {[
                  "WPA4", "WPS", "Extended Reality", "Startup growth", "Cybersecurity course",
                  "Reading", "Watching", "Playing", "Creating", "Daily life", "Relationships",
                  "Eating", "Work", "DQ DLC", "Self care", "Other", "Essay", "Exercise", "Daily Quest", 
                  "Secret", "Orange Islands"
                ].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>

            <label>
              Mastery:
              <select name="Mastery" value={taskData.Mastery} onChange={handleChange}>
                <option value="">Select a mastery</option>
                {[
                  "Snowflake", "Jenkins", "xr", "Makefiles", "Java", "React", "React Testing", "Java testing",
                  "Python", "Python Testing", "Javascript", "Unity", "Opsec", "Writing", "Fiction", "Literature",
                  "Ai Development", "Swift", "C", "SQL", "Music", "Pandas", "AWS", "Investing", "Life"
                ].map((mastery) => (
                  <option key={mastery} value={mastery}>{mastery}</option>
                ))}
              </select>
            </label>

            <div className="form-field">
              <label>
                Attribute:
                <FontAwesomeIcon icon={faCircleInfo} className="icon-transition" onClick={() => setShowPopup(true)} />
              </label>
              <select name="Attribute" value={taskData.Attribute} onChange={handleChange}>
                <option value="">Select an attribute</option>
                {[
                  "VI", "ST", "MA", "AT", "RES", "DEX", "LOVE", "EN",
                  "INTELLIGENCE", "FAI", "INS", "ARC", "HONOUR", "DOM", "ECHOES"
                ].map((attr) => (
                  <option key={attr} value={attr}>{attr}</option>
                ))}
              </select>
              {showPopup && <StatPopup onClose={() => setShowPopup(false)} />}
            </div>

            <div className="form-field">
              <label>Attribute Points:</label>
              <input type="number" name="AttributePoints" value={taskData.AttributePoints} onChange={handleChange} />
            </div>

            <div className="form-field">
              <label>Difficulty Level:</label>
              <select name="Difficulty" value={taskData.Difficulty} onChange={handleChange}>
                <option value="">Select difficulty</option>
                {[
                  "Super Easy", "Very Easy", "Easy", "Normal",
                  "Hard", "Very Hard", "Super Hard"
                ].map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <Checkbox
              label="Include Progress Bar:"
              checked={includeProgressBar}
              onChange={() => {
                setIncludeProgressBar(!includeProgressBar);
                if (includeProgressBar) setTaskData({ ...taskData, Progress: 0 });
              }}
              id="progress"
            />

            {includeProgressBar && (
              <div className="form-field">
                <label>Progress (0-100):</label>
                <input
                  type="number"
                  name="Progress"
                  value={taskData.Progress}
                  onChange={handleChange}
                  min="0"
                  max="100"
                />
              </div>
            )}

            <br />
            <button type="submit" className="form-button">Add Task</button>
          </form>
        </div>
      </Draggable>
    </div>
  );
};

export default AddTaskModal;
