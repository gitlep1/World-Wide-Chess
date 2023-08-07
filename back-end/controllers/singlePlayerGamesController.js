const _ = require("lodash");
const express = require("express");
const Chess = require("chess.js").Chess;
const games = express.Router();

const {
  getAllSingleGames,
  getSingleGameByID,
  createSingleGame,
  updateSingleGame,
  updateSingleGamePositions,
  deleteSingleGame,
} = require("../queries/singlePlayerGames");

const { requireAuth } = require("../validation/requireAuth");
const { scopeAuth } = require("../validation/scopeAuth");

games.get("/", requireAuth(), scopeAuth(["read:user"]), async (req, res) => {
  const allGames = await getAllSingleGames();
  if (allGames) {
    // console.log("=== GET games", allGames, "===");
    res.status(200).json({ payload: allGames });
  } else {
    res.status(404).send("No chess games found.");
  }
});

games.get(
  "/:id",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const id = _.escape(req.params.id);
    const gotAGame = await getSingleGameByID(id);

    if (gotAGame) {
      // console.log("=== GET game", gotAGame, "===");
      res.status(200).json({ payload: gotAGame });
    } else {
      res.status(404).send(`Cannot get chess game with ID: ${id}`);
    }
  }
);

games.post(
  "/",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    console.log("=== req.headers", req.headers);

    const newGameData = {
      room_name: req.body.room_name,
      room_password: req.body.room_password,
      player_id: req.body.player_id,
    };

    const newGame = await createSingleGame(newGameData);

    if (newGame) {
      console.log("=== CREATE game", newGame, "===");
      res.status(200).json({ payload: newGame });
    } else {
      res.status(404).send("Cannot create a new game.");
    }
  }
);

games.put(
  "/:id",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { id } = req.params;
    const updatedGameData = {
      bot_id: req.body.bot_id,
      player_color: req.body.player_color,
      bot_color: req.body.bot_color,
      in_progress: req.body.in_progress,
      current_positions: req.body.current_positions,
    };

    const updateGameData = await updateSingleGame(id, updatedGameData);

    if (updateGameData) {
      console.log("=== UPDATE game", updateGameData, "===");
      res.status(200).json({ payload: updateGameData });
    } else {
      res.status(404).send("Couldn't update game.");
    }
  }
);

games.put(
  "/:id/move",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { id } = req.params;
    const { from, to, promotion } = req.body;

    const game = await getSingleGameByID(id);
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

        const updatedGame = await updateSingleGame(id, updatedGameData);
        console.log("updated game ID: ", id, "with data: ", updatedGame);
        res.status(200).json({ payload: updatedGame });
      } else {
        console.log(`Could not update game: ${id}, INVALID MOVE!`);
        res.status(404).send({ error: "Invalid move in error" });
      }
    } else {
      const move = chessGame.move({ from, to });
      if (move) {
        const updatedGameData = {
          player2id: oldGameData.player2id,
          player1color: oldGameData.player1color,
          player2color: oldGameData.player2color,
          in_progress: oldGameData.in_progress,
          current_positions: move.after,
        };

        const updatedGame = await updateSingleGame(id, updatedGameData);
        // console.log("updated game ID: ", id, "with data: ", updatedGame);
        res.status(200).json({ payload: updatedGame });
      } else {
        console.log(`Could not update game: ${id}, INVALID MOVE!`);
        res.status(404).send({ error: "Invalid move in error" });
      }
    }
  }
);

games.delete(
  "/:id",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { id } = req.params;
    const gameDelete = await deleteSingleGame(id);

    if (gameDelete.id) {
      console.log("=== DESTROY game", gameDelete, "===");
      res.status(200).json({ payload: gameDelete });
    } else {
      res.status(404).send(`Game with the ID: ${id} could not be deleted.`);
    }
  }
);

module.exports = games;
