const db = require("../db/dbConfig.js");

const getInventoryItemsByGuestID = async (gid) => {
  const inventory = await db.oneOrNone(
    "SELECT * FROM guest_inventory WHERE guest_id = $1",
    gid
  );
  return inventory;
};

module.exports = {
  getInventoryItemsByGuestID,
};
