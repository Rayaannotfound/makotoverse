import axios from "axios";

let alltypes = [];
let players = [];
let makotoverse = [];
let online = [];
let strangersnfreakschardata = [];
let npc = [];
let enemies = [];
let reallife = [];

const categoryMap = {
  Makotoverse: makotoverse,
  playable: players,
  online: online,
  strangersnfreaks: strangersnfreakschardata,
  NPC: npc,
  Enemies: enemies,
  realife: reallife,
};

axios
  .get("http://localhost:5000/api/allcharacters")
  .then((response) => {
    const characters = response.data;

    characters.forEach(({ charname, age, shortdesc, chartype, pic, category }) => {
      const characterData = [charname, age, shortdesc, chartype, pic];
      if (categoryMap[category]) {
        categoryMap[category].push({ [category]: characterData });
      }
    });

    alltypes = [
      players,
      makotoverse,
      online,
      strangersnfreakschardata,
      npc,
      enemies,
      reallife,
    ];
  })
  .catch((error) => {
    console.error("Error fetching character data:", error);
  });

export {
  alltypes,
  players,
  makotoverse,
  online,
  strangersnfreakschardata,
  npc,
  enemies,
  reallife,
};
