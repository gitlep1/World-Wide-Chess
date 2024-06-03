const db = require("../db/dbConfig.js");

const getAllGuests = async () => {
  const guests = await db.any(
    "SELECT * FROM users WHERE users.is_guest = true"
  );
  return guests;
};

const getGuestByID = async (id) => {
  const guest = await db.oneOrNone(
    "SELECT * FROM users WHERE users.id = $1 AND users.is_guest = true",
    id
  );
  return guest;
};

const createGuest = async (newGuestData) => {
  const newGuest = await db.oneOrNone(
    "INSERT INTO users (profileimg, username, is_guest) VALUES($1, $2, $3) RETURNING *",
    [newGuestData.profileimg, newGuestData.username, newGuestData.is_guest]
  );
  return newGuest;
};

const deleteGuest = async (id) => {
  if (id === null || id === undefined) {
    return false;
  }
  const deletedGuest = await db.oneOrNone(
    "DELETE FROM users WHERE id = $1 AND users.is_guest = true RETURNING *",
    id
  );
  return deletedGuest;
};

module.exports = {
  getAllGuests,
  getGuestByID,
  createGuest,
  deleteGuest,
};
