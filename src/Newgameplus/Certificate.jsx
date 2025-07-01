import React from "react";
import "../styling/title.css";
import "../styling/CustomModal.css";
import "../styling/button.css";
import "../styling/status.css";

import finalstats from "../photos/finalstats.PNG";
import finaldb from "../photos/finaldb.PNG";

const Certificate = () => {
  return (
    <div>
      <h3>CONGRATULATIONS </h3>
      <img src={finalstats} alt="amogus"></img>
      <img src={finaldb} alt="amogus"></img>
    </div>
  );
};

export default Certificate;
