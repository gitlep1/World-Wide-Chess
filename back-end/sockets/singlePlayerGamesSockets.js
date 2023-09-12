const { getUserByID } = require("../queries/users");
const { getGuestByID } = require("../queries/guests");
const { getBotById } = require("../queries/bots");
const Chess = require("chess.js").Chess;

const {
  getAllGames,
  getGameByID,
  createGame,
  updateGame,
  updateGamePositions,
  deleteGame,
} = require("../queries/singleGames");

const addSingleGamesSocketEventListeners = (io, socket, socketId) => {
  const token = socket.handshake.auth.token;

  socket.on("get-single-games", async () => {
    try {
      const singleGames = await getAllGames();
      socket.emit("single-games", singleGames);
      socket.broadcast.emit("single-games", singleGames);
    } catch (err) {
      const errorMessage = "Could not get all games";
      socket.emit("get-single-games-error", new Error(errorMessage));
    }
  });

  socket.on("single-room-created", async (gameData) => {
    console.log(
      `=== New room created by socketID: ${socketId} \n Game Data: `,
      gameData,
      "==="
    );

    const singleGame = await getGameByID(gameData.id);

    if (singleGame) {
      socket.join(`/Room/${gameData.id}/Settings`);
      io.in(`/Room/${gameData.id}/Settings`).emit(
        "single-room-settings",
        singleGame
      );
    } else {
      const errorMessage = `Could not get game with ID: ${gameData.id}`;
      socket.emit("single-room-created-error", new Error(errorMessage));
      socket.leave(`/Room/${gameData.id}/Settings`);
    }
  });

  socket.on("single-room-joined", async (gameData) => {
    console.log(`=== SocketID: ${socketId} joined room: ${gameData.payload.id} === \n
    Game Data: ${gameData.payload}`);

    const singleGame = await getGameByID(gameData.id);

    if (singleGame) {
      socket.join(`/Room/${gameData.id}/Settings`);
      io.in(`/Room/${gameData.id}/Settings`).emit(
        "single-room-settings",
        singleGame
      );
    } else {
      const errorMessage = `Could not get game with ID: ${gameData.id}`;
      socket.emit("single-room-created-error", new Error(errorMessage));
      socket.leave(`/Room/${gameData.id}/Settings`);
    }
  });

  socket.on("start-single-player-game", async (gameData) => {
    console.log(
      `=== start-single-player-game \n
    Game Data: `,
      gameData,
      "==="
    );

    const playerData =
      (await getUserByID(gameData.playerid)) ||
      (await getGuestByID(gameData.playerid));

    const botData = await getBotById(gameData.botid);

    if (playerData && botData) {
      io.in(`/Room/${gameData.id}/Settings`).emit(
        "single-started",
        gameData,
        playerData,
        botData
      );
    } else {
      const errorMessage = `Could not get player data: ${playerData}`;
      socket.emit("single-room-created-error", new Error(errorMessage));
    }
  });

  socket.on("get-single-game-data", async (gameId) => {
    socket.leave(`/Room/${gameId}/Settings`);
    socket.leave(`/Room/${gameId}`);
    socket.join(`/Room/${gameId}/Settings`);
    socket.join(`/Room/${gameId}`);

    const singleGame = await getGameByID(gameId);

    if (singleGame) {
      const playerData =
        (await getUserByID(singleGame.player1id)) ||
        (await getGuestByID(singleGame.player1id));

      const botData = await getBotById(singleGame.botid);

      if (playerData && botData) {
        io.in(`/Room/${gameId}/Settings`).emit(
          "single-player-reconnected",
          singleGame,
          playerData,
          botData
        );
        io.in(`/Room/${gameId}`).emit(
          "single-player-reconnected",
          singleGame,
          playerData,
          botData
        );
      } else {
        const errorMessage = `Opponent has disconnected.`;
        io.in(`/Room/${gameId}`).emit(
          "single-opponent-disconnected",
          errorMessage
        );
      }
    } else {
      const errorMessage = `Game has ended.`;
      io.in(`/Room/${gameId}`).emit("single-game-ended", errorMessage);
      socket.leave(`/Room/${gameId}`);
    }
  });

  socket.on("change-bot-difficulty", async (gameID, choosenBotID) => {
    try {
      const botData = await getBotById(choosenBotID);
      console.log(botData);
      io.in(`/Room/${gameID}/Settings`).emit("update-bot-difficulty", botData);

      const updatedGameData = {
        botid: choosenBotID,
        in_progress: false,
      };
      await updateGame(gameID, updatedGameData);
    } catch (err) {
      const errorMessage = err.message;
      io.in(`/Room/${gameID}/Settings`).emit(
        "game-settings-error",
        errorMessage
      );
      socket.leave(`/Room/${gameID}/Settings`);
    }
  });

  socket.on("single-move-piece", async (gameData, updatedGamePosition) => {
    const oldSingleGameData = await getGameByID(gameData.id);

    const chessGame = new Chess(oldSingleGameData.current_positions);

    const from = updatedGamePosition.from;
    const to = updatedGamePosition.to;

    const move = chessGame.move({ from, to });
    if (move) {
      const singleGameUpdated = await updateGamePositions(
        gameData.id,
        updatedGamePosition
      );

      if (singleGameUpdated) {
        console.log(
          "updated game ID: ",
          gameData.id,
          "with data: ",
          gameUpdated
        );

        io.in(`/Room/${gameData.id}`).emit(
          "single-game-state-updated",
          singleGameUpdated
        );
      } else {
        console.log(
          "could not update game ID: ",
          gameData.id,
          "with data: ",
          singleGameUpdated
        );

        const errorMessage = "ERROR: could not update positions";
        io.in(`Room/${gameData.id}`).emit(
          "single-game-state-updated-error",
          errorMessage
        );
      }
    }
  });

  socket.on("single-piece-promo", async (gameData, updatedGamePosition) => {
    const oldSingleGameData = await getGameByID(gameData.id);

    const chessGame = new Chess(oldSingleGameData.current_positions);

    const from = updatedGamePosition.from;
    const to = updatedGamePosition.to;
    const promotion = updatedGamePosition.promotion;

    const move = chessGame.move({ from, to, promotion });
    if (move) {
      const singleGameUpdated = await updateGamePositions(
        gameData.id,
        updatedGamePosition
      );

      if (singleGameUpdated) {
        console.log(
          "updated game ID: ",
          gameData.id,
          "with data: ",
          singleGameUpdated
        );

        io.in(`/Room/${gameData.id}`).emit(
          "single-game-state-updated",
          gameUpdated
        );
      } else {
        console.log(
          "could not update game ID: ",
          gameData.id,
          "with data: ",
          singleGameUpdated
        );

        const errorMessage = "ERROR: could not update piece promotion position";
        io.in(`Room/${gameData.id}`).emit(
          "single-piece-promo-error",
          errorMessage
        );
      }
    }
  });
};

