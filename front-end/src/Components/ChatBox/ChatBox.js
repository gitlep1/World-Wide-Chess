import "./ChatBox.scss";
import { useState, useEffect } from "react";
import { BsFillChatSquareTextFill } from "react-icons/bs";

const ChatBox = ({}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);

  return (
    <div className="chat-box-container">
      <BsFillChatSquareTextFill
        className="chat-box-icon"
        onClick={() => setOpen(!open)}
      />
      <div className="chat-box">
        <p>Chat Box Body</p>
      </div>
    </div>
  );
};

export default ChatBox;
