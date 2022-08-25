const express = require("express");
const cors = require("cors");
const userController = require("./controllers/userController");
const gamesController = require("./controllers/gamesController");
const previousGamesController = require("./controllers/previousGamesController");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", userController);
app.use("/games", gamesController);
app.use("/previousGames", previousGamesController);

app.get("/", (req, res) => {
  res.send("Start playing chess!");
});

app.get("*", (req, res) => {
  res.status(404).send("Not found!");
});

module.exports = app;
