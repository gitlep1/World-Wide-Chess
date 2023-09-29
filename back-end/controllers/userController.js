const express = require("express");
const user = express.Router();

const {
  getAllUsers,
  getUserByID,
  createUser,
  updateUser,
  deleteUser,
  checkIfEmailExists,
} = require("../queries/users");

const { checkValues } = require("../validation/userValidation");

user.get("/", async (req, res) => {
  const allUsers = await getAllUsers();

  if (allUsers) {
    // console.log("=== GET Users", allUsers, "===");
    res.status(200).json(allUsers);
  } else {
    res.status(404).send("Cannot find any users");
  }
});

user.get("/:id", async (req, res) => {
  const { id } = req.params;
  const getAUser = await getUserByID(id);
  console.log(getAUser);
  if (getAUser) {
    // console.log("=== GET user by ID", getAUser, "===");
    res.status(200).json(getAUser);
  } else {
    res.status(404).send("user not found");
  }
});

user.post("/", checkValues, async (req, res) => {
  const newUserData = {
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  };

  const checkEmail = await checkIfEmailExists(newUserData.email);

  if (checkEmail) {
    res.status(409).send("Email already exists!");
  } else {
    // newUserData["profileimg"] = "../Images/DefaultProfImg.png";
    const createdUser = await createUser(newUserData);

    if (createdUser) {
      console.log("=== POST user", createdUser, "===");
      res.status(201).json(createdUser);
    } else {
      res.status(404).send("user not created");
    }
  }
});

user.put("/:id", checkValues, async (req, res) => {
  const { id } = req.params;

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

  const updatedUser = await updateUser(id, updatedUserData);

  if (updatedUser) {
    console.log("=== PUT user", updatedUser, "===");
    res.status(200).json(updatedUser);
  } else {
    res.status(404).send("user not found");
  }
});

user.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const deletedUser = await deleteUser(id);
  console.log("=== DELETE user", deletedUser, "===");

  if (deletedUser.id) {
    res.status(200).json(deletedUser);
  } else {
    res.status(404).send("user not found");
  }
});

module.exports = user;
