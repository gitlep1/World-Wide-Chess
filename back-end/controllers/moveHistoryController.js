const _ = require("lodash");
const express = require("express");
const moveHistory = express.Router();

const {
  getMoveHistoryByGameID,
  createMoveHistory,
  deleteMoveHistory,
} = require("../queries/moveHistory");

const { getGameByID } = require("../queries/singleGames");

const { requireAuth } = require("../validation/requireAuth");

moveHistory.get("/:gameID", requireAuth(), async (req, res) => {
  const gameID = _.escape(req.params.gameID);
  const checkIfGameExists = await getGameByID(gameID);

  if (!checkIfGameExists) {
    return res
      .status(404)
      .json({ error: `Game with ID: ${gameID} does not exist.` });
  }

  const moveHistory = await getMoveHistoryByGameID(gameID);

  if (moveHistory) {
    console.log("=== GET move history", moveHistory, "===");
    return res.status(200).json({ payload: moveHistory });
  } else {
    return res
      .status(404)
      .json({ error: `move history not found for game with ID: ${gameID}` });
  }
});

moveHistory.post("/", requireAuth(), async (req, res) => {
  const checkIfGameExists = await getGameByID(req.body.game_id);

  if (!checkIfGameExists) {
    return res
      .status(404)
      .send(`Cannot find any move history matching game ID: ${gameID}`);
  }

  const newMoveHistoryData = {
    game_id: checkIfGameExists.game_id,
    from_square: checkIfGameExists.from_square,
    to_square: checkIfGameExists.to_square,
    piece: checkIfGameExists.piece,
    color: checkIfGameExists.color,
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
  console.log("inside moveHistory.delete");
  const gameID = _.escape(req.params.gameID);
  const checkIfGameExists = await getGameByID(gameID);

  if (!checkIfGameExists) {
    return res
      .status(404)
      .send(`Cannot find any move history matching game ID: ${gameID}`);
  }

  const moveHistory = await getMoveHistoryByGameID(gameID);
  console.log({ moveHistory });

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
