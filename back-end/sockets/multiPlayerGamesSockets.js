const jwt = require("jsonwebtoken");

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

const {
  getMoveHistoryByGameID,
  createMoveHistory,
  updateMoveHistory,
  deleteMoveHistory,
} = require("../queries/moveHistoryMulti");

const { requireAuth } = require("../validation/requireAuth");
const { scopeAuth } = require("../validation/scopeAuth");

const JSK = process.env.JWT_SECRET;

const addMultiGamesSocketEventListeners = (io, socket, socketId) => {
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

  socket.on("multi-room-created", async (gameData, userID) => {
    console.log(
      `=== New room created by socketID: ${socketId} \n Game Data: `,
      gameData,
      "==="
    );

    const checkIfUserExists = await getUserByID(userID);
    const multiGame = await getGameByID(gameData.id);

    if (checkIfUserExists && multiGame) {
      const player1Data = {
        id: checkIfUserExists.id,
        username: checkIfUserExists.username,
        profileimg: checkIfUserExists.profileimg,
        wins: checkIfUserExists.wins,
        loss: checkIfUserExists.loss,
        ties: checkIfUserExists.ties,
      };

      socket.join(`/Room/${gameData.id}/Settings`);
      io.in(`/Room/${gameData.id}/Settings`).emit(
        "multi-room-settings",
        multiGame,
        player1Data
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
      profileimg: checkIfUserExists.profileimg,
      wins: checkIfUserExists.wins,
      loss: checkIfUserExists.loss,
      ties: checkIfUserExists.ties,
      games_played: checkIfUserExists.games_played,
      rating: checkIfUserExists.rating,
      is_guest: checkIfUserExists.is_guest,
      socketid: socketId,
    };

    socket.emit("asking-host");

    io.in(`/Room/${gameData.id}/Settings`).emit("request-to-join", player2Data);
  });

  socket.on("accept-game", async (gameData, player1Data, player2Data) => {
    console.log(`=== ${player2Data.username} joined room: ${gameData.id} ===`);

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
          profileimg: checkIf1stUserExists.profileimg,
          wins: checkIf1stUserExists.wins,
          loss: checkIf1stUserExists.loss,
          ties: checkIf1stUserExists.ties,
          games_played: checkIf1stUserExists.games_played,
          rating: checkIf1stUserExists.rating,
          is_guest: checkIf1stUserExists.is_guest,
        };

        const playerTwoData = {
          id: checkIf2ndUserExists.id,
          username: checkIf2ndUserExists.username,
          profileimg: checkIf2ndUserExists.profileimg,
          wins: checkIf2ndUserExists.wins,
          loss: checkIf2ndUserExists.loss,
          ties: checkIf2ndUserExists.ties,
          games_played: checkIf1stUserExists.games_played,
          rating: checkIf1stUserExists.rating,
          is_guest: checkIf1stUserExists.is_guest,
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
    console.log("=== start-multi-player-game: ");
    console.log("Game Data: ", gameData, "===");

    const player1Data =
      (await getUserByID(gameData.player1id)) ||
      (await getGuestByID(gameData.player1id));

    const player2Data =
      (await getUserByID(gameData.player2id)) ||
      (await getGuestByID(gameData.player2id));

    if (player1Data && player2Data) {
      const playerOneData = {
        id: player1Data.id,
        username: player1Data.username,
        profileimg: player1Data.profileimg,
        wins: player1Data.wins,
        loss: player1Data.loss,
        ties: player1Data.ties,
        games_played: player1Data.games_played,
        rating: player1Data.rating,
        is_guest: player1Data.is_guest,
      };

      const playerTwoData = {
        id: player2Data.id,
        username: player2Data.username,
        profileimg: player2Data.profileimg,
        wins: player2Data.wins,
        loss: player2Data.loss,
        ties: player2Data.ties,
        games_played: player2Data.games_played,
        rating: player2Data.rating,
        is_guest: player2Data.is_guest,
      };

      io.in(`/Room/${gameData.id}/Settings`).emit(
        "multi-started",
        gameData,
        playerOneData,
        playerTwoData
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

      const moveHistory = await getMoveHistoryByGameID(gameId);

      if (player1Data && player2Data) {
        const playerOneData = {
          id: player1Data.id,
          username: player1Data.username,
          profileimg: player1Data.profileimg,
          wins: player1Data.wins,
          loss: player1Data.loss,
          ties: player1Data.ties,
          games_played: player1Data.games_played,
          rating: player1Data.rating,
          is_guest: player1Data.is_guest,
        };

        const playerTwoData = {
          id: player2Data.id,
          username: player2Data.username,
          profileimg: player2Data.profileimg,
          wins: player2Data.wins,
          loss: player2Data.loss,
          ties: player2Data.ties,
          games_played: player2Data.games_played,
          rating: player2Data.rating,
          is_guest: player2Data.is_guest,
        };

        io.in(`/Room/${gameId}/Settings`).emit(
          "multi-player-reconnected-player1",
          multiGame,
          playerOneData
        );
        io.in(`/Room/${gameId}/Settings`).emit(
          "multi-player-reconnected-player2",
          multiGame,
          playerTwoData
        );

        io.in(`/Room/${gameId}`).emit(
          "multi-player-reconnected-player1",
          multiGame,
          playerOneData,
          moveHistory
        );
        io.in(`/Room/${gameId}`).emit(
          "multi-player-reconnected-player2",
          multiGame,
          playerTwoData,
          moveHistory
        );

        return;
      } else if (player1Data) {
        const playerOneData = {
          id: player1Data.id,
          username: player1Data.username,
          profileimg: player1Data.profileimg,
          wins: player1Data.wins,
          loss: player1Data.loss,
          ties: player1Data.ties,
          games_played: player1Data.games_played,
          rating: player1Data.rating,
          is_guest: player1Data.is_guest,
        };

        io.in(`/Room/${gameId}/Settings`).emit(
          "multi-player-reconnected-player1",
          multiGame,
          playerOneData
        );
        io.in(`/Room/${gameId}`).emit(
          "multi-player-reconnected-player1",
          multiGame,
          playerOneData,
          moveHistory
        );
      } else {
        const errorMessage = `Opponent has disconnected.`;

        io.in(`/Room/${gameId}/Settings`).emit(
          "multi-opponent-disconnected-settings",
          errorMessage
        );
        io.in(`/Room/${gameId}`).emit(
          "multi-opponent-disconnected-game",
          errorMessage
        );
      }
    } else {
      const errorMessage = `Game has ended.`;
      io.in(`/Room/${gameId}`).emit("multi-game-ended", errorMessage);
      socket.leave(`/Room/${gameId}`);
    }
  });

  socket.on("multi-game-cancel", async (gameid) => {
    const getGameData = await getGameByID(gameid);

    if (getGameData) {
      io.in(`/Room/${gameid}/Settings`).emit("multi-game-canceled");
      socket.leave(`/Room/${gameid}/Settings`);
    }
  });

  socket.on(
    "multi-move-piece",
    async (oldGameData, updatedGameData, piece, color) => {
      const oldMultiGameData = await getGameByID(oldGameData.id);

      const chessGame = new Chess(oldMultiGameData.current_positions);

      const from = updatedGameData.from;
      const to = updatedGameData.to;

      const move = chessGame.move({ from, to });
      if (move) {
        const multiGameUpdated = await updateGamePositions(
          oldGameData.id,
          updatedGameData
        );

        if (!(multiGameUpdated instanceof Error)) {
          console.log(
            "updated game ID: ",
            oldGameData.id,
            "with data: ",
            multiGameUpdated
          );

          const updatedMoveHistoryData = {
            from_square: from,
            to_square: to,
            piece: piece,
            color: color,
          };

          console.log({ multiGameUpdated });

          const updatedMoveHistory = await updateMoveHistory(
            multiGameUpdated.id,
            updatedMoveHistoryData
          );

          console.log({ updatedMoveHistory });

          io.in(`/Room/${oldGameData.id}`).emit(
            "multi-game-state-updated",
            multiGameUpdated,
            updatedMoveHistory
          );
        } else {
          console.log(
            "could not update game ID: ",
            oldGameData.id,
            "with data: ",
            multiGameUpdated
          );

          const errorMessage = "ERROR: could not update positions";
          io.in(`Room/${oldGameData.id}`).emit(
            "multi-game-state-updated-error",
            errorMessage
          );
        }
      }
    }
  );

  socket.on(
    "multi-piece-promo",
    async (gameData, updatedGamePosition, piece, color) => {
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

        if (!(multiGameUpdated instanceof Error)) {
          console.log(
            "updated game ID: ",
            gameData.id,
            "with data: ",
            multiGameUpdated
          );

          const updatedMoveHistoryData = {
            from_square: from,
            to_square: to,
            piece: piece,
            color: color,
          };

          const updatedMoveHistory = await updateMoveHistory(
            multiGameUpdated.id,
            updatedMoveHistoryData
          );

          io.in(`/Room/${gameData.id}`).emit(
            "multi-game-state-updated",
            multiGameUpdated,
            updatedMoveHistory
          );
        } else {
          console.log(
            "could not update game ID: ",
            gameData.id,
            "with data: ",
            multiGameUpdated
          );

          const errorMessage =
            "ERROR: could not update piece promotion position";
          io.in(`Room/${gameData.id}`).emit(
            "multi-game-state-updated-error",
            errorMessage
          );
        }
      }
    }
  );

  socket.on("leave-multi-player-game", async (gameID) => {
    socket.leave(`/Room/${gameID}/Settings`);

    const multiGame = await getGameByID(gameID);

    if (multiGame) {
      io.in(`/Room/${gameID}/Settings`).emit("opponent-left", multiGame);
    } else {
      const errorMessage = `Game not found.`;
      io.in(`/Room/${gameID}/Settings`).emit("multi-game-error", errorMessage);
    }
  });

  socket.on("multi-end-game", async (gameID, token) => {
    const multiGame = await getGameByID(gameID);

    if (multiGame) {
      const player1Data =
        (await getUserByID(multiGame.player1id)) ||
        (await getGuestByID(multiGame.player1id));

      const player2Data =
        (await getUserByID(multiGame.player2id)) ||
        (await getGuestByID(multiGame.player2id));

      const decoded = jwt.decode(token);

      if (player1Data.id === decoded.user.id) {
        const playerOneData = {
          id: player1Data.id,
          username: player1Data.username,
          profileimg: player1Data.profileimg,
          wins: player1Data.wins,
          loss: player1Data.loss,
          ties: player1Data.ties,
          games_played: player1Data.games_played,
          rating: player1Data.rating,
          is_guest: player1Data.is_guest,
        };

        io.in(`/Room/${gameID}`).emit("player1left", multiGame, playerOneData);
      } else if (player2Data.id === decoded.user.id) {
        const playerTwoData = {
          id: player2Data.id,
          username: player2Data.username,
          profileimg: player2Data.profileimg,
          wins: player2Data.wins,
          loss: player2Data.loss,
          ties: player2Data.ties,
          games_played: player2Data.games_played,
          rating: player2Data.rating,
          is_guest: player2Data.is_guest,
        };

        io.in(`/Room/${gameID}`).emit("player2left", multiGame, playerTwoData);
      }
      await deleteMoveHistory(gameID);
    } else {
      const errorMessage = `Game has ended.`;
      io.in(`/Room/${gameID}`).emit("multi-game-ended", errorMessage);
      socket.leave(`/Room/${gameID}`);
    }
  });
};

module.exports = addMultiGamesSocketEventListeners;
