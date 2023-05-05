const express = require("express");
const Chess = require("chess.js").Chess;
const games = express.Router();

const {
  getAllGames,
  getGameByID,
  createGame,
  updateGame,
  deleteGame,
} = require("../queries/games");

games.get("/", async (req, res) => {
  const allGames = await getAllGames();
  if (allGames) {
    // console.log("=== GET games", allGames, "===");
    res.status(200).json(allGames);
  } else {
    res.status(404).send("No chess games found.");
  }
});

games.get("/:id", async (req, res) => {
  const { id } = req.params;
  const aGame = await getGameByID(id);

  if (aGame.length > 0) {
    // console.log("=== GET game", aGame, "===");
    res.status(200).json(aGame[0]);
  } else {
    res.status(404).send(`Cannot get chess game with ID: ${id}`);
  }
});

games.post("/", async (req, res) => {
  const newGameData = {
    room_name: req.body.room_name,
    room_password: req.body.room_password,
    player1id: req.body.player1id,
    player2id: req.body.player2id,
  };

  const newGame = await createGame(newGameData);

  if (newGame) {
    console.log("=== CREATE game", newGame, "===");
    res.status(200).json(newGame);
  } else {
    res.status(404).send("Cannot create a new game.");
  }
});

games.put("/:id", async (req, res) => {
  const { id } = req.params;

  const updatedGameData = {
    player2id: req.body.player2id,
    player1color: req.body.player1color,
    player2color: req.body.player2color,
    in_progress: req.body.in_progress,
    current_positions: req.body.current_positions,
  };

  const updateGameData = await updateGame(id, updatedGameData);

  if (updateGameData) {
    console.log("=== UPDATE game", updateGameData, "===");
    res.status(200).json(updateGameData);
  } else {
    res.status(404).send("Couldn't update game.");
  }
});

games.put("/:id/move", async (req, res) => {
  const { id } = req.params; // game ID
  const { from, to, promotion } = req.body; // move information

  // get the current game state from the database
  const game = await getGameByID(id);
  // create a new chess.js instance using the current game state
  const chessGame = new Chess(game[0].current_positions);

  const oldGameData = {
    player2id: req.body.player2id,
    player1color: req.body.player1color,
    player2color: req.body.player2color,
    in_progress: req.body.in_progress,
    current_positions: chessGame.fen(),
  };

  if (promotion !== "") {
    const move = chessGame.move({ from, to, promotion });
    if (move) {
      const updatedGameData = {
        player2id: oldGameData.player2id,
        player1color: oldGameData.player1color,
        player2color: oldGameData.player2color,
        in_progress: oldGameData.in_progress,
        current_positions: move.after,
      };
      // if the move is valid, update the game state in the database
      const updatedGame = await updateGame(id, updatedGameData);
      console.log("updated game ID: ", id, "with data: ", updatedGame);
      res.status(200).json(updatedGame);
    } else {
      console.log(`Could not update game: ${id}, INVALID MOVE!`);
      res.status(404).send({ error: "Invalid move in error" });
    }
  } else {
    // validate the move and make the move if it's legal
    const move = chessGame.move({ from, to });
    if (move) {
      const updatedGameData = {
        player2id: oldGameData.player2id,
        player1color: oldGameData.player1color,
        player2color: oldGameData.player2color,
        in_progress: oldGameData.in_progress,
        current_positions: move.after,
      };
      // if the move is valid, update the game state in the database
      const updatedGame = await updateGame(id, updatedGameData);
      // console.log("updated game ID: ", id, "with data: ", updatedGame);
      res.status(200).json(updatedGame);
    } else {
      console.log(`Could not update game: ${id}, INVALID MOVE!`);
      res.status(404).send({ error: "Invalid move in error" });
    }
  }
});

games.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const gameDelete = await deleteGame(id);

  if (gameDelete.id) {
    console.log("=== DESTROY game", gameDelete, "===");
    res.status(200).json(gameDelete);
  } else {
    res.status(404).send(`Game with the ID: ${id} could not be deleted.`);
  }
});

module.exports = games;
