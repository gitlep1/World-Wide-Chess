import "./Messages.scss";

const Message = ({ message }) => {
  return (
    <div className="message-card">
      <div className="message-username">{message.username}</div>
      <div className="message-text">{message.message}</div>
      <hr />
    </div>
  );
};

export default Message;
