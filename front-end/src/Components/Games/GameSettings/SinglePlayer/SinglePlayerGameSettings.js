import "./SinglePlayerGameSettings.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import axios from "axios";

import BotCard from "./BotCard/BotCard";

const API = process.env.REACT_APP_API_URL;

const SinglePlayerGameSettings = ({
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

  const [bots, setBots] = useState([]);
  const [botData, setBotData] = useState({});

  useEffect(() => {
    fetchBotsData();

    socket.emit("get-player-and-game-data", gameID);

    socket.on("player-reconnected", (gameData, playerData, backendBotData) => {
      setGame(gameData);
      setPlayer1Data(playerData);
      setPlayer2Data(backendBotData);
    });

    // socket.on("update-bot-difficulty", (botData) => {
    //   console.log("inside update bot frontend");
    //   setPlayer2Data(botData);
    // });

    return () => {
      socket.off("player-reconnected");
      // socket.off("update-bot-difficulty");
    };
  }, []); // eslint-disable-line

  const fetchBotsData = async () => {
    return axios
      .get(`${API}/bots`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setBots(res.data.payload);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleStartGame = async () => {
    const startingPositions =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    const updateGameData = {
      bot_id: botData.id,
      winner: null,
      in_progress: true,
      current_positions: startingPositions,
      player_color: "white",
      bot_color: "black",
      game_time: Date.now(),
    };

    await axios
      .put(`${API}/single-player-games/${game.id}`, updateGameData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        socket.emit("games-update-all-clients");
        socket.emit("start-single-player-game", res.data.payload);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = async (gameID) => {
    await axios
      .delete(`${API}/single-player-games/${gameID}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Game has been cancelled", {
          toastId: "hostCancelledBotGame",
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
      });
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
          <h3>Rating: {player1Data.rating}</h3>
          {!player1Data.is_guest ? (
            <div className="playerData-stats">
              <h3 className="wins">Wins: {player1Data.wins}</h3>
              <h3 className="loss">Loss: {player1Data.loss}</h3>
              <h3 className="ties">Ties: {player1Data.ties}</h3>
            </div>
          ) : null}
        </div>
        <h4>VS</h4>
        <div className="single-player-game-settings-botData">
          {Object.keys(botData).length !== 0 ? (
            <>
              <Image
                src={botData.profileimg}
                alt="bot profile info"
                className="single-player-game-settings-title-profile-image"
              />
              <h1>{botData.username}</h1>
              <div className="botData-stats">
                <h3 className="wins">Wins: {botData.wins}</h3>
                <h3 className="loss">Loss: {botData.loss}</h3>
                <h3 className="ties">Ties: {botData.ties}</h3>
              </div>
            </>
          ) : (
            <h1>Please select a bot difficulty</h1>
          )}
        </div>

        <div className="single-player-game-settings-buttons">
          <Button
            onClick={() => {
              handleStartGame();
            }}
            variant="light"
          >
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
