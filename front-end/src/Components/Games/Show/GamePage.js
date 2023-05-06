import "./GamePage.scss";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import GetApi from "../../../CustomFunctions/GetApi";

import VsBot from "./BotGame/GamePageBot/GamePageBot";
import VsPlayer from "./PlayerGame/GamePagePlayer";
import { Modal } from "react-bootstrap";

const API = process.env.REACT_APP_API_URL;

const GamePage = ({
  user,
  users,
  socket,
  game,
  setGame,
  player1Data,
  player2Data,
  setPlayer1Data,
  setPlayer2Data,
}) => {
  const { gameID } = useParams();
  const navigate = useNavigate();

  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  const reloadPlayerAndGameData = async () => {
    await new Promise((resolve, reject) => {
      try {
        socket.emit("get-player-and-game-data", gameID);
        resolve();
      } catch (err) {
        reject();
      }
    });
  };

  const reloadData = async () => {
    await toast
      .promise(reloadPlayerAndGameData(), {
        containerId: "loadChessMatchData",
        pending: "Loading game...",
        success: "Game Data Reloaded!",
        error: "Error loading game",
      })
      .then(() => {
        setLoaded(false);
      });
  };

  useEffect(() => {
    socket.on("player-reconnected", async (gameData, player1, player2) => {
      setGame(gameData);
      setPlayer1Data(player1);
      setPlayer2Data(player2);
    });

    socket.on("game-ended", (errorMessage) => {
      toast.error(errorMessage);
      navigate("/Lobby");
    });

    return () => {
      socket.off("player-reconnected");
    };
  }, [navigate, setGame, setPlayer1Data, setPlayer2Data, socket]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";

      setLoaded(true);
      reloadData();

      return "Are you sure you want to leave? Your progress will be lost.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    reloadData();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      setLoaded(false);
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
    if (game.player2id === 1 || game.player2id === 2 || game.player2id === 3) {
      return (
        <VsBot
          user={user}
          game={game}
          player1Data={player1Data}
          player2Data={player2Data}
          forfeitNotify={forfeitNotify}
          endGame={endGame}
          socket={socket}
        />
      );
    } else if (game.player2id > 3) {
      return (
        <VsPlayer
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
      <Modal
        show={showRefreshModal}
        onHide={() => {
          setShowRefreshModal(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>Are you sure you want to leave the page?</Modal.Title>
        </Modal.Header>
      </Modal>
      <ToastContainer
        containerId="loadChessMatchData"
        theme="dark"
        autoClose={3000}
        position="top-center"
        closeOnClick={false}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
      <ToastContainer
        containerId="GameEnded"
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
