const db = require("../db/dbConfig");

const getAllMultiGames = async () => {
  try {
    const games = await db.any(
      `SELECT
      multi_player_games.id,
      multi_player_games.room_name,
      multi_player_games.room_password,
      multi_player_games.player1id,
      multi_player_games.player2id,
      multi_player_games.player1color,
      multi_player_games.player2color,
      multi_player_games.in_progress,
      multi_player_games.current_positions,
      multi_player_games.game_time,
      player1.username AS player1,
      player2.username AS player2
      FROM multi_player_games
      JOIN users AS player1 ON multi_player_games.player1id = player1.id
      LEFT JOIN users AS player2 ON multi_player_games.player2id = player2.id
      ORDER BY multi_player_games.id
      `
    );
    return games;
  } catch (err) {
    return err;
  }
};

const getMultiGameByID = async (id) => {
  try {
    const game = await db.oneOrNone(
      `SELECT
      multi_player_games.id,
      multi_player_games.room_name,
      multi_player_games.room_password,
      multi_player_games.player1id,
      multi_player_games.player2id,
      multi_player_games.player1color,
      multi_player_games.player2color,
      multi_player_games.in_progress,
      multi_player_games.current_positions,
      multi_player_games.game_time,
      player1.username AS player1,
      player2.username AS player2
      FROM multi_player_games
      JOIN users AS player1 ON multi_player_games.player1id = player1.id
      LEFT JOIN users AS player2 ON multi_player_games.player2id = player2.id
      WHERE multi_player_games.id = $1`,
      id
    );
    return game;
  } catch (err) {
    return err;
  }
};

const createMultiGame = async (newGameData) => {
  try {
    const newGame = await db.one(
      "INSERT INTO multi_player_games (room_name, room_password, player1id, game_time) VALUES ($1, $2, $3, $4) RETURNING *",
      [
        newGameData.room_name,
        newGameData.room_password,
        newGameData.player1id,
        newGameData.game_time,
      ]
    );
    return newGame;
  } catch (error) {
    return error;
  }
};

const updateMultiGame = async (id, updatedGameData) => {
  try {
    const updatedGame = await db.one(
      `
      UPDATE multi_player_games SET player2id = $2, player1color = $3, player2color = $4, in_progress = $5, current_positions = $6, game_time = $7
      WHERE multi_player_games.id = $1 RETURNING *`,
      [
        id,
        updatedGameData.player2id,
        updatedGameData.player1color,
        updatedGameData.player2color,
        updatedGameData.in_progress,
        updatedGameData.current_positions,
        updatedGameData.game_time,
      ]
    );
    return updatedGame;
  } catch (error) {
    return error;
  }
};

const updateMultiGamePositions = async (id, updatedGameData) => {
  try {
    const updatedGamePosition = await db.one(
      `
      UPDATE multi_player_games SET current_positions = $2
      WHERE multi_player_games.id = $1 RETURNING *`,
      [id, updatedGameData.current_positions]
    );
    return updatedGamePosition;
  } catch (error) {
    return error;
  }
};

const deleteMultiGame = async (id) => {
  try {
    if (id === null || id === undefined) {
      return false;
    }
    const deletedGame = await db.one(
      "DELETE FROM multi_player_games WHERE id = $1 RETURNING *",
      id
    );
    return deletedGame;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllMultiGames,
  getMultiGameByID,
  createMultiGame,
  updateMultiGame,
  updateMultiGamePositions,
  deleteMultiGame,
};
