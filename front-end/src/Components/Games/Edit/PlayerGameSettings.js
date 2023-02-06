import { useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const PlayerGameSettings = ({ game, user, error }) => {
  const API = process.env.REACT_APP_API_URL;
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
          navigate("/Games/Lobby");
        }, 4100);
      }
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startingPosition =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    const updateGameData = {
      player2ID: game.player2id,
      winner: null,
      inProgress: true,
      currentPositions: startingPosition,
    };

    await axios.put(`${API}/games/${game.id}`, updateGameData).then((res) => {
      navigate(`/Games/${game.id}`);
    });
  };

  const handleDelete = async (gameID) => {
    await axios
      .put(`${API}/games/${gameID}`, { inProgress: false })
      .then(() => {
        toast.success(
          "You have cancelled the game. \n You will be redirected in 3 seconds.",
          {
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
        navigate("/Games/Lobby");
      }, 4100);
    });
  };

  const handleLeaveGame = async () => {
    await axios
      .put(`${API}/games/${game.id}`, { [game.player2id]: null })
      .then(() => {
        navigate("/Games/Lobby");
      });
  };

  return (
    <section className="renderSection">
      {error ? (
        <h1>Host Cancelled Game</h1>
      ) : user.id === game.player1id ? (
        <Form onSubmit={handleSubmit}>
          <Button type="submit" variant="dark">
            Start Game vs {game.player2}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              handleDelete(game.id);
            }}
          >
            Cancel
          </Button>
        </Form>
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
      {game.in_progress ? navigate(`/Games/${game.id}`) : null}
    </section>
  );
};

export default PlayerGameSettings;
