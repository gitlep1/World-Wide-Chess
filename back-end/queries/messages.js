const db = require("../db/dbConfig.js");

const getAllMessages = async () => {
  const messages = await db.any("SELECT * FROM messages");
  return messages;
};

const getMessageByID = async (id) => {
  const message = await db.oneOrNone(
    "SELECT * FROM messages WHERE id = $1",
    id
  );
  return message;
};

const getallUserMessagesByID = async (uid) => {
  const message = await db.any(
    "SELECT * FROM messages WHERE user_id = $1",
    uid
  );
  return message;
};

const createMessage = async (newMessageData) => {
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
};

const updateMessage = async (id, updatedMessageData) => {
  const updateMessage = await db.one(
    "UPDATE messages SET user_id = $1, message = $2 WHERE id = $3 RETURNING *",
    [updatedMessageData.user_id, updatedMessageData.message, id]
  );
  return updateMessage;
};

const deleteMessage = async (id) => {
  if (id === null || id === undefined) {
    return false;
  }
  const deletedMessage = await db.one(
    "DELETE FROM messages WHERE id = $1 RETURNING *",
    id
  );
  return deletedMessage;
};

module.exports = {
  getAllMessages,
  getMessageByID,
  getallUserMessagesByID,
  createMessage,
  updateMessage,
  deleteMessage,
};
