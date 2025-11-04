const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const cors = require("cors");
const moment = require("moment"); 
const bodyParser = require("body-parser");
const cron = require("node-cron");
require('dotenv').config()


const app = express();
const port = 5000;
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json({ limit: "500mb" }));

app.listen(8080, () => "API is running on http://localhost:5000/login");

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,


});

const jwt = require("jsonwebtoken");
const secret = process.env.DB_SECRET; 

const saltRounds = 10;
console.log("Shadow realm activated!");
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
});
async function createUser(username, password) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  db.query(
    "INSERT INTO login (username, password) VALUES (?, ?)",
    [username, hashedPassword],
    (error, results) => {
      if (error) {
        return console.error(error.message);
      }
    }
  );
}


// createUser("Makoto", "Makotoverse123");


function authenticateToken(req, res, next) {
  console.log("this is the req", req);  
  const authHeader = req.headers.authorization;
  console.log("autherhead ", authHeader);
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Use "Authorization: Bearer <token>"' });
  }

  console.log("Authorization header received:", authHeader);

  jwt.verify(token, secret, (err, payload) => {
    console.log('JWT verify payload:', payload);
    console.log('JWT verify error:', err);
    console.log('JWT verify error name:', token);
    if (err) {
      console.error('JWT verify error:', err.name, err.message);
  
      return res.status(403).json({ error: 'Invalid or expired token' });
      
    }
    if (!payload?.id) {
    
      return res.status(400).json({ error: 'Token missing id claim' });
    }
    req.user = payload;
    next();
  });
}



app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM login WHERE username = ?", [username], async (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Ensure we have an id value
    const userId = user.id ?? user.ID ?? user.user_id;

    const token = jwt.sign(
      { id: userId, username: user.username },
      secret,
      { expiresIn: "70h" }
    );

    res.json({token: token });
  });
});

  app.get("/api/betterstats/exists", authenticateToken, (req, res) => {
    const raw = (req.query.name || "").trim();
    const userId = req.user.id;
    if (!raw) return res.status(400).json({ error: "Missing name" });

    const name = raw.toUpperCase(); 
    db.query("SELECT 1 FROM betterstats WHERE statName = ? AND userID = ? LIMIT 1", [name, userId], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ exists: rows.length > 0 });
    });
  });

   app.post("/api/betterstats", authenticateToken, (req, res) => {
    let { statName, description } = req.body || {};
    const userId = req.user.id;
    statName = (statName || "").trim().toUpperCase();
    description = (description || "").trim();

    if (!statName || !/^[A-Z][A-Z0-9_]{1,31}$/.test(statName)) {
      return res.status(400).json({ error: "Invalid statName format" });
    }
    if (!description || description.length > 2000) {
      return res.status(400).json({ error: "Invalid description" });
    }

    db.query(
      "INSERT INTO betterstats (statName, description, userID) VALUES (?, ?, ?)",
      [statName, description, userId],
      (err, result) => {
        if (err) {
          
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ error: "Stat name already exists" });
          }
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: result.insertId, statName, description });
      }
    );
  });


app.post("/api/addData", (req, res) => {
  const { name, age } = req.body;
  const query = "INSERT INTO your_table (name, age) VALUES (?, ?)";

  db.query(query, [name, age], (err, result) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json({ message: "Data added successfully" });
  });
});

const { Application } = require("discord.js");



app.post("/api/news", (req, res) => {
  const { ID, Heading, Information } = req.body;
  const query = "INSERT INTO news_feed (Heading, Information) VALUES (?,?)";

  db.query(query, [ID, Heading, Information], (err, result) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json({ message: "Data added successfully" });
  });
});

