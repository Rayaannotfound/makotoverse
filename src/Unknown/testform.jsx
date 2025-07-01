import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import DataList from "./DataList";

function TestForm() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/addData", { name, age });
      setName("");
      setAge("");
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  return (
    <div>
      <h2>Add Data</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Age"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <DataList />
    </div>
  );
}

export default TestForm;
