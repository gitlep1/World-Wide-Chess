import "./GameSettings.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";

import RenderPlayerGame from "./RenderPlayerGame";
import RenderBotGame from "./RenderBotGame";

const GameSettings = ({ user }) => {
  const { gameID } = useParams();
  const API = process.env.REACT_APP_API_URL;

  const [game, setGame] = useState({});

  const [error, setError] = useState("");

  // const [leftGame, setLeftGame] = useState(false);

  useEffect(() => {
    getGame();

    const interval = setInterval(() => {
      getGame();
    }, 1000);

    return () => clearInterval(interval);
  }, []); // eslint-disable-line

  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    window.addEventListener("unload", handleEndPoint);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
      window.removeEventListener("unload", handleEndPoint);
    };
  }, []); // eslint-disable-line

  const getGame = () => {
    axios
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
    console.log("inside endpoint");
    axios.put(`${API}/games/${gameID}`, { inProgress: false }).then((res) => {
      // alert(`${game.player1} Has left the game.`);
      // console.log("inside endpoint");
    });
  };

  return (
    <section>
      <section className="editGameTitle">
        <h1>{game.player1}'s Chess Match</h1>
        <p>Opponent:</p>
        {game.player2 ? <h3>{game.player2}</h3> : <h3>Searching...</h3>}
      </section>
      <section className="editGameSettings">
        {game.player2 ? (
          <RenderPlayerGame game={game} user={user} error={error} />
        ) : (
          <RenderBotGame game={game} error={error} />
        )}
      </section>
      <ToastContainer autoClose={3000} theme="dark" />
    </section>
  );
};

export default GameSettings;