app.post("/api/addCharacter", (req, res) => {
  const { name, age, type, shortdesc, image, category } = req.body;

  const query =
    "INSERT INTO sumcharacters (charname, age, chartype, shortdesc, category, pic) VALUES (?,?,?,?,?,?)";

  db.query(
    query,
    [name, age, type, shortdesc, category, image],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.json({ message: "Data added successfully" });
    }
  );
});
function DbQuery(sqlQuery, res) {
  db.query(sqlQuery, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
    }
  });
}
app.get("/api/getNews/:ID", (req, res) => {
  const ID = req.params.ID; 

  const sqlQuery = `SELECT * FROM news_feed WHERE ${ID}`;
 

  DbQuery(sqlQuery, res);
});
app.post("/api/postdiaryentry", (req, res) => {
  const { Title, Morning, Afternoon, Evening, Night, Midnight, Notes } =
    req.body;
  
  const now = new Date();

 
  const pad = (num) => (num < 10 ? `0${num}` : num);


  const toDateTimeFormat = (date) => {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); 
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const formatDateToSQL = (date) => {
    const pad = (number) => (number < 10 ? `0${number}` : number);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate()
    )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
      date.getSeconds()
    )}`;
  };

  const dateObject = new Date();
  const formattedDate = formatDateToSQL(dateObject);

  const query = `INSERT INTO diary (Title, Morning, Afternoon, Evening, Night, Midnight, Notes, Completed, Date) VALUES (?,?,?,?,?,?,?, 1, '${formattedDate}')`;

  
  db.query(
    query,
    [Title, Morning, Afternoon, Evening, Night, Midnight, Notes, 1, dateObject],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.json({ message: "Data added successfully" });
    }
  );
});
app.post("/api/addNewsData", (req, res) => {
  const { Heading, Information } = req.body;
  const query = "INSERT INTO news_feed (Heading, Information) VALUES (?, ?)";

  db.query(query, [Heading, Information], (err, result) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json({ message: "Data added successfully" });
  });
});

app.get("/api/getAllNews", (req, res) => {
  const sqlQuery = "SELECT ID, Heading FROM news_feed";

  DbQuery(sqlQuery, res);
});

app.get("/api/getData/", (req, res) => {
  const query = "SELECT * FROM your_table";

  db.query(query, (err, result) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json(result);
  });
});

app.get("/api/getDiary/", (req, res) => {
  const query = "SELECT * FROM diary";

  db.query(query, (err, result) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json(result);
  });
});

app.get("/api/flashcards", (req, res) => {
  const query = "SELECT * FROM flashcards ORDER BY ID ASC";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.get("/api/getHabits", (req, res) => {
  const query = "SELECT * FROM habitstack";
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

app.get("/api/flashcards/options/:id", async (req, res) => {
  const flashcardId = req.params.id;

  const query = `SELECT OptionText, IsCorrect FROM options WHERE ${flashcardId}`;

  db.query(query, [flashcardId], (err, results) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error fetching options", error: err });
    }
    res.json(results);
  });
});

app.get("/api/flashcards/:id", async (req, res) => {
  const { id } = req.params;
  
  const flashcardQuery = "SELECT * FROM flashcards WHERE ID = ?";
  const optionsQuery =
    "SELECT OptionText, IsCorrect FROM options WHERE FlashcardID = ?";

  try {
    const flashcardDetails = await new Promise((resolve, reject) => {
      db.query(flashcardQuery, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]); 
      });
    });

    res.json(flashcardDetails);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/api/flashcardsexp", (req, res) => {

  const updateLevelsQuery =
    'UPDATE levels SET Experience = Experience + 100 WHERE Name IN ("Makoto")';
  db.query(updateLevelsQuery, [100], (error, results) => {
    if (error) {
      return db.rollback(() => {
        console.error("Error updating levels:", error);
        res.status(500).json({ error: "Internal server error" });
      });
    }
  });
});

app.post("/api/diaryexp", (req, res) => {

  const updateLevelsQuery =
    'UPDATE levels SET Experience = Experience + 1000 WHERE Name IN ("Makoto")';
  db.query(updateLevelsQuery, [10], (error, results) => {
    if (error) {
      return db.rollback(() => {
        console.error("Error updating levels:", error);
        res.status(500).json({ error: "Internal server error" });
      });
    }
  });
});

app.post("/addHabitStack", (req, res) => {
  const { time, before, after } = req.body;

  let sql =
    "INSERT INTO habitstack (TimeofHabit, Before, After) VALUES (?, ?, ?)";
  db.query(sql, [time, before, after], (err, result) => {
    if (err) throw err;
    res.send("Habit stack added...");
  });
});
app.post("/api/addflashcard", (req, res) => {
  const { Question, Hint, Category, isMultipleChoice, Options, Answer, Link } =
    req.body;

  
  const insertQuestionQuery =
    "INSERT INTO flashcards (Question, Hint, Category, isMultipleChoice, Answer, Link) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(
    insertQuestionQuery,
    [Question, Hint, Category, isMultipleChoice, Answer, Link],
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      const flashcardId = result.insertId;

      if (isMultipleChoice && Options && Options.length) {
     
        const optionsInserts = Options.map((option) => [
          flashcardId,
          option,
          option === Answer,
        ]);
        const insertOptionsQuery =
          "INSERT INTO options (FlashcardID, OptionText, IsCorrect) VALUES ?";
        db.query(insertOptionsQuery, [optionsInserts], (optionsErr) => {
          if (optionsErr) {
            return res.status(500).send(optionsErr);
          }
          res.status(201).json({
            message: "Multiple choice flashcard added successfully",
            flashcardId,
          });
        });
      } else {
        res
          .status(201)
          .json({ message: "Flashcard added successfully", flashcardId });
      }
    }
  );
});

app.put("/api/flashcards/:id", (req, res) => {
  const { id } = req.params;
  const { Question, Answer, Hint, Category, Link } = req.body;
  const optionquery = `UPDATE options SET OptionText = ? WHERE FlashcardID=${id} and isCorrect=1`;

  const query =
    "UPDATE flashcards SET Question = ?, Answer = ?, Hint = ?, Category = ?, Link = ? WHERE ID = ?";
  db.query(
    query,
    [Question, Answer, Hint, Category, Link, id],
    (err, result) => {
      if (err) {
        res.status(500).send(err);
        return;
      }

      if (Answer) {
        db.query(optionquery, [Answer], (err, result) => {
          if (err) {
            res.status(500).send(err);
            return;
          }
          res
            .status(200)
            .json({ message: "Flashcard and option updated successfully" });
        });
      } else {
        res.status(200).json({ message: "Flashcard updated successfully" });
      }
    }
  );
});
app.delete("/api/deleteflashcards/:id", (req, res) => {
  const { id } = req.params;

  let newid = id.replace("ID=", "");

  const deleteOptionsQuery = `DELETE FROM options WHERE FlashcardID=${newid}`;

  db.query(deleteOptionsQuery, [id], (err, result) => {
    if (err) {
 
      res.status(500).send(err);
      return;
    }

   
    const deleteFlashcardQuery = `DELETE FROM flashcards WHERE ID=${newid}`;
   
    db.query(deleteFlashcardQuery, [id], (err, result) => {
      if (err) {

        res.status(500).send(err);
        return;
      }


      res.status(200).json({
        message: "Flashcard and associated options deleted successfully",
      });
    });
  });
});

app.get("/api/stats", authenticateToken, (req, res) => {
  const userId = req.user.id;
  db.query(
    "SELECT statName, points FROM betterstats WHERE userID = ? ORDER BY statName", userId,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows); 
    }
  );
});


app.post("/api/update-stats", authenticateToken, async (req, res) => {
  const entries = Object.entries(req.body); 
  if (entries.length === 0) {
    return res.status(400).json({ error: "No updates provided" });
  }

  const allowed = new Set([
    "VI","ST","MA","AT","RES","EN","INTELLIGENCE","FAI","INS",
    "ARC","HONOUR","DOM","ECHOES","DEX","LOVE"
  ]);
const userId = req.user.id;
  const sql = "UPDATE betterstats SET points = ? WHERE statName = ? AND userID = ?";
  const tasks = entries
    .filter(([name]) => allowed.has(name))
    .map(([name, points]) =>
      new Promise((resolve, reject) =>
        db.query(sql, [Number(points) || 0, name, userId],  (err, r) =>
          err ? reject(err) : resolve(r)
        )
      )
    );

  try {
    await Promise.all(tasks);
    res.json({ ok: true, updated: tasks.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


app.get("/api/getLatestNews/", (req, res) => {
  const sqlQuery = `SELECT *
  FROM news_feed
  ORDER BY createdAt DESC
  LIMIT 1;`;

  DbQuery(sqlQuery, res);
});

app.get("/api/getLevelData", (req, res) => {
  const sqlQuery = `SELECT * FROM levels ORDER BY Experience DESC`;

  DbQuery(sqlQuery, res);
});

app.post("/api/postNewLevel/:Name", (req, res) => {
  const { Level } = req.body; 
  const Name = req.params.Name;
  let rank;
  if (Level > 0 && Level < 25) {
    rank = "F";
  } else if (Level > 24 && Level < 50) {
    rank = "E";
  } else if (Level > 49 && Level < 60) {
    rank = "D";
  } else if (Level > 59 && Level < 80) {
    rank = "C";
  } else if (Level > 79 && Level < 90) {
    rank = "B";
  } else if (Level > 89 && Level < 100) {
    rank = "A";
  } else if (Level > 99 && Level < 118) {
    rank = "S";
  } else {
    rank = "S+";
  }

  
  let Levelup;
  
  if (Level < 99) {
    Levelup = `UPDATE levels SET Level = ?, Health = Health + 50, Rank = ? WHERE Name = ?`;
  } else if (Level > 102) {
    Levelup = `UPDATE levels SET Level = ?, Health = Health + 200, Rank = ? WHERE Name = ?`;
  } else {
    Levelup = `UPDATE levels SET Level = ?, Health = 9999, Rank = ? WHERE Name = ?`;
  }



  const selectQuery = `SELECT Experience FROM levels WHERE Name = ?`;

  db.query(selectQuery, [Name], (error, results) => {
    if (error) {
      console.error("Error fetching number:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      
      db.query(Levelup, [Level, rank, Name], (error, results) => {
        if (error) {
          console.error("Error updating record:", error);
          res.status(500).json({ error: "Internal server error" });
        } else {
          res.json({ message: "Record updated successfully" });
        }
      });
    }
  });
});


app.post("/api/add-task", authenticateToken, (req, res) => {
  console.log("Adding task...");
  console.log("Request:", req);
  const {
    Title,
    Description,
    XP,
    Locked,
    Important,
    Deadline,
    Category,
    Attribute, 
    AttributePoints, 
    Difficulty, 
    Progress, 
    Mastery,
    
  } = req.body;
const userId = req.user.id; 
  let isLocked = Locked || 0; 
  let isImportant = Important || 0; 
  let newDeadline = null; 


  if (Deadline && Deadline.trim() !== "") {
    const date = new Date(Deadline);
    newDeadline = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  }


  let newAttribute = Attribute || null;
  let newAttributePoints = AttributePoints || 0;
  let newDifficulty = Difficulty || null;
  let newProgress = Progress || 0;

  let query = `INSERT INTO tasks (Title, Description, XP, isCompleted, Locked, Important, Deadline, Category, Attribute, AttributePoints, Difficulty, Progress, Mastery, userid) 
               VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(
    query,
    [
      Title,
      Description,
      XP,
      isLocked,
      isImportant,
      newDeadline,
      Category,
      newAttribute,
      newAttributePoints,
      newDifficulty,
      newProgress,
      Mastery,
      userId
    ],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.json({ message: "Data added successfully" });
    }
  );
});



