import "./GamePage.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import axios from "axios";

import SinglePlayerGame from "./SinglePlayerGame/SinglePlayerGame";
import MultiPlayerGame from "./MultiPlayerGame/MultiPlayerGame";

import {
  SetCookies,
  RemoveCookies,
} from "../../../CustomFunctions/HandleCookies";

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

  const endGame = async (gameID) => {
    try {
      if (gameData.isMulti) {
        socket.emit("multi-end-game", gameID, token);
      } else {
        socket.emit("single-end-game", gameID, token);
      }

      toast.success("Game ended.", {
        containerId: "general-toast",
      });

      const isMulti = gameData.isMulti ? "multi-games" : "single-games";

      setGame({});
      setPlayer1Data({});
      setPlayer2Data({});

      const deleteMoveHistory = axios.delete(`${API}/move-history/${gameID}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const deleteGame = axios.delete(`${API}/${isMulti}/${gameID}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      await axios
        .all([deleteMoveHistory, deleteGame])
        .then((res) => {
          setTimeout(() => {
            navigate("/Lobby");
            RemoveCookies("gameid");
          }, 4100);
        })
        .catch((err) => {
          setError(err);
        });
    } catch (err) {
      setError(err.response.data);
    }
  };

  const renderSingleOrMultiGame = () => {
    console.log({ error });
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
