const _ = require("lodash");
const express = require("express");
const moveHistory = express.Router();

const {
  getMoveHistoryByGameID,
  createMoveHistory,
  deleteMoveHistory,
} = require("../queries/moveHistorySingle");

const { getGameByID } = require("../queries/singleGames");

const { requireAuth } = require("../validation/requireAuth");

moveHistory.get("/:gameID", requireAuth(), async (req, res) => {
  const gameID = _.escape(req.params.gameID);
  const moveHistory = await getMoveHistoryByGameID(gameID);
  const checkIfGameExists = await getGameByID(gameID);

  if (!checkIfGameExists) {
    return res
      .status(404)
      .send(`Cannot find any move history matching game ID: ${gameID}`);
  }

  return res.status(200).json({ payload: moveHistory });
});

moveHistory.post("/", requireAuth(), async (req, res) => {
  const newMoveHistoryData = {
    game_id: req.body.game_id,
    from_square: req.body.from_square,
    to_square: req.body.to_square,
    piece: req.body.piece,
    color: req.body.color,
  };

  const createdMoveHistory = await createMoveHistory(newMoveHistoryData);

  if (createdMoveHistory) {
    console.log("=== POST move history", createdMoveHistory, "===");
    return res.status(201).json({ payload: createdMoveHistory });
  } else {
    return res.status(404).send("move history not created");
  }
});

moveHistory.delete("/:gameID", requireAuth(), async (req, res) => {
  const gameID = _.escape(req.params.gameID);
  const moveHistory = await getMoveHistoryByGameID(gameID);
  const checkIfGameExists = await getGameByID(gameID);

  if (!checkIfGameExists) {
    return res
      .status(404)
      .send(`Cannot find any move history matching game ID: ${gameID}`);
  }

  if (moveHistory) {
    const deletedMoveHistory = await deleteMoveHistory(gameID);

    if (!deletedMoveHistory) {
      return res
        .status(404)
        .send(`move history not deleted for game ID: ${gameID}`);
    }

    console.log("=== DELETE move history", deletedMoveHistory, "===");
    return res.status(200).json({ payload: deletedMoveHistory });
  } else {
    return res
      .status(404)
      .send(`move history not found for game ID: ${gameID}`);
  }
});

module.exports = moveHistory;
