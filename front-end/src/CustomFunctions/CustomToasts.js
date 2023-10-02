import "./CustomToasts.scss";
import { Button } from "react-bootstrap";

const ToastAskToJoin = ({ socket, token, player2Data }) => {
  const handleAccept = async () => {};

  const handleDeny = async () => {};

  return (
    <div className="toastAskContainer">
      <div>
        <h3>{player2Data.username}</h3>
        Wants to join your game
      </div>
      <div>
        Wins: {player2Data.wins} Loss: {player2Data.loss}
      </div>
      <Button variant="success" onClick={() => console.log("clicked Accept")}>
        Accept
      </Button>{" "}
      <Button variant="danger" onClick={() => console.log("clicked Deny")}>
        Deny
      </Button>
    </div>
  );
};

export { ToastAskToJoin };
