import React, { useState, useEffect } from "react";
import "../styling/title.css";
import "../styling/CustomModal.css";

import "../styling/button.css";
import "../styling/status.css";
import Null from "../photos/null.jpg";
import PropTypes from "prop-types";
import axios from "axios";
import Solo from "../photos/solo.jpg";
import { LevelingUp, getNextLevel, getDifference } from "./levelup";
import XPBar from "./XpBar";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

const Statuses = () => {
  const [Name, setName] = useState("");
  const [Experience, setxp] = useState("");
  const [level, setLevel] = useState("");
  const [lvldata, setDataList] = useState([]);
  const [questpoints, setQuestPoints] = useState(null);
  const names = ["Makoto"];

  useEffect(() => {
    fetchData();
  }, []);
  const [showPopup, setShowPopup] = useState(false);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    
    setShowModal(true);
  }, []);

  const fetchData = async () => {
    try {
      const levelResponse = await axios.get(
        "http://localhost:5000/api/getLevelData"
      );
      setDataList(levelResponse.data);

      const questPointsResponse = await axios.get(
        "http://localhost:5000/api/getQuestPoints"
      );
      console.log("Quest Points Response Data:", questPointsResponse.data);

      setQuestPoints(questPointsResponse.data); 
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  console.table(lvldata);
  function NewLevel(newLevel, Name) {
    try {
      axios.post(`http://localhost:5000/api/postNewLevel/${Name}`, {
        Level: newLevel,
      });

     
      return (
        <div>
          <p> Lvl UP!</p>
        </div>
      );
    } catch (error) {
      console.error("Error posting data:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`http://localhost:5000/api/addLevelData/${Name}`, {
        Experience,
      });

     
      setName("");
      setxp("");
      setLevel("");
    } catch (error) {
      console.error("Error posting data:", error);
    }

    for (const key of Object.keys(lvldata)) {
      try {
        //("persona ", key);
        const newvalue = LevelingUp(
          lvldata[key].Experience,
          lvldata[key].Level
        );
        //("fuuka", newvalue[0]);

        if (newvalue[0] !== 0 && newvalue[0] !== undefined) {
          NewLevel(newvalue[0], lvldata[key].Name);
         

          setShowPopup(newvalue[1]);
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    }
    window.location.reload();
  };
  

  const Popup = ({ closePopup }) => {
    return (
      <div className="popup">
        <div className="popup-inner">
          <h2>You leveled up!</h2>
          <p>Congratulations.</p>
          <button onClick={closePopup}>Close</button>
        </div>
      </div>
    );
  };

  return (
    <div className="leveling">
      {showPopup && <Popup />}
      <header>
        <h2>Character sheet</h2>{" "}
        <a href="/certificate">
          <FontAwesomeIcon icon={faCrown} size="3x" color="yellow" />
        </a>
      </header>

      <Link to="/diary">
        <button className="button-info"> Diary</button>
      </Link>
      <form onSubmit={handleSubmit}>
        <label>
          Select a name:
          <select value={Name} onChange={(e) => setName(e.target.value)}>
            <option value="">Select a name</option>
            {names.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <input
          type="number"
          placeholder="EXP"
          value={Experience}
          onChange={(e) => setxp(e.target.value)}
        />
        <button className="expbutton" type="submit">
          Submit
        </button>
      </form>

      <Link to="/stats">
        <button className="buttonui">Stats</button>
      </Link>

      {lvldata
        .filter((item) => item.Name === "Makoto")
        .map((item, index) => {
          const nextXP = getNextLevel(item.Level, item.Experience);
          const levelBar = getDifference(item.Level);
          const overalldiff = levelBar[1] - levelBar[0];
          console.log(overalldiff, "  , ", levelBar[0]);
          console.log(item.Experience / levelBar[1]);

          console.log(levelBar);
          
          const canLevelUp = levelBar[1] - item.Experience < 0;
          console.log(canLevelUp);
          return (
            <p key={index}>
              <span className="name">{item.Name}</span>:{" "}
              <span className="levellabel">Level</span>{" "}
              <span className="level">{item.Level}</span>
              <br />
              <span className="EXPlabel">EXP</span>:{" "}
              <span className="experience">{item.Experience}</span> <br />
              <span className="HPlabel">HP</span>:{" "}
              <span className="health">{item.Health}</span> <br />
              <span className="EXPlabel">Rank: {item.Rank}</span> <br />
              {!canLevelUp ? (
                <>
                  <XPBar
                    current={overalldiff - (levelBar[1] - item.Experience)}
                    needed={overalldiff}
                  />

                  <span className="nextdesc">
                    XP Needed for next level up:{" "}
                  </span>
                  <span className="next">{nextXP}</span>
                </>
              ) : (
                <>
                  <XPBar current={1} needed={1} />
                  <span className="youcanlevelup">You can level up now!</span>
                  <p>
                    {item.Level} <FontAwesomeIcon icon={faArrowRight} />{" "}
                    {LevelingUp(item.Experience, item.Level)}
                  </p>
                </>
              )}
            </p>
          );
        })}

      <p>Quest points: {questpoints?.[0]?.Points ?? "Not available"}</p>
      <div
        style={{
          position: "fixed",
          bottom: "0",
          right: "0",
          margin: "20px",
          zIndex: "1000",
        }}
      >
        <iframe
          src="http://localhost:4000/community"
          style={{ width: "800px", height: "900px" }}
        ></iframe>
      </div>
    </div>
  );
};

export default Statuses;
