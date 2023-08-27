import "./ChatBox.scss";
import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { nanoid } from "nanoid";
import { ToastContainer } from "react-toastify";
import axios from "axios";

import Messages from "./Messages/Messages";
import Message from "./Message/Message";

const API = process.env.REACT_APP_API_URL;

const ChatBox = ({ token, socket, user }) => {
  const chatBoxRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [openChat, setOpenChat] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    socket.emit("get-all-messages");

    socket.on("all-messages", (data) => {
      setMessages(data);
      scrollToBottom();
    });

    socket.on("get-all-messages-error", (error) => {
      setError(error);
    });

    return () => {
      socket.off("all-messages");
      socket.off("get-all-messages-error");
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      const chatBox = chatBoxRef.current;

      const scrollDiff =
        chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight;

      if (scrollDiff <= 800) {
        if (typeof chatBox.scrollTo === "function") {
          chatBox.scrollTo({
            top: chatBox.scrollHeight,
            behavior: "smooth",
          });
        } else {
          chatBox.scrollTop = chatBox.scrollHeight;
        }
      }
    }
  };

  const handleMessageCreated = (newMessage) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    scrollToBottom();
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

          <div className="chat-box-body scrollBar-style">
            <div className="chat-box-messages">
              {error === "" ? (
                <div className="messages" ref={chatBoxRef}>
                  {messages.map((message) => (
                    <Messages key={nanoid()} message={message} />
                  ))}
                </div>
              ) : (
                <p style={{ color: "red" }}>Error: {error}</p>
              )}
            </div>

            <div className="chat-box-players-online">
              <h1>Online</h1>
              <div className="players-online">
                <p>test1</p>
                <p>test2</p>
                <p>test3</p>
                <p>test4</p>
                <p>test5</p>
                <p>test6</p>
                <p>test7</p>
                <p>test8</p>
                <p>test9</p>
                <p>test10</p>
                <p>test11</p>
                <p>test12</p>
                <p>test13</p>
                <p>test14</p>
                <p>test15</p>
                <p>test16</p>
                <p>test17</p>
                <p>test18</p>
                <p>test19</p>
                <p>test20</p>
                <p>test21</p>
                <p>test22</p>
                <p>test23</p>
                <p>test24</p>
                <p>test25</p>
                <p>test26</p>
                <p>test27</p>
                <p>test28</p>
                <p>test29</p>
                <p>test30</p>
                <p>test31</p>
                <p>test32</p>
                <p>test33</p>
              </div>
            </div>

            <div className="chat-box-message">
              <Message
                user={user}
                token={token}
                socket={socket}
                onMessageCreated={handleMessageCreated}
              />
            </div>
          </div>
        </div>
      )}

      <ToastContainer autoClose={3000} theme="dark" limit={3} />
    </section>
  );
};

export default ChatBox;
