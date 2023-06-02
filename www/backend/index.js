import express from "express";
import mysql from "mysql";
import cors from "cors";

var _global_id = 0;

const app = express();
// push them above the router middleware!

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "admin",
  password: "CrowneCC",
  database: "MediaDatabase",
  port: 3306,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
  connection.release();
});

app.use(cors());

app.get("/api", (req, res) => {
  res.json("Connected to backend!");
});

// GET METHOD TO REQUEST ALL DATA AS JSON FILE THROUGHT API

app.get("/api/media/", (req, res) => {
  const q = "SELECT * FROM Media;";
  db.getConnection((err, connection) => {
    if (err) {
      return res.json(err);
    }
    connection.query(q, (error, data) => {
      connection.release();
      if (error) {
        return res.json(error);
      }
      console.log("Connected To Backend! /api/media GET");
      return res.json(data);
    });
  });
});

// GET METHOD TO REQUEST ESPECIFIC DATA AS JSON FILE THROUGHT API
app.get("/api/media/:id", (req, res) => {
  const q = "SELECT * FROM Media WHERE id = ?;";
  db.getConnection((err, connection) => {
    if (err) {
      return res.json(err);
    }
    connection.query(q, [req.params.id], (error, data) => {
      connection.release();
      if (error) {
        return res.json(error);
      }
      console.log("Connected To Backend! /api/media GET [id]");
      return res.json(data);
    });
  });
});


app.get("/api/show/last_id/", (req, res) => {
  let answer = {
    id: _global_id,
  };
  console.log(_global_id);
  return res.json(answer);
});

app.post("/api/store/last_id/:id", (req, res) => {
  console.log(req.params.id);
  _global_id = req.params.id;

  let answer = {
    id: _global_id,
  };
  return res.json(answer);
});

// POST METHOD TO SET ESPECIFIC DATA AS JSON FILE THROUGHT API
app.post("/api/media/", (req, res) => {
  const q =
    "INSERT INTO Media (`id`,`title`,`descr`,`cover`,`average_score`,`release_date`,`media_type`) VALUES (?);";
  const values = [
    req.body.id,
    req.body.title,
    req.body.descr,
    req.body.cover,
    req.body.average_score,
    req.body.release_date,
    req.body.media_type,
  ];

  db.query(q, [values], (err, data) => {
    if (err) {
      console.log(Date.now());
      console.log("MEDIA error here;");
      console.log(values);
      console.log(err);
      return res.json(err);
    }
    console.log("MEDIA created here;");
    console.log(values);
    return res.json(data);
  });
});

// PUT METHOD TO UPDATE ESPECIFIC DATA AS JSON FILE THROUGHT API
app.put("/api/media/:id", (req, res) => {
  console.log("PUT METHOD");
  let id = req.params.id;
  let title = req.body.title;
  let descr = req.body.descr;
  let cover = req.body.cover;
  let vote_average = parseFloat(req.body.vote_average); // ensure vote_average is a valid number
  let release_date = req.body.release_date;
  let media_type = req.body.media_type;

  // check for presence and validity of vote_average
  if (isNaN(vote_average) || !isFinite(vote_average)) {
    console.log("Invalid vote_average value");
    return res.status(400).json({ error: "Invalid vote_average value" });
  }

  let sql =
    "UPDATE Media SET title = ?, descr = ?, cover = ?,average_score = ?, release_date = ?,media_type = ? WHERE id = ?;";
  db.query(
    sql,
    [title, descr, cover, vote_average, release_date, media_type, id],
    (err, data) => {
      if (err) {
        console.log("MEDIA Updated PUT ERROR");
        console.log(err);
        return res.json(err);
      }
      console.log("MEDIA Updated PUT [id]");
      return res.json(data);
    }
  );
});
// DELETE METHOD TO DELETE ESPECIFIC DATA AS JSON FILE THROUGHT API
app.delete("/api/media/:id", (req, res) => {
  let sql = "DELETE FROM Media WHERE id = ?";
  db.query(sql, [req.params.id], (err, data) => {
    if (err) {
      console.log("error on DELETE", req.params.id);
      return res.json(data);
    }
    console.log("DELETED Media with id = ", req.params.id);
    return res.json(data);
  });
});

app.listen(3100, () => {
  console.log("Connected To Backend! Updated");
});
