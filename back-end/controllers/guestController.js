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

// const DefaultProfImg = "../Images/DefaultProfImg.png";

guest.get("/", requireAuth(), scopeAuth(["read:user"]), async (req, res) => {
  const allGuests = await getAllGuests();

  if (allGuests) {
    // console.log("=== GET Users", allGuests, "===");
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
      // console.log("=== GET guest by ID", getAGuest, "===");
      res.status(200).json({ payload: getAGuest });
    } else {
      res.status(404).send("guest not found");
    }
  }
);

guest.post("/signup", async (req, res) => {
  const newGuestData = {
    profileimg: req.body.profileimg,
    username: req.body.username,
    is_guest: true,
  };

  const createdGuest = await createGuest(newGuestData);

  if (createdGuest) {
    const clientTokenPayload = {
      user: createdGuest,
      scopes: ["read:user", "write:user"],
    };
    console.log(
      "=== POST guest (clientTokenPayload)",
      clientTokenPayload,
      "==="
    );
    const token = jwt.sign(clientTokenPayload, JSK, { expiresIn: "1h" });
    res.status(201).json({ payload: createdGuest, token });
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
      console.log("=== DELETE guest", deletedGuest, "===");
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
