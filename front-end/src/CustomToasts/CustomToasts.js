import "./CustomToasts.scss";
import { Button } from "react-bootstrap";

const ToastAskToJoin = ({
  socket,
  token,
  game,
  user,
  player2Data,
  onAccept,
  onDeny,
}) => {
  const handleAccept = () => {
    onAccept(game, user, player2Data);
  };

  const handleDeny = () => {
    onDeny(player2Data);
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
