const express = require("express");
const cors = require("cors");
const http = require("http");
const csurf = require("csurf");
const socketIO = require("socket.io");
const addSocketEventListeners = require("./socket");

const userController = require("./controllers/userController");
const gamesController = require("./controllers/gamesController");
const previousGamesController = require("./controllers/previousGamesController");

require("dotenv").config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://world-wide-chess.netlify.app",
];

const httpServer = http.createServer(app);
const io = socketIO(httpServer, {
  cors: {
    credentials: true,
    origin: allowedOrigins,
  },
});

const csrfProtection = csurf({ cookie: true });

app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  })
);

app.get("/csrf-token", (req, res) => {
  res.set("X-CSRF-Token", req.csrfToken());
  res.status(200).send();
});

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

addSocketEventListeners(io);

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Playing chess on port ${PORT} 
  ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜
  ⬜️⬛️⬜️⬛️⬜️⬛️⬜️⬛️
  ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟
  ⬛️⬜️⬛️⬜️⬛️⬜️⬛️⬜️
  ⬜️⬛️⬜️⬛️⬜️⬛️⬜️⬛️
  ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙
  ⬛️⬜️⬛️⬜️⬛️⬜️⬛️⬜️
  ♖ ♘ ♗ ♔ ♕ ♗ ♘ ♖
  `);
});
