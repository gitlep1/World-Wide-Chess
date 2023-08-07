const db = require("../db/dbConfig.js");

const getAllBots = async () => {
  try {
    const bots = await db.any("SELECT * FROM bots");
    return bots;
  } catch (err) {
    return err;
  }
};

const getBotById = async (id) => {
  try {
    const bot = await db.one("SELECT * FROM bots WHERE id = $1", id);
    return bot;
  } catch (err) {
    return err;
  }
};

module.exports = { getAllBots, getBotById };
