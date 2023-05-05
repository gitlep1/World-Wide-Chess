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

const GamePage = ({ user, users, socket, game, setGame }) => {
  const { gameID } = useParams();
  const navigate = useNavigate();

  const [player1Data, setPlayer1Data] = useState({});
  const [player2Data, setPlayer2Data] = useState({});
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  const getPlayerData = async () => {
    return axios
      .all([axios.get(`${API}/users`), axios.get(`${API}/games/${gameID}`)])
      .then((res) => {
        const users = res[0].data;
        const game = res[1].data;

        const getPlayer1Data = users.filter(
          (player) => game.player1id === player.id
        );
        const getPlayer2Data = users.filter(
          (player) => game.player2id === player.id
        );

        setPlayer1Data(getPlayer1Data[0]);
        setPlayer2Data(getPlayer2Data[0]);
        setGame(game);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const reloadData = async () => {
    await toast
      .promise(getPlayerData(), {
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
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";

      setLoaded(true);

      return "Are you sure you want to leave? Your progress will be lost.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    reloadData();

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      setLoaded(false);
      // setShowRefreshModal(false);
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
        closeOnClick={false}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
    </section>
  );
};

export default GamePage;
