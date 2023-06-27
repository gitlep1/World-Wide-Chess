const express = require("express");
const shop = express.Router();

const { getAllShopItems, getShopItemsByID } = require("../queries/shop");

const { requireAuth } = require("../validation/requireAuth");
const myRequireAuth = requireAuth("shop");

shop.get("/", myRequireAuth, async (req, res) => {
  const shopItems = await getAllShopItems();

  if (shopItems.length > 0) {
    // console.log("=== GET shop items", shopItems, "===");
    res.status(200).json(shopItems);
  } else {
    res.status(404).send("shop items not found");
  }
});

shop.get("/:id", myRequireAuth, async (req, res) => {
  const { id } = req.params;
  const getAshopItem = await getShopItemsByID(id);

  if (getAshopItem) {
    // console.log("=== GET shop item by ID", getAshopItem, "===");
    res.status(200).json(getAshopItem);
  } else {
    res.status(404).send(`shop item: ${id} was not found`);
  }
});

module.exports = shop;
