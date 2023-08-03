const db = require("../db/dbConfig.js");

const getAllBots = async () => {
  try {
    const bots = await db.any("SELECT * FROM bots");
    return bots;
  } catch (err) {
    return err;
  }
};

module.exports = { getAllBots };
