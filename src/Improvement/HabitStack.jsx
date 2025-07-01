import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styling/habitstack.css";
import "../styling/button.css";

const HabitStack = () => {
  const [habitStacks, setHabitStacks] = useState([]);
  const [time, setTime] = useState("");
  const [beforeAction, setBeforeAction] = useState("");
  const [afterAction, setAfterAction] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/getHabits");
      setHabitStacks(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAddStack = async () => {
    const newStack = {
      time,
      before: beforeAction,
      after: afterAction,
    };

    try {
      await axios.post("http://localhost:5000/addHabitStack", newStack);
      fetchData();
      setTime("");
      setBeforeAction("");
      setAfterAction("");
    } catch (error) {
      console.error("Error adding habit stack:", error);
    }
  };

  return (
    <div className="wrapper">
      <h2>Create a Habit Stack</h2>

      <div>
        <label>Time (e.g., Morning Routine, Evening Routine):</label>
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="flip-card__input"
          placeholder="Enter routine time"
          required
        />
      </div>

      <div>
        <label>Before I:</label>
        <input
          type="text"
          value={beforeAction}
          onChange={(e) => setBeforeAction(e.target.value)}
          className="flip-card__input"
          placeholder="Enter before action"
          required
        />
      </div>

      <div>
        <label>I will:</label>
        <input
          type="text"
          value={afterAction}
          onChange={(e) => setAfterAction(e.target.value)}
          className="flip-card__input"
          placeholder="Enter after action"
          required
        />
      </div>

      <button onClick={handleAddStack} className="button-submit">
        <span>Add Habit Stack</span>
      </button>

      <h3>Your Habit Stacks</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {habitStacks.map((stack, index) => (
          <div className="card" key={index}>
            <div className="card__content">
              <p className="title">{stack.TimeofHabit}</p>
              <p>Before I {stack.BeforeHabit}</p>
              <p>I will: {stack.AfterHabit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitStack;
