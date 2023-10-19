const express = require("express");
const inventory = express.Router();
const jwt = require("jsonwebtoken");

const { getUserByID, updateUser } = require("../queries/users");
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

  const itemID = req.body.id;
  const checkShopItem = await getShopItemByID(itemID);

  if (!(checkShopItem instanceof Error)) {
    const getUserInventory = await getInventoryItemsByUserID(
      checkIfUserExists.id
    );

    for (const item of getUserInventory) {
      if (item.item_id === itemID) {
        return res.status(409).send("You already own this item.");
      }
    }

    if (checkIfUserExists.chess_coins >= checkShopItem.item_price) {
      const newInventoryData = {
        user_id: checkIfUserExists.id,
        item_id: checkShopItem.id,
        item_img: checkShopItem.item_img,
        item_name: checkShopItem.item_name,
      };

      const createdInventoryItem = await addInventoryItem(newInventoryData);

      if (createdInventoryItem) {
        const newUserBalance =
          checkIfUserExists.chess_coins - checkShopItem.item_price;

        const updatedUserData = {
          profileimg: checkIfUserExists.profileimg,
          username: checkIfUserExists.username,
          password: checkIfUserExists.password,
          email: checkIfUserExists.email,
          theme: checkIfUserExists.theme,
          chess_coins: newUserBalance,
          wins: checkIfUserExists.wins,
          ties: checkIfUserExists.ties,
          loss: checkIfUserExists.loss,
          preferred_color: checkIfUserExists.preferred_color,
          last_online: checkIfUserExists.last_online,
        };

        const updatedUser = await updateUser(
          checkIfUserExists.id,
          updatedUserData
        );

        res
          .status(201)
          .json({ payload: createdInventoryItem, updatedUser: updatedUser });
      } else {
        res.status(404).send("Inventory item not created.");
      }
    } else {
      res.status(402).send("Insufficient chess coins");
    }
  } else {
    res.status(404).send(`Item not found in shop.`);
  }
});

module.exports = inventory;
