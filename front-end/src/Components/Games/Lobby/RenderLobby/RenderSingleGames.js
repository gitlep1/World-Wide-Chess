import "./RenderGames.scss";
import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const RenderSingleGames = ({
  screenVersion,
  singleGamesCopy = [],
  joinWithPassword,
  setJoinWithPassword,
  handleJoin,
  sortingByTextSingle,
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

  const botSelection = (game) => {
    if (game.botid === 1) {
      return "Easy Bot";
    } else if (game.botid === 2) {
      return "Medium Bot";
    } else if (game.botid === 3) {
      return "Hard Bot";
    } else {
      return `Selecting Bot...`;
    }
  };

  if (sortingByTextSingle === "Room Number (Default)") {
    singleGamesCopy.sort((a, b) => a.id - b.id);
  } else if (sortingByTextSingle === "Name") {
    singleGamesCopy.sort((a, b) => a.room_name.localeCompare(b.room_name));
  } else if (sortingByTextSingle === "Rank") {
    singleGamesCopy.sort((a, b) => a.id - b.id);
  } else if (sortingByTextSingle === "Region") {
    singleGamesCopy.sort((a, b) => a.id - b.id);
  }

  const renderSingleGames = () => {
    if (loading) {
      return <h1>Loading...</h1>;
    } else if (error) {
      return <h1>Error: {error}</h1>;
    } else {
      return singleGamesCopy.map((singleGame) => {
        return (
          <div className="room-info-box" key={singleGame.id}>
            <span className="room-number">{singleGame.id}</span>{" "}
            <span className="room-name">{singleGame.room_name}</span>
            <div className="room-players">
              <span>{singleGame.player1}</span> vs
              <span>{botSelection(singleGame)}</span>
            </div>
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
    }
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
