const {
  getAllMessages,
  getMessageByID,
  getallUserMessagesByID,
  createMessage,
  updateMessage,
  deleteMessage,
} = require("../queries/messages.js");

const addMessagesSocketEventListeners = (io, socket, socketId) => {
  socket.on("get-all-messages", async () => {
    try {
      const getAll = await getAllMessages();
      io.emit("all-messages", getAll);
    } catch (err) {
      const errorMessage = "Could not get all messages";
      socket.emit("get-all-messages-error", new Error(errorMessage));
    }
  });

  socket.on("create-message", async (messageData) => {
    try {
      await createMessage(messageData);
    } catch (err) {
      const errorMessage = "Could not create message";
      socket.emit("create-message-error", new Error(errorMessage));
    }
  });
};

module.exports = addMessagesSocketEventListeners;
