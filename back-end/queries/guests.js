const db = require("../db/dbConfig.js");

const getAllGuests = async () => {
  try {
    const guests = await db.any(
      "SELECT * FROM users WHERE users.is_guest = true"
    );
    return guests;
  } catch (err) {
    return err;
  }
};

const getGuestByID = async (id) => {
  try {
    const guest = await db.oneOrNone(
      "SELECT * FROM users WHERE users.id = $1 AND users.is_guest = true",
      id
    );
    return guest;
  } catch (err) {
    return err;
  }
};

const createGuest = async (newGuestData) => {
  try {
    const newGuest = await db.one(
      "INSERT INTO users (profileimg, username, is_guest) VALUES($1, $2, $3) RETURNING *",
      [newGuestData.profileimg, newGuestData.username, newGuestData.is_guest]
    );
    return newGuest;
  } catch (error) {
    return error;
  }
};

const deleteGuest = async (id) => {
  try {
    if (id === null || id === undefined) {
      return false;
    }
    const deletedGuest = await db.one(
      "DELETE FROM users WHERE id = $1 AND users.is_guest = true RETURNING *",
      id
    );
    return deletedGuest;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllGuests,
  getGuestByID,
  createGuest,
  deleteGuest,
};
