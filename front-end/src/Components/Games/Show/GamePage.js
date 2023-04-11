import "./GamePage.scss";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import GetApi from "../../../CustomFunctions/GetApi";

import VsBot from "./BotGame/GamePageBot/GamePageBot";
import VsPlayer from "./PlayerGame/GamePagePlayer";

const GamePage = ({ user }) => {
  const API = process.env.REACT_APP_API_URL;
  const [getData, cancelRequests] = GetApi();

  const { gameID } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState({});
  // const [users, setUsers] = useState([]);
  const [player1Data, setPlayer1Data] = useState({});
  const [player2Data, setPlayer2Data] = useState({});
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

        setPlayer1Data(getPlayer1Data);
        setPlayer2Data(getPlayer2Data);
        setGame(game);
      })
      .catch((err) => {
        setError(err);
      });
  };

  useEffect(() => {
    toast
      .promise(getPlayerData(), {
        containerId: "loadChessMatchData",
        pending: "Loading game...",
        success: "Game loaded!",
        error: "Error loading game",
      })
      .then(() => {
        setLoaded(true);
      });
  }, []); // eslint-disable-line

  const endGame = (gameID) => {
    axios.delete(`${API}/games/${gameID}`).then(() => {
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
      setTimeout(() => {
        navigate("/Lobby/");
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

  return (
    <section className="gamePageSection">
      {loaded ? (
        game.player2id === 1 || game.player2id === 2 || game.player2id === 3 ? (
          <VsBot
            user={user}
            game={game}
            endGame={endGame}
            player1Data={player1Data}
            player2Data={player2Data}
            forfeitNotify={forfeitNotify}
          />
        ) : (
          <VsPlayer user={user} game={game} endGame={endGame} />
        )
      ) : null}
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