app.get("/api/tasks", authenticateToken, (req, res) => {
  const userId = req.user.id;
   console.log("Authenticated user ID:", userId);
   console.log("User ID from token:", userId);
   const sqlQuery = "SELECT * FROM tasks WHERE userid = ? AND isCompleted=0 ORDER BY ID DESC;";

   db.query(sqlQuery, [userId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});
app.get("/api/task/:Locked", (req, res) => {
  const taskId = req.params.Locked;
  const sqlQuery = `SELECT isCompleted FROM tasks WHERE ${taskId};`;

  DbQuery(sqlQuery, res);
});
app.get("/api/getArchivedtasks", (req, res) => {
  const sqlQuery = "SELECT * FROM tasks WHERE isCompleted=1 ORDER BY  ID ASC;";
 
  DbQuery(sqlQuery, res);
});

app.get("/api/task/details/:id", (req, res) => {
  const taskId = req.params.id;

  const query = `
    SELECT ID, Title, XP, Attribute, AttributePoints, Mastery, isCompleted 
    FROM tasks 
    WHERE ID = ?;
  `;

  db.query(query, [taskId], (error, results) => {
    if (error) {
      console.error("Error fetching task details:", error);
      return res.status(500).json({ error: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(results[0]); 
  });
});

app.post("/api/complete-task/:id", (req, res) => {
  const taskId = req.params.id;
  const { xp: XP, Attribute, AttributePoints, Mastery } = req.body;
  console.log(Mastery, "  <--- Mastery");

  if (!taskId || !XP) {
    return res.status(400).json({ error: "Task ID and XP are required" });
  }

  db.beginTransaction((error) => {
    if (error) {
      console.error("Error starting transaction:", error);
      return res.status(500).json({ error: "Internal server error" });
    }


    const updateTaskQuery = `UPDATE tasks SET isCompleted = 1 WHERE ${taskId}`;
    db.query(updateTaskQuery, (error) => {
      console.log(updateTaskQuery);
      if (error) {
        return db.rollback(() => {
          console.error("Error updating tasks:", error);
          res.status(500).json({ error: "Internal server error" });
        });
      }
    });

    let updateLevelsQuery = "";
   
    if (Mastery !== null) {
      updateLevelsQuery =
        'UPDATE levels SET Experience = Experience + ? WHERE Name IN ( "Makoto", ?)';
    } else {
      updateLevelsQuery =
        'UPDATE levels SET Experience = Experience + ? WHERE Name IN ( "Makoto")';
    }

    db.query(updateLevelsQuery, [XP, Mastery], (error) => {
      if (error) {
        return db.rollback(() => {
          console.error("Error updating levels:", error);
          res.status(500).json({ error: "Internal server error" });
        });
      }

    
      if (Attribute && AttributePoints) {
        
        const updateStatsQuery = `UPDATE betterstats SET points = points + ? WHERE statName = ?`;
        db.query(
          updateStatsQuery,
          [AttributePoints, Attribute],
          (error) => {
            if (error) {
              return db.rollback(() => {
                console.error("Error updating newstats:", error);
                res.status(500).json({ error: "Internal server error" });
              });
            }

        
            db.commit((err) => {
              if (err) {
                return db.rollback(() => {
                  console.error("Error committing transaction:", err);
                  res.status(500).json({ error: "Internal server error" });
                });
              }
              res.json({ success: true });
            });
          }
        );
      } else {
     
        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error committing transaction:", err);
              res.status(500).json({ error: "Internal server error" });
            });
          }
          res.json({ success: true });
        });
      }
    });
  });
});

