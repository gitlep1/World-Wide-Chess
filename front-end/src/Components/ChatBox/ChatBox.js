import "./ChatBox.scss";
import { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import { nanoid } from "nanoid";
import axios from "axios";

import Messages from "./Messages/Messages";
import Message from "./Message/Message";
import PlayersOnline from "./PlayersOnline/PlayersOnline";

const API = process.env.REACT_APP_API_URL;

const ChatBox = ({ token, socket, user }) => {
  const chatBoxRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const [openChat, setOpenChat] = useState(false);
  const [users, setUsers] = useState([]);

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

  useEffect(() => {
    getAllUsers();
  }, []); // eslint-disable-line

  const getAllUsers = async () => {
    try {
      const allUsers = axios.get(`${API}/users`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const allGuests = axios.get(`${API}/guests`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const [allUsersData, allGuestsData] = await axios.all([
        allUsers,
        allGuests,
      ]);

      setUsers([...allUsersData.data.payload, ...allGuestsData.data.payload]);
    } catch (error) {
      setError(error.message);
    }
  };

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
      {openChat ? null : (
        <div
          className="chat-box-icon-container"
          onClick={() => setOpenChat(true)}
        >
          <div className="chat-box-icon-1">Global</div>
          <div className="chat-box-icon-2">Chat</div>
        </div>
      )}
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
                {users.map((user) => {
                  return <PlayersOnline player={user} key={nanoid()} />;
                })}
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
    </section>
  );
};

export default ChatBox;
