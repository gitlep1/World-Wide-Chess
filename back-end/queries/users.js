const db = require("../db/dbConfig.js");

const getAllUsers = async () => {
  try {
    const query =
      "SELECT username, rating, wins, ties, loss, chess_coins, profileimg, preferred_color, last_online FROM users WHERE users.is_guest = false";

    const users = await db.any(query);
    return users;
  } catch (err) {
    return err;
  }
};

const getUserByID = async (id) => {
  try {
    const query =
      "SELECT * FROM users WHERE users.id = $1 AND users.is_guest = false";

    const user = await db.oneOrNone(query, id);
    return user;
  } catch (err) {
    return err;
  }
};

const createUser = async (newUserData) => {
  try {
    const query =
      "INSERT INTO users (profileimg, username, password, email) VALUES($1, $2, $3, $4) RETURNING *";

    const values = [
      newUserData.profileimg,
      newUserData.username,
      newUserData.password,
      newUserData.email,
    ];

    const newUser = await db.one(query, values);
    return newUser;
  } catch (error) {
    return error;
  }
};

const updateUser = async (id, updatedUserData) => {
  try {
    const query =
      "UPDATE users SET profileimg = $1, username = $2, password = $3, email = $4, theme = $5, chess_coins = $6, wins = $7, ties = $8, loss = $9, preferred_color = $10, last_online = $11 WHERE id = $12 RETURNING *";

    const values = [
      updatedUserData.profileimg,
      updatedUserData.username,
      updatedUserData.password,
      updatedUserData.email,
      updatedUserData.theme,
      updatedUserData.chess_coins,
      updatedUserData.wins,
      updatedUserData.ties,
      updatedUserData.loss,
      updatedUserData.preferred_color,
      updatedUserData.last_online,
      id,
    ];

    const updateUser = await db.one(query, values);
    return updateUser;
  } catch (error) {
    return error;
  }
};

const deleteUser = async (id) => {
  try {
    if (id === null || id === undefined) {
      return false;
    }

    const query = "DELETE FROM users WHERE id = $1 AND users.is_guest = false";

    const deletedUser = await db.one(query, id);
    return deletedUser;
  } catch (error) {
    return error;
  }
};

const checkUserCredentials = async (email, username) => {
  try {
    const query =
      "SELECT id FROM users WHERE email = $1 AND username = $2 AND users.is_guest = false";

    const values = [email, username];

    const userEmail = await db.oneOrNone(query, values);
    return userEmail ? true : false;
  } catch (error) {
    return error;
  }
};

const checkIfUserExists = async (email, password) => {
  try {
    const query =
      "SELECT id FROM users WHERE email = $1 AND password = $2 AND users.is_guest = false";

    const values = [email, password];

    const user = await db.oneOrNone(query, values);
    return user;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllUsers,
  getUserByID,
  createUser,
  updateUser,
  deleteUser,
  checkUserCredentials,
  checkIfUserExists,
};
