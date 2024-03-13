const express = require("express");
const cors = require("cors");
const http = require("http");
const csurf = require("csurf");
const socketIO = require("socket.io");
const addSocketEventListeners = require("./socket");

const usersController = require("./controllers/usersController");
const guestController = require("./controllers/guestController");
const botsController = require("./controllers/botsController");
const singleGamesController = require("./controllers/singleGamesController");
const multiGamesController = require("./controllers/multiGamesController");
const singleMoveHistoryController = require("./controllers/moveHistorySingleController");
const multiMoveHistoryController = require("./controllers/moveHistoryMultiController");
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

app.use("/users", usersController);
app.use("/guests", guestController);
app.use("/bots", botsController);
app.use("/single-games", singleGamesController);
app.use("/single-move-history", singleMoveHistoryController);
app.use("/multi-games", multiGamesController);
app.use("/multi-move-history", multiMoveHistoryController);
app.use("/facts", factsController);
app.use("/shop", shopController);
app.use("/user-inventory", userInventoryController);
app.use("/guest-inventory", guestInventoryController);
app.use("/messages", messagesController);
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
