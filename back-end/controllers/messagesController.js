const express = require("express");
const message = express.Router();

const {
  getAllMessages,
  getMessageByID,
  getallUserMessagesByID,
  createMessage,
  updateMessage,
  deleteMessage,
} = require("../queries/messages");

const { requireAuth } = require("../validation/requireAuth");

message.get("/", requireAuth(), async (req, res) => {
  const allMessages = await getAllMessages();

  if (allMessages) {
    res.status(200).json({ payload: allMessages });
  } else {
    res.status(404).send("Cannot find any messages");
  }
});

message.get("/user", requireAuth(), async (req, res) => {
  const getAllUserMessages = await getallUserMessagesByID(uid);

  if (getAllUserMessages.length > 0) {
    res.status(200).json({ payload: getAllUserMessages });
  } else {
    res.status(404).send(`messages for ${uid} not found`);
  }
});

message.get("/:id", requireAuth(), async (req, res) => {
  const { id } = req.params;
  const getAMessage = await getMessageByID(id);

  if (getAMessage) {
    res.status(200).json({ payload: getAMessage });
  } else {
    res.status(404).send("message not found");
  }
});

message.post("/", requireAuth(), async (req, res) => {
  const newMessageData = {
    user_id: req.body.user_id,
    username: req.body.username,
    profileimg: req.body.profileimg,
    message: req.body.message,
  };

  const createdMessage = await createMessage(newMessageData);

  if (createdMessage) {
    res.status(201).json({ payload: createdMessage });
  } else {
    res.status(404).send("message not created");
  }
});

message.put("/:id", requireAuth(), async (req, res) => {
  const { id } = req.params;

  const updatedMessageData = {
    user_id: req.body.user_id,
    message: req.body.message,
  };

  const updatedMessage = await updateMessage(id, updatedMessageData);

  if (updatedMessage) {
    res.status(200).json({ payload: updatedMessage });
  } else {
    res.status(404).send("message not found");
  }
});

message.delete("/:id", requireAuth(), async (req, res) => {
  const { id } = req.params;

  const deletedMessage = await deleteMessage(id);

  if (deletedMessage.id) {
    res.status(200).json({ payload: deletedMessage });
  } else {
    res.status(404).send("message not found");
  }
});

module.exports = message;