app.post("/api/remove-task/:id", (req, res) => {
  const taskId = req.params.id;

  const updateTaskQuery = `UPDATE tasks SET isCompleted = 1 WHERE ${taskId}`;

  db.query(updateTaskQuery, (err, result) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json({ message: "Data added successfully" });
   
  });
});
app.post("/api/reinstate-task/:id", (req, res) => {
  const taskId = req.params.id;

  const updateTaskQuery = `UPDATE tasks SET isCompleted = 0 WHERE ${taskId}`;
 
  db.query(updateTaskQuery, (err, result) => {
    if (err) {
      res.status(500).json(err);
      return;
    }
    res.json({ message: "Data added successfully" });

  });
});

app.post("/api/update-task/:id", authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const {
    Title,
    Description,
    XP,
    Locked,
    Important,
    Category,
    Attribute,
    AttributePoints,
    Difficulty,
    Progress,
    Mastery,
  } = req.body;
const userId = req.user.id;
  const updateTaskQuery = `
    UPDATE tasks 
    SET 
      Title = ?, 
      Description = ?, 
      XP = ?, 
      Locked = ?, 
      Important = ?, 
      Category = ?, 
      Attribute = ?, 
      AttributePoints = ?, 
      Difficulty = ?, 
      Progress = ?,
      Mastery = ?
   WHERE ${taskId}
  `;

  let isLocked = Locked || 0;
  let isImportant = Important || 0;
  let newAttribute = Attribute || null;
  let newAttributePoints = AttributePoints || 0;
  let newDifficulty = Difficulty || null;
  let newProgress = Progress || 0;

  db.query(
    updateTaskQuery,
    [
      Title,
      Description,
      XP,
      isLocked,
      isImportant,
      Category,
      newAttribute,
      newAttributePoints,
      newDifficulty,
      newProgress,
      Mastery,
      userId,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.json({ message: "Task updated successfully" });
    }
  );
});

