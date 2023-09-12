import { Button } from "react-bootstrap";

const CustomToasts = ({ player }) => {
  return (
    <div>
      <div>{player} Wants to join your game</div>
      <Button variant="success" onClick={() => console.log("clicked Accept")}>
        Accept
      </Button>{" "}
      <Button variant="danger" onClick={() => console.log("clicked Deny")}>
        Deny
      </Button>
    </div>
  );
};

export default CustomToasts;
