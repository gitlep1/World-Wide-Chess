const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const addSocketEventListeners = require("./socket");

const usersController = require("./controllers/usersController");
const guestController = require("./controllers/guestController");
const botsController = require("./controllers/botsController");
const singleGamesController = require("./controllers/singleGamesController");
const multiGamesController = require("./controllers/multiGamesController");
const moveHistoryController = require("./controllers/moveHistoryController");
const factsController = require("./controllers/factsController");
const shopController = require("./controllers/shopController");
const userInventoryController = require("./controllers/userInventoryController");
const guestInventoryController = require("./controllers/guestInventoryController");
const messagesController = require("./controllers/messagesController");
const dailyTasksController = require("./controllers/dailyTasksController");
const monthlyTasksController = require("./controllers/monthlyTasksController");

require("dotenv").config();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:4000",
  "https://world-wide-chess.vercel.app",
  "https://world-wide-chess-updates.vercel.app",
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

app.use(
  cors({
    credentials: true,
    origin: allowedOrigins,
  })
);

app.use(express.json());

// === account routes === \\
app.use("/users", usersController);
app.use("/guests", guestController);
app.use("/bots", botsController);

// === game routes === \\
app.use("/single-games", singleGamesController);
app.use("/multi-games", multiGamesController);
app.use("/move-history", moveHistoryController);

// === misc routes === \\
app.use("/facts", factsController);
app.use("/shop", shopController);

// === inventory routes === \\
app.use("/user-inventory", userInventoryController);
app.use("/guest-inventory", guestInventoryController);

// === message routes === \\
app.use("/messages", messagesController);

// === task routes === \\
app.use("/daily-tasks", dailyTasksController);
app.use("/monthly-tasks", monthlyTasksController);

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
  res.status(404).send("GET OUT OF HERE OR THE SITE DEMONS WILL GET YOU!!!");
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
