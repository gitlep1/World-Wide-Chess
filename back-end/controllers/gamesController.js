const express = require("express");
const games = express.Router();

const {
  getAllGames,
  getGamesByID,
  createGames,
  updateGames,
  deleteGames,
} = require("../queries/games");

games.get("/", async (req, res) => {
  const allGames = await getAllGames();
  if (allGames) {
    console.log("=== GET games", allGames, "===");
    res.status(200).json(allGames);
  } else {
    res.status(404).send("No chess games found.");
  }
});

games.get("/:id", async (req, res) => {
  const { id } = req.params;
  const aGame = await getGamesByID(id);

  if (aGame.length > 0) {
    console.log("=== GET game", aGame, "===");
    res.status(200).json(aGame[0]);
  } else {
    res.status(404).send(`Cannot get chess game with ID: ${id}`);
  }
});

games.post("/", async (req, res) => {
  const newGameData = {
    userID: req.body.userID,
    opponentID: req.body.opponentID,
  };

  const newGame = await createGames(newGameData.userID, newGameData.opponentID);

  if (newGame) {
    console.log("=== CREATE game", newGame, "===");
    res.status(200).json(newGame);
  } else {
    res.status(404).send("Cannot create a new game.");
  }
});

games.put("/:id", async (req, res) => {
  const { id } = req.params;
  const newMoves = {
    moves: req.body.moves,
  };

  const updateGame = await updateGames(id, newMoves.moves);

  if (updateGame) {
    console.log("=== UPDATE game", updateGame, "===");
    res.status(200).json(updateGame);
  } else {
    res.status(404).send("Couldn't update game.");
  }
});

games.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deleteGame = await deleteGames(id);

  if (deleteGame.id) {
    console.log("=== DESTROY game", deleteGame, "===");
    res.status(200).json(deleteGame);
  } else {
    res.status(404).send(`Game with the ID: ${id} could not be deleted.`);
  }
});

module.exports = games;
