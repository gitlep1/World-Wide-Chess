const db = require("../db/dbConfig.js");

const getAllUsers = async () => {
  const users = await db.any(
    "SELECT profileimg, username, theme, chess_coins, wins, ties, loss, games_played, rating, preferred_color, last_online FROM users WHERE users.is_guest = false"
  );
  return users;
};

const getUserByID = async (id) => {
  const user = await db.oneOrNone(
    "SELECT * FROM users WHERE users.id = $1 AND users.is_guest = false",
    [id]
  );

  if (!user) {
    return null;
  }

  return user;
};

const createUser = async (newUserData) => {
  const newUser = await db.oneOrNone(
    "INSERT INTO users (profileimg, username, password, email) VALUES($1, $2, $3, $4) RETURNING *",
    [
      newUserData.profileimg,
      newUserData.username,
      newUserData.password,
      newUserData.email,
    ]
  );
  return newUser;
};

const updateUser = async (id, updatedUserData) => {
  const updateUser = await db.oneOrNone(
    "UPDATE users SET profileimg = $1, username = $2, password = $3, email = $4, theme = $5, chess_coins = $6, wins = $7, ties = $8, loss = $9, games_played = $10, rating = $11, preferred_color = $12, last_online = $13 WHERE id = $14 RETURNING *",
    [
      updatedUserData.profileimg,
      updatedUserData.username,
      updatedUserData.password,
      updatedUserData.email,
      updatedUserData.theme,
      updatedUserData.chess_coins,
      updatedUserData.wins,
      updatedUserData.ties,
      updatedUserData.loss,
      updatedUserData.games_played,
      updatedUserData.rating,
      updatedUserData.preferred_color,
      updatedUserData.last_online,
      id,
    ]
  );
  return updateUser;
};

const deleteUser = async (id) => {
  if (id === null || id === undefined) {
    return false;
  }

  const deletedUser = await db.oneOrNone(
    "DELETE FROM users WHERE id = $1 AND users.is_guest = false",
    id
  );
  return deletedUser;
};

const checkUserCredentials = async (email, username) => {
  const userEmail = await db.oneOrNone(
    "SELECT id FROM users WHERE email = $1 AND username = $2 AND users.is_guest = false",
    [email, username]
  );
  return userEmail ? true : false;
};

const checkIfUserExists = async (email, password) => {
  const user = await db.oneOrNone(
    "SELECT id FROM users WHERE email = $1 AND password = $2 AND users.is_guest = false",
    [email, password]
  );
  return user;
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
