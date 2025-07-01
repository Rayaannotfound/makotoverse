import React, { useState, useEffect } from "react";
import "../styling/title.css";
import "../styling/CustomModal.css";
import "../styling/button.css";
import "../styling/status.css";
import axios from "axios";
import { LevelingUp, getNextLevel } from "../Improvement/levelup";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Mastery = () => {
  const [name, setName] = useState("");
  const [experience, setExperience] = useState("");
  const [levelData, setLevelData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const masteryNames = [
    "Snowflake", "Jenkins", "XR", "Makefile", "Java", "React",
    "React Testing", "Java Testing", "Python", "Python Testing",
    "Javascript", "Unity", "Opsec", "Ai Developer", "Fiction",
    "Writing", "Pheonix", "Swift", "Literature", "C",
    "Music", "SQL", "Pandas",
  ]; // I forgot not to hard code

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/getLevelData")
      .then((res) => setLevelData(res.data))
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`http://localhost:5000/api/addLevelData/${name}`, {
        Experience: experience,
      });
      setName("");
      setExperience("");
    } catch (error) {
      console.error("Error posting data:", error);
    }

    for (const entry of levelData) {
      try {
        const [newLevel, shouldShowPopup] = LevelingUp(entry.Experience, entry.Level);
        if (newLevel) {
          await axios.post(`http://localhost:5000/api/postNewLevel/${entry.Name}`, {
            Level: newLevel,
          });
          if (shouldShowPopup) setShowPopup(true);
        }
      } catch (error) {
        console.error("Error updating level:", error);
      }
    }

    window.location.reload();
  };

  const Popup = ({ closePopup }) => (
    <div className="popup">
      <div className="popup-inner">
        <h2>Your Mastery leveled up!</h2>
        <p>Congratulations.</p>
        <button onClick={closePopup}>Close</button>
      </div>
    </div>
  );

  const renderMasteryItem = (item, index) => {
    const xpNeeded = getNextLevel(item.Level, item.Experience);
    return (
      <p key={index}>
        <span className="name">{item.Name}</span>:{" "}
        <span className="levellabel">Level</span>{" "}
        <span className="level">{item.Level}</span>
        <br />
        <span className="EXPlabel">EXP</span>:{" "}
        <span className="experience">{item.Experience}</span>
        <br />
        <span className="EXPlabel">Rank: {item.Rank}</span>
        <br />
        {xpNeeded > -1 ? (
          <>
            <span className="nextdesc">XP Needed for next level up: </span>
            <span className="next">{xpNeeded}</span>
          </>
        ) : (
          <>
            <span className="youcanlevelup">You can level up now!</span>
            <p>
              {item.Level} <FontAwesomeIcon icon={faArrowRight} />{" "}
              {LevelingUp(item.Experience, item.Level)}
            </p>
          </>
        )}
      </p>
    );
  };

  return (
    <div className="leveling">
      {showPopup && <Popup closePopup={() => setShowPopup(false)} />}

      <header>
        <h2>All Masteries</h2>
      </header>

      <Link to="/diary">
        <button className="button-info">Diary</button>
      </Link>

      <form onSubmit={handleSubmit}>
        <label>
          Select a Mastery:
          <select value={name} onChange={(e) => setName(e.target.value)}>
            <option value="">Select a Mastery</option>
            {masteryNames.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <input
          type="number"
          placeholder="EXP"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
        />
        <button className="expbutton" type="submit">
          Submit
        </button>
      </form>

      <Link to="/stats">
        <button className="buttonui">Stats</button>
      </Link>

      {levelData.filter((item) => item.FRUIT === 1).map(renderMasteryItem)}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          margin: "20px",
          zIndex: 1000,
        }}
      >
        <iframe
          src="/stats"
          style={{ width: "800px", height: "900px" }}
        ></iframe>
      </div>
    </div>
  );
};

export default Mastery;
