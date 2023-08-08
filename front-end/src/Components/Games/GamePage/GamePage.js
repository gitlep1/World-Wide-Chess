import "./GamePage.scss";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import SinglePlayerGame from "./SinglePlayerGame/SinglePlayerGame";
import MultiPlayerGame from "./MultiPlayerGame/MultiPlayerGame";

const API = process.env.REACT_APP_API_URL;

const GamePage = ({
  screenVersion,
  user,
  authenticated,
  token,
  socket,
  gameMode,
  setGameMode,
  game,
  setGame,
  player1Data,
  player2Data,
  setPlayer1Data,
  setPlayer2Data,
}) => {
  const { gameID } = useParams();
  const navigate = useNavigate();

  const reloadPlayerAndGameData = async () => {
    return new Promise((resolve, reject) => {
      socket.emit("get-player-and-game-data", gameID);

      socket.on("player-reconnected", async (gameData, player1, player2) => {
        setGame(gameData);
        setPlayer1Data(player1);
        setPlayer2Data(player2);
      });

      resolve();
    });
  };

  const reloadData = async () => {
    await toast.promise(reloadPlayerAndGameData(), {
      containerId: "loadChessMatchData",
      success: "Game Data Reloaded!",
      error: "Error loading game",
    });
  };

  useEffect(() => {
    reloadData();
  }, []); // eslint-disable-line

  useEffect(() => {
    socket.on("game-ended", (errorMessage) => {
      toast.error(errorMessage);
      socket.off("player-reconnected");
      navigate("/Lobby");
    });

    return () => {
      socket.off("game-ended");
    };
  }, [navigate, socket]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";

      return "Are you sure you want to leave? Your progress will be lost.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []); // eslint-disable-line

  const endGame = async (gameID) => {
    await axios.delete(`${API}/games/${gameID}`).then(() => {
      toast.success("Game Ended", {
        containerId: "GameEnded",
        position: "top-center",
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
      });
      socket.emit("games-update-all-clients");
      setTimeout(() => {
        navigate("/Lobby");
      }, 4100);
    });
  };

  const forfeitNotify = () => {
    // console.log("inside");
    // if (!player1Data[0]) {
    //   if (user.id !== player1Data[0].id) {
    //     toast.error(`${player1Data[0].username} has forfeitted.`, {
    //       toastId: "player1Quit",
    //       position: "top-center",
    //       hideProgressBar: false,
    //       closeOnClick: false,
    //       pauseOnHover: false,
    //       pauseOnFocusLoss: false,
    //       draggable: true,
    //       progress: undefined,
    //     });
    //     setTimeout(() => {
    //       navigate("/Lobby/");
    //     }, 4100);
    //   } else {
    //     toast.error(`You have forfeitted.`, {
    //       toastId: "playerOneQuit",
    //       position: "top-center",
    //       hideProgressBar: false,
    //       closeOnClick: false,
    //       pauseOnHover: false,
    //       pauseOnFocusLoss: false,
    //       draggable: true,
    //       progress: undefined,
    //     });
    //     setTimeout(() => {
    //       navigate("/Lobby/");
    //     }, 4100);
    //   }
    // } else if (!player2Data[0]) {
    //   if (user.id !== player2Data[0].id) {
    //     toast.error(`${player2Data[0].username} has forfeitted.`, {
    //       toastId: "player1Quit",
    //       position: "top-center",
    //       hideProgressBar: false,
    //       closeOnClick: false,
    //       pauseOnHover: false,
    //       pauseOnFocusLoss: false,
    //       draggable: true,
    //       progress: undefined,
    //     });
    //     setTimeout(() => {
    //       navigate("/Lobby/");
    //     }, 4100);
    //   } else {
    //     toast.error(`You have forfeitted.`, {
    //       toastId: "playerOneQuit",
    //       position: "top-center",
    //       hideProgressBar: false,
    //       closeOnClick: false,
    //       pauseOnHover: false,
    //       pauseOnFocusLoss: false,
    //       draggable: true,
    //       progress: undefined,
    //     });
    //     setTimeout(() => {
    //       navigate("/Lobby/");
    //     }, 4100);
    //   }
    // }
  };

  const renderBotOrPlayerGame = () => {
    if (!gameMode) {
      return (
        <SinglePlayerGame
          screenVersion={screenVersion}
          user={user}
          game={game}
          player1Data={player1Data}
          player2Data={player2Data}
          forfeitNotify={forfeitNotify}
          endGame={endGame}
          socket={socket}
        />
      );
    } else {
      return (
        <MultiPlayerGame
          screenVersion={screenVersion}
          user={user}
          game={game}
          player1Data={player1Data}
          player2Data={player2Data}
          forfeitNotify={forfeitNotify}
          endGame={endGame}
          socket={socket}
        />
      );
    }
  };

  return (
    <section className="gamePageSection">
      {renderBotOrPlayerGame()}
      <ToastContainer
        theme="dark"
        autoClose={3000}
        position="top-center"
        closeOnClick={true}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
    </section>
  );
};

export default GamePage;
