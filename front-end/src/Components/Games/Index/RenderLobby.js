import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

const RenderLobby = ({ gamesCopy, handleJoin }) => {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const handleShowPasswordModal = () => setShowPasswordModal(true);
  const handleClosePasswordModal = () => setShowPasswordModal(false);

  const handleChange = (e) => {
    setPassword(e.target.value);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();

    let findPassword = gamesCopy.filter(
      (game) => game.room_password === password
    );

    if (findPassword.length > 0) {
      clearFields();
      return console.log("correct");
    } else {
      clearFields();
      return toast.error("Incorrect room password.", {
        position: "top-center",
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const clearFields = () => {
    setPassword("");
  };

  const renderLobbyGames = () => {
    return gamesCopy.map((game, index) => {
      return (
        <tr key={game.id}>
          <td>{index + 1}</td>
          <td>
            <span className="players">
              {game.room_name} {game.room_password}
            </span>
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
                    game.room_password
                      ? handleShowPasswordModal()
                      : handleJoin(game.id);
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
        <Modal.Title className="lobbyModal-title">Game Settings</Modal.Title>
        <Modal.Body>
          <Form onSubmit={handlePasswordSubmit}>
            <h3 className="lobbyModal-Password">Password</h3>
            <Form.Group controlId="formPassword">
              <Form.Control
                type="text"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={password}
                className="lobbyModal-password-data"
              />
            </Form.Group>

            <div className="lobbyModal-buttons">
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
    </>
  );
};

export default RenderLobby;
