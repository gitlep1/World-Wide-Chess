const express = require("express");
const facts = express.Router();

const { getAllFacts } = require("../queries/facts");
const { requireAuth } = require("../validation/requireAuth");
const { scopeAuth } = require("../validation/scopeAuth");

facts.get("/", async (req, res) => {
  const allFacts = await getAllFacts();

  if (allFacts) {
    // console.log("=== GET Facts", allFacts, "===");
    res.status(200).json({ payload: allFacts });
  } else {
    res.status(404).send("Cannot find any facts");
  }
});

module.exports = facts;
