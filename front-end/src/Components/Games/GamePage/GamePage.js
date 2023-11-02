import "./GamePage.scss";

import SinglePlayerGame from "./SinglePlayerGame/SinglePlayerGame";
import MultiPlayerGame from "./MultiPlayerGame/MultiPlayerGame";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const GamePage = ({
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

  const forfeitNotify = () => {
    // console.log("inside");
    // if (!player1Data) {
    //   if (user.id !== player1Data.id) {
    //     toast.error(`${player1Data.username} has forfeitted.`, {
    //       toastId: "player1Quit",
    //       position: "top-center",
    //       hideProgressBar: false,
    //       closeOnClick: false,
    //       pauseOnHover: false,
    //       pauseOnFocusLoss: false,
    //       draggable: true,
    //       progress: undefined,
    //     });
    //     setTimeout(() => {
    //       navigate("/Lobby/");
    //     }, 4100);
    //   } else {
    //     toast.error(`You have forfeitted.`, {
    //       toastId: "playerOneQuit",
    //       position: "top-center",
    //       hideProgressBar: false,
    //       closeOnClick: false,
    //       pauseOnHover: false,
    //       pauseOnFocusLoss: false,
    //       draggable: true,
    //       progress: undefined,
    //     });
    //     setTimeout(() => {
    //       navigate("/Lobby/");
    //     }, 4100);
    //   }
    // } else if (!player2Data) {
    //   if (user.id !== player2Data.id) {
    //     toast.error(`${player2Data.username} has forfeitted.`, {
    //       toastId: "player1Quit",
    //       position: "top-center",
    //       hideProgressBar: false,
    //       closeOnClick: false,
    //       pauseOnHover: false,
    //       pauseOnFocusLoss: false,
    //       draggable: true,
    //       progress: undefined,
    //     });
    //     setTimeout(() => {
    //       navigate("/Lobby/");
    //     }, 4100);
    //   } else {
    //     toast.error(`You have forfeitted.`, {
    //       toastId: "playerOneQuit",
    //       position: "top-center",
    //       hideProgressBar: false,
    //       closeOnClick: false,
    //       pauseOnHover: false,
    //       pauseOnFocusLoss: false,
    //       draggable: true,
    //       progress: undefined,
    //     });
    //     setTimeout(() => {
    //       navigate("/Lobby/");
    //     }, 4100);
    //   }
    // }
  };

  const renderLoading = () => {
    return <div>Loading...</div>;
  };

  const endGame = () => {
    if (game.is_multiplayer) {
      socket.emit("multi-end-game", { gameId: game.id });
    } else {
      socket.emit("single-end-game", { gameId: game.id });
    }

    setGame({});
    setPlayer1Data({});
    setPlayer2Data({});

    toast.success("Game ended.", {
      toastId: "endGame",
      position: "top-center",
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      draggable: true,
      progress: undefined,
    });
    setTimeout(() => {
      navigate("/Lobby");
    }, 4100);
    return;
  };

  const renderBotOrPlayerGame = () => {
    if (Object.keys(game).length < 1) {
      renderLoading();
    }
    if (game.is_multiplayer) {
      return (
        <MultiPlayerGame
          screenVersion={screenVersion}
          user={user}
          game={game}
          setGame={setGame}
          player1Data={player1Data}
          setPlayer1Data={setPlayer1Data}
          player2Data={player2Data}
          setPlayer2Data={setPlayer2Data}
          forfeitNotify={forfeitNotify}
          endGame={endGame}
          socket={socket}
        />
      );
    } else {
      return (
        <SinglePlayerGame
          screenVersion={screenVersion}
          user={user}
          game={game}
          setGame={setGame}
          player1Data={player1Data}
          player2Data={player2Data}
          setPlayer1Data={setPlayer1Data}
          setPlayer2Data={setPlayer2Data}
          forfeitNotify={forfeitNotify}
          endGame={endGame}
          socket={socket}
          token={token}
        />
      );
    }
  };

  return (
    <section className="gamePageSection">{renderBotOrPlayerGame()}</section>
  );
};

export default GamePage;
