import "./ChatBox.scss";
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { nanoid } from "nanoid";
import axios from "axios";

import Messages from "./Messages/Messages";
import Message from "./Message/Message";

const API = process.env.REACT_APP_API_URL;

const ChatBox = ({ token, socket, user }) => {
  const [messages, setMessages] = useState([]);
  const [openChat, setOpenChat] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    getMessagesData();
  }, []); // eslint-disable-line

  const getMessagesData = async () => {
    return axios
      .get(`${API}/messages`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setMessages(res.data.payload);
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  return (
    <section>
      <div
        className="chat-box-icon-container"
        onClick={() => setOpenChat(true)}
      >
        <div className="chat-box-icon-1">Global</div>
        <div className="chat-box-icon-2">Chat</div>
      </div>
      {openChat && (
        <div className="chat-box-container">
          <div className="chat-box-header">
            <h1>Global Chat</h1>

            <Button variant="danger" onClick={() => setOpenChat(false)}>
              X
            </Button>
          </div>

          <div className="chat-box-body">
            <div className="chat-box-messages">
              <div className="messages">
                {messages.map((message) => (
                  <>
                    <Messages key={nanoid()} message={message} />
                    <Messages key={nanoid()} message={message} />
                    <Messages key={nanoid()} message={message} />
                    <Messages key={nanoid()} message={message} />
                  </>
                ))}
              </div>
            </div>

            <div className="chat-box-players-online">
              <h1>Online</h1>
              <div className="players-online">
                <p>testtesttesttes</p>
                <p>test</p>
                <p>test</p>
                <p>test</p>
                <p>test</p>
                <p>test</p>
                <p>test</p>
                <p>test</p>
                <p>test</p>
                <p>test</p>
                <p>test</p>
                <p>test</p>

                <p>test</p>
                <p>test</p>
                <p>test</p>
                <p>test</p>

                <p>test1</p>
                <p>test2</p>
                <p>test3</p>
                <p>test4</p>
              </div>
            </div>

            <div className="chat-box-message">
              <Message user={user} token={token} socket={socket} />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ChatBox;
