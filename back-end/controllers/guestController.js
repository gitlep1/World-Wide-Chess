const express = require("express");
const jwt = require("jsonwebtoken");
const guest = express.Router();

const {
  getAllGuests,
  getGuestByID,
  createGuest,
  deleteGuest,
} = require("../queries/guests");

const { requireAuth } = require("../validation/requireAuth");
const myRequireAuth = requireAuth("guest");

const JSK = process.env.JWT_SECRET;

const DefaultProfImg = "../Images/DefaultProfImg.png";

guest.get("/", myRequireAuth, async (req, res) => {
  const allGuests = await getAllGuests();

  if (allGuests) {
    // console.log("=== GET Users", allGuests, "===");
    res.status(200).json(allGuests);
  } else {
    res.status(404).send("Cannot find any users");
  }
});

guest.get("/:id", myRequireAuth, async (req, res) => {
  const { id } = req.params;
  const getAGuest = await getGuestByID(id);

  if (getAGuest) {
    // console.log("=== GET guest by ID", getAGuest, "===");
    res.status(200).json(getAGuest);
  } else {
    res.status(404).send("user not found");
  }
});

guest.post("/", async (req, res) => {
  const newGuestData = {
    profileimg: req.body.profileimg,
    username: req.body.username,
    is_guest: true,
  };

  const createdGuest = await createGuest(newGuestData);

  if (createdGuest) {
    console.log("=== POST guest", createdGuest, "===");
    const token = jwt.sign({ id: createdGuest.id }, JSK, { expiresIn: "1d" });
    res.status(201).json({ guest: createdGuest, token });
  } else {
    res.status(404).send("user not created");
  }
});

guest.delete("/:id", myRequireAuth, async (req, res) => {
  const { id } = req.params;

  const deletedGuest = await deleteGuest(id);
  console.log("=== DELETE guest", deletedGuest, "===");

  if (deletedGuest.id) {
    res.status(200).json(deletedGuest);
  } else {
    res.status(404).send("user not found");
  }
});

module.exports = guest;
