const { getAllUsers, getUserByID, deleteUser } = require("../queries/users");

const addUsersSocketEventListeners = (socket, socketId) => {
  socket.on("users-visit", async () => {
    try {
      const getUsers = await getAllUsers();
      socket.emit("users", getUsers);
    } catch (err) {
      const errorMessage = "Could not get all users";
      socket.emit("users-visit-error", new Error(errorMessage));
    }
  });

  socket.on("user-changed", async (userId) => {
    try {
      const getUser = await getUserByID(userId);
      socket.emit("user", getUser);
      socket.broadcast.emit("user", getUser);
    } catch (err) {
      const errorMessage = `Could not update user: ${userId}`;
      socket.emit("user-changed-error", new Error(errorMessage));
    }
  });
};

module.exports = addUsersSocketEventListeners;
