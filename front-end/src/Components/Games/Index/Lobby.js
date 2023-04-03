import "./Lobby.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import RenderLobby from "./RenderLobby";
import FilterSearch from "./FilterSearch";
import DetectScreenSize from "../../../CustomFunctions/DetectScreenSize";

const Lobbypage = ({ user, games, handleRefresh }) => {
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;
  const gamesCopy = [...games];

  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");

  const [showFilter, setShowFilter] = useState(false);
  const handleShowFilter = () => setShowFilter(true);
  const handleCloseFilter = () => setShowFilter(false);

  const [screenSize, setScreenSize] = useState(0);

  useEffect(() => {
    const intervalFunctions = setInterval(() => {
      getScreenSize();
    });

    return () => clearInterval(intervalFunctions);
  }, []);

  const getScreenSize = () => {
    return setScreenSize(DetectScreenSize().width);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (roomName.length < 3 || roomName.length > 20) {
      return toast.error("Room Name must be between 3-20 characters.", {
        position: "top-center",
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
        draggable: true,
        progress: undefined,
      });
    }

    const newGameData = {
      room_name: roomName,
      room_password: password,
      player1id: user.id,
    };

    await axios.post(`${API}/games`, newGameData).then((res) => {
      navigate(`/Room/${res.data.id}/Settings`);
    });
  };

  const handleJoin = async (gameID) => {
    const updatePlayer2 = {
      player2id: user.id,
    };

    await axios.put(`${API}/games/${gameID}`, updatePlayer2).then((res) => {
      notify(res.data);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "roomName") {
      setRoomName(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const notify = (gameData) => {
    toast.success("Game is being created ...", {
      position: "top-center",
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      draggable: true,
      progress: undefined,
    });
    setTimeout(() => {
      navigate(`/Games/${gameData.id}`);
    }, 4100);
    clearFields();
  };

  const clearFields = () => {
    setRoomName("");
    setPassword("");
  };

  return (
    <section className="lobbyMain">
      <section className="lobbySection1">
        <div
          onClick={() => {
            handleShowFilter();
          }}
          className="lobbyButtons"
        >
          CREATE
        </div>
        <div
          onClick={() => {
            handleRefresh();
          }}
          className="lobbyButtons"
        >
          REFRESH
        </div>
        <FilterSearch gamesCopy={gamesCopy} />
      </section>
      <br />
      <section className="lobbySection2">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Room Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <RenderLobby gamesCopy={gamesCopy} handleJoin={handleJoin} />
          </tbody>
        </Table>
      </section>

      <ToastContainer autoClose={3000} theme="dark" />

      <Modal
        show={showFilter}
        onHide={handleCloseFilter}
        centered
        className="lobbyModal"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Title className="lobbyModal-title">Game Settings</Modal.Title>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <h3 className="lobbyModal-roomName">Room Name</h3>
            <Form.Group controlId="formRoomName">
              <Form.Control
                type="text"
                name="roomName"
                placeholder="RoomName"
                onChange={handleChange}
                value={roomName}
                className="lobbyModal-roomName-data"
              />
            </Form.Group>

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
              <Button variant="danger" onClick={handleCloseFilter}>
                Cancel
              </Button>{" "}
              <Button variant="success" type="submit">
                Create Room
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="lobbyModal-footer">
          {/* <h3>{user.username}</h3> */}
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default Lobbypage;
