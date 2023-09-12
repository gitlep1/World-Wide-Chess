const db = require("../db/dbConfig.js");

const getAllMessages = async () => {
  try {
    const messages = await db.any("SELECT * FROM messages");
    return messages;
  } catch (err) {
    return err;
  }
};

const getMessageByID = async (id) => {
  try {
    const message = await db.oneOrNone(
      "SELECT * FROM messages WHERE id = $1",
      id
    );
    return message;
  } catch (err) {
    return err;
  }
};

const getallUserMessagesByID = async (uid) => {
  try {
    const message = await db.any(
      "SELECT * FROM messages WHERE user_id = $1",
      uid
    );
    return message;
  } catch (err) {
    return err;
  }
};

const createMessage = async (newMessageData) => {
  try {
    const newMessage = await db.one(
      "INSERT INTO messages (user_id, username, profileimg, message) VALUES($1, $2, $3, $4) RETURNING *",
      [
        newMessageData.user_id,
        newMessageData.username,
        newMessageData.profileimg,
        newMessageData.message,
      ]
    );
    return newMessage;
  } catch (error) {
    return error;
  }
};

const updateMessage = async (id, updatedMessageData) => {
  try {
    const updateMessage = await db.one(
      "UPDATE messages SET user_id = $1, message = $2 WHERE id = $3 RETURNING *",
      [updatedMessageData.user_id, updatedMessageData.message, id]
    );
    return updateMessage;
  } catch (error) {
    return error;
  }
};

const deleteMessage = async (id) => {
  try {
    if (id === null || id === undefined) {
      return false;
    }
    const deletedMessage = await db.one(
      "DELETE FROM messages WHERE id = $1 RETURNING *",
      id
    );
    return deletedMessage;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getAllMessages,
  getMessageByID,
  getallUserMessagesByID,
  createMessage,
  updateMessage,
  deleteMessage,
};
