const usersSocket = require("./sockets/usersSockets");
const singlePlayerGamesSocket = require("./sockets/singlePlayerGamesSockets");
const multiPlayerGamesSocket = require("./sockets/multiPlayerGamesSockets");
const messagesSocket = require("./sockets/messagesSockets");

const { requireAuth } = require("./validation/requireAuth");
const { scopeAuth } = require("./validation/scopeAuth");

const addSocketEventListeners = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    const count = io.engine.clientsCount;
    console.log("Client Count: ", count);

    // disconnect all clients \\
    // io.sockets.sockets.forEach((socket) => {
    //   socket.disconnect(true);
    // });

    usersSocket(io, socket, socket.id);
    singlePlayerGamesSocket(io, socket, socket.id);
    multiPlayerGamesSocket(io, socket, socket.id);
    messagesSocket(io, socket, socket.id);
  });
};

module.exports = addSocketEventListeners;
