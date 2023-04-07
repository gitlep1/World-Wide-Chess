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

const createUser = async (newUserData) => {
  try {
    const newUser = await db.one(
      "INSERT INTO users (username, password, email, profileimg) VALUES($1, $2, $3, $4) RETURNING *",
      [
        newUserData.username,
        newUserData.password,
        newUserData.email,
        newUserData.profileimg,
      ]
    );
    return newUser;
  } catch (error) {
    return error;
  }
};

const updateUser = async (id, updatedUserData) => {
  try {
    const updateUser = await db.one(
      "UPDATE users SET profileimg=$1, username=$2, password=$3, email=$4, theme=$5, wins=$6, ties=$7, loss=$8, preferred_color=$9, last_online=$10 WHERE id=$11 RETURNING *",
      [
        updatedUserData.profileimg,
        updatedUserData.username,
        updatedUserData.password,
        updatedUserData.email,
        updatedUserData.theme,
        updatedUserData.wins,
        updatedUserData.ties,
        updatedUserData.loss,
        updatedUserData.preferred_color,
        updatedUserData.last_online,
        id,
      ]
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
