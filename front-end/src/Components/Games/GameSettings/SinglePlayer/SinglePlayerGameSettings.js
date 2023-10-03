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

    socket.emit("get-single-game-data", gameID);

    socket.on(
      "single-player-reconnected",
      (gameData, playerData, backendBotData) => {
        setGame(gameData);
        setPlayer1Data(playerData);
        setBotData(backendBotData);
        setPlayer2Data(backendBotData);
      }
    );

    socket.on("single-started", (gameData, playerData, backendBotData) => {
      // console.log("inside single started");
      setGame(gameData);
      setPlayer1Data(playerData);
      setBotData(backendBotData);
      setPlayer2Data(backendBotData);
      navigate(`/room/${gameID}`);
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
      .then((res) => {
        // console.log("inside start game: ", res.data.payload);
        socket.emit("start-single-player-game", res.data.payload);
      })
      .catch((err) => {
        console.log(err.message);
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
