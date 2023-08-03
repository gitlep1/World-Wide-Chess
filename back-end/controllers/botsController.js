const express = require("express");
const bot = express.Router();

const { getAllBots } = require("../queries/bots");

const { requireAuth } = require("../validation/requireAuth");
const { scopeAuth } = require("../validation/scopeAuth");

bot.get("/", requireAuth(), scopeAuth(["read:user"]), async (req, res) => {
  const allBots = await getAllBots();

  if (allBots) {
    // console.log("=== GET Bots", allBots, "===");
    res.status(200).json({ payload: allBots });
  } else {
    res.status(404).send("Cannot find any bots");
  }
});

module.exports = bot;
