import React from "react";
import { Link } from "react-router-dom";
import "../styling/treesentenel.css";

const NavButtons = ({ dictionary }) => {
  return (
    <div>
      {Object.keys(dictionary).map((key) => (
        <ul>
          <li>
            <Link to={key} className="btn">
              {dictionary[key]}
            </Link>
          </li>
        </ul>
      ))}
    </div>
  );
};

export default NavButtons;
