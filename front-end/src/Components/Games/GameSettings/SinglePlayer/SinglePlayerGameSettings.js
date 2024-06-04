import "./SinglePlayerGameSettings.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import axios from "axios";

import upArrow from "../../../../Images/Up_Green.png";
import downArrow from "../../../../Images/Down_Red.png";
import equalSign from "../../../../Images/Equal_Blue.png";

import BotCard from "./BotCard/BotCard";

import DisabledIcon from "../../../../CustomSvgs/DisabledIcon/DisabledIcon";

const API = process.env.REACT_APP_API_URL;

const SinglePlayerGameSettings = ({
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

  const [bots, setBots] = useState([]);
  const [botData, setBotData] = useState({});

  useEffect(() => {
    fetchBotsData();

    socket.emit("get-single-game-data", game.id);

    socket.on(
      "single-player-reconnected",
      (gameData, playerData, backendBotData) => {
        setGame(gameData);
        setPlayer1Data(playerData);
        setBotData(backendBotData);
        setPlayer2Data(backendBotData);
      }
    );

    socket.on("single-room-settings", (gameData) => {
      setGame(gameData);
    });

    socket.on("single-started", (gameData, playerData, backendBotData) => {
      setGame(gameData);
      setPlayer1Data(playerData);
      setBotData(backendBotData);
      setPlayer2Data(backendBotData);
      navigate(`/room/${game.id}`);
    });

    // socket.on("update-bot-difficulty", (botData) => {
    //   console.log("inside update bot frontend");
    //   setPlayer2Data(botData);
    // });

    return () => {
      socket.off("single-player-reconnected");
      socket.off("single-started");
      // socket.off("update-bot-difficulty");
    };
  }, []); // eslint-disable-line

  const fetchBotsData = async () => {
    return axios
      .get(`${API}/bots`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setBots(res.data.payload);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const handleStartGame = async () => {
    const updateGameData = {
      botid: botData.id,
      winner: null,
      in_progress: true,
      player1color: "w",
      botcolor: "b",
      game_time: 0,
    };

    if (Object.keys(botData).length === 0) {
      return toast.error("Please select a bot", {
        containerId: "selectBot",
      });
    }

    await axios
      .put(`${API}/single-games/${game.id}`, updateGameData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(async (res) => {
        const moveHistoryData = {
          game_id: res.data.payload.id,
          from_square: null,
          to_square: null,
          piece: null,
          color: null,
        };

        await axios
          .post(`${API}/move-history`, moveHistoryData, {
            headers: {
              authorization: `Bearer ${token}`,
            },
          })
          .catch((err) => {
            // console.log(err.response.data);
          });
        socket.emit("start-single-player-game", res.data.payload);
      })
      .catch((err) => {
        // console.log(err.message);
      });
  };

  const handleDelete = async (gameID) => {
    await axios
      .delete(`${API}/single-games/${gameID}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Game has been cancelled", {
          containerId: "toast-notify",
        });
        setTimeout(() => {
          navigate("/Lobby/");
        }, 4100);
      });
  };

  const renderPlayerWinIcons = () => {
    if (player1Data.wins > botData.wins) {
      return (
        <Image
          src={upArrow}
          alt="arrow up icon"
          className="game-settings-stats-icon"
          fluid
          rounded
        />
      );
    } else if (player1Data.wins < botData.wins) {
      return (
        <Image
          src={downArrow}
          alt="arrow down icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (player1Data.wins === botData.wins) {
      return (
        <Image
          src={equalSign}
          alt="equal sign icon"
          className="game-settings-stats-icon"
        />
      );
    }
  };

  const renderPlayerLossIcons = () => {
    if (player1Data.loss > botData.loss) {
      return (
        <Image
          src={upArrow}
          alt="arrow up icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (player1Data.loss < botData.loss) {
      return (
        <Image
          src={downArrow}
          alt="arrow down icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (player1Data.loss === botData.loss) {
      return (
        <Image
          src={equalSign}
          alt="equal sign icon"
          className="game-settings-stats-icon"
        />
      );
    }
  };

  const renderPlayerTieIcons = () => {
    if (player1Data.ties > botData.ties) {
      return (
        <Image
          src={upArrow}
          alt="arrow up icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (player1Data.ties < botData.ties) {
      return (
        <Image
          src={downArrow}
          alt="arrow down icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (player1Data.ties === botData.ties) {
      return (
        <Image
          src={equalSign}
          alt="equal sign icon"
          className="game-settings-stats-icon"
        />
      );
    }
  };

  const renderBotWinIcons = () => {
    if (botData.wins > player1Data.wins) {
      return (
        <Image
          src={upArrow}
          alt="arrow up icon"
          className="game-settings-stats-icon"
          fluid
          rounded
        />
      );
    } else if (botData.wins < player1Data.wins) {
      return (
        <Image
          src={downArrow}
          alt="arrow down icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (botData.wins === player1Data.wins) {
      return (
        <Image
          src={equalSign}
          alt="equal sign icon"
          className="game-settings-stats-icon"
        />
      );
    }
  };

  const renderBotLossIcons = () => {
    if (botData.loss > player1Data.loss) {
      return (
        <Image
          src={upArrow}
          alt="arrow up icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (botData.loss < player1Data.loss) {
      return (
        <Image
          src={downArrow}
          alt="arrow down icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (botData.loss === player1Data.loss) {
      return (
        <Image
          src={equalSign}
          alt="equal sign icon"
          className="game-settings-stats-icon"
        />
      );
    }
  };

  const renderBotTieIcons = () => {
    if (botData.ties > player1Data.ties) {
      return (
        <Image
          src={upArrow}
          alt="arrow up icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (botData.ties < player1Data.ties) {
      return (
        <Image
          src={downArrow}
          alt="arrow down icon"
          className="game-settings-stats-icon"
        />
      );
    } else if (botData.ties === player1Data.ties) {
      return (
        <Image
          src={equalSign}
          alt="equal sign icon"
          className="game-settings-stats-icon"
        />
      );
    }
  };

  return error ? (
    <h1>Game Cancelled</h1>
  ) : (
    <section className="single-player-game-settings-container">
      <div className="single-player-game-settings-title">
        <div className="single-player-game-settings-playerData">
          <Image
            src={player1Data.profileimg}
            alt="player profile info"
            className="single-player-game-settings-title-profile-image"
          />
          <h1>{player1Data.username}</h1>
          {!player1Data.is_guest ? (
            <>
              <h3>Rating: {player1Data.rating}</h3>
              <div className="playerData-stats">
                <h3 className="wins">
                  {renderPlayerWinIcons()} Wins: {player1Data.wins}
                </h3>
                <h3 className="loss">
                  {renderPlayerLossIcons()} Loss: {player1Data.loss}
                </h3>
                <h3 className="ties">
                  {renderPlayerTieIcons()} Ties: {player1Data.ties}
                </h3>
              </div>
            </>
          ) : null}
        </div>
        <h4>VS</h4>
        <div className="single-player-game-settings-botData">
          {botData.name !== "QueryResultError" ? (
            <>
              <Image
                src={botData.profileimg}
                alt="bot profile info"
                className="single-player-game-settings-title-profile-image"
              />
              <h1>{botData.username}</h1>
              <div className="botData-stats">
                <h3 className="wins">
                  {renderBotWinIcons()} Wins: {botData.wins}
                </h3>
                <h3 className="loss">
                  {renderBotLossIcons()} Loss: {botData.loss}
                </h3>
                <h3 className="ties">
                  {renderBotTieIcons()} Ties: {botData.ties}
                </h3>
              </div>
            </>
          ) : (
            <h1>Please select a bot to play against</h1>
          )}
        </div>

        <div className="single-player-game-settings-buttons">
          {botData.id === 1 || botData.id === 2 || botData.id === 3 ? (
            <Button
              onClick={() => {
                handleStartGame();
              }}
              variant="light"
            >
              Start Game
            </Button>
          ) : (
            <Button
              className="single-start-button-disabled"
              disabled
              variant="light"
            >
              <DisabledIcon />
            </Button>
          )}
          <Button
            variant="danger"
            onClick={() => {
              handleDelete(game.id);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
      <div className="single-player-game-settings-bot-roster">
        {bots.map((bot) => {
          return <BotCard key={nanoid()} bot={bot} setBotData={setBotData} />;
        })}
      </div>
    </section>
  );
};

export default SinglePlayerGameSettings;
