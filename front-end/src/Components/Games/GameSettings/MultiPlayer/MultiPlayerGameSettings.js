import "./MultiPlayerGameSettings.scss";
import { useEffect, useState } from "react";
import { Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Cookies from "js-cookie";

import { ToastAskToJoin } from "../../../../CustomToasts/CustomToasts";

import upArrow from "../../../../Images/Up_Green.png";
import downArrow from "../../../../Images/Down_Red.png";
import equalSign from "../../../../Images/Equal_Blue.png";

const API = process.env.REACT_APP_API_URL;

const MultiPlayerGameSettings = ({
  game,
  setGame,
  user,
  token,
  error,
  socket,
  player1Data,
  player2Data,
  setPlayer1Data,
  setPlayer2Data,
}) => {
  const navigate = useNavigate();
  const gameCookieData = JSON.parse(Cookies.get("gameid"));

  const [toastId, setToastId] = useState("");

  useEffect(() => {
    socket.emit("get-multi-game-data", game.id);

    socket.on("multi-player-reconnected-player1", (gameData, playerOneData) => {
      setGame(gameData);
      setPlayer1Data(playerOneData);
    });

    socket.on("multi-player-reconnected-player2", (gameData, playerTwoData) => {
      setGame(gameData);
      setPlayer2Data(playerTwoData);
    });

    socket.on("multi-room-settings", (gameData, player1) => {
      setGame(gameData);
      setPlayer1Data(player1);
    });

    socket.on("request-to-join", (player2Data) => {
      handleAskToJoin(player2Data);
    });

    socket.on("player-joined", (gameData, player1, player2) => {
      setGame(gameData);
      setPlayer1Data(player1);
      setPlayer2Data(player2);
    });

    socket.on(
      "multi-started",
      async (gameData, playerOneData, playerTwoData) => {
        setGame(gameData);
        setPlayer1Data(playerOneData);
        setPlayer2Data(playerTwoData);
        navigate(`/Room/${gameData.id}`);
      }
    );

    socket.on("multi-game-canceled", () => {
      handleCancelledGame();
    });

    socket.on("opponent-left", (gameData) => {
      setGame(gameData);
      setPlayer2Data({});
    });

    return () => {
      socket.off("multi-player-reconnected-player1");
      socket.off("multi-player-reconnected-player2");
      socket.off("multi-room-settings");
      socket.off("request-to-join");
      socket.off("player-joined");
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
          authorization: `Bearer ${token}`,
        },
      })
      .then(async (res) => {
        const newMoveHistoryData = {
          gameID: res.data.payload.id,
        };

        await axios
          .post(`${API}/multi-move-history`, newMoveHistoryData, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          })
          .catch((err) => {
            // console.log(err.response.data);
          });
        socket.emit("start-multi-player-game", res.data.payload);
      });
  };

  const handleCancelledGame = () => {
    toast.clearWaitingQueue();

    if (user.id === player1Data.id) {
      navigate("/Lobby");
    } else {
      toast.error("Host has cancelled the game.", {
        containerId: "general-toast",
      });
      setTimeout(() => {
        toast.clearWaitingQueue();
        navigate("/Lobby");
      }, 3000);
    }
  };

  const handleDelete = async (gameID) => {
    socket.emit("multi-game-cancel", gameID);

    await axios
      .delete(`${API}/multi-games/${gameID}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success(
          "You have cancelled the game. \n You will be redirected in 3 seconds.",
          {
            containerId: "toast-notify",
          }
        );
      })
      .catch((err) => {
        // console.log(err.response.data);
      });

    toast.clearWaitingQueue();
    setPlayer1Data({});
    setPlayer2Data({});
    setGame({});

    setTimeout(() => {
      navigate("/Lobby");
    }, 4100);
  };

  const handleLeaveGame = async () => {
    const leaveGameData = {
      player2id: null,
      in_progress: false,
    };

    await axios
      .put(`${API}/multi-games/${game.id}`, leaveGameData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setGame(res.data.payload);
        socket.emit("leave-multi-player-game", game.id);
        navigate("/Lobby");
      })
      .catch((err) => {
        // console.log(err.response.data);
      });
  };

  const renderPlayer1WinIcons = () => {
    if (player1Data.wins > player2Data.wins) {
      return (
        <Image
          src={upArrow}
          alt="arrow up icon"
          className="game-settings-stats-icon"
          fluid
          rounded
        />
      );
    } else if (player1Data.wins < player2Data.wins) {
      return (
        <Image
          src={downArrow}
          alt="arrow down icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (player1Data.wins === player2Data.wins) {
      return (
        <Image
          src={equalSign}
          alt="equal sign icon"
          className="game-settings-stats-icon"
        />
      );
    }
  };

  const renderPlayer1LossIcons = () => {
    if (player1Data.loss > player2Data.loss) {
      return (
        <Image
          src={upArrow}
          alt="arrow up icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (player1Data.loss < player2Data.loss) {
      return (
        <Image
          src={downArrow}
          alt="arrow down icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (player1Data.loss === player2Data.loss) {
      return (
        <Image
          src={equalSign}
          alt="equal sign icon"
          className="game-settings-stats-icon"
        />
      );
    }
  };

  const renderPlayer1TieIcons = () => {
    if (player1Data.ties > player2Data.ties) {
      return (
        <Image
          src={upArrow}
          alt="arrow up icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (player1Data.ties < player2Data.ties) {
      return (
        <Image
          src={downArrow}
          alt="arrow down icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (player1Data.ties === player2Data.ties) {
      return (
        <Image
          src={equalSign}
          alt="equal sign icon"
          className="game-settings-stats-icon"
        />
      );
    }
  };

  const renderPlayer2WinIcons = () => {
    if (player2Data.wins > player1Data.wins) {
      return (
        <Image
          src={upArrow}
          alt="arrow up icon"
          className="game-settings-stats-icon"
          fluid
          rounded
        />
      );
    } else if (player2Data.wins < player1Data.wins) {
      return (
        <Image
          src={downArrow}
          alt="arrow down icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (player2Data.wins === player1Data.wins) {
      return (
        <Image
          src={equalSign}
          alt="equal sign icon"
          className="game-settings-stats-icon"
        />
      );
    }
  };

  const renderPlayer2LossIcons = () => {
    if (player2Data.loss > player1Data.loss) {
      return (
        <Image
          src={upArrow}
          alt="arrow up icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (player2Data.loss < player1Data.loss) {
      return (
        <Image
          src={downArrow}
          alt="arrow down icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (player2Data.loss === player1Data.loss) {
      return (
        <Image
          src={equalSign}
          alt="equal sign icon"
          className="game-settings-stats-icon"
        />
      );
    }
  };

  const renderPlayer2TieIcons = () => {
    if (player2Data.ties > player1Data.ties) {
      return (
        <Image
          src={upArrow}
          alt="arrow up icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (player2Data.ties < player1Data.ties) {
      return (
        <Image
          src={downArrow}
          alt="arrow down icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (player2Data.ties === player1Data.ties) {
      return (
        <Image
          src={equalSign}
          alt="equal sign icon"
          className="game-settings-stats-icon"
        />
      );
    }
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
          fluid
          rounded
        />
        <h4>
          {renderPlayer1WinIcons()} Wins: {player1Data.wins}
        </h4>
        <h4>
          {renderPlayer1LossIcons()} Loss: {player1Data.loss}
        </h4>
        <h4>
          {renderPlayer1TieIcons()} Ties: {player1Data.ties}
        </h4>
      </div>

      <div className="game-settings-player2-info">
        {Object.keys(player2Data).length > 0 ? (
          <>
            <h2>Opponent</h2>
            <h3>{player2Data.username}</h3>
            <Image
              src={player2Data.profileimg}
              alt="player 2"
              className="playerImg"
              fluid
              rounded
            />
            <h4>
              {renderPlayer2WinIcons()} Wins: {player2Data.wins}
            </h4>
            <h4>
              {renderPlayer2LossIcons()} Loss: {player2Data.loss}
            </h4>
            <h4>
              {renderPlayer2TieIcons()} Ties: {player2Data.ties}
            </h4>
          </>
        ) : (
          <h3>Waiting for opponent ...</h3>
        )}
      </div>

      {error ? (
        <h1>Host Cancelled Game</h1>
      ) : user.id === game.player1id ? (
        <div className="multi-game-settings-buttons-container">
          <Button onClick={handleStartGame} variant="success">
            Start Game
          </Button>
          <br />
          <br />
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
        <div className="multi-game-settings-buttons-container">
          <h3>Waiting for host to start</h3>
          <Button
            variant="dark"
            onClick={() => {
              handleLeaveGame();
            }}
          >
            Leave Game
          </Button>
        </div>
      )}
      {/* {game.in_progress ? navigate(`/Room/${game.id}`) : null} */}
    </section>
  );
};

export default MultiPlayerGameSettings;
