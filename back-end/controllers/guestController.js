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
    res.status(404).send("Cannot find any users");
  }
});

guest.get(
  "/:id",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { id } = req.params;
    const { token } = req.user;
    const decoded = jwt.decode(token);
    const { user } = decoded;

    if (Number(user.id) === Number(id)) {
      const getAGuest = await getGuestByID(id);

      if (getAGuest) {
        // console.log("=== GET guest by ID", getAGuest, "===");
        res.status(200).json({ payload: getAGuest });
      } else {
        res.status(404).send("user not found");
      }
    } else {
      res.sendStatus(401);
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
      "=== POST guest",
      createdGuest,
      ":::",
      clientTokenPayload,
      "==="
    );
    const token = jwt.sign(clientTokenPayload, JSK, { expiresIn: "1d" });
    res.status(201).json({ payload: createdGuest, token });
  } else {
    res.status(404).send("user not created");
  }
});

guest.delete(
  "/:id",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { id } = req.params;

    const deletedGuest = await deleteGuest(id);
    console.log("=== DELETE guest", deletedGuest, "===");

    if (deletedGuest.id) {
      res.status(200).json(deletedGuest);
    } else {
      res.status(404).send("user not found");
    }
  }
);

module.exports = guest;
