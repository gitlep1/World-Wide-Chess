const db = require("../db/dbConfig");

const getAllGames = async () => {
  const games = await db.any(
    `SELECT 
        games.*,
        player1.username AS player1,
        player2.username AS player2
      FROM games
      JOIN users AS player1 ON games.player1id = player1.id
      LEFT JOIN users AS player2 ON games.player2id = player2.id
      WHERE games.is_multiplayer = FALSE
      ORDER BY games.id
      `
  );
  return games;
};

const getGameByID = async (id) => {
  const game = await db.oneOrNone(
    `SELECT 
        games.*,
        player1.username AS player1,
        player2.username AS player2
      FROM games
      JOIN users AS player1 ON games.player1id = player1.id
      LEFT JOIN users AS player2 ON games.player2id = player2.id
      WHERE games.id = $1`,
    id
  );
  return game;
};

const createGame = async (newGameData) => {
  const newGame = await db.one(
    "INSERT INTO games (room_name, room_password, player1id, allow_specs, is_multiplayer) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [
      newGameData.room_name,
      newGameData.room_password,
      newGameData.player1id,
      newGameData.allow_specs,
      newGameData.is_multiplayer,
    ]
  );
  return newGame;
};

const updateGame = async (id, updatedGameData) => {
  const updatedGame = await db.one(
    `
      UPDATE games SET botId = $2, player2id = $3, player1color = $4, player2color = $5, botColor = $6, current_positions = $7, in_progress = $8, game_time = $9 WHERE id = $1 RETURNING *`,
    [
      id,
      updatedGameData.botId,
      updatedGameData.player2id,
      updatedGameData.player1color,
      updatedGameData.player2color,
      updatedGameData.botColor,
      updatedGameData.current_positions,
      updatedGameData.in_progress,
      updatedGameData.game_time,
    ]
  );
  return updatedGame;
};

const updateGamePositions = async (id, updatedPositions) => {
  const updatedGame = await db.oneOrNone(
    `
      UPDATE games SET current_positions = $2 WHERE id = $1 RETURNING *`,
    [id, updatedPositions.current_positions]
  );
  return updatedGame;
};

const deleteGame = async (id) => {
  if (id === null || id === undefined) {
    return false;
  }
  const deletedGame = await db.oneOrNone(
    "DELETE FROM games WHERE id = $1 RETURNING *",
    id
  );
  console.log({ deletedGame });
  return deletedGame;
};

module.exports = {
  getAllGames,
  getGameByID,
  createGame,
  updateGame,
  updateGamePositions,
  deleteGame,
};
