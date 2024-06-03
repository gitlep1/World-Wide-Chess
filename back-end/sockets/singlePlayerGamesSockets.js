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

const {
  getMoveHistoryByGameID,
  createMoveHistory,
  // updateMoveHistory,
  deleteMoveHistory,
} = require("../queries/moveHistorySingle");

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
    try {
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

        const moveHistory = await getMoveHistoryByGameID(gameId);

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
            botData,
            moveHistory
          );
        } else {
          const errorMessage = `Host has disconnected.`;
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
    } catch (err) {
      const errorMessage = err.message;
      io.in(`/Room/${gameId}/Settings`).emit(
        "game-settings-error",
        errorMessage
      );
      socket.leave(`/Room/${gameId}/Settings`);
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

  socket.on(
    "single-move-piece",
    async (gameData, updatedPositions, piece, color) => {
      const oldSingleGameData = await getGameByID(gameData.id);

      console.log({ gameData });
      console.log({ oldSingleGameData });
      console.log({ updatedPositions });
      console.log({ piece });
      console.log({ color });

      const chessGame = new Chess(oldSingleGameData.current_positions);

      const from = updatedPositions.from;
      const to = updatedPositions.to;

      // const move = chessGame.move({ from, to });
      // if (move) {
      const singleGameUpdated = await updateGamePositions(
        oldSingleGameData.id,
        updatedPositions
      );
      console.log({ singleGameUpdated });

      if (!(singleGameUpdated instanceof Error)) {
        const updatedMoveHistoryData = {
          game_id: singleGameUpdated.id,
          from_square: from,
          to_square: to,
          piece: piece,
          color: color,
        };

        console.log({ updatedMoveHistoryData });

        const updatedMoveHistory = await createMoveHistory(
          updatedMoveHistoryData
        );

        console.log({ updatedMoveHistory });

        io.in(`/Room/${gameData.id}`).emit(
          "single-game-state-updated",
          singleGameUpdated,
          updatedMoveHistory
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
      // }
    }
  );

  socket.on(
    "single-piece-promo",
    async (gameData, updatedGamePosition, piece, color) => {
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

        if (!(singleGameUpdated instanceof Error)) {
          console.log(
            "updated game ID: ",
            gameData.id,
            "with data: ",
            singleGameUpdated
          );

          const updatedMoveHistoryData = {
            from_square: from,
            to_square: to,
            piece: piece,
            color: color,
          };

          // const updatedMoveHistory = await updateMoveHistory(
          //   singleGameUpdated.id,
          //   updatedMoveHistoryData
          // );

          io.in(`/Room/${gameData.id}`).emit(
            "single-game-state-updated",
            gameUpdated,
            updatedMoveHistory
          );
        } else {
          console.log(
            "could not update game ID: ",
            gameData.id,
            "with data: ",
            singleGameUpdated
          );

          const errorMessage =
            "ERROR: could not update piece promotion position";
          io.in(`Room/${gameData.id}`).emit(
            "single-piece-promo-error",
            errorMessage
          );
        }
      }
    }
  );

  socket.on("single-game-end", async (gameData) => {
    const singleGame = await getGameByID(gameID);

    if (singleGame) {
      const playerData =
        (await getUserByID(singleGame.player1id)) ||
        (await getGuestByID(singleGame.player1id));

      const decoded = jwt.decode(token);

      if (playerData.id === decoded.user.id) {
        io.in(`/Room/${gameID}`).emit(
          "hostLeft",
          singleGame,
          playerData.username
        );

        await deleteMoveHistory(gameID);
        setTimeout(async () => {
          await deleteGame(gameID);
        }, 8000);
      }
    }
  });
};

module.exports = addSingleGamesSocketEventListeners;
