const db = require("../db/dbConfig.js");

const getInventoryItemsByGuestID = async (gid) => {
  try {
    const inventory = await db.oneOrNone(
      "SELECT * FROM guest_inventory WHERE guest_id = $1",
      gid
    );
    return inventory;
  } catch (err) {
    return err;
  }
};

module.exports = {
  getInventoryItemsByGuestID,
};
