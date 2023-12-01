import "./Message.scss";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const Message = ({ user, token, socket, onMessageCreated }) => {
  const [input, setInput] = useState("");

  const onChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey &&
      !e.altKey &&
      !e.ctrlKey &&
      !e.metaKey
    ) {
      handleSubmit(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (input === "") {
      toast.error("Please enter a message.", {
        containerId: "nonEmptyMsg",
      });
    } else {
      const messageData = {
        user_id: user.id,
        username: user.username,
        profileimg: user.profileimg,
        message: input,
      };
      // socket.emit("create-message", messageData);
      await axios
        .post(`${API}/messages`, messageData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          socket.emit("get-all-messages");
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    setInput("");
  };

  return (
    <Form className="message-container" onSubmit={handleSubmit}>
      <Form.Group controlId="formBasicInput">
        <Form.Control
          as="textarea"
          rows={1}
          placeholder="Type a message"
          value={input}
          onChange={onChange}
          onKeyDown={handleKeyPress}
        />
      </Form.Group>

      <Button className="message-button" variant="dark" type="submit">
        Send
      </Button>
    </Form>
  );
};

export default Message;
