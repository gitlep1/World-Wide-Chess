const db = require("../db/dbConfig");

const getAllGames = async () => {
  try {
    const games = await db.any(
      `SELECT games.id, games.player1ID, games.player2ID, player1.username
      AS player1, player2.username AS player2, games.in_progress, games.moves
      FROM games
      JOIN users AS player1 ON games.player1ID = player1.id
      LEFT JOIN users AS player2 ON games.player2ID = player2.id
      ORDER BY games.id
      `
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
      "UPDATE games SET player2ID = $2, winner = $3, in_progress = $4, moves = $5 WHERE id = $1 RETURNING *",
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
