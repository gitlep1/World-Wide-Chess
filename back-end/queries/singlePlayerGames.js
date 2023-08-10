const db = require("../db/dbConfig");

const getAllSingleGames = async () => {
  try {
    const games = await db.any(
      `SELECT
      single_player_games.id,
      single_player_games.room_name,
      single_player_games.room_password,
      single_player_games.player_id,
      single_player_games.bot_id,
      single_player_games.player_color,
      single_player_games.bot_color,
      single_player_games.in_progress,
      single_player_games.current_positions,
      single_player_games.game_time,
      player1.username AS player1,
      player2.username AS player2
      FROM single_player_games
      JOIN users AS player1 ON single_player_games.player_id = player1.id
      LEFT JOIN bots AS player2 ON single_player_games.bot_id = player2.id
      ORDER BY single_player_games.id
      `
    );
    return games;
  } catch (err) {
    return err;
  }
};

const getSingleGameByID = async (id) => {
  try {
    const game = await db.oneOrNone(
      `SELECT
      single_player_games.id,
      single_player_games.room_name,
      single_player_games.room_password,
      single_player_games.player_id,
      single_player_games.bot_id,
      single_player_games.player_color,
      single_player_games.bot_color,
      single_player_games.in_progress,
      single_player_games.current_positions,
      single_player_games.game_time,
      player1.username AS player1,
      player2.username AS player2
      FROM single_player_games
      JOIN users AS player1 ON single_player_games.player_id = player1.id
      LEFT JOIN bots AS player2 ON single_player_games.bot_id = player2.id
      WHERE single_player_games.id = $1`,
      id
    );
    return game;
  } catch (err) {
    return err;
  }
};

const createSingleGame = async (newGameData) => {
  try {
    const newGame = await db.one(
      "INSERT INTO single_player_games (room_name, room_password, player_id, game_time) VALUES ($1, $2, $3, $4) RETURNING *",
      [
        newGameData.room_name,
        newGameData.room_password,
        newGameData.player_id,
        newGameData.game_time,
      ]
    );
    return newGame;
  } catch (error) {
    return error;
  }
};

const updateSingleGame = async (id, updatedGameData) => {
  try {
    const updatedGame = await db.one(
      `
      UPDATE single_player_games SET bot_id = $2, player_color = $3, bot_color = $4, in_progress = $5, current_positions = $6, game_time = $7
      WHERE single_player_games.id = $1 RETURNING *`,
      [
        id,
        updatedGameData.bot_id,
        updatedGameData.player_color,
        updatedGameData.bot_color,
        updatedGameData.in_progress,
        updatedGameData.current_positions,
        updatedGameData.game_time,
      ]
    );
    console.log(updatedGame);
    return updatedGame;
  } catch (error) {
    return error;
  }
};

const updateSingleGamePositions = async (id, updatedGameData) => {
  try {
    const updatedGamePosition = await db.one(
      `
      UPDATE single_player_games SET current_positions = $2
      WHERE single_player_games.id = $1 RETURNING *`,
      [id, updatedGameData.current_positions]
    );
    return updatedGamePosition;
  } catch (error) {
    return error;
  }
};

const deleteSingleGame = async (id) => {
  try {
    if (id === null || id === undefined) {
      return false;
    }
    const deletedGame = await db.one(
      "DELETE FROM single_player_games WHERE id = $1 RETURNING *",
      id
    );
    return deletedGame;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllSingleGames,
  getSingleGameByID,
  createSingleGame,
  updateSingleGame,
  updateSingleGamePositions,
  deleteSingleGame,
};
