import React, { useState, useEffect } from "react";
import "../styling/timing.css";

const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {

    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  
  const formattedTime = currentTime.toLocaleTimeString();
  const currentHour = currentTime.getHours();
  let greeting;
  let gradientColor;

  if (currentHour < 10 && currentHour > 8) {
    greeting =
      "Good morning! Rise and shine, my Lord to be! Hope you rested well!";
    gradientColor = "linear-gradient(135deg, #FAD961, #F76B1C)";
  } else if (currentHour < 12 && currentHour > 10) {
    greeting = "Hello! I hope you are doing well. I believe in you, my consort";
  } else if (currentHour < 15 && currentHour > 11) {
    greeting =
      "Good afternoon! I hope your day has been well! Please keep your awareness of what you are doing!";
    gradientColor = "linear-gradient(135deg, #A1FFCE, #FAFFD1)";
  } else if (currentHour < 19 && currentHour > 14) {
    greeting =
      "Hello my lord to be. You have made it to the afternoon evening part of the day. Very good! I hope you have been having a good day";
  } else if (currentHour < 8 && currentHour > 4) {
    greeting = "Nice and early it seems! As expected of my lord to be";
    gradientColor = "linear-gradient(135deg, #000428, #004e92)";
  } else if (currentHour > 17 && currentHour < 22) {
    greeting = "Good evening! Make the most of it my friend";
    gradientColor = "linear-gradient(135deg, #B0E0E6, #FFD700)";
  } else if (currentHour > 22 && currentHour < 1) {
    greeting = "Good night! Would you like me to comfort you whilst you sleep?";
    gradientColor = "linear-gradient(135deg, #191970, #4B0082)";
  } else {
    greeting =
      "My lord!! Please sleep or you will become unruly and weak tomorrow...no such way a lord should be acting. Come I will keep you warm while you sleep";
    gradientColor = "linear-gradient(135deg, #8B0000, #FF0000)";
  }
  return (
    <div>
      <h2>Current Time:</h2>
      <h3 className="time-based-message">{formattedTime}</h3>
      <h2 style={{ color: gradientColor }}> {greeting}</h2>
    </div>
  );
};

export default TimeDisplay;
