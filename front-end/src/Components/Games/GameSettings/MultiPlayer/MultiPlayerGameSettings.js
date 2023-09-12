import "./MultiPlayerGameSettings.scss";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const MultiPlayerGameSettings = ({
  game,
  setGame,
  user,
  authenticated,
  token,
  error,
  socket,
  player1Data,
  player2Data,
  setPlayer1Data,
  setPlayer2Data,
}) => {
  const { gameID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit("get-multi-game-data", gameID);

    socket.on(
      "multi-player-reconnected",
      (gameData, playerOneData, playerTwoData) => {
        console.log("inside multi-player-reconnected");
        setGame(gameData);
        setPlayer1Data(playerOneData);
        setPlayer2Data(playerTwoData);
      }
    );

    socket.on("multi-started", (gameData, playerOneData, playerTwoData) => {
      setGame(gameData);
      setPlayer1Data(playerOneData);
      setPlayer2Data(playerTwoData);
      navigate(`/Room/${gameData.id}`);
    });

    return () => {
      socket.off("multi-player-reconnected");
      socket.off("multi-started");
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    if (error) {
      if (user.id === player1Data.id) {
        return undefined;
      } else {
        toast.success(`Host: ${player1Data.username} has cancelled the game.`, {
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
  }, [error, navigate, player1Data.id, player1Data.username, user.id]);

  const handleStartGame = async () => {
    const updateGameData = {
      player2id: player2Data.id,
      in_progress: true,
      player1color: "w",
      player2color: "b",
    };

    await axios
      .put(`${API}/multi-games/${game.id}`, updateGameData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        socket.emit("start-multi-player-game", res.data.payload);
      });
  };

  const handleDelete = async (gameID) => {
    await axios
      .delete(`${API}/multi-games/${gameID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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
    setTimeout(() => {
      navigate("/Lobby");
    }, 4100);
  };

  const handleLeaveGame = async () => {
    await axios
      .put(`${API}/multi-games/${game.id}`, {
        [game.player2id]: null,
        in_progress: false,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        navigate("/Lobby");
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

export default MultiPlayerGameSettings;
