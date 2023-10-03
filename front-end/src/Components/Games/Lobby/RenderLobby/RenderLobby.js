import "./RenderLobby.scss";
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { nanoid } from "nanoid";

const RenderLobby = ({
  screenVersion,
  singleGamesCopy,
  multiGamesCopy,
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
        <div className="room-info" key={nanoid()}>
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

  const renderMultiGames = () => {
    return multiGamesCopy.map((multiGame) => {
      return (
        <div className="room-info" key={nanoid()}>
          <span className="room-name">{multiGame.room_name}</span>

          <span className="room-status">
            <section className="lobby-status-buttons">
              {multiGame.in_progress ? (
                <>
                  <div className="lobby-button-two">JOIN</div>

                  <div
                    onClick={() => {
                      multiGame.room_password
                        ? handleShowPasswordModal()
                        : console.log("no password");
                      handleJoin(multiGame.id);
                    }}
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
                      multiGame.room_password ? (
                        <>
                          {handleShowPasswordModal()}
                          {setPasswordGameId(multiGame.id)}
                        </>
                      ) : (
                        handleJoin(multiGame.id)
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
    <section className={`${screenVersion}-render-lobby-container`}>
      <div className="single-game-container" key={nanoid()}>
        {renderSingleGames()}
      </div>

      <div className="multi-game-container" key={nanoid()}>
        {renderMultiGames()}
      </div>

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
    </section>
  );
};

export default RenderLobby;
