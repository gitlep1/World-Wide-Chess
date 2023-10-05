import "./GamePage.scss";

import SinglePlayerGame from "./SinglePlayerGame/SinglePlayerGame";
import MultiPlayerGame from "./MultiPlayerGame/MultiPlayerGame";

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

  const renderBotOrPlayerGame = () => {
    if (game.is_multiplayer) {
      return (
        <MultiPlayerGame
          screenVersion={screenVersion}
          user={user}
          game={game}
          setGame={setGame}
          player1Data={player1Data}
          player2Data={player2Data}
          forfeitNotify={forfeitNotify}
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
