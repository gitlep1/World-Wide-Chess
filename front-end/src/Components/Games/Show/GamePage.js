import "./GamePage.scss";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import VsBot from "./GamePageBot";
import VsPlayer from "./GamePagePlayer";

const GamePage = ({ user }) => {
  const { gameID } = useParams();
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  const [game, setGame] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
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

  useEffect(() => {
    if (error) {
      toast.success(
        `Opponent has forfeited the game. \n You will be redirected in 3 seconds.`,
        {
          toastId: "hostCancelledPlayerGame",
          position: "top-center",
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          draggable: true,
          progress: undefined,
        }
      );
      setTimeout(() => {
        navigate("/Games/Lobby");
      }, 4100);
    }
  });

  const endGame = (gameID) => {
    axios.delete(`${API}/games/${gameID}`).then(() => {
      toast.success("Game Ended", {
        toastId: "Game has ended",
        position: "top-center",
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
      });
      setTimeout(() => {
        navigate("/Games/Lobby");
      }, 4100);
    });
  };

  return (
    <section className="gamePageSection">
      {error ? (
        <h1>Opponent has forfeited</h1>
      ) : game.player2id === 1 ||
        game.player2id === 2 ||
        game.player2id === 3 ? (
        <VsBot user={user} game={game} endGame={endGame} />
      ) : (
        <VsPlayer user={user} game={game} endGame={endGame} />
      )}
      <ToastContainer autoClose={3000} theme="dark" />
    </section>
  );
};

export default GamePage;
