import "./ChatBox.scss";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

const ChatBox = ({}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [openChat, setOpenChat] = useState(false);

  useEffect(() => {}, []);

  return (
    <div className="chat-box-container">
      {!openChat && (
        <div
          className="chat-box-icon-container"
          onClick={() => setOpenChat(true)}
        >
          <div className="chat-box-1">Global</div>
          <div className="chat-box-2">Chat</div>
        </div>
      )}
      {openChat && (
        <div className="chat-box">
          <div className="chat-box-header">
            <h1>Global Chat</h1>

            <Button variant="danger" onClick={() => setOpenChat(false)}>
              X
            </Button>
          </div>

          <div style={{ color: "white" }}>lol</div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
