import "./RenderLobby.scss";
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const RenderLobby = ({
  gamesCopy,
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

  const renderLobbyGames = () => {
    return gamesCopy.map((game, index) => {
      return (
        <div key={game.id} className="mobile-room-info">
          <span className="room-name">{game.room_name}</span>
          <span className="room-status">
            <section className="lobby-status-buttons">
              {game.player2 ? (
                <>
                  <div className="lobby-button-two">JOIN</div>

                  <div
                    // onClick={() => {
                    //   game.room_password
                    //     ? handleShowPasswordModal()
                    //     : console.log("no password");
                    //   // handleJoin(game.id);
                    // }}
                    className="lobby-button-one"
                  >
                    SPECTATE
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="lobby-button-one"
                    onClick={() => {
                      game.room_password ? (
                        <>
                          {handleShowPasswordModal()}
                          {setPasswordGameId(game.id)}
                        </>
                      ) : (
                        handleJoin(game.id)
                      );
                    }}
                  >
                    JOIN
                  </div>

                  <div className="lobby-button-two">SPECTATE</div>
                </>
              )}
            </section>
          </span>
        </div>
      );
    });
  };

  return (
    <>
      {renderLobbyGames()}

      <Modal
        show={showPasswordModal}
        onHide={handleClosePasswordModal}
        centered
        className="lobbyModalPassword-container"
      >
        <Modal.Title>Room Password</Modal.Title>
        <Modal.Body className="lobbyModalPassword-modal">
          <Form onSubmit={handlePasswordSubmit}>
            <h3>Password</h3>
            <Form.Group controlId="lobbyModalPassword-formControl">
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
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default RenderLobby;
