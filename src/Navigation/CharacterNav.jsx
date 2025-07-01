import React from "react";
import { Link } from "react-router-dom";
import "../styling/Navigation.css";
// import {
//   playablechardata,
//   NPC,
//   strangersnfreakschardata,
//   onlinehardata,
//   Enemies,
//   makotoverse,
//   realife,
//   weapons,
// } from "../Characters/Charcterdata";

import { alltypes } from "../Characters/NewCharacterData";
export const base_url = "http://localhost:3000/characters"; // Include the protocol 'http://'
const dictionary = {
  playable: "Main Characters",
  NPC: "NPC",
  strangersnfreaks: "Stranger And Freaks",
  online: "Online",
  Enemies: "Enemies",
  Makotoverse: "Enter the Makotoverse",
  realife: "In real life",
  weapons: "weapons",
};
// export const dictionary2 = {
//   playable: playablechardata,
//   NPC: NPC,
//   Strangernfreaks: strangersnfreakschardata,
//   Online: onlinehardata,
//   Enemies: Enemies,
//   Makotoverse: makotoverse,
//   irl: realife,
//   weapons: weapons,
// };
// {alltypes.map((valueArray, index) =>
//   valueArray.map((valueObject, objectIndex) =>
//     Object.entries(valueObject).map(([key, value]) => (
//       <Route
//         key={key} // Use the key as the unique key for the Route
//         path={`${base_url}${key}`} // Use the key in the route path
//         element={<Characters chardata={value} />}
//       />
//     ))
//   )
// )}
const CharacterNav = () => {
  // Use a Set to track unique keys
  const uniqueKeys = new Set();

  alltypes.forEach((valueArray) => {
    valueArray.forEach((valueObject) => {
      Object.keys(valueObject).forEach((key) => {
        uniqueKeys.add(key);
      });
    });
  });

  // Convert Set back to array for mapping
  const uniqueKeysArray = Array.from(uniqueKeys);

  return (
    <div>
      {uniqueKeysArray.map((key, index) => (
        <ul key={key}>
          <li>
            <Link to={`${base_url}/${key}`} className="button-link">
              {dictionary[key]}
            </Link>
          </li>
        </ul>
      ))}
    </div>
  );
};

export default CharacterNav;
