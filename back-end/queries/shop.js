const db = require("../db/dbConfig.js");

const getAllShopItems = async () => {
  try {
    const shopItems = await db.any("SELECT * FROM shop");
    return shopItems;
  } catch (err) {
    return err;
  }
};

const getShopItemByID = async (id) => {
  try {
    const shopItem = await db.oneOrNone("SELECT * FROM shop WHERE id = $1", id);
    return shopItem;
  } catch (err) {
    return err;
  }
};

module.exports = {
  getAllShopItems,
  getShopItemByID,
};
