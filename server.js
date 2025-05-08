// Importing required modules here
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const mysql = require('mysql');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

// Create uploadimages directory if not exist
const uploadDir = path.join(__dirname, "upload_images");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Setup Multer using it to upload images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "upload_images"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage: storage });

// Create a connection to the database confidential veriables managed by .env file dotenv 
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connecting to the database SQL in my case
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

// Route to create a new user
app.post("/register", (req, res) => {
  const { email, password, type } = req.body;
  const query = "CALL addUser(?, ?, ?)";
  connection.query(query, [email, password, type], (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).send("User registered successfully!");
  });
});

// Route to fetch users
app.get("/users", (req, res) => {
  connection.query("SELECT * FROM users", (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.json(results);
  });
});

// Route to delete a user
app.delete("/users/:id", (req, res) => {
    const userId = req.params.id;
    const query = "DELETE FROM users WHERE ID = ?";
    connection.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send("User deleted successfully!");
    });
});

app.post("/upload", upload.array("images"), (req, res) => {
  res.status(200).send("Images uploaded");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
