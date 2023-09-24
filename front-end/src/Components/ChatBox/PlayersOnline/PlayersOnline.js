import "./PlayersOnline.scss";
import { Image } from "react-bootstrap";

const PlayersOnline = ({ player }) => {
  return (
    <div className="player-online">
      <Image
        className="userProfileImg-online"
        src={player.profileimg}
        alt="profile"
        roundedCircle
      />
      <h3>{player.username}</h3>
    </div>
  );
};

export default PlayersOnline;
