const db = require("../db/dbConfig.js");

const getAllFacts = async () => {
  try {
    const users = await db.any("SELECT * FROM facts");
    return users;
  } catch (err) {
    return err;
  }
};

module.exports = {
  getAllFacts,
};
