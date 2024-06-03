const db = require("../db/dbConfig.js");

const getAllShopItems = async () => {
  const shopItems = await db.any("SELECT * FROM shop");
  return shopItems;
};

const getShopItemByID = async (id) => {
  const shopItem = await db.oneOrNone("SELECT * FROM shop WHERE id = $1", id);
  return shopItem;
};

module.exports = {
  getAllShopItems,
  getShopItemByID,
};
