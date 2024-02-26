const db = require("../db/dbConfig.js");

const getMoveHistoryByGameID = async (gameID) => {
  try {
    const moveHistory = await db.oneOrNone(
      "SELECT * FROM move_history WHERE game_id = $1",
      gameID
    );
    return moveHistory;
  } catch (err) {
    return err;
  }
};

const createMoveHistory = async (moveHistoryData) => {
  try {
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
  } catch (err) {
    return err;
  }
};

const deleteMoveHistory = async (gameID) => {
  try {
    if (gameID === null || gameID === undefined) {
      return false;
    }
    const deletedMessage = await db.one(
      "DELETE FROM move_history WHERE game_id = $1 RETURNING *",
      gameID
    );
    return deletedMessage;
  } catch (err) {
    return err;
  }
};

module.exports = {
  getMoveHistoryByGameID,
  createMoveHistory,
  deleteMoveHistory,
};
