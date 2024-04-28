import "./RenderGames.scss";
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const RenderSingleGames = ({
  screenVersion,
  singleGamesCopy = [],
  joinWithPassword,
  setJoinWithPassword,
  handleJoin,
}) => {
  const [passwordGameId, setPasswordGameId] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleShowPasswordModal = () => setShowPasswordModal(true);
  const handleClosePasswordModal = () => setShowPasswordModal(false);

  const handleChange = (e) => {
    setJoinWithPassword(e.target.value);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    await handleJoin(passwordGameId);
    clearFields();
  };

  const clearFields = () => {
    setJoinWithPassword("");
  };

  const renderSingleGames = () => {
    return singleGamesCopy.map((singleGame) => {
      return (
        <div className="room-info" key={singleGame.id}>
          <span className="room-name">{singleGame.room_name}</span>

          <span className="room-status">
            <section className="lobby-status-buttons">
              {singleGame.in_progress ? (
                <div
                  onClick={() => {
                    singleGame.room_password
                      ? handleShowPasswordModal()
                      : console.log("no password");
                    handleJoin(singleGame.id);
                  }}
                  className="lobby-button-one"
                >
                  SPECTATE
                </div>
              ) : (
                <div className="lobby-button-two">SPECTATE</div>
              )}
            </section>
          </span>
        </div>
      );
    });
  };

  return (
    <section className={`${screenVersion}-render-games-container`}>
      {renderSingleGames()}

      <Modal
        show={showPasswordModal}
        onHide={handleClosePasswordModal}
        centered
        className="lobby-modal-password-container"
      >
        <Modal.Title>Room Password</Modal.Title>
        <Modal.Body className="lobby-modal-password-modal">
          <Form onSubmit={handlePasswordSubmit}>
            <h3>Password</h3>
            <Form.Group controlId="lobby-modal-password-form-control">
              <Form.Control
                type="password"
                name="joinWithPassword"
                placeholder="Password"
                onChange={handleChange}
                value={joinWithPassword}
              />
            </Form.Group>

            <div>
              <Button variant="danger" onClick={handleClosePasswordModal}>
                Cancel
              </Button>{" "}
              <Button variant="success" type="submit">
                Join Game
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default RenderSingleGames;
