const _ = require("lodash");
const express = require("express");
const jwt = require("jsonwebtoken");
const Chess = require("chess.js").Chess;
const games = express.Router();

const {
  getAllGames,
  getGameByID,
  createGame,
  updateGame,
  updateGamePositions,
  deleteGame,
} = require("../queries/multiGames");

const { getUserByID } = require("../queries/users");
const { getGuestByID } = require("../queries/guests");

const { requireAuth } = require("../validation/requireAuth");
const { scopeAuth } = require("../validation/scopeAuth");

games.get("/", requireAuth(), scopeAuth(["read:user"]), async (req, res) => {
  const allGames = await getAllGames();

  if (allGames) {
    res.status(200).json({ payload: allGames });
  } else {
    res.status(404).json({ error: "No chess games found." });
  }
});

games.get(
  "/:id",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const id = _.escape(req.params.id);
    const gotAGame = await getGameByID(id);

    if (gotAGame) {
      res.status(200).json({ payload: gotAGame });
    } else {
      res.status(404).json({ error: `Cannot get chess game with ID: ${id}` });
    }
  }
);

games.post(
  "/",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { token } = req.user;
    const decoded = jwt.decode(token);

    const checkUserData =
      (await getUserByID(decoded.user.id)) ||
      (await getGuestByID(decoded.user.id));

    if (!checkUserData) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const newGameData = {
      room_name: req.body.room_name,
      room_password: req.body.room_password,
      player1id: checkUserData.id,
      allow_specs: req.body.allow_specs,
      is_multiplayer: true,
    };

    const newGame = await createGame(newGameData);

    if (newGame) {
      console.log("=== CREATE game", newGame, "===");
      res.status(200).json({ payload: newGame });
    } else {
      res.status(404).json({ error: "Cannot create a new game." });
    }
  }
);

games.put(
  "/:id",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    console.log("inside put 1");
    const id = _.escape(req.params.id);

    const { token } = req.user;
    const decoded = jwt.decode(token);

    const checkIfHost =
      (await getUserByID(decoded.user.id)) ||
      (await getGuestByID(decoded.user.id));

    const checkGameData = await getGameByID(id);

    // if (checkIfHost.id !== checkGameData.player1id) {
    //   return res.status(401).json({ error: "Unauthorized" });
    // } else {
    const startingPositions =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    const updatedGameData = {
      botId: req.body.botId,
      player2id: req.body.player2id,
      player1color: req.body.player1color,
      player2color: req.body.player2color,
      botColor: req.body.botColor,
      current_positions: startingPositions,
      in_progress: true,
      game_time: 0,
    };

    const updateGameData = await updateGame(id, updatedGameData);

    if (updateGameData) {
      console.log("=== UPDATE game", updateGameData, "===");
      res.status(200).json({ payload: updateGameData });
    } else {
      res.status(404).json({ error: "Couldn't update game." });
    }
    // }
  }
);

games.put(
  "/moves/:id",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const id = _.escape(req.params.id);
    const { token } = req.user;
    const decoded = jwt.decode(token);

    console.log("inside put 2");

    const checkIfHost =
      (await getUserByID(decoded.user.id)) ||
      (await getGuestByID(decoded.user.id));

    const checkGameData = await getGameByID(id);

    if (
      checkIfHost.id !== checkGameData.player1id ||
      checkIfHost.id !== checkGameData.player2id
    ) {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      const { from, to, promotion } = req.body;

      const game = await getGameByID(id);
      const chessGame = new Chess(game.current_positions);

      if (promotion !== "") {
        const move = chessGame.move({ from, to, promotion });
        if (move) {
          const updatedPositions = {
            current_positions: move.after,
          };

          const updatePositions = await updateGamePositions(
            id,
            updatedPositions
          );
          console.log("updated game ID: ", id, "with data: ", updatePositions);
          res.status(200).json({ payload: updatePositions });
        } else {
          console.log(`Could not update game: ${id}, INVALID MOVE!`);
          res.status(404).json({ error: "Invalid promotion move" });
        }
      } else {
        const move = chessGame.move({ from, to });
        if (move) {
          const updatedPositions = {
            current_positions: move.after,
          };

          const updatePositions = await updateGamePositions(
            id,
            updatedPositions
          );
          console.log("updated game ID: ", id, "with data: ", updatePositions);
          res.status(200).json({ payload: updatePositions });
        } else {
          console.log(`Could not update game: ${id}, INVALID MOVE!`);
          res.status(404).json({ error: "Invalid move" });
        }
      }
    }
  }
);

games.delete(
  "/:id",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const id = _.escape(req.params.id);
    const { token } = req.user;
    const decoded = jwt.decode(token);

    const checkIfHost =
      (await getUserByID(decoded.user.id)) ||
      (await getGuestByID(decoded.user.id));

    const checkGameData = await getGameByID(id);

    if (checkIfHost.id !== checkGameData.player1id) {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      const deletedGame = await deleteGame(id);

      if (deletedGame.id) {
        console.log("=== DELETE game", deletedGame, "===");
        res.status(200).json({ payload: deletedGame });
      } else {
        res
          .status(404)
          .json({ error: `Game with the ID: ${id} could not be deleted.` });
      }
    }
  }
);

module.exports = games;
