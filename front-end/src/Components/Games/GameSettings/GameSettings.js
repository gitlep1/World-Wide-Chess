import "./GameSettings.scss";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";

import Loading from "../../Loading/Loading";
import PlayerGameSettings from "./PlayerGameSettings";
import BotGameSettings from "./BotGameSettings";

const API = process.env.REACT_APP_API_URL;

const GameSettings = ({
  screenVersion,
  user,
  authenticated,
  token,
  socket,
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
    const warnUserLeavingPage = () => {
      window.addEventListener("beforeunload", alertUser);
      window.addEventListener("unload", handleEndPoint);
      return () => {
        window.removeEventListener("beforeunload", alertUser);
        window.removeEventListener("unload", handleEndPoint);
      };
    };
    warnUserLeavingPage();
  }, []); // eslint-disable-line

  useEffect(() => {
    socket.emit("games-update-all-clients");

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

  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue =
      "Are you sure you want to leave this page? ** Doing so will REMOVE THE ROOM!**";
  };

  const handleEndPoint = async () => {
    await axios.delete(`${API}/games/${gameID}`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    navigate("/Lobby");
  };

  const renderGameSettings = () => {
    if (loading) {
      return <Loading />;
    } else if (error) {
      return <h1>Error:</h1>;
    } else {
      return (
        <section className="editGameRender">
          <div className="editGameTitle">
            <h1>{game.player1}'s Chess Match</h1>
            <h4>Opponent:</h4>
            {game.player2 ? <h3>{game.player2}</h3> : <h3>Searching...</h3>}
          </div>
          <div className="editGameSettings">
            {game.player2 ? (
              <PlayerGameSettings
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
              <BotGameSettings
                game={game}
                setGame={setGame}
                error={error}
                socket={socket}
                setPlayer1Data={setPlayer1Data}
                setPlayer2Data={setPlayer2Data}
              />
            )}
          </div>
        </section>
      );
    }
  };

  return (
    <section className={`${screenVersion}-editGameContainer`}>
      {renderGameSettings()}
      <ToastContainer autoClose={3000} theme="dark" />
    </section>
  );
};

export default GameSettings;
