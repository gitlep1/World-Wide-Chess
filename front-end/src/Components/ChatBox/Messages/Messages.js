import "./Messages.scss";
import { Image } from "react-bootstrap";
import { nanoid } from "nanoid";

const Messages = ({ message }) => {
  const messageLines = message.message.split("\n");

  return (
    <div className="message-card">
      <Image
        className="userProfileImg"
        src={message.profileimg}
        roundedCircle
      />

      <div className="message-card-content">
        <h3>{message.username}</h3>
        {messageLines.map((line) => (
          <div key={nanoid()} className="message-text">
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
