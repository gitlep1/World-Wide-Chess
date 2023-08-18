import "./GameSettings.scss";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";

import Loading from "../../Loading/Loading";
import SinglePlayerGameSettings from "./SinglePlayer/SinglePlayerGameSettings";
import MultiPlayerGameSettings from "./MultiPlayer/MultiPlayerGameSettings";

const API = process.env.REACT_APP_API_URL;

const GameSettings = ({
  screenVersion,
  user,
  authenticated,
  token,
  socket,
  isMultiplayer,
  setIsMultiplayer,
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
    socket.on("room-settings", (gameData) => {
      setGame(gameData);
    });

    socket.on("host-started-single", (gameData, player1Data, player2Data) => {
      setGame(gameData);
      setPlayer1Data(player1Data);
      setPlayer2Data(player2Data);
      navigate(`/Room/${gameData.id}`);
    });

    socket.on("host-started-multi", (gameData, player1Data, player2Data) => {
      setGame(gameData);
      setPlayer1Data(player1Data);
      setPlayer2Data(player2Data);
      navigate(`/Room/${gameData.id}`);
    });

    return () => {
      socket.off("room-settings");
      socket.off("host-started-single");
      socket.off("host-started-multi");
    };
  }, [socket, navigate, setGame, setPlayer1Data, setPlayer2Data]);

  // const getRoomData = async () => {
  //   setLoading(true);

  //   if (isMultiplayer) {
  //     return axios
  //       .get(`${API}/multi-player-games/${gameID}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((res) => {
  //         setLoading(false);
  //         setGame(res.data.payload);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         setLoading(false);
  //       });
  //   } else {
  //     return axios
  //       .get(`${API}/single-player-games/${gameID}`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((res) => {
  //         setLoading(false);
  //         setGame(res.data.payload);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //         setLoading(false);
  //       });
  //   }
  // };

  const renderGameSettings = () => {
    if (loading) {
      return <Loading />;
    } else if (error) {
      return <h1>Error:</h1>;
    } else {
      return (
        <section className="game-settings-options-container">
          <h1 className="game-settings-room-name">
            Room Name: {game.room_name}
          </h1>

          <div className="game-settings-options">
            {isMultiplayer ? (
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
      <ToastContainer autoClose={3000} theme="dark" />
    </section>
  );
};

export default GameSettings;
