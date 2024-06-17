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
const { scopeAuth } = require("../validation/scopeAuth");

const JSK = process.env.JWT_SECRET;

guest.get("/", requireAuth(), scopeAuth(["read:user"]), async (req, res) => {
  const allGuests = await getAllGuests();

  if (allGuests) {
    res.status(200).json({ payload: allGuests });
  } else {
    res.status(404).send("Cannot find any guests");
  }
});

guest.get(
  "/guest",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { token } = req.user;
    const decoded = jwt.decode(token);

    const getAGuest = await getGuestByID(decoded.user.id);

    if (getAGuest) {
      const guestData = {
        profileimg: getAGuest.profileimg,
        username: getAGuest.username,
        theme: getAGuest.theme,
        chess_coins: getAGuest.chess_coins,
        is_guest: true,
      };

      res.status(200).json({ payload: guestData });
    } else {
      res.status(404).send("guest not found");
    }
  }
);

guest.post("/signup", async (req, res) => {
  const newGuestData = {
    profileimg: "https://i.imgur.com/UhrGSKy.png",
    username: req.body.username,
    is_guest: true,
  };

  const createdGuest = await createGuest(newGuestData);

  if (createdGuest) {
    const clientTokenPayload = {
      user: createdGuest,
      scopes: ["read:user", "write:user"],
    };

    const token = jwt.sign(clientTokenPayload, JSK, {
      expiresIn: "1d",
    });

    const guestData = {
      id: createdGuest.id,
      profileimg: createdGuest.profileimg,
      username: createdGuest.username,
      theme: createdGuest.theme,
      chess_coins: createdGuest.chess_coins,
      is_guest: true,
    };

    res.status(201).json({ payload: guestData, token });
  } else {
    res.status(404).send("guest not created");
  }
});

guest.delete(
  "/delete",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { token } = req.user;
    const decoded = jwt.decode(token);

    const deletedGuest = await deleteGuest(decoded.user.id);

    if (deletedGuest.id) {
      res.status(200).json(
        `Guest: ${deletedGuest.username} \n 
          with ID: ${deletedGuest.id} has been deleted.`
      );
    } else {
      res
        .status(404)
        .send(
          `Guest: ${decoded.user.username} with ID: ${decoded.user.id} was not deleted`
        );
    }
  }
);

module.exports = guest;
