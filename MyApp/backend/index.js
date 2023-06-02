import express from "express";
import mysql from "mysql";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

var _global_id = 0;
const port = process.env.PORT || 5000;
const app = express();
// push them above the router middleware!

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// parse application/json
app.use(express.json());

const db = mysql.createPool({
  host: "0.0.0.0",
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
  db.query(q, (err, data) => {
    if (err) {
      return res.json(err);
    }
    console.log("Connected To Backend! /api/media GET");
    return res.json(data);
  });
});

// GET METHOD TO REQUEST ESPECIFIC DATA AS JSON FILE THROUGHT API
app.get("/api/media/:id", (req, res) => {
  const q = "SELECT * FROM Media WHERE id = ?;";
  db.query(q, [req.params.id], (err, data) => {
    if (err) {
      return res.json(err);
    }
    console.log("Connected To Backend! /api/media GET [id]");
    return res.json(data);
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

app.listen(port, () => {
  console.log("Backend! Runnimg on port:" + port + "");
});

const API_KEY = process.env.API_KEY || "530e0261c942a040e464884807ad95d8";
const BASE_URL = "https://api.themoviedb.org/3";

app.get("/api/tmdb/media", async (req, res) => {
  const LANG = "&language=es-ES";
  const mediaType = req.query.mediaType;
  const searchTerm = req.query.query ? decodeURIComponent(req.query.query) : "";
  const query = searchTerm ? `&query=${searchTerm}` : "";
  let apiURL = "";
  if (query === "") {
    apiURL =
      mediaType === "Pelicula"
        ? `${BASE_URL}/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}${LANG}`
        : `${BASE_URL}/discover/tv?sort_by=popularity.desc&api_key=${API_KEY}${LANG}`;
  } else {
    apiURL =
      mediaType === "Pelicula"
        ? `${BASE_URL}/search/movie?api_key=${API_KEY}${LANG}${query}`
        : `${BASE_URL}/search/tv?api_key=${API_KEY}${LANG}${query}`;
  }

  try {
    const response = await axios.get(apiURL);
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
