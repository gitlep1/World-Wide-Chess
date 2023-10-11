const express = require("express");
const inventory = express.Router();
const jwt = require("jsonwebtoken");

const { getUserByID } = require("../queries/users");
const {
  getInventoryItemsByUserID,
  addInventoryItem,
} = require("../queries/inventory");
const { getShopItemsByID } = require("../queries/shop");

const { requireAuth } = require("../validation/requireAuth");

inventory.get("/", requireAuth(), async (req, res) => {
  const { token } = req.user;
  const decoded = jwt.decode(token);

  const checkIfUserExists = await getUserByID(decoded.user.id);

  if (!checkIfUserExists) {
    return res.status(404).send("User not found");
  }

  const getAInventory = await getInventoryItemsByUserID(checkIfUserExists.id);

  if (getAInventory) {
    console.log("=== GET inventory by ID", getAInventory, "===");

    res.status(200).json({ payload: getAInventory });
  } else {
    res
      .status(404)
      .send(`inventory for user: ${checkIfUserExists.username} was not found`);
  }
});

inventory.post("/", requireAuth(), async (req, res) => {
  const { token } = req.user;
  const decoded = jwt.decode(token);

  const checkIfUserExists = await getUserByID(decoded.user.id);

  if (!checkIfUserExists) {
    return res.status(404).send("User not found");
  }

  const newInventoryData = {
    user_id: checkIfUserExists.id,
    item_id: req.body.item_id,
  };

  const checkShopItem = await getShopItemsByID(newInventoryData.item_id);

  if (checkShopItem) {
    const createdInventoryItem = await addInventoryItem(newInventoryData);

    if (createdInventoryItem) {
      console.log("=== POST inventory", createdInventoryItem, "===");

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
