import "./Message.scss";
import { useState } from "react";
import { Form } from "react-bootstrap";

const Message = ({ user, token, socket }) => {
  const [input, setInput] = useState("");

  const onChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = () => {
    // Implement your logic to send the message
    console.log("Sending message:", input);
    setInput("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("inside");
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
    </Form>
  );
};

export default Message;
