const express = require("express");
const inventory = express.Router();
const jwt = require("jsonwebtoken");

const { getUserByID } = require("../queries/users");
const {
  getInventoryItemsByUserID,
  addInventoryItem,
} = require("../queries/userInventory");
const { getShopItemByID } = require("../queries/shop");

const { requireAuth } = require("../validation/requireAuth");

inventory.get("/", requireAuth(), async (req, res) => {
  const { token } = req.user;
  const decoded = jwt.decode(token);

  const checkIfUserExists = await getUserByID(decoded.user.id);

  if (!checkIfUserExists) {
    return res.status(404).send("User not found");
  }

  const getUserInventory = await getInventoryItemsByUserID(
    checkIfUserExists.id
  );

  if (getUserInventory) {
    console.log("=== GET user inventory by ID", getUserInventory, "===");

    res.status(200).json({ payload: getUserInventory });
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

  const itemID = req.body.item_id;

  const checkShopItem = await getShopItemByID(itemID);

  if (checkShopItem) {
    const newInventoryData = {
      user_id: checkIfUserExists.id,
      item_id: checkShopItem.id,
      item_img: req.body.item_img,
      item_name: req.body.item_name,
    };

    const createdInventoryItem = await addInventoryItem(newInventoryData);

    if (createdInventoryItem) {
      console.log("=== POST user inventory", createdInventoryItem, "===");

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