app.post("/api/clone-task", authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const {
    Title,
    Description,
    XP,
    Locked,
    Important,
    Category,
    Attribute,
    AttributePoints,
    Difficulty,
    Progress,
    Mastery,
  } = req.body;
const userId = req.user.id;
console.log(userId, "  <--- userId");
  const updateTaskQuery = `
    INSERT INTO TASKS(Title, Description,XP, Locked, Important, Category,Attribute,AttributePoints,Difficulty,Progress,Mastery, userid)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?)
   
  `;

  let isLocked = Locked || 0;
  let isImportant = Important || 0;
  let newAttribute = Attribute || null;
  let newAttributePoints = AttributePoints || 0;
  let newDifficulty = Difficulty || null;
  let newProgress = Progress || 0;

  db.query(
    updateTaskQuery,
    [
      Title,
      Description,
      XP,
      isLocked,
      isImportant,
      Category,
      newAttribute,
      newAttributePoints,
      newDifficulty,
      newProgress,
      Mastery,
      userId,
    ],
    (err, result) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.json({ message: "Task updated successfully" });
    }
  );
});

app.get("/api/getdiscoveries", (req, res) => {
  const sqlQuery = `SELECT title, description, photo FROM discovery`;
  db.query(sqlQuery, (error, results) => {
    if (error) {
      console.error("Error:", error);
      res.status(500).send("Error fetching content list");
    } else {
      const contentList = results.map((row) => {
        const { title, description, photo } = row;
        return { title, description, photo: JSON.parse(photo).photo };
      });
      res.status(200).json(contentList);
  
    }
  });
});

