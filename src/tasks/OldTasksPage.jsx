import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styling/modal.css";
import "../styling/button.css";
import "../styling/tasks.css";
import "../styling/notification.css";
import "../styling/news.css";

const OldTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const fetchTasks = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/getArchivedtasks");
      const filteredTasks = response.data.filter((task) =>
        task.Title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setTasks(filteredTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [searchQuery]);

  const handleReinstateTask = async (taskId) => {
    try {
      await axios.post(`http://localhost:5000/api/reinstate-task/ID=${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error("Error reinstating task:", error);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchTasks();
    }, 300); 

    return () => clearTimeout(debounce);
  }, [fetchTasks]);

  return (
    <div className="archivedback">
      <Link to="/tasks">
        <button className="button-link">Back to Tasks</button>
      </Link>
      <h1>Completed Tasks</h1>
      <p>You have completed {tasks.length} missions!</p>

      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchInputChange}
        placeholder="Search tasks..."
      />

      <div className="tasks-container">
        {tasks.map((task) => (
          <div className="task-box" key={task.ID}>
            <h2>{task.Title}</h2>
            <h3>Mission #{task.ID}</h3>
            <p>{task.Description}</p>
            <p>Category: {task.Category}</p>
            <p>XP: {task.XP}</p>
            <button
              className="button-close"
              onClick={() => handleReinstateTask(task.ID)}
            >
              Reinstate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OldTasksPage;
