const db = require("../db/dbConfig");

const getAllGames = async () => {
  try {
    const games = await db.any("SELECT * FROM games");
    return games;
  } catch (err) {
    return err;
  }
};

const getGamesByID = async (id) => {
  try {
    const game = await db.any("SELECT * FROM games WHERE id = $1", id);
    return game;
  } catch (err) {
    return err;
  }
};

const createGames = async (userID, opponentID) => {
  try {
    const newGame = await db.one(
      "INSERT INTO games (userID, opponentID) VALUES($1, $2) RETURNING *",
      [userID, opponentID]
    );
    return newGame;
  } catch (error) {
    return error;
  }
};

const updateGames = async (id, moves) => {
  try {
    const updatedGame = await db.one(
      "UPDATE games SET moves = moves || $2 WHERE id = $1 RETURNING *",
      [id, moves]
    );
    return updatedGame;
  } catch (error) {
    return error;
  }
};

const deleteGames = async (id) => {
  try {
    if (id === null || id === undefined) {
      return false;
    }
    const deletedGame = await db.one(
      "DELETE FROM games WHERE id = $1 RETURNING *",
      id
    );
    return deletedGame;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllGames,
  getGamesByID,
  createGames,
  updateGames,
  deleteGames,
};
