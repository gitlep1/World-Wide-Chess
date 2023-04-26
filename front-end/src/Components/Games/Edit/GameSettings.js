import "./GameSettings.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";

import Loading from "../../Loading/Loading";
import PlayerGameSettings from "./PlayerGameSettings";
import BotGameSettings from "./BotGameSettings";

const API = process.env.REACT_APP_API_URL;

const GameSettings = ({ user, games, socket }) => {
  const { gameID } = useParams();

  const [game, setGame] = useState({});
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
    // getGame();

    const interval = setInterval(() => {
      getGame();
    }, 1000);

    return () => clearInterval(interval);
  }, []); // eslint-disable-line

  const getGame = async () => {
    await axios
      .get(`${API}/games/${gameID}`)
      .then((res) => {
        setGame(res.data);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  const handleEndPoint = async () => {
    return axios
      .put(`${API}/games/${gameID}`, { in_progress: false })
      .then((res) => {
        // alert(`${game.player1} Has left the game.`);
      });
  };

  const renderGameSettings = () => {
    if (loading) {
      return <Loading />;
    } else if (error) {
      return <h1>Error:</h1>;
    } else {
      return (
        <section className="editGameSection2">
          <div className="editGameTitle">
            <h1>{game.player1}'s Chess Match</h1>
            <h4>Opponent:</h4>
            {game.player2 ? <h3>{game.player2}</h3> : <h3>Searching...</h3>}
          </div>
          <div className="editGameSettings">
            {game.player2 ? (
              <PlayerGameSettings
                game={game}
                user={user}
                error={error}
                socket={socket}
              />
            ) : (
              <BotGameSettings game={game} error={error} socket={socket} />
            )}
          </div>
        </section>
      );
    }
  };

  return (
    <section className="editGameSection">
      {renderGameSettings()}
      <ToastContainer autoClose={3000} theme="dark" />
    </section>
  );
};

export default GameSettings;
