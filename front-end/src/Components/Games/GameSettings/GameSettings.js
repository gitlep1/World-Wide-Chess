import "./GameSettings.scss";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import GameSettingsLoader from "../../../CustomLoaders/GameSettingsLoader/GameSettingsLoader";

import SinglePlayerGameSettings from "./SinglePlayer/SinglePlayerGameSettings";
import MultiPlayerGameSettings from "./MultiPlayer/MultiPlayerGameSettings";

const GameSettings = ({
  screenVersion,
  user,
  authenticated,
  token,
  socket,
  game,
  setGame,
  player1Data,
  player2Data,
  setPlayer1Data,
  setPlayer2Data,
}) => {
  const navigate = useNavigate();
  const { gameID } = useParams();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    socket.emit("get-single-game-data", gameID);
    socket.emit("get-multi-game-data", gameID);

    socket.on("single-room-settings", (gameData) => {
      setGame(gameData);
    });

    socket.on("multi-room-settings", (gameData, player1) => {
      setGame(gameData);
      setPlayer1Data(player1);
    });

    socket.on("single-started", (gameData, player1Data, player2Data) => {
      // console.log("started single");
      setGame(gameData);
      setPlayer1Data(player1Data);
      setPlayer2Data(player2Data);
      navigate(`/Room/${gameData.id}`);
    });

    socket.on("multi-started", (gameData, player1Data, player2Data) => {
      setGame(gameData);
      setPlayer1Data(player1Data);
      setPlayer2Data(player2Data);
      navigate(`/Room/${gameData.id}`);
    });

    return () => {
      socket.off("single-room-settings");
      socket.off("multi-room-settings");
      socket.off("host-started-single");
      socket.off("host-started-multi");
    };
  }, []); // eslint-disable-line

  const renderGameSettings = () => {
    if (loading) {
      return <GameSettingsLoader />;
    } else if (error) {
      return <h1>Error:</h1>;
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
                authenticated={authenticated}
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
                authenticated={authenticated}
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
