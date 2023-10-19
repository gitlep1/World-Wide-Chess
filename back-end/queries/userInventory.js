const db = require("../db/dbConfig.js");

const getInventoryItemsByUserID = async (uid) => {
  try {
    const inventory = await db.any(
      "SELECT * FROM user_inventory WHERE user_id = $1",
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
      "INSERT INTO user_inventory (user_id, item_id, item_img, item_name) VALUES($1, $2, $3, $4) RETURNING *",
      [
        newInventoryData.user_id,
        newInventoryData.item_id,
        newInventoryData.item_img,
        newInventoryData.item_name,
      ]
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
