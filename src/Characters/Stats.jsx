import React, { useState, useEffect } from "react";
import axios from "axios";
import Gojo from "../photos/Gojo.png";
import "../styling/gojo.css";
import "../styling/button.css";
import "../styling/modal.css";
import "../styling/stats.css";
import { Link } from "react-router-dom";
import StatPopup from "../Improvement/StatPopup";

const Stats = () => {
  const [stats, setStats] = useState({});
  const [inputs, setInputs] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  const openModal = () => setShowPopup(true);
  const closeModal = () => setShowPopup(false);

  const bubbleStyle = {
    position: "absolute",
    left: "100%",
    marginLeft: "20px",
    padding: "20px",
    backgroundColor: "#fff",
    border: "1px solid #000",
    borderRadius: "15px",
    color: "white",
  };

  const triangleStyle = {
    position: "absolute",
    top: "50%",
    left: "-20px",
    transform: "translateY(-50%) rotate(90deg)",
    width: 0,
    height: 0,
    borderLeft: "10px solid transparent",
    borderRight: "10px solid transparent",
    borderTop: "10px solid #fff",
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/stats")
      .then((response) => {
        const data = response.data;
        setStats(data);
        setInputs(
          Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: "" }), {})
        );
      })
      .catch((error) => console.error("Error fetching stats", error));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = Object.keys(inputs).reduce((acc, key) => {
      if (inputs[key]) {
        acc[key] = parseInt(stats[key] || 0, 10) + parseInt(inputs[key], 10);
      }
      return acc;
    }, {});

    try {
      await axios.post("http://localhost:5000/api/update-stats", dataToSend);
      setStats((prev) => ({ ...prev, ...dataToSend }));
      setInputs(Object.keys(inputs).reduce((acc, key) => ({ ...acc, [key]: "" }), {}));
    } catch (error) {
      console.error("Error posting updated stats:", error);
    }
  };

  const calcAverage = (keys, divisor) =>
    (keys.reduce((sum, key) => sum + (stats[key] || 0), 0) / divisor).toFixed(2);

  return (
    <div className="statsback">
      <div className="container">
        <Link to="/status">
          <button className="button-link">Status</button>
        </Link>
        <Link to="/mastery">
          <button className="button-link">Mastery</button>
        </Link>

        <form onSubmit={handleSubmit} className="stats-form">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="stats-item">
              <label>{key}: </label>
              <span>{value}</span>
              <input
                type="number"
                name={key}
                value={inputs[key] || ""}
                onChange={handleInputChange}
              />
            </div>
          ))}

          <p>DARKNESS: {calcAverage(["DOM", "RES", "VI", "ARC", "INS"], 5)}</p>
          <p>
            HERO:{" "}
            {calcAverage(["AT", "ARC", "HONOUR", "INS", "DOM", "LOVE"], 6)}
          </p>
          <p>
            HEALTH:{" "}
            {calcAverage(["VI", "ST", "EN", "RES", "LOVE", "HONOUR", "RES"], 5)}
          </p>
          <p>
            KNOWLEDGE:{" "}
            {calcAverage(["MA", "INTELLIGENCE", "FAI"], 3)}
          </p>

          <button type="submit">Update Stats</button>
        </form>

        <button onClick={openModal} className="button-info">
          Help
        </button>
        {showPopup && <StatPopup onClose={closeModal} />}

        <div className="image-container">
          <div style={bubbleStyle}>
            <div style={triangleStyle}></div>
            Hey there!
          </div>
          <img src={Gojo} alt="Gojo" className="centered-image" />
          <div className="fading-text-container">
            <h1 className="fading-rainbow-text">
              Picture a stronger version of yourself in the future
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
