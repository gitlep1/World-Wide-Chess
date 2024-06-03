const db = require("../db/dbConfig");

const getAllPreviousGames = async (player1ID) => {
  const previousGames = await db.any(
    "SELECT * FROM games WHERE player1ID = $1",
    [player1ID]
  );
  return previousGames;
};

const getPreviousGamesByID = async (player1ID, id) => {
  const game = await db.any(
    "SELECT * FROM games WHERE player1ID = $1 AND id = $2",
    [player1ID, id]
  );
  return game;
};

const deletePreviousGames = async (player1ID, id) => {
  if (
    id === null ||
    id === undefined ||
    player1ID === null ||
    player1ID === undefined
  ) {
    return false;
  }
  const deletedGame = await db.one(
    "DELETE FROM games WHERE player1ID = $1 AND id = $2 RETURNING *",
    [player1ID, id]
  );
  return deletedGame;
};

module.exports = {
  getAllPreviousGames,
  getPreviousGamesByID,
  deletePreviousGames,
};
