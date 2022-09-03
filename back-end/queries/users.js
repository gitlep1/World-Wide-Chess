const db = require("../db/dbConfig.js");

const getAllUsers = async () => {
  try {
    const users = await db.any("SELECT * FROM users");
    return users;
  } catch (err) {
    return err;
  }
};

const getUserByID = async (id) => {
  try {
    const user = await db.any("SELECT * FROM users WHERE id = $1", id);
    return user;
  } catch (err) {
    return err;
  }
};

const createUser = async (profileImg, username, password, email) => {
  try {
    const newUser = await db.one(
      "INSERT INTO users (profileImg, username, password, email) VALUES($1, $2, $3, $4) RETURNING *",
      [profileImg, username, password, email]
    );
    return newUser;
  } catch (error) {
    return error;
  }
};

const updateUser = async (id, profileImg, username, password, email) => {
  try {
    const updateUser = await db.one(
      "UPDATE users SET profileImg = $1, username=$2, password=$3, email=$4 where id=$5 RETURNING *",
      [profileImg, username, password, email, id]
    );
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
    const deletedUser = await db.one(
      "DELETE FROM users WHERE id=$1 RETURNING *",
      id
    );
    return deletedUser;
  } catch (error) {
    return error;
  }
};

const checkIfEmailExists = async (email) => {
  const userEmail = await db.any("SELECT * FROM users WHERE email = $1", email);
  if (userEmail.length > 0) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  getAllUsers,
  getUserByID,
  createUser,
  updateUser,
  deleteUser,
  checkIfEmailExists,
};