app.post("/api/newdiscovery", (req, res) => {


  const { title, description, photo } = req.body.content;

  const content = {
    title: title,
    description: description,
    photo: photo,
  };
 
  let query;

  query = `INSERT INTO discovery (Title, Description, Photo) VALUES (?,?,?)`;

  db.query(
    query,
    [title, description, JSON.stringify(content)],
    (error, results) => {
      if (error) {
        console.error("Error:", error);
        res.status(500).send("Error storing content");
      } else {
   
        res.status(200).send("Content stored successfully");
      }
    }
  );
});
app.post("/api/studying", (req, res) => {
  const { title, type, body } = req.body.content;

  const content = {
    title: title,
    type: type,
    body: body,
  };
  findExistingStudy(title, (error, titlenew) => {
 
    if (error) {
      console.error(error);
    } else {
   console.log("kizaru..we have studied 100x harder than before")
    }


    let query;
    if (titlenew) {
   
      query = `UPDATE studying
    SET title = ?, type = ?, content = ?
    WHERE title = '${titlenew}'`;
     
    } else {
      query = `INSERT INTO studying (title, type, content) VALUES (?,?,?)`;
    }

    db.query(
      query,
      [title, type, JSON.stringify(content)],
      (error, results) => {
       
        if (error) {
          console.error("Error:", error);
          res.status(500).send("Error storing content");
        } else {
        
          res.status(200).send("Content stored successfully");
        }
      }
    );
  });
});
function findExistingStudy(title, callback) {
  db.query(
    `SELECT title FROM studying WHERE title="${title}"`,
    (error, results) => {
      if (error) {
        console.error("Error:", error);
        callback("Error fetching content list", null);
      } else {
        if (results.length > 0) {
          const existingTitle = results[0].title;
          callback(null, existingTitle);
        } else {
      
          callback(null, null);
        }
      }
    }
  );
}

