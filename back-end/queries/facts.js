const db = require("../db/dbConfig.js");

const getAllFacts = async () => {
  const users = await db.any("SELECT * FROM facts");
  return users;
};

module.exports = {
  getAllFacts,
};
