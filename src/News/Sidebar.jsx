import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faComments } from "@fortawesome/free-solid-svg-icons";
import "../styling/sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Link to="/news">
        <FontAwesomeIcon icon={faHome} />
      </Link>
      <Link to="/submitNews">
        <FontAwesomeIcon icon={faComments} />
      </Link>
    </div>
  );
};

export default Sidebar;
