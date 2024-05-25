import "./RenderGames.scss";
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const RenderMultiGames = ({
  screenVersion,
  multiGamesCopy = [],
  joinWithPassword,
  setJoinWithPassword,
  handleJoin,
  sortingByTextMulti,
  loading,
  error,
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

  if (sortingByTextMulti === "Room Number (Default)") {
    multiGamesCopy.sort((a, b) => a.id - b.id);
  } else if (sortingByTextMulti === "Name") {
    multiGamesCopy.sort((a, b) => a.room_name.localeCompare(b.room_name));
  } else if (sortingByTextMulti === "Rank") {
    multiGamesCopy.sort((a, b) => a.id - b.id);
  } else if (sortingByTextMulti === "Region") {
    multiGamesCopy.sort((a, b) => a.id - b.id);
  }

  const renderMultiGames = () => {
    if (loading) {
      return <h1>Loading...</h1>;
    } else if (error) {
      return <h1>Error: {error}</h1>;
    } else {
      return multiGamesCopy.map((multiGame) => {
        return (
          <div className="room-info-box" key={multiGame.id}>
            <span className="room-number">{multiGame.id}</span>{" "}
            <span className="room-name">{multiGame.room_name}</span>
            <div className="room-players">
              <span>{multiGame.player1}</span> vs
              <span>{multiGame.player2 || "Waiting for opponent..."}</span>
            </div>
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
    }
  };

  return (
    <section className={`${screenVersion}-render-games-container`}>
      {renderMultiGames()}

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

export default RenderMultiGames;
