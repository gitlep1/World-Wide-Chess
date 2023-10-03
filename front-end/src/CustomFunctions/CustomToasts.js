import "./CustomToasts.scss";
import { Button } from "react-bootstrap";

const ToastAskToJoin = ({ socket, token, game, player2Data }) => {
  const handleAccept = () => {
    socket.emit("accept-game", game, player2Data);
  };

  const handleDeny = () => {
    console.log("inside deny");
    socket.emit("deny-game");
  };

  return (
    <div className="toastAskContainer">
      <div>
        <h3>{player2Data.username}</h3>
        Wants to join your game
      </div>
      <div>
        Wins: {player2Data.wins} Loss: {player2Data.loss}
      </div>
      <Button variant="success" onClick={handleAccept}>
        Accept
      </Button>{" "}
      <Button variant="danger" onClick={handleDeny}>
        Deny
      </Button>
    </div>
  );
};

export { ToastAskToJoin };
