import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styling/modal.css";
import "../styling/button.css";
import "../styling/tasks.css";
import "../styling/notification.css";
import "../styling/news.css";
import "../styling/icon.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencil,
  faExclamation,
  faCircleInfo,
  faPenFancy,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import AddTaskModal from "../tasks/AddTaskModal";
import UpdateTaskModal from "./UpdateTaskModal";
import ManualCron from "./manualCron";
import StatPopup from "../Improvement/StatPopup";
import ProgressBar from "../utilities/ProgressBar";
import CloneTask from "../tasks/CloneTask";
import Draggable from "react-draggable";


const BASE_URL = "localhost:5000";


import { utils, animate, anime, stagger } from 'animejs';






const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTaskAddedPopup, setShowTaskAddedPopup] = useState(false);
  const [formData, setFormData] = useState({});
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [importantFilter, setImportantFilter] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [excludeDailyQuest, setExcludeDailyQuest] = useState(false); 
  const [searchQuery, setSearchQuery] = useState("");
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);

  useEffect(() => {
    fetchTasks();


  }, [importantFilter, selectedCategory, excludeDailyQuest, searchQuery]);

  const handleIconClick = (taskData) => {
    setFormData(taskData);
    setIsUpdateModalOpen(true);
  };

  const handleCloneIconClick = (taskData) => {
    setFormData(taskData);
    setIsCloneModalOpen(true);
  };

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
     
