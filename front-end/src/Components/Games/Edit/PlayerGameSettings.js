import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const PlayerGameSettings = ({
  game,
  setGame,
  user,
  error,
  socket,
  setPlayer1Data,
  setPlayer2Data,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      if (user.id === game.player1id) {
        return undefined;
      } else {
        toast.success(`${game.player1}(Host) has cancelled the game.`, {
          toastId: "hostCancelledPlayerGame",
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
      }
    }
  }, [error, game.player1, game.player1id, navigate, user.id]);

  const handleStartGame = async () => {
    const startingPosition =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    const updateGameData = {
      player2id: game.player2id,
      in_progress: true,
      current_positions: startingPosition,
      player1color: "w",
      player2color: "b",
    };

    await axios.put(`${API}/games/${game.id}`, updateGameData).then((res) => {
      socket.emit("games-update-all-clients");
      socket.emit("start-game", res.data);
    });
  };

  const handleDelete = async (gameID) => {
    await axios
      .put(`${API}/games/${gameID}`, { in_progress: false })
      .then(() => {
        toast.success(
          "You have cancelled the game. \n You will be redirected in 3 seconds.",
          {
            toastId: "delete",
            position: "top-center",
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: false,
            pauseOnFocusLoss: false,
            draggable: true,
            progress: undefined,
          }
        );
      });
    await axios.delete(`${API}/games/${gameID}`).then(() => {
      setTimeout(() => {
        navigate("/Lobby/");
      }, 4100);
    });
  };

  const handleLeaveGame = async () => {
    await axios
      .put(`${API}/games/${game.id}`, { [game.player2id]: null })
      .then(() => {
        navigate("/Lobby/");
      });
  };

  return (
    <section className="renderSection">
      {error ? (
        <h1>Host Cancelled Game</h1>
      ) : user.id === game.player1id ? (
        <div>
          <Button onClick={handleStartGame} variant="dark">
            Start Game
          </Button>{" "}
          <Button
            variant="danger"
            onClick={() => {
              handleDelete(game.id);
            }}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <>
          <h3>Waiting for host to start</h3>
          <Button
            variant="dark"
            onClick={() => {
              handleLeaveGame();
            }}
          >
            Leave Game
          </Button>
        </>
      )}
      {/* {game.in_progress ? navigate(`/Room/${game.id}`) : null} */}
    </section>
  );
};

export default PlayerGameSettings;
