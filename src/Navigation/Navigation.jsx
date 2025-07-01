import React from "react";
import { useNavigate } from "react-router-dom";
import "../styling/Navigation.css"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faShieldHalved,
  faGamepad,
  faNewspaper,
  faSchool,
  faMagnifyingGlass,
  faBarsProgress,
  faShop,
} from "@fortawesome/free-solid-svg-icons";

const Navigation = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li>
          <button className="nav-button" onClick={() => handleNavigation("/")}>
            <FontAwesomeIcon icon={faHome} /> Home
          </button>
        </li>
        <li>
          <button
            className="nav-button"
            onClick={() => handleNavigation("/characters/playable")}
          >
            <FontAwesomeIcon icon={faUser} /> Characters
          </button>
        </li>
        <li>
          <button
            className="nav-button"
            onClick={() => handleNavigation("/status")}
          >
            <FontAwesomeIcon icon={faGamepad} /> Status
          </button>
        </li>
        <li>
          <button
            className="nav-button"
            onClick={() => handleNavigation("/stats")}
          >
            <FontAwesomeIcon icon={faShieldHalved} /> Stats
          </button>
        </li>
        <li>
          <button
            className="nav-button"
            onClick={() => handleNavigation("/news")}
          >
            <FontAwesomeIcon icon={faNewspaper} /> News
          </button>
        </li>
        <li>
          <button
            className="nav-button"
            onClick={() => handleNavigation("/study/notes")}
          >
            <FontAwesomeIcon icon={faSchool} /> Study/Memes
          </button>
        </li>
        <li>
          <button
            className="nav-button"
            onClick={() => handleNavigation("/discovery")}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} /> Discovery
          </button>
        </li>
        <li>
          <button
            className="nav-button"
            onClick={() => handleNavigation("/tasks")}
          >
            <FontAwesomeIcon icon={faBarsProgress} /> Tasks
          </button>
        </li>

        <li>
          <button
            className="nav-button"
            onClick={() => handleNavigation("/marketplace")}
          >
            <FontAwesomeIcon icon={faShop} /> Marketplace
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
