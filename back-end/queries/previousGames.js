const db = require("../db/dbConfig");

const getAllPreviousGames = async (userID) => {
  try {
    const previousGames = await db.any(
      "SELECT * FROM games WHERE userID = $1",
      [userID]
    );
    return previousGames;
  } catch (err) {
    return err;
  }
};

const getPreviousGamesByID = async (userID, id) => {
  try {
    const game = await db.any(
      "SELECT * FROM games WHERE userID = $1 AND id = $2",
      [userID, id]
    );
    return game;
  } catch (err) {
    return err;
  }
};

const createPreviousGames = async (userID, opponentID, winner, moves) => {
  try {
    const newGame = await db.one(
      "INSERT INTO games (userID, opponentID, winner, moves) VALUES($1, $2, $3, $4) RETURNING *",
      [userID, opponentID, winner, moves]
    );
    return newGame;
  } catch (error) {
    return error;
  }
};

const updatePreviousGames = async (id, userID, opponentID, winner, moves) => {
  try {
    const updatedGame = await db.one(
      "UPDATE games SET opponentID = $3 winner = $4 moves = moves || $5 WHERE id = $1 AND userID = $2 RETURNING *",
      [id, userID, opponentID, winner, moves]
    );
    return updatedGame;
  } catch (error) {
    return error;
  }
};

const deletePreviousGames = async (id, userID) => {
  try {
    if (
      id === null ||
      id === undefined ||
      userID === null ||
      userID === undefined
    ) {
      return false;
    }
    const deletedGame = await db.one(
      "DELETE FROM games WHERE id = $1 AND userID = $2 RETURNING *",
      [id, userID]
    );
    return deletedGame;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllPreviousGames,
  getPreviousGamesByID,
  createPreviousGames,
  updatePreviousGames,
  deletePreviousGames,
};
