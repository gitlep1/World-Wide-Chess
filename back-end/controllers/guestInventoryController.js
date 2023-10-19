const express = require("express");
const guestInventory = express.Router();
const jwt = require("jsonwebtoken");

const { getGuestByID } = require("../queries/guests");
const { getInventoryItemsByGuestID } = require("../queries/guestInventory");
// const { getShopItemByID } = require("../queries/shop");

const { requireAuth } = require("../validation/requireAuth");

guestInventory.get("/", requireAuth(), async (req, res) => {
  const { token } = req.user;
  const decoded = jwt.decode(token);

  const checkIfGuestExists = await getGuestByID(decoded.user.id);

  if (!checkIfGuestExists) {
    return res.status(404).send("User not found");
  }

  const getGuestInventory = await getInventoryItemsByGuestID(
    checkIfGuestExists.id
  );

  if (getGuestInventory) {
    console.log("=== GET guest inventory by ID", getGuestInventory, "===");

    res.status(200).json({ payload: getGuestInventory });
  } else {
    res
      .status(404)
      .send(`inventory for user: ${checkIfGuestExists.username} was not found`);
  }
});

module.exports = guestInventory;
