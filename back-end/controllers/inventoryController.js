const express = require("express");
const inventory = express.Router();

const {
  getInventoryItemsByUserID,
  addInventoryItem,
} = require("../queries/inventory");
const { getShopItemsByID } = require("../queries/shop");

const { requireAuth } = require("../validation/requireAuth");

inventory.get("/:uid", requireAuth(), async (req, res) => {
  const { uid } = req.params;
  const getAInventory = await getInventoryItemsByUserID(uid);

  if (getAInventory.length > 0) {
    // console.log("=== GET inventory by ID", getAInventory, "===");
    res.status(200).json({ payload: getAInventory });
  } else {
    res.status(404).send(`inventory for user: ${uid} was not found`);
  }
});

inventory.post("/", requireAuth(), async (req, res) => {
  const newInventoryData = {
    user_id: req.body.user_id,
    item_id: req.body.item_id,
  };

  const checkShopItem = await getShopItemsByID(newInventoryData.item_id);

  if (checkShopItem) {
    const createdInventoryItem = await addInventoryItem(newInventoryData);

    if (createdInventoryItem) {
      // console.log("=== POST inventory", createdInventoryItem, "===");
      res.status(201).json({ payload: createdInventoryItem });
    } else {
      res.status(404).send("Inventory item not created.");
    }
  } else {
    res
      .status(404)
      .send(`Item with ID: ${newInventoryData.item_id} not found in shop.`);
  }
});

module.exports = inventory;
