const addGamesSocketEventListeners = (socket, socketId) => {
  socket.on("room-create", (gameData) => {
    //
  });

  socket.on("start-game", (gameId) => {
    console.log(`Client joined game ${gameId}`);
    const gameRoom = io.of(`/Room/${gameId}`);

    gameRoom.on("connection", (socket) => {
      console.log(`A player connected to game ${gameId}`);

      // Handle game events
    });

    socket.join(`Room/${gameId}`);
  });

  // socket.on("join-game", (gameId) => {
  //   console.log(`Client joined game ${gameId}`);
  //   socket.join(`game-${gameId}`);
  // });

  // socket.on("move-piece", async (gameId, from, to, promotion) => {
  //   console.log(from, to);
  //   // Get the current game state from the database
  //   const game = await getGamesByID(gameId);

  //   // Create a new chess.js instance using the current game state
  //   const chessGame = new Chess(game[0].current_positions);

  //   // Validate the move and make the move if it's legal
  //   const move = chessGame.move({ from, to, promotion });
  //   if (move) {
  //     const updatedGameData = {
  //       player2id: game[0].player2id,
  //       player1color: game[0].player1color,
  //       player2color: game[0].player2color,
  //       in_progress: game[0].in_progress,
  //       current_positions: move.after,
  //     };
  //     // If the move is valid, update the game state in the database
  //     const updatedGame = await updateGames(gameId, updatedGameData);

  //     // Emit a 'game-state-updated' event to all clients in the game room
  //     io.to(`game-${gameId}`).emit("game-state-updated", updatedGame);

  //     console.log(`Game ${gameId} state updated:`, updatedGame);
  //   } else {
  //     console.log(`Could not update game: ${gameId}, INVALID MOVE!`);
  //   }
  // });
};

module.exports = addGamesSocketEventListeners;
