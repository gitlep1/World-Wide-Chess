const usersSocket = require("./sockets/usersSockets");
const singlePlayerGamesSocket = require("./sockets/singlePlayerGamesSockets");
const multiPlayerGamesSocket = require("./sockets/multiPlayerGamesSockets");
const messagesSocket = require("./sockets/messagesSockets");

const { socketAuth } = require("./validation/socketAuth");
const { socketScope } = require("./validation/socketScope");

const addSocketEventListeners = (io) => {
  // io.use((socket, next) => {
  //   socketAuth(socket, (error) => {
  //     if (error) {
  //       return next(error);
  //     }

  //     socketScope(["read:user", "write:user"])(socket, (error) => {
  //       if (error) {
  //         return next(error);
  //       }
  //     });

  //     next();
  //   });
  // });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    const count = io.engine.clientsCount;
    console.log("Client Count: ", count);

    // disconnect all clients \\
    // io.sockets.sockets.forEach((socket) => {
    //   socket.disconnect(true);
    // });

    // === add socket token checking later === \\
    // socket.on("check-token", (token) => {
    //   console.log("check: ", token);
    //   socketAuth(token, socket, (error) => {
    //     if (error) {
    //       const errMsg = error.message;
    //       return socket.emit("invalid-token-error", errMsg);
    //     }
    //   });

    // socketScope(["read:user", "write:user"])(token, socket, (error) => {
    //   if (error) {
    //     const errMsg = error.message;
    //     return socket.emit("invalid-scope-error", errMsg);
    //   }
    // });
    // });

    usersSocket(io, socket, socket.id);
    singlePlayerGamesSocket(io, socket, socket.id);
    multiPlayerGamesSocket(io, socket, socket.id);
    messagesSocket(io, socket, socket.id);
  });
};

module.exports = addSocketEventListeners;
