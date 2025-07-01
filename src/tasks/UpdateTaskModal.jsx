import React, { useState, useEffect } from "react";
import "../styling/modal.css";
import "../styling/button.css";
import "../styling/tasks.css";
import "../styling/icon.css";

const UpdateTaskModal = ({ isOpen, onClose, onSubmit, taskData }) => {
  const [updatedTaskData, setUpdatedTaskData] = useState(taskData);
  const [isChecked, setIsChecked] = useState(taskData.Important === 1);
  const [includeProgressBar, setIncludeProgressBar] = useState(
    taskData.Progress > 0
  );

  useEffect(() => {
    setUpdatedTaskData(taskData);
    setIsChecked(taskData.Important === 1);
    setIncludeProgressBar(taskData.Progress > 0);
  }, [taskData]);

  const handleChange = (e) => {
    setUpdatedTaskData({ ...updatedTaskData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleProgressBarToggle = (event) => {
    setIncludeProgressBar(event.target.checked);
    if (!event.target.checked) {
      setUpdatedTaskData({ ...updatedTaskData, Progress: 0 });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valueToSubmit = {
      ...updatedTaskData,
      Important: isChecked ? 1 : 0,
    };
    onSubmit(valueToSubmit);
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
            <label> Important </label>
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
              <option value="WPA4">WPA4</option>
              <option value="WPS">"WPS</option>
              <option value="Extended Reality">Extended Reality</option>
              <option value="Startup growth">Startup growth</option>
              <option value="Cybersecurity course">Cybersecurity course</option>
              <option value="Reading">Reading</option>
              <option value="Watching">Watching</option>
              <option value="Playing">Playing</option>
              <option value="Creating">Creating</option>
              <option value="Daily life">Daily life</option>
              <option value="Relationships">Relationships</option>
              <option value="Eating">Eating</option>
              <option value="Work">Work</option>
              <option value="DQ DLC"> DQ DLC</option>
              <option value="Self care">Self Care</option>
              <option value="Other">Other</option>
              <option value="Essay">Essay</option>
              <option value="Exercise">Exercise</option>
              <option value="Daily Quest">Daily Quest</option>
              <option value="Secret">Secret</option>
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

              <option value="Snowflake">Snowflake</option>
              <option value="Jenkins">"Jenkins</option>
              <option value="xr">xr</option>
              <option value="Makefiles">Makefiles</option>
              <option value="Java">Java</option>
              <option value="React">React</option>
              <option value="React Testing">React Testing</option>
              <option value="Java testing">Java testing</option>
              <option value="Python">Python</option>
              <option value="Python Testing">Python Testing</option>
              <option value="Javascript">Javascript</option>
              <option value="Unity">Unity</option>
              <option value="Opsec">Opsec</option>
              <option value="Writing">Writing</option>
              <option value="Fiction">Fiction</option>
              <option value="Literature"> Literature</option>
              <option value="Ai Development"> Ai Development</option>
              <option value="Swift"> Swift</option>
              <option value="C"> C</option>
              <option value="SQL">SQL</option>
              <option value="Music">Music</option>
              <option value="Pandas">Pandas</option>
              <option value="AWS">AWS</option>
              <option value="Investing">Investing</option>
              <option value="Life"> Life is worth living</option>
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
              <option value="VI">VI</option>
              <option value="ST">ST</option>
              <option value="MA">MA</option>
              <option value="AT">AT</option>
              <option value="RES">RES</option>
              <option value="DEX">DEX</option>
              <option value="LOVE">LOVE</option>
              <option value="EN">EN</option>
              <option value="INTELLIGENCE">INT</option>
              <option value="FAI">FAI</option>
              <option value="INS">INS</option>
              <option value="ARC">ARC</option>
              <option value="HONOUR">HONOUR</option>
              <option value="DOM">DOM</option>
              <option value="ECHOES">ECHOES</option>
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
              <option value="Super Easy">Super Easy</option>
              <option value="Very Easy">Very Easy</option>
              <option value="Easy">Easy</option>
              <option value="Normal">Normal</option>
              <option value="Hard">Hard</option>
              <option value="Very Hard">Very Hard</option>
              <option value="Super Hard">Super Hard</option>
            </select>
          </div>

          <div className="custom-checkbox">
            <label> Include Progress Bar: </label>
            <input
              type="checkbox"
              id="progressCheckbox"
              checked={includeProgressBar}
              onChange={handleProgressBarToggle}
            />
          </div>

        
          <div className="form-field">
            <label>Progress (0-100):</label>
            <input
              type="number"
              name="Progress"
              value={updatedTaskData.Progress || ""}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </div>
       

          <button type="submit" className="form-button">
            Update Task
          </button>
        </form>
        <button className="close-modal" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default UpdateTaskModal;
