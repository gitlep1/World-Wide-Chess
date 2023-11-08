const express = require("express");
const jwt = require("jsonwebtoken");
const users = express.Router();

const {
  getAllUsers,
  getUserByID,
  createUser,
  updateUser,
  deleteUser,
  checkUserCredentials,
  checkIfUserExists,
} = require("../queries/users");

const { checkValues } = require("../validation/userValidation");
const { requireAuth } = require("../validation/requireAuth");
const { scopeAuth } = require("../validation/scopeAuth");

const JSK = process.env.JWT_SECRET;

const DefaultProfImg = "../Images/DefaultProfImg.png";

users.get("/", requireAuth(), scopeAuth(["read:user"]), async (req, res) => {
  const allUsers = await getAllUsers();

  if (allUsers) {
    // console.log("=== GET Users", allUsers, "===");
    res.status(200).json({ payload: allUsers });
  } else {
    res.status(404).send("Cannot find any users");
  }
});

users.get(
  "/user",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { token } = req.user;
    const decoded = jwt.decode(token);

    const getAUser = await getUserByID(decoded.user.id);

    if (getAUser) {
      // console.log("=== GET user by ID", getAUser, "===");

      const userData = {
        id: getAUser.id,
        profileimg: getAUser.profileimg,
        username: getAUser.username,
        theme: getAUser.theme,
        chess_coins: getAUser.chess_coins,
        wins: getAUser.wins,
        loss: getAUser.loss,
        ties: getAUser.ties,
        rating: getAUser.rating,
        preferred_color: getAUser.preferred_color,
        is_guest: false,
        last_online: getAUser.last_online,
      };

      res.status(200).json({ payload: userData });
    } else {
      res.status(404).send("user not found");
    }
  }
);

users.post("/signup", checkValues, async (req, res) => {
  const newUserData = {
    profileimg: req.body.profileimg,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  };

  const checkCreds = await checkUserCredentials(
    newUserData.email,
    newUserData.username
  );

  if (checkCreds) {
    res.status(409).send("User already exists!");
  } else {
    const createdUser = await createUser(newUserData);

    if (createdUser) {
      const clientTokenPayload = {
        user: createdUser,
        scopes: ["read:user", "write:user"],
      };
      console.log(
        "=== POST user (clientTokenPayload)",
        clientTokenPayload,
        "==="
      );
      const token = jwt.sign(clientTokenPayload, JSK, { expiresIn: "30d" });

      const userData = {
        id: createdUser.id,
        profileimg: createdUser.profileimg,
        username: createdUser.username,
        theme: createdUser.theme,
        chess_coins: createdUser.chess_coins,
        wins: createdUser.wins,
        loss: createdUser.loss,
        ties: createdUser.ties,
        rating: createdUser.rating,
        preferred_color: createdUser.preferred_color,
        is_guest: false,
        last_online: createdUser.last_online,
      };

      res.status(201).json({ payload: userData, token });
    } else {
      res.status(404).send("user not created");
    }
  }
});

users.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const checkUser = await checkIfUserExists(email, password);

  if (checkUser) {
    const getUserData = await getUserByID(checkUser.id);

    if (getUserData) {
      const clientTokenPayload = {
        user: getUserData,
        scopes: ["read:user", "write:user"],
      };
      console.log(
        "=== POST user (clientTokenPayload)",
        clientTokenPayload,
        "==="
      );
      const token = jwt.sign(clientTokenPayload, JSK, { expiresIn: "30d" });

      const userData = {
        id: getUserData.id,
        profileimg: getUserData.profileimg,
        username: getUserData.username,
        theme: getUserData.theme,
        chess_coins: getUserData.chess_coins,
        wins: getUserData.wins,
        loss: getUserData.loss,
        ties: getUserData.ties,
        rating: getUserData.rating,
        preferred_color: getUserData.preferred_color,
        is_guest: false,
        last_online: getUserData.last_online,
      };

      res.status(201).json({ payload: userData, token });
    } else {
      res.status(404).send(`Data for: ${checkUser.id} not found`);
    }
  } else {
    res.status(404).send("user not found");
  }
});

users.put(
  "/update",
  checkValues,
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { token } = req.user;
    const decoded = jwt.decode(token);

    const updatedUserData = {
      profileimg: req.body.profileimg,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
      theme: req.body.theme,
      chess_coins: req.body.chess_coins,
      wins: req.body.wins,
      ties: req.body.ties,
      loss: req.body.loss,
      preferred_color: req.body.preferred_color,
      last_online: req.body.last_online,
    };

    const updatedUser = await updateUser(decoded.user.id, updatedUserData);

    if (updatedUser) {
      console.log("=== PUT user", updatedUser, "===");
      res.status(200).json({ payload: updatedUser });
    } else {
      res.status(404).send("user not found");
    }
  }
);

users.delete(
  "/delete",
  requireAuth(),
  scopeAuth(["read:user", "write:user"]),
  async (req, res) => {
    const { token } = req.user;
    const decoded = jwt.decode(token);

    const deletedUser = await deleteUser(decoded.user.id);

    if (deletedUser) {
      console.log("=== DELETE user", deletedUser, "===");
      res.status(200).send(
        `
          ID: ${deletedUser.id}
          User: ${deletedUser.username} 
          SUCCESS: user has been deleted.
        `
      );
    } else {
      res.status(404).send(
        `
          ID: ${decoded.user.id} 
          User: ${decoded.user.username}
          ERROR: user does not exist.
        `
      );
    }
  }
);

module.exports = users;
