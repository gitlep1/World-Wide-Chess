const db = require("../db/dbConfig");

const getAllGames = async () => {
  try {
    const games = await db.any(
      `SELECT
      games.id,
      games.player1ID,
      games.player2ID,
      games.in_progress,
      games.winner,
      games.currentPositions,
      player1.username AS player1,
      player2.username AS player2,
      player1.profileImg AS player1img,
      player2.profileImg AS player2img
      FROM games
      JOIN users AS player1 ON games.player1ID = player1.id
      LEFT JOIN users AS player2 ON games.player2ID = player2.id
      LEFT JOIN users AS player1img ON games.player1img = player1.profileImg
      Left JOIN users AS player2img ON games.player2img = player2.profileImg
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
    const game = await db.any(
      `SELECT
      games.id,
      games.player1ID,
      games.player2ID,
      games.in_progress,
      games.winner,
      games.currentPositions,
      player1.username AS player1,
      player2.username AS player2,
      player1.profileImg AS player1img,
      player2.profileImg AS player2img
      FROM games
      JOIN users AS player1 ON games.player1ID = player1.id
      LEFT JOIN users AS player2 ON games.player2ID = player2.id
      LEFT JOIN users AS player1img ON games.player1img = player1.profileImg
      Left JOIN users AS player2img ON games.player2img = player2.profileImg
      WHERE games.id = $1`,
      id
    );
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

const updateGames = async (
  id,
  player2ID,
  winner,
  inProgress,
  currentPositions
) => {
  try {
    const updatedGame = await db.one(
      `
      UPDATE games SET player2ID = $2, winner = $3, in_progress = $4, currentPositions = $5
      WHERE games.id = $1 RETURNING *`,
      [id, player2ID, winner, inProgress, currentPositions]
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
