const db = require("../db/dbConfig");

const getAllGames = async () => {
  try {
    const games = await db.any(
      "SELECT * FROM games"
      // "SELECT * FROM users JOIN games ON users.id = games.player1ID"
      // `SELECT *, player1.username AS player1, player2.username AS player2 FROM games
      // JOIN users AS player1 ON games.player1id = player1.id
      // JOIN users AS player2 ON games.player2id = player2.id`
    );
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

const createGames = async (player1ID, player2ID) => {
  try {
    const newGame = await db.one(
      "INSERT INTO games (player1ID, player2ID) VALUES($1, $2) RETURNING *",
      [player1ID, player2ID]
    );
    return newGame;
  } catch (error) {
    return error;
  }
};

const updateGames = async (id, player2ID, winner, inProgress, moves) => {
  try {
    const updatedGame = await db.one(
      "UPDATE games SET player2ID = $2, winner = $3, in_progress = $4, moves = moves || $5 WHERE id = $1 RETURNING *",
      [id, player2ID, winner, inProgress, moves]
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
