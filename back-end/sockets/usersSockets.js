const { getAllUsers, getUserByID, deleteUser } = require("../queries/users");

const addUsersSocketEventListeners = (io, socket, socketId) => {
  socket.on("users-update-all-clients", async () => {
    try {
      const getUsers = await getAllUsers();
      socket.emit("users", getUsers);
      socket.broadcast.emit("users", getUsers);
    } catch (err) {
      const errorMessage = "Could not get all users";
      socket.emit("users-visit-error", new Error(errorMessage));
    }
  });

  socket.on("user-update", async (userId) => {
    try {
      const getUser = await getUserByID(userId);
      socket.emit("userUpdated", getUser);
      socket.broadcast.emit("userUpdated", getUser);
    } catch (err) {
      const errorMessage = `Could not update user: ${userId}`;
      socket.emit("user-changed-error", new Error(errorMessage));
    }
  });
};

module.exports = addUsersSocketEventListeners;
