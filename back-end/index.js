const express = require("express");
const cors = require("cors");
const http = require("http");
const csurf = require("csurf");
const socketIO = require("socket.io");
const addSocketEventListeners = require("./socket");

const userController = require("./controllers/userController");
const guestController = require("./controllers/guestController");
const botsController = require("./controllers/botsController");
const singlePlayerGamesController = require("./controllers/singlePlayerGamesController");
const multiPlayerGamesController = require("./controllers/multiPlayerGamesController");
// const previousGamesController = require("./controllers/previousGamesController");
const factsController = require("./controllers/factsController");
const shopController = require("./controllers/shopController");
const inventoryController = require("./controllers/inventoryController");
const messagesController = require("./controllers/messagesController");

require("dotenv").config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://world-wide-chess.netlify.app",
  "https://world-wide-chess-updates.netlify.app",
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
// app.use(csrfProtection);
app.use(express.json());
app.use("/users", userController);
app.use("/guests", guestController);
app.use("/bots", botsController);
app.use("/single-player-games", singlePlayerGamesController);
app.use("/multi-player-games", multiPlayerGamesController);
// work on game history later \\
// app.use("/previousGames", previousGamesController);
app.use("/facts", factsController);
app.use("/shop", shopController);
app.use("/inventory", inventoryController);
app.use("/messages", messagesController);

app.get("/", (req, res) => {
  res.send(`
  <h1>World Wide Chess</h1>

  <form method="post" action="/login">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username">

      <label for="password">Password:</label>
      <input type="password" id="password" name="password">

      <button type="submit">Submit</button>
    </form>
  `);
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
