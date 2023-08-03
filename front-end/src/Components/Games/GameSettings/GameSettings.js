import "./GameSettings.scss";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";

import Loading from "../../Loading/Loading";
import SinglePlayerGameSettings from "./SinglePlayer/SinglePlayerGameSettings";
import MultiPlayerGameSettings from "./MultiPlayer/MultiPlayerGameSettings";

import LeavingPage from "../../../CustomFunctions/LeavingPage";

const API = process.env.REACT_APP_API_URL;

const GameSettings = ({
  screenVersion,
  user,
  authenticated,
  token,
  socket,
  gameMode,
  setGameMode,
  game,
  setGame,
  setPlayer1Data,
  setPlayer2Data,
}) => {
  const navigate = useNavigate();
  const { gameID } = useParams();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // const [leftGame, setLeftGame] = useState(false);

  useEffect(() => {
    getRoomData();
  }, []); // eslint-disable-line

  useEffect(() => {
    LeavingPage(gameID, token, navigate);
  }, []); // eslint-disable-line

  useEffect(() => {
    socket.on("room-settings", (gameData) => {
      setGame(gameData);
    });

    socket.on("host-started", (gameData, player1Data, player2Data) => {
      setGame(gameData);
      setPlayer1Data(player1Data);
      setPlayer2Data(player2Data);
      navigate(`/Room/${gameData.id}`);
    });

    return () => {
      socket.off("room-settings");
      socket.off("host-started");
    };
  }, [socket, navigate, setGame, setPlayer1Data, setPlayer2Data]);

  const getRoomData = async () => {
    setLoading(true);

    if (gameMode) {
      return axios
        .get(`${API}/multi-player-games/${gameID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false);
          setGame(res.data.payload);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      return axios
        .get(`${API}/single-player-games/${gameID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setLoading(false);
          setGame(res.data.payload);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const renderGameSettings = () => {
    if (loading) {
      return <Loading />;
    } else if (error) {
      return <h1>Error:</h1>;
    } else {
      return (
        <section className="game-settings-options">
          {gameMode ? (
            <MultiPlayerGameSettings
              game={game}
              setGame={setGame}
              user={user}
              authenticated={authenticated}
              token={token}
              error={error}
              socket={socket}
              setPlayer1Data={setPlayer1Data}
              setPlayer2Data={setPlayer2Data}
            />
          ) : (
            <SinglePlayerGameSettings
              game={game}
              setGame={setGame}
              user={user}
              authenticated={authenticated}
              token={token}
              error={error}
              socket={socket}
              setPlayer1Data={setPlayer1Data}
              setPlayer2Data={setPlayer2Data}
            />
          )}
        </section>
      );
    }
  };

  return (
    <section className={`${screenVersion}-game-settings-container`}>
      {renderGameSettings()}
      <ToastContainer autoClose={3000} theme="dark" />
    </section>
  );
};

export default GameSettings;
