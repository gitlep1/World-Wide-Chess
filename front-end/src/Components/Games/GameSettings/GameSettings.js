import "./GameSettings.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";

import GameSettingsLoader from "../../../CustomLoaders/GameSettingsLoader/GameSettingsLoader";

import SinglePlayerGameSettings from "./SinglePlayer/SinglePlayerGameSettings";
import MultiPlayerGameSettings from "./MultiPlayer/MultiPlayerGameSettings";

const API = process.env.REACT_APP_API_URL;

const GameSettings = ({
  screenVersion,
  user,
  token,
  socket,
  player1Data,
  player2Data,
  setPlayer1Data,
  setPlayer2Data,
}) => {
  const gameCookieData = JSON.parse(Cookies.get("gameid"));

  const [game, setGame] = useState({});
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    getGameData();
  }, []); // eslint-disable-line

  const getGameData = async () => {
    setError("");
    setLoading(true);

    const isMulti = gameCookieData.isMulti ? "multi-games" : "single-games";

    await axios
      .get(`${API}/${isMulti}/${gameCookieData.id}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setGame(res.data.payload);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response);
        setLoading(false);
      });
  };

  const renderGameSettings = () => {
    if (loading) {
      return <GameSettingsLoader />;
    } else if (error) {
      return <h1 className="error">Error: {error}</h1>;
    } else {
      return (
        <section className="game-settings-options-container">
          <h1 className="game-settings-room-name">
            Room Name: {game.room_name}
          </h1>

          <div className="game-settings-options">
            {game.is_multiplayer ? (
              <MultiPlayerGameSettings
                game={game}
                setGame={setGame}
                user={user}
                token={token}
                error={error}
                socket={socket}
                player1Data={player1Data}
                player2Data={player2Data}
                setPlayer1Data={setPlayer1Data}
                setPlayer2Data={setPlayer2Data}
              />
            ) : (
              <SinglePlayerGameSettings
                game={game}
                setGame={setGame}
                user={user}
                token={token}
                error={error}
                socket={socket}
                player1Data={player1Data}
                player2Data={player2Data}
                setPlayer1Data={setPlayer1Data}
                setPlayer2Data={setPlayer2Data}
              />
            )}
          </div>
        </section>
      );
    }
  };

  return (
    <section className={`${screenVersion}-game-settings-container`}>
      {renderGameSettings()}
    </section>
  );
};

export default GameSettings;
