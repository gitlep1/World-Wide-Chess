const db = require("../db/dbConfig");

const getAllPreviousGames = async (player1ID) => {
  try {
    const previousGames = await db.any(
      "SELECT * FROM games WHERE player1ID = $1",
      [player1ID]
    );
    return previousGames;
  } catch (err) {
    return err;
  }
};

const getPreviousGamesByID = async (player1ID, id) => {
  try {
    const game = await db.any(
      "SELECT * FROM games WHERE player1ID = $1 AND id = $2",
      [player1ID, id]
    );
    return game;
  } catch (err) {
    return err;
  }
};

const deletePreviousGames = async (player1ID, id) => {
  try {
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
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllPreviousGames,
  getPreviousGamesByID,
  deletePreviousGames,
};
