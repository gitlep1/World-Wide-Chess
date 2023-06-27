const db = require("../db/dbConfig.js");

const getAllGuests = async () => {
  try {
    const guests = await db.any("SELECT * FROM guests");
    return guests;
  } catch (err) {
    return err;
  }
};

const getGuestByID = async (id) => {
  try {
    const guest = await db.oneOrNone(
      "SELECT * FROM guests WHERE guests.id = $1",
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
      "INSERT INTO guests (profileimg, username) VALUES($1, $2) RETURNING *",
      [newGuestData.profileimg, newGuestData.username]
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
      "DELETE FROM guests WHERE id = $1 RETURNING *",
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
