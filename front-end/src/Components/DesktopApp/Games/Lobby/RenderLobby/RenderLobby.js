import "./RenderLobby.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const RenderLobby = ({
  gamesCopy,
  joinWithPassword,
  setJoinWithPassword,
  handleJoin,
}) => {
  // const navigate = useNavigate();

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
        <tr key={game.id} className="lobby-renderGames">
          <td className="room-number">{index + 1}</td>
          <td>
            <span className="room-name">{game.room_name}</span>
          </td>
          <td className="status">
            {game.player2 ? (
              <section className="lobbyStatusLinks">
                <div className="lobbyStatusParent2">JOIN</div>

                <div
                  // onClick={() => {
                  //   game.room_password
                  //     ? handleShowPasswordModal()
                  //     : console.log("no password");
                  //   // handleJoin(game.id);
                  // }}
                  className="lobbyStatus1Parent"
                >
                  SPECTATE
                </div>
              </section>
            ) : (
              <section className="lobbyStatusLinks">
                <div
                  className="lobbyStatus1Parent"
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

                <div className="lobbyStatusParent2">SPECTATE</div>
              </section>
            )}
          </td>
        </tr>
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
