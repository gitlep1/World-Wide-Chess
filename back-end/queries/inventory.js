const db = require("../db/dbConfig.js");

const getInventoryItemsByUserID = async (uid) => {
  try {
    const inventory = await db.oneOrNone(
      "SELECT * FROM inventory WHERE user_id = $1",
      uid
    );
    return inventory;
  } catch (err) {
    return err;
  }
};

const addInventoryItem = async (newInventoryData) => {
  try {
    const newInventoryItem = await db.one(
      "INSERT INTO inventory (user_id, item_id) VALUES($1, $2) RETURNING *",
      [newInventoryData.user_id, newInventoryData.item_id]
    );
    return newInventoryItem;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getInventoryItemsByUserID,
  addInventoryItem,
};
