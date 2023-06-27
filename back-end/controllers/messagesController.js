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
const myRequireAuth = requireAuth("messages");

message.get("/", myRequireAuth, async (req, res) => {
  const allMessages = await getAllMessages();

  if (allMessages) {
    // console.log("=== GET Messages", allMessages, "===");
    res.status(200).json(allMessages);
  } else {
    res.status(404).send("Cannot find any messages");
  }
});

message.get("/user", myRequireAuth, async (req, res) => {
  const { uid } = req.query;
  const getAllUserMessages = await getallUserMessagesByID(uid);

  if (getAllUserMessages.length > 0) {
    // console.log("=== GET user messages by ID", getAllUserMessages, "===");
    res.status(200).json(getAllUserMessages);
  } else {
    res.status(404).send(`messages for ${uid} not found`);
  }
});

message.get("/:id", myRequireAuth, async (req, res) => {
  const { id } = req.params;
  const getAMessage = await getMessageByID(id);

  if (getAMessage) {
    // console.log("=== GET message by ID", getAMessage, "===");
    res.status(200).json(getAMessage);
  } else {
    res.status(404).send("message not found");
  }
});

message.post("/", myRequireAuth, async (req, res) => {
  const newMessageData = {
    user_id: req.body.user_id,
    message: req.body.message,
  };

  const createdMessage = await createMessage(newMessageData);

  if (createdMessage) {
    console.log("=== POST message", createdMessage, "===");
    res.status(201).json(createdMessage);
  } else {
    res.status(404).send("message not created");
  }
});

message.put("/:id", myRequireAuth, async (req, res) => {
  const { id } = req.params;

  const updatedMessageData = {
    user_id: req.body.user_id,
    message: req.body.message,
  };

  const updatedMessage = await updateMessage(id, updatedMessageData);

  if (updatedMessage) {
    console.log("=== PUT message", updatedMessage, "===");
    res.status(200).json(updatedMessage);
  } else {
    res.status(404).send("message not found");
  }
});

message.delete("/:id", myRequireAuth, async (req, res) => {
  const { id } = req.params;

  const deletedMessage = await deleteMessage(id);
  console.log("=== DELETE message", deletedMessage, "===");

  if (deletedMessage.id) {
    res.status(200).json(deletedMessage);
  } else {
    res.status(404).send("message not found");
  }
});

module.exports = message;
