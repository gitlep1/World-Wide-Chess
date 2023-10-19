const express = require("express");
const shop = express.Router();

const { getAllShopItems, getShopItemByID } = require("../queries/shop");

const { requireAuth } = require("../validation/requireAuth");

shop.get("/", requireAuth(), async (req, res) => {
  const shopItems = await getAllShopItems();

  if (shopItems.length > 0) {
    // console.log("=== GET shop items", shopItems, "===");
    res.status(200).json({ payload: shopItems });
  } else {
    res.status(404).send("shop items not found");
  }
});

shop.get("/:id", requireAuth(), async (req, res) => {
  const { id } = req.params;
  const getAshopItem = await getShopItemByID(id);

  if (getAshopItem) {
    // console.log("=== GET shop item by ID", getAshopItem, "===");
    res.status(200).json({ payload: getAshopItem });
  } else {
    res.status(404).send(`shop item: ${id} was not found`);
  }
});

module.exports = shop;