if (!token) {
  localStorage.clear();
  sessionStorage.clear();
  window.location.reload();
}
      const response = await axios.get(`http://${BASE_URL}/api/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
      let fetchedTasks = response.data;

      if (importantFilter === 1) {
        fetchedTasks = fetchedTasks.filter((task) => task.Important === 1);
      } else if (importantFilter === 2) {
        fetchedTasks = fetchedTasks.filter(
          (task) => task.Important === 0 || task.Important === null
        );
      }

      if (selectedCategory) {
        fetchedTasks = fetchedTasks.filter(
          (task) => task.Category === selectedCategory
        );
      }

      if (excludeDailyQuest) {
        fetchedTasks = fetchedTasks.filter(
          (task) => task.Category !== "Daily Quest"
        );
      }

      fetchedTasks = fetchedTasks.filter((task) =>
        task.Title.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const checkLockedPromises = fetchedTasks.map((task) => {
        if (task.Locked) {
          return axios
            .get(`http://${BASE_URL}/api/task/ID=${task.Locked}`)
            .then((res) => {
              const isCompleted = res.data[0].isCompleted === 1;
              return { ...task, canBeCompleted: isCompleted };
            })
            .catch(() => {
              return { ...task, canBeCompleted: false };
            });
        } else {
          return Promise.resolve({ ...task, canBeCompleted: true });
        }
      });

      const tasksWithCompletableStatus = await Promise.all(checkLockedPromises);
      setTasks(tasksWithCompletableStatus);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async (task) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        localStorage.clear();
      }
      await axios.post(`http://${BASE_URL}/api/add-task`, task, { headers: {
      Authorization: `Bearer ${token}`, 
    },});
      setIsModalOpen(false);
      setShowTaskAddedPopup(true);
      fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleCompleteTask = async (
    taskId,
    xp,
    Attribute,
    AttributePoints,
    Mastery
  ) => {
    try {
      await axios.post(`http://${BASE_URL}/api/complete-task/ID=${taskId}`, {
        xp,
        Attribute,
        AttributePoints,
        Mastery,
      });
      fetchTasks();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleRemoveTask = async (taskId) => {
    try {
      await axios.post(`http://${BASE_URL}/api/remove-task/ID=${taskId}`, {});
      fetchTasks();
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const totalXP = tasks.reduce((partialSum, task) => partialSum + task.XP, 0);

  const getProgressBarColor = (progress) => {
    if (progress <= 30) return "red";
    if (progress <= 70) return "orange";
    return "green";
  };

  return (
    <div className="soloback">
      <div className="centered-content">
        <h1>Add or Complete Tasks</h1>
        <button className="button-task" onClick={() => setIsModalOpen(true)}>
          <span className="button__text">Add Task</span>
          <span className="button__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke-linejoin="round"
              stroke-linecap="round"
              stroke="currentColor"
              height="24"
              fill="none"
              className="svg"
            >
              <line y2="19" y1="5" x2="12" x1="12"></line>
              <line y2="12" y1="12" x2="19" x1="5"></line>
            </svg>
          </span>
        </button>
        <Link to="/habits">
          <button className="button-close">Habit Stack</button>
        </Link>
        <Link to="/old-tasks">
          <button className="button-info">Archived</button>
        </Link>
      </div>
      <p> You have: {tasks.length} Pending Missions Remaining!</p>
      <p>
        {" "}
        And {tasks.filter((task) => task.Important === 1).length} Important
        Missions Remaining!{" "}
      </p>
      <p>
        {" "}
        And {tasks.filter((task) => task.Deadline !== null).length} missions
        with a fast approaching deadline!
      </p>
      <p>
        {" "}
        Don't worry! You also have{" "}
        {
          tasks.filter(
            (task) => task.Important === 0 || task.Important === null
          ).length
        }{" "}
        filler missions too!
      </p>
      <p> Total XP that can be accumulated: {totalXP} </p>
      <ManualCron />

      <label>Exclude Daily Quests</label>
      <input
        type="checkbox"
        checked={excludeDailyQuest}
        onChange={(e) => setExcludeDailyQuest(e.target.checked)}
      />
      <br />

      <label> Importance (All, Important, Unimportant ) </label>
      <input
        type="range"
        min="0"
        max="2"
        value={importantFilter === null ? 0 : importantFilter}
        onChange={(e) => {
          const value = Number(e.target.value);
          setImportantFilter(value === 0 ? null : value);
        }}
      />
      <label>
        Category:
        <select
          name="Category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          required
        >
          <option value="">Select a category</option>

          <option value="WPA4">WPA4</option>
          <option value="WPS">WPS</option>
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
          <option value="Orange Islands">Orange Islands</option>
        </select>
      </label>
      <br></br>
      <label>Search:</label>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchInputChange}
        placeholder="Search tasks..."
      />

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />
      <UpdateTaskModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSubmit={handleUpdateTask}
        taskData={formData}
      />
      <CloneTask
        isOpen={isCloneModalOpen}
        onClose={() => setIsCloneModalOpen(false)}
        onSubmit={handleCloneTask}
        taskData={formData}
      />

      {showTaskAddedPopup && (
        <TaskAddedPopup
          onClose={() => {
            setShowTaskAddedPopup(false);
            window.location.reload();
            fetchTasks(); 
          }}
        />
      )}
      <div className="tasks-container">
        {tasks.length === 0 ? (
          <p>No tasks at the moment 😄</p>
        ) : (
          tasks.map((task) => {
            const today = moment();
            const deadline = moment(task.Deadline, "YYYY-MM-DD");
            const daysLeft = deadline.diff(today, "days") + 1;

            return (
                <div className="roll-in-blurred-left">
                  <div className="task-box">
                    <div className="drag-handle" style={{ cursor: "move" }}>
                      <h2>{task.Title}</h2> <h3>Mission #{task.ID}</h3>
                    </div>

                    <p>{task.Description}</p>
                    <p>{task.XP} XP</p>

                    {task.Attribute && (
                      <p style={{ color: "lightGreen" }}>
                        {task.Attribute} : +{task.AttributePoints}
                      </p>
                    )}

                    {task.Mastery && <p>Mastery: {task.Mastery}</p>}
                    {task.Difficulty && <p>Difficulty: {task.Difficulty}</p>}

                    {task.Progress > 0 && task.Progress <= 100 && (
                      <ProgressBar progress={task.Progress} />
                    )}

                    {daysLeft > -1 && (
                      <p className="Deadline">{daysLeft} days left</p>
                    )}
                    {daysLeft === 0 && <p className="Deadline">due today!</p>}

                    {!task.canBeCompleted ? (
                      <p style={{ color: "red" }}>
                        Mission #{task.Locked} must be completed first
                      </p>
                    ) : null}

                    {task.Category && <p>Category: {task.Category}</p>}

                    <div className="task-buttons-container">
                      <button
                        className="button-link"
                        disabled={!task.canBeCompleted}
                        onClick={() =>
                          handleCompleteTask(
                            task.ID,
                            task.XP,
                            task.Attribute,
                            task.AttributePoints,
                            task.Mastery
                          )
                        }
                      >
                        Complete
                      </button>

                      <button
                        className="button-close"
                        onClick={() => handleRemoveTask(task.ID)}
                      >
                        Remove
                      </button>

                      <FontAwesomeIcon
                        icon={faPencil}
                        className="icon-transition"
                        onClick={() => handleIconClick(task)}
                      />

                      <FontAwesomeIcon
                        icon={faPenFancy}
                        className="icon-transition"
                        onClick={() => handleCloneIconClick(task)}
                      />

                      {task.Important === 1 && (
                        <FontAwesomeIcon
                          icon={faExclamation}
                          className="tisimportant"
                        />
                      )}
                    </div>
                  </div>
                </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TasksPage;

const getProgressBarColor = (progress) => {
  if (progress <= 30) return "red";
  if (progress <= 70) return "orange";
  return "green";
};

const TaskAddedPopup = ({ onClose }) => {
  return (
    <div className="popup">
      <div className="popup-inner">
        <h1>Task Added Successfully!</h1>
        <button className="button-close" onClick={onClose}>
          Okay!
        </button>
      </div>
    </div>
  );
};

const Popup = ({ onClose }) => {
  return (
    <div className="popup">
      <div className="popup-inner">
        <h1> You completed a task!</h1>
        <p> EXP has been added for everyone!</p>
        <button className="button-close" onClick={onClose}>
          Okay!
        </button>
      </div>
    </div>
  );
};

const handleUpdateTask = async (updatedTask) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post(
      `http://${BASE_URL}/api/update-task/ID=${updatedTask.ID}`,
      updatedTask, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
    window.location.reload();
    setIsUpdateModalOpen(false);
  } catch (error) {
    console.error("Error updating task:", error);
  }
};

const handleCloneTask = async (updatedTask) => {

  try {
     const token = localStorage.getItem("token");
    await axios.post(`http://${BASE_URL}/api/clone-task`, updatedTask, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
    window.location.reload();
    setIsUpdateModalOpen(false);
  } catch (error) {
    console.error("Error updating task:", error);
  }
};
