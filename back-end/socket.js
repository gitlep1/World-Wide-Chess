const usersSocket = require("./sockets/usersSockets");
const gamesSocket = require("./sockets/gamesSockets");

const addSocketEventListeners = (io) => {
  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    const count = io.engine.clientsCount;
    console.log("Client Count: ", count);

    // disconnect all clients \\
    // io.sockets.sockets.forEach((socket) => {
    //   socket.disconnect(true);
    // });

    usersSocket(socket, socket.id);
    gamesSocket(socket, socket.id);
  });
};

module.exports = addSocketEventListeners;
