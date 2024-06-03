import "./GamePage.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";

import SinglePlayerGame from "./SinglePlayerGame/SinglePlayerGame";
import MultiPlayerGame from "./MultiPlayerGame/MultiPlayerGame";

const API = process.env.REACT_APP_API_URL;

const GamePage = ({
  screenVersion,
  user,
  token,
  socket,
  player1Data,
  player2Data,
  setPlayer1Data,
  setPlayer2Data,
}) => {
  const navigate = useNavigate();

  const gameData = JSON.parse(Cookies.get("gameid")) || null;

  const [game, setGame] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getGameData();
  }, []); // eslint-disable-line

  const getGameData = async () => {
    setLoading(true);
    setError("");

    const isMulti = gameData.isMulti ? "multi-games" : "single-games";

    await axios
      .get(`${API}/${isMulti}/${gameData.id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setGame(res.data.payload);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const endGame = async () => {
    if (gameData.isMulti) {
      socket.emit("multi-end-game", gameData.id, token);
    } else {
      socket.emit("single-end-game", gameData.id, token);
    }

    toast.success("Game ended.", {
      containerId: "general-toast",
    });

    const isMulti = gameData.isMulti ? "multi-games" : "single-games";

    setGame({});
    setPlayer1Data({});
    setPlayer2Data({});

    await axios
      .delete(`${API}/${isMulti}/${gameData.id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTimeout(() => {
          navigate("/Lobby");
        }, 5000);
      })
      .catch((err) => {
        setError(err.message);
      });
    Cookies.remove("gameid");
  };

  const renderSingleOrMultiGame = () => {
    if (loading) {
      return <div>Loading...</div>;
    } else if (error) {
      return <div>ERROR: {error}</div>;
    } else if (gameData.isMulti) {
      return (
        <MultiPlayerGame
          screenVersion={screenVersion}
          user={user}
          game={game}
          setGame={setGame}
          player1Data={player1Data}
          player2Data={player2Data}
          setPlayer1Data={setPlayer1Data}
          setPlayer2Data={setPlayer2Data}
          endGame={endGame}
          socket={socket}
          token={token}
        />
      );
    } else {
      return (
        <SinglePlayerGame
          screenVersion={screenVersion}
          user={user}
          game={game}
          setGame={setGame}
          player1Data={player1Data}
          player2Data={player2Data}
          setPlayer1Data={setPlayer1Data}
          setPlayer2Data={setPlayer2Data}
          endGame={endGame}
          socket={socket}
          token={token}
        />
      );
    }
  };

  return (
    <section className="gamePageSection">{renderSingleOrMultiGame()}</section>
  );
};

export default GamePage;
