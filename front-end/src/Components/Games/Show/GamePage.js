import "./GamePage.scss";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import VsBot from "./GamePageBot";
import VsPlayer from "./GamePagePlayer";

const GamePage = ({ user }) => {
  const { gameID } = useParams();
  const API = process.env.REACT_APP_API_URL;

  const [game, setGame] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    // getChessMatch();
    const chessMatchInterval = setInterval(async () => {
      await axios
        .get(`${API}/games/${gameID}`)
        .then((res) => {
          setGame(res.data);
        })
        .catch((err) => {
          setError(err);
        });
    }, 1000);

    return () => clearInterval(chessMatchInterval);
  }, []); // eslint-disable-line

  return (
    <section className="gamePageSection">
      {game.player2id === 1 || game.player2id === 2 || game.player2id === 3 ? (
        <VsBot user={user} game={game} />
      ) : (
        <VsPlayer user={user} game={game} />
      )}
      {error && <p>{error}</p>}
    </section>
  );
};

export default GamePage;