module.exports = addSingleGamesSocketEventListeners;

// console.log(
//   chessGame.move({
//     from: updatedGamePosition.from,
//     to: updatedGamePosition.to,
//   })
// );
// if (move) {
//   console.log("valid");
// } else {
//   console.log("invalid");
// }

// if (move) {
//   const updatedGameData = {
//     player2id: gameData.player2id,
//     player1color: gameData.player1color,
//     player2color: gameData.player2color,
//     in_progress: gameData.in_progress,
//     current_positions: move.after,
//   };
//   const updatedGame = await updateGame(gameData.id, updatedGameData);

//   if (updatedGame) {
//     console.log(
//       "updated game ID: ",
//       gameData.id,
//       "with data: ",
//       updatedGame
//     );
//     io.in(`Room/${gameData.id}`).emit("game-state-updated", updatedGame);
//   } else {
//     console.log(
//       "could not update game ID: ",
//       gameData.id,
//       "with data: ",
//       updatedGame
//     );
//     const errorMessage = "ERROR: 409";
//     io.in(`Room/${gameData.id}`).emit(
//       "game-state-updated-error",
//       errorMessage
//     );
//   }
// } else {
//   console.log("INVALID MOVE!");

//   const errorMessage = "INVALID MOVE!";
//   io.in(`Room/${gameData.id}`).emit(
//     "game-state-updated-error",
//     errorMessage
//   );
// }

// if (promotion !== "") {
//   const move = chessGame.move({ from, to, promotion });
//   if (move) {
//     const updatedGameData = {
//       player2id: oldGameData.player2id,
//       player1color: oldGameData.player1color,
//       player2color: oldGameData.player2color,
//       in_progress: oldGameData.in_progress,
//       current_positions: move.after,
//     };
//     console.log(
//       "updated game ID: ",
//       gameData.id,
//       "with data: ",
//       updatedGame
//     );

//     const updatedGame = await updateGame(gameData.id, updatedGameData);
//     io.in(`Room/${gameData.id}`).emit("game-state-updated", updatedGame);
//   } else {
//     console.log(`Could not update game: ${gameData.id}, INVALID MOVE!`);

//     const errorMessage = "INVALID MOVE!";
//     io.in(`Room/${gameData.id}`).emit(
//       "game-state-updated-error",
//       errorMessage
//     );
//   }
// }

// Validate the move and make the move if it's legal
// const move = chessGame.move({ from, to, promotion });
// console.log(`from: ${from} ||| to: ${to}`);
// console.log(`move from: ${move.from} ||| move to: ${move.to}`);
// if (move) {
//   const updatedGameData = {
//     player2id: game[0].player2id,
//     player1color: game[0].player1color,
//     player2color: game[0].player2color,
//     in_progress: game[0].in_progress,
//     current_positions: move.after,
//   };
//   // If the move is valid, update the game state in the database
//   const updatedGame = await updatedGame(gameId, updatedGameData);

//   // Emit a 'game-state-updated' event to all clients in the game room
//   io.in(`Room/${gameId}`).emit("game-state-updated", updatedGame);

//   console.log(`Game ${gameId} state updated:`, updatedGame);
// } else {
//   console.log(`Could not update game: ${gameId}, INVALID MOVE!`);
// }
