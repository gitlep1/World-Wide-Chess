import "./BotCard.scss";
import { Image } from "react-bootstrap";

const BotCard = ({ bot, setBotData }) => {
  return (
    <div
      className="bot-card"
      onClick={() => {
        setBotData(bot);
      }}
    >
      <Image
        variant="top"
        src={bot.profileimg}
        alt="bot profile info"
        className="bot-card-image"
      />
      <div>
        <h3>{bot.username}</h3>
      </div>
    </div>
  );
};

export default BotCard;
