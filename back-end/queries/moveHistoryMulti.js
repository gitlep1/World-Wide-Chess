const db = require("../db/dbConfig.js");

const getMoveHistoryByGameID = async (gameID) => {
  const moveHistory = await db.oneOrNone(
    "SELECT * FROM move_history WHERE game_id = $1",
    gameID
  );
  return moveHistory;
};

const createMoveHistory = async (moveHistoryData) => {
  const newMoveHistory = db.one(
    "INSERT INTO move_history (game_id, from_square, to_square, piece, color) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [
      moveHistoryData.game_id,
      moveHistoryData.from_square,
      moveHistoryData.to_square,
      moveHistoryData.piece,
      moveHistoryData.color,
    ]
  );
  return newMoveHistory;
};

const updateMoveHistory = async (gameID, moveHistoryData) => {
  const updatedMoveHistory = await db.one(
    "UPDATE move_history SET from_square = $1, to_square = $2, piece = $3, color = $4 WHERE game_id = $5 RETURNING *",
    [
      moveHistoryData.from_square,
      moveHistoryData.to_square,
      moveHistoryData.piece,
      moveHistoryData.color,
      gameID,
    ]
  );
  return updatedMoveHistory;
};

const deleteMoveHistory = async (gameID) => {
  if (gameID === null || gameID === undefined) {
    return false;
  }
  const deletedMessage = await db.one(
    "DELETE FROM move_history WHERE game_id = $1 RETURNING *",
    gameID
  );
  return deletedMessage;
};

module.exports = {
  getMoveHistoryByGameID,
  createMoveHistory,
  updateMoveHistory,
  deleteMoveHistory,
};
