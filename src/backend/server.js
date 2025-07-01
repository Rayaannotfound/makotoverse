const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const cors = require("cors");
const moment = require("moment"); 
const bodyParser = require("body-parser");
const cron = require("node-cron");


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



const saltRounds = 10;
console.log("Shadow realm");
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




app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM login WHERE username = ?",
    [username],
    async (error, results) => {
      if (error) {
        return res.status(500).send("Internal server error");
      }
      if (results.length === 0) {
        return res
          .status(401)
          .send({ message: "Invalid username or password" });
      }

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        res.send({ token: "mamamiaihaveatoken" });
      } else {
        res.status(401).send({ message: "Invalid username or password" });
      }
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
const jwt = require("jsonwebtoken");
const { Application } = require("discord.js");

const secret = "your_jwt_secret";

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
      //(results);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(results);
      //(results);
    }
  });
}
app.get("/api/getNews/:ID", (req, res) => {
  const ID = req.params.ID; 
  //("I am the ID", ID);

  const sqlQuery = `SELECT * FROM news_feed WHERE ${ID}`;
 
  // Execute the SQL query and send the result as a response
  DbQuery(sqlQuery, res);
});
app.post("/api/postdiaryentry", (req, res) => {
  const { Title, Morning, Afternoon, Evening, Night, Midnight, Notes } =
    req.body;
  
  const now = new Date();

 
  const pad = (num) => (num < 10 ? `0${num}` : num);


  const toDateTimeFormat = (date) => {
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // getMonth() returns 0-11
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

  //"INSERT INTO diary (Title, Morning, Afternoon, Evening, Night, Midnight, Notes, Completed, Date) VALUES ('Monday 26th feb','finished my essay','got to uni and attended a lecture. Almost voided my essay. But spoke to Oana and it was all good again','I went out to some shops and bought some cool stuff including a plush and 2 games','I\'m making this page','I\'ll hopefully be sleeping','should be a good day', 1, 2024-02-26 21:22:54)"
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
  //(flashcardId);
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

app.get("/api/stats", (req, res) => {
  db.query("SELECT * FROM newstats LIMIT 1", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]);
  });
});

app.post("/api/update-stats", (req, res) => {

  Object.entries(req.body).forEach(([key, value]) => {


    const query = `UPDATE newstats SET ${key}=? `;

    db.query(query, [value], (err, result) => {
      if (err) {
        res.status(500).json(err);
        return;
      }
      res.json({ message: "Data added successfully" });

    });
  });
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

//"INSERT INTO tasks (Title, Description, XP, isCompleted, Locked, Important, Deadline) VALUES ('One more!', 'LETS ', '10', 0, 0, 0, 2024-02-15)"
app.post("/api/add-task", (req, res) => {
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

  let isLocked = Locked || 0; 
  let isImportant = Important || 0; 
  let newDeadline = null; 


  if (Deadline && Deadline.trim() !== "") {
    const date = new Date(Deadline);
    newDeadline = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  }

  // Default values for optional fields
  let newAttribute = Attribute || null;
  let newAttributePoints = AttributePoints || 0;
  let newDifficulty = Difficulty || null;
  let newProgress = Progress || 0;

  let query = `INSERT INTO tasks (Title, Description, XP, isCompleted, Locked, Important, Deadline, Category, Attribute, AttributePoints, Difficulty, Progress, Mastery) 
               VALUES (?, ?, ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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

app.get("/api/tasks", (req, res) => {
  const sqlQuery = "SELECT * FROM tasks WHERE isCompleted=0 ORDER BY ID DESC;";
 
  DbQuery(sqlQuery, res);
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
        
        const updateStatsQuery = `UPDATE newstats SET ?? = ?? + ?`;
        db.query(
          updateStatsQuery,
          [Attribute, Attribute, AttributePoints],
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

app.post("/api/update-task/:id", (req, res) => {
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

app.post("/api/clone-task", (req, res) => {
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

  const updateTaskQuery = `
    INSERT INTO TASKS(Title, Description,XP, Locked, Important, Category,Attribute,AttributePoints,Difficulty,Progress,Mastery)
    VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
   
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
  { Title: "Go through AI badge", Description: "Go through AI badge", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Go through Ai interview questions", Description: "Go through Ai interview questions", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "If no work, do GitHub + ai badge on the background", Description: "If no work, do GitHub + ai badge on the background", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Get makotoverse on GitHub", Description: "Get makotoverse on GitHub", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Get card game on GitHub", Description: "Get card game on GitHub", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Get key pair value on GitHub", Description: "Get key pair value on GitHub", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Get birthday celebration on GitHub", Description: "Get birthday celebration on GitHub", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Get fathers day on GitHub", Description: "Get fathers day on GitHub", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Get new source code on GitHub", Description: "Get new source code on GitHub", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Get university adventure on GitHub", Description: "Get university adventure on GitHub", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "Tell  about your github", Description: "Tell about your ggithub", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "get that thing done", Description: "get that thing done", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
  { Title: "No lunch", Description: "No lunch", XP: 5000, Category: "Post game", Important: false, Attribute: "RES", AttributePoints: 14 },
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
        //("Task inserted", results.insertId);
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
  //(Name);
  const query = "UPDATE levels SET Experience = Experience + ? WHERE Name = ?";
  const selectQuery = "SELECT Experience FROM levels WHERE Name = ?";
  //(query);

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
