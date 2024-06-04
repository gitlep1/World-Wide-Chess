const db = require("../db/dbConfig.js");

const getMoveHistoryByGameID = async (gameID) => {
  const moveHistory = await db.manyOrNone(
    "SELECT * FROM move_history WHERE game_id = $1",
    gameID
  );
  return moveHistory;
};

const createMoveHistory = async (moveHistoryData) => {
  const newMoveHistory = db.oneOrNone(
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

const deleteMoveHistory = async (gameID) => {
  if (gameID === null || gameID === undefined) {
    return false;
  }
  const deletedMessage = await db.manyOrNone(
    "DELETE FROM move_history WHERE game_id = $1 RETURNING *",
    gameID
  );
  return deletedMessage;
};

module.exports = {
  getMoveHistoryByGameID,
  createMoveHistory,
  deleteMoveHistory,
};