app.get("/api/get-content-list/:id", (req, res) => {
  const id = req.params.id;
  db.query(
    `SELECT id, title, content, type FROM studying WHERE ${id}`,
    (error, results) => {
      if (error) {
        console.error("Error:", error);
        res.status(500).send("Error fetching content list");
      } else {
        const contentList = results.map((row) => {
          const { id, title, content, type } = row;
          return { id, title, content: JSON.parse(content).body, type };
        });
        res.status(200).json(contentList);
      }
    }
  );
});

app.get("/api/getQuestPoints", (req, res) => {
  const sqlQuery = `SELECT Points FROM questpoints`;
  DbQuery(sqlQuery, res);
});
// batch quests for when I need to add a bunch of ones randomly (click cron button for)
const quests = [
  { Title: "Get virtualbox on Windows machine", Description: "Get virtualbox on Windows machine", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Get ps3 emulator on vbox", Description: "Get ps3 emulator on vbox", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Get n64 for personal use", Description: "Get n64 for personal use", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Clean up room before getting n64 so theres space", Description: "Clean up room before getting n64 so theres space", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Unlock v2 without demon entropy", Description: "Unlock v2 without demon entropy", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Learn about Dockerfile", Description: "Learn about Dockerfile", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Learn about Kubernetes", Description: "Learn about Kubernetes", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Learn about cloud formation", Description: "Learn about cloud formation", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Learn about AWS bedrock", Description: "Learn about AWS bedrock", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Clear first badge", Description: "Clear first badge", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Buy pokemon cards", Description: "Buy pokemon cards", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Buy your sister 2ds pink unboxed", Description: "Buy your sister 2ds pink unboxed", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 }
];


app.post("/api/add-daily-quests", (req, res) => {
  quests.forEach((quest) => {
    const {
      Title,
      Description,
      XP,
      Category,
      Important,
      Attribute,
      AttributePoints,
    } = quest;
    const sql =
      "INSERT INTO tasks (Title, Description, XP, Category, Important, Attribute, AttributePoints) VALUES (?, ?, ?, ?, ?, ?, ?)";
    db.query(
      sql,
      [Title, Description, XP, Category, Important, Attribute, AttributePoints],
      (error, results) => {
        if (error) throw error;
  
      }
    );
  });
});

app.get("/api/allstudies", (req, res) => {
  DbQuery(`SELECT id, title FROM studying`, res);
});
app.get("/api/allcharacters", (req, res) => {
  DbQuery(`SELECT * FROM sumcharacters`, res);
});

app.post("/api/addLevelData/:Name", (req, res) => {
  const { Experience } = req.body;
  const Name = req.params.Name;
 
  const query = "UPDATE levels SET Experience = Experience + ? WHERE Name = ?";
  const selectQuery = "SELECT Experience FROM levels WHERE Name = ?";


  db.query(selectQuery, [Name], (error, results) => {
    if (error) {
      console.error("Error fetching number:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      db.query(query, [Experience, Name], (error, results) => {
        if (error) {
          console.error("Error updating record:", error);
          res.status(500).json({ error: "Internal server error" });
        } else {
          res.json({ message: "Record updated successfully" });
        }
      });
    }
  });
});


app.listen(port, () => {
  //(`Server is running on port ${port}`);
});
