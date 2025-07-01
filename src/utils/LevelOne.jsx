import React, { useState, useEffect } from "react";
import levelonebackground from "../photos/levelonebackground.jpg";
import redleft from "../photos/redleftfacing.png";

const LevelOne = () => {
  const [position, setPosition] = useState({ x: 100, y: 0 });
  const [redup, setRedup] = useState(false); 
  const [facingLeft, setFacingLeft] = useState(false); 

  useEffect(() => {
    const handleKeyDown = (event) => {
      setPosition((prevPosition) => {
        const step = 20;
        const key = event.key.toLowerCase();

        let newX = prevPosition.x;
        let newY = prevPosition.y;
        let movingUp = redup;
        let isFacingLeft = facingLeft;

        switch (key) {
          case "w":
            newY = prevPosition.y + step; 
            movingUp = true;
            break;
          case "s":
            newY = prevPosition.y - step; 
            movingUp = false;
            break;
          case "a":
            newX = prevPosition.x - step;
            isFacingLeft = true;
            break;
          case "d":
            newX = prevPosition.x + step;
            isFacingLeft = false;
            break;
          default:
            return prevPosition;
        }

        setRedup(movingUp);
        setFacingLeft(isFacingLeft);
        return {
          x: Math.max(0, Math.min(window.innerWidth - 100, newX)),
          y: Math.max(0, Math.min(window.innerHeight - 100, newY)),
        };
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [redup, facingLeft]);

  return (
    <div
      style={{
        backgroundImage: `url(${levelonebackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
    >
      <img
        src={redleft} 
        alt="Red Character"
        style={{
          width: "100px",
          height: "100px",
          position: "absolute",
          left: `${position.x}px`,
          bottom: `${position.y}px`,
          transition: "0.1s ease-out",
          transform: `scaleX(${facingLeft ? "1" : "-1"})`,
        }}
      />
    </div>
  );
};

export default LevelOne;
