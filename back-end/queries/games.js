const db = require("../db/dbConfig");

const getAllGames = async () => {
  try {
    const games = await db.any(
      `SELECT
      games.id,
      games.room_name,
      games.room_password,
      games.player1id,
      games.player2id,
      games.player1color,
      games.player2color,
      games.in_progress,
      games.current_positions,
      player1.username AS player1,
      player2.username AS player2
      FROM games
      JOIN users AS player1 ON games.player1id = player1.id
      LEFT JOIN users AS player2 ON games.player2id = player2.id
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
      games.room_name,
      games.room_password,
      games.player1id,
      games.player2id,
      games.player1color,
      games.player2color,
      games.in_progress,
      games.current_positions,
      player1.username AS player1,
      player2.username AS player2
      FROM games
      JOIN users AS player1 ON games.player1id = player1.id
      LEFT JOIN users AS player2 ON games.player2id = player2.id
      WHERE games.id = $1`,
      id
    );
    return game;
  } catch (err) {
    return err;
  }
};

const createGames = async (newGameData) => {
  try {
    const newGame = await db.one(
      "INSERT INTO games (room_name, room_password, player1id, player2id) VALUES ($1, $2, $3, $4) RETURNING *",
      [
        newGameData.room_name,
        newGameData.room_password,
        newGameData.player1id,
        newGameData.player2id,
      ]
    );
    return newGame;
  } catch (error) {
    return error;
  }
};

const updateGames = async (id, updatedGameData) => {
  try {
    const updatedGame = await db.one(
      `
      UPDATE games SET player2id = $2, player1color=$3, player2color=$4, in_progress = $5, current_positions = $6
      WHERE games.id = $1 RETURNING *`,
      [
        id,
        updatedGameData.player2id,
        updatedGameData.player1color,
        updatedGameData.player2color,
        updatedGameData.in_progress,
        updatedGameData.current_positions,
      ]
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
