const _ = require("lodash");
const express = require("express");
const moveHistory = express.Router();

const {
  getMoveHistoryByGameID,
  createMoveHistory,
  updateMoveHistory,
  deleteMoveHistory,
} = require("../queries/moveHistoryMulti");

const { getGameByID } = require("../queries/multiGames");

const { requireAuth } = require("../validation/requireAuth");

moveHistory.get("/:gameID", requireAuth(), async (req, res) => {
  const gameID = _.escape(req.params.gameID);
  const checkIfGameExists = await getGameByID(gameID);

  if (!checkIfGameExists) {
    return res
      .status(404)
      .send(`Cannot find any move history matching game ID: ${gameID}`);
  }

  const moveHistory = await getMoveHistoryByGameID(gameID);
  return res.status(200).json({ payload: moveHistory });
});

moveHistory.post("/", requireAuth(), async (req, res) => {
  const newMoveHistoryData = {
    game_id: req.body.gameID,
    from_square: null,
    to_square: null,
    piece: null,
    color: null,
  };

  const checkIfGameExists = await getGameByID(newMoveHistoryData.game_id);

  if (!checkIfGameExists) {
    return res.status(404).send(`Game ID matching: ${gameID} does not exist`);
  }

  const createdMoveHistory = await createMoveHistory(newMoveHistoryData);

  if (createdMoveHistory) {
    console.log("=== POST move history", createdMoveHistory, "===");
    return res.status(201).json({ payload: createdMoveHistory });
  } else {
    return res.status(404).send("move history not created");
  }
});

moveHistory.put("/:gameID", requireAuth(), async (req, res) => {
  const gameID = _.escape(req.params.gameID);
  const checkIfGameExists = await getGameByID(gameID);

  if (!checkIfGameExists) {
    return res
      .status(404)
      .send(`Cannot find any move history matching game ID: ${gameID}`);
  }

  const moveHistory = await getMoveHistoryByGameID(gameID);
  const updatedMoveHistoryData = {
    from_square: req.body.from,
    to_square: req.body.to,
    piece: req.body.piece,
    color: req.body.color,
  };

  if (moveHistory) {
    const updatedMoveHistory = await updateMoveHistory(
      gameID,
      updatedMoveHistoryData
    );

    if (!updatedMoveHistory) {
      return res
        .status(404)
        .send(`move history not updated for game ID: ${gameID}`);
    }

    console.log("=== PUT move history", updatedMoveHistory, "===");
    return res.status(200).json({ payload: updatedMoveHistory });
  }
});

moveHistory.delete("/:gameID", requireAuth(), async (req, res) => {
  const gameID = _.escape(req.params.gameID);
  const checkIfGameExists = await getGameByID(gameID);

  if (!checkIfGameExists) {
    return res
      .status(404)
      .send(`Cannot find any move history matching game ID: ${gameID}`);
  }

  const moveHistory = await getMoveHistoryByGameID(gameID);

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
