const { getUserByID } = require("../queries/users");
const { getGuestByID } = require("../queries/guests");
const Chess = require("chess.js").Chess;

const {
  getAllGames,
  getGameByID,
  createGame,
  updateGame,
  updateGamePositions,
  deleteGame,
} = require("../queries/multiGames");

const addMultiGamesSocketEventListeners = (io, socket, socketId) => {
  const token = socket.handshake.auth.token;

  socket.on("get-multi-games", async () => {
    try {
      const multiGames = await getAllGames();
      socket.emit("multi-games", multiGames);
      socket.broadcast.emit("multi-games", multiGames);
    } catch (err) {
      const errorMessage = "Could not get all games";
      socket.emit("get-multi-games-error", new Error(errorMessage));
    }
  });

  socket.on("multi-room-created", async (gameData) => {
    console.log(
      `=== New room created by socketID: ${socketId} \n Game Data: `,
      gameData,
      "==="
    );

    const multiGame = await getGameByID(gameData.id);

    if (multiGame) {
      socket.join(`/Room/${gameData.id}/Settings`);
      io.in(`/Room/${gameData.id}/Settings`).emit(
        "multi-room-settings",
        multiGame
      );
    } else {
      const errorMessage = `Could not get game with ID: ${gameData.id}`;
      socket.emit("multi-room-created-error", new Error(errorMessage));
      socket.leave(`/Room/${gameData.id}/Settings`);
    }
  });

  socket.on("ask-to-join", async (gameData, player2ID) => {
    console.log(
      `=== SocketID: ${socketId} asked to join room: ${gameData.id} ===`
    );

    const checkIfGameExists = await getGameByID(gameData.id);
    const checkIfUserExists =
      (await getUserByID(player2ID)) || (await getGuestByID(player2ID));

    if (!checkIfUserExists && !checkIfGameExists) {
      return;
    }

    const player2Data = {
      id: checkIfUserExists.id,
      username: checkIfUserExists.username,
      wins: checkIfUserExists.wins,
      loss: checkIfUserExists.loss,
      socketid: socketId,
    };

    socket.emit("asking-host");

    io.in(`/Room/${gameData.id}/Settings`).emit("request-to-join", player2Data);
  });

  socket.on("accept-game", async (gameData, player1Data, player2Data) => {
    console.log(`=== ${player2Data.username} joined room: ${gameData.id} ===`);
    console.log(player1Data);
    console.log(player2Data);
    console.log(gameData);

    const multiGame = await getGameByID(gameData.id);

    const checkIf1stUserExists =
      (await getUserByID(player1Data.id)) ||
      (await getGuestByID(player1Data.id));

    const checkIf2ndUserExists =
      (await getUserByID(player2Data.id)) ||
      (await getGuestByID(player2Data.id));

    const startingPositions =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    if (multiGame && checkIf1stUserExists && checkIf2ndUserExists) {
      const updatedGameData = {
        botId: null,
        player2id: checkIf2ndUserExists.id,
        player1color: "w",
        player2color: "b",
        botColor: null,
        current_positions: startingPositions,
        in_progress: true,
        game_time: 0,
      };
      const updateGameData = await updateGame(multiGame.id, updatedGameData);

      if (updateGameData) {
        const player2SocketId = player2Data.socketid;

        const playerOneData = {
          id: checkIf1stUserExists.id,
          username: checkIf1stUserExists.username,
          wins: checkIf1stUserExists.wins,
          loss: checkIf1stUserExists.loss,
          ties: checkIf1stUserExists.ties,
        };

        const playerTwoData = {
          id: checkIf2ndUserExists.id,
          username: checkIf2ndUserExists.username,
          wins: checkIf2ndUserExists.wins,
          loss: checkIf2ndUserExists.loss,
          ties: checkIf2ndUserExists.ties,
        };

        io.to(player2SocketId).emit("host-accepted", updateGameData);
        io.in(`/Room/${gameData.id}/Settings`).emit(
          "player-joined",
          updateGameData,
          playerOneData,
          playerTwoData
        );
      } else {
        const errorMessage = `Could not update game with ID: ${gameData.id}`;
        socket.emit("accept-game-error", new Error(errorMessage));
      }
    } else {
      const errorMessage = `Could not get game with ID: ${gameData.id} or user does not exist`;
      socket.emit("accept-game-error", new Error(errorMessage));
    }
  });

  socket.on("deny-game", async (player2Data) => {
    console.log(`=== SocketID: ${socketId} denied game ===`);

    const player2SocketId = player2Data.socketid;
    io.to(player2SocketId).emit("host-denied");
  });

  socket.on("start-multi-player-game", async (gameData) => {
    console.log(`=== start-multi-player-game === \n
    Game Data: ${gameData}`);

    const player1Data =
      (await getUserByID(gameData.player1id)) ||
      (await getGuestByID(gameData.player1id));

    const player2Data =
      (await getUserByID(gameData.player2id)) ||
      (await getGuestByID(gameData.player2id));

    if (player1Data && player2Data) {
      io.in(`/Room/${gameData.id}/Settings`).emit(
        "multi-started",
        gameData,
        player1Data,
        player2Data
      );
    } else {
      const errorMessage = `Could not get player data: ${player1Data}, ${player2Data}`;
      socket.emit("multi-room-started-error", new Error(errorMessage));
    }
  });

  socket.on("get-multi-game-data", async (gameId) => {
    socket.leave(`/Room/${gameId}/Settings`);
    socket.leave(`/Room/${gameId}`);
    socket.join(`/Room/${gameId}/Settings`);
    socket.join(`/Room/${gameId}`);

    const multiGame = await getGameByID(gameId);

    if (multiGame) {
      const player1Data =
        (await getUserByID(multiGame.player1id)) ||
        (await getGuestByID(multiGame.player1id));

      const player2Data =
        (await getUserByID(multiGame.player2id)) ||
        (await getGuestByID(multiGame.player2id));

      if (player1Data && player2Data) {
        io.in(`/Room/${gameId}/Settings`).emit(
          "multi-player-reconnected",
          multiGame,
          player1Data,
          player2Data
        );
        io.in(`/Room/${gameId}`).emit(
          "multi-player-reconnected",
          multiGame,
          player1Data,
          player2Data
        );
      } else {
        const errorMessage = `Opponent has disconnected.`;
        io.in(`/Room/${gameId}`).emit(
          "multi-opponent-disconnected",
          errorMessage
        );
      }
    } else {
      const errorMessage = `Game has ended.`;
      io.in(`/Room/${gameId}`).emit("multi-game-ended", errorMessage);
      socket.leave(`/Room/${gameId}`);
    }
  });

  socket.on("multi-move-piece", async (gameData, updatedGamePosition) => {
    const oldMultiGameData = await getGameByID(gameData.id);

    const chessGame = new Chess(oldMultiGameData.current_positions);

    const from = updatedGamePosition.from;
    const to = updatedGamePosition.to;

    const move = chessGame.move({ from, to });
    if (move) {
      const multiGameUpdated = await updateGamePositions(
        gameData.id,
        updatedGamePosition
      );

      if (multiGameUpdated) {
        console.log(
          "updated game ID: ",
          gameData.id,
          "with data: ",
          gameUpdated
        );

        io.in(`/Room/${gameData.id}`).emit(
          "multi-game-state-updated",
          multiGameUpdated
        );
      } else {
        console.log(
          "could not update game ID: ",
          gameData.id,
          "with data: ",
          multiGameUpdated
        );

        const errorMessage = "ERROR: could not update positions";
        io.in(`Room/${gameData.id}`).emit(
          "multi-game-state-updated-error",
          errorMessage
        );
      }
    }
  });

  socket.on("multi-piece-promo", async (gameData, updatedGamePosition) => {
    const oldMultiGameData = await getGameByID(gameData.id);

    const chessGame = new Chess(oldMultiGameData.current_positions);

    const from = updatedGamePosition.from;
    const to = updatedGamePosition.to;
    const promotion = updatedGamePosition.promotion;

    const move = chessGame.move({ from, to, promotion });
    if (move) {
      const multiGameUpdated = await updateGamePositions(
        gameData.id,
        updatedGamePosition
      );

      if (multiGameUpdated) {
        console.log(
          "updated game ID: ",
          gameData.id,
          "with data: ",
          multiGameUpdated
        );

        io.in(`/Room/${gameData.id}`).emit(
          "multi-game-state-updated",
          gameUpdated
        );
      } else {
        console.log(
          "could not update game ID: ",
          gameData.id,
          "with data: ",
          multiGameUpdated
        );

        const errorMessage = "ERROR: could not update piece promotion position";
        io.in(`Room/${gameData.id}`).emit(
          "multi-game-state-updated-error",
          errorMessage
        );
      }
    }
  });
};

module.exports = addMultiGamesSocketEventListeners;

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
