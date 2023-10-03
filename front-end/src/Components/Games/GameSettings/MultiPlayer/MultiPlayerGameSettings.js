import "./MultiPlayerGameSettings.scss";
import { useEffect, useState } from "react";
import { Button, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import { ToastAskToJoin } from "../../../../CustomFunctions/CustomToasts";

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

  const [toastId, setToastId] = useState("");

  useEffect(() => {
    socket.emit("get-multi-game-data", gameID);

    socket.on(
      "multi-player-reconnected",
      (gameData, playerOneData, playerTwoData) => {
        // console.log("inside multi-player-reconnected");
        setGame(gameData);
        setPlayer1Data(playerOneData);
        setPlayer2Data(playerTwoData);
      }
    );

    socket.on("request-to-join", (player2Data) => {
      handleAskToJoin(player2Data);
    });

    socket.on("player-joined", (gameData, player1, player2) => {
      setGame(gameData);
      setPlayer1Data(player1);
      setPlayer2Data(player2);
    });

    socket.on("multi-started", (gameData, playerOneData, playerTwoData) => {
      setGame(gameData);
      setPlayer1Data(playerOneData);
      setPlayer2Data(playerTwoData);
      navigate(`/Room/${gameData.id}`);
    });

    return () => {
      socket.off("multi-player-reconnected");
      socket.off("request-to-join");
      socket.off("multi-started");
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    if (error) {
      if (user.id === player1Data.id) {
        return undefined;
      } else {
        toast.success(`Host: ${player1Data.username} has cancelled the game.`, {
          containerId: "toast-notify",
        });
        setTimeout(() => {
          navigate("/Lobby/");
        }, 4100);
      }
    }
  }, [error, navigate, player1Data.id, player1Data.username, user.id]);

  const handleAskToJoin = (player2Data) => {
    const toastid = toast(
      <ToastAskToJoin
        socket={socket}
        token={token}
        game={game}
        user={user}
        player2Data={player2Data}
        onAccept={handleAccept}
        onDeny={handleDeny}
      />,
      {
        containerId: "askToJoin",
      }
    );
    setToastId(toastid);
    toast.clearWaitingQueue();
  };

  const handleAccept = (game, player1Data, player2Data) => {
    socket.emit("accept-game", game, player1Data, player2Data);
    toast.dismiss(toastId);
  };

  const handleDeny = (player2Data) => {
    socket.emit("deny-game", player2Data);
    toast.dismiss(toastId);
  };

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
    setPlayer1Data({});
    setPlayer2Data({});
    setGame({});

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
            containerId: "toast-notify",
          }
        );
      });
    toast.clearWaitingQueue();
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
    <section className="multi-player-game-settings-container">
      <div className="game-settings-player1-info">
        <h2>Host</h2>
        <h3>{player1Data.username}</h3>
        <Image
          src={player1Data.profileimg}
          alt="player 1"
          className="playerImg"
        />
        <h4>Wins: {player1Data.wins}</h4>
        <h4>Loss: {player1Data.loss}</h4>
        <h4>Ties: {player1Data.ties}</h4>
      </div>

      <div className="game-settings-player2-info">
        <h2>Opponent</h2>
        <h3>{player2Data.username}</h3>
        <Image
          src={player2Data.profileimg}
          alt="player 2"
          className="playerImg"
        />
        <h4>Wins: {player2Data.wins}</h4>
        <h4>Loss: {player2Data.loss}</h4>
        <h4>Ties: {player2Data.ties}</h4>
      </div>

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
