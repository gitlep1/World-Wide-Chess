import "./Lobby.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import RenderLobby from "./RenderLobby/RenderLobby";
import FilterSearch from "./FilterSearch/FilterSearch";
import DetectScreenSize from "../../../CustomFunctions/DetectScreenSize";

const Lobbypage = ({ user, games, handleRefresh }) => {
  let gamesCopy = [];
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  const [createRoomName, setCreateRoomName] = useState("");
  const [createRoomPassword, setCreateRoomPassword] = useState("");
  const [joinWithPassword, setJoinWithPassword] = useState("");
  const [searchbar, setSearchbar] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const handleShowCreate = () => setShowCreate(true);
  const handleCloseCreate = () => setShowCreate(false);

  const [screenSize, setScreenSize] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const intervalFunctions = setInterval(() => {
      getScreenSize();
    });

    return () => clearInterval(intervalFunctions);
  }, []);

  const getScreenSize = () => {
    return setScreenSize(DetectScreenSize().width);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "createRoomName") {
      setCreateRoomName(value);
    } else if (name === "password") {
      setCreateRoomPassword(value);
    } else if (name === "searchbar") {
      setSearchbar(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (createRoomName.length < 3 || createRoomName.length > 20) {
      return toast.error("Room Name must be between 3-20 characters.", {
        toastId: "createRoomNameError",
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
      room_name: createRoomName,
      room_password: createRoomPassword,
      player1id: user.id,
    };

    await axios.post(`${API}/games`, newGameData).then((res) => {
      navigate(`/Room/${res.data.id}/Settings`);
    });
  };

  const handleJoin = async (gameID) => {
    let gameData = {};
    const updatePlayer2 = {
      player2id: user.id,
    };

    for (const game of gamesCopy) {
      if (game.id === gameID) {
        gameData = game;
      }
    }

    const addDataToGame = async () => {
      return axios.put(`${API}/games/${gameData.id}`, updatePlayer2);
    };

    if (gameData.room_password) {
      if (
        gameData.room_password.toLowerCase() === joinWithPassword.toLowerCase()
      ) {
        toast
          .promise(addDataToGame(), {
            pending: "Joining Game ...",
            success: "Joined Game",
            error: "Error",
          })
          .then((res) => {
            notify(res.data);
          })
          .catch((err) => {
            setError(err.message);
          });
      } else {
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
    } else {
      toast
        .promise(addDataToGame(), {
          pending: "Joining Game ...",
          success: "Joined Game",
          error: "Error",
        })
        .then((res) => {
          notify(res.data);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  };

  const notify = (gameData) => {
    toast.success({
      toastId: "notify-success",
      position: "top-center",
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: false,
      pauseOnFocusLoss: false,
      draggable: true,
      progress: undefined,
    });
    setTimeout(() => {
      navigate(`/Room/${gameData.id}/Settings`);
    }, 3500);
    clearFields();
  };

  const clearFields = () => {
    setCreateRoomName("");
    setCreateRoomPassword("");
  };

  if (searchbar !== "") {
    const gamesList = [...games];
    gamesCopy = gamesList.filter((game) =>
      game.room_name.toLowerCase().includes(searchbar.toLowerCase())
    );
  } else {
    gamesCopy = [...games];
  }

  return (
    <section className="lobbyMain">
      <section className="lobbySection1">
        <div
          onClick={() => {
            handleShowCreate();
          }}
          className="lobbyButtons"
        >
          CREATE
        </div>
        <div className="lobby-searchbar-container">
          <Form.Group controlId="lobby-searchbar">
            <Form.Control
              type="text"
              name="searchbar"
              placeholder="Room Name ..."
              onChange={handleChange}
              value={searchbar}
            />
          </Form.Group>
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
        <Table striped bordered hover className="lobbyTable">
          <thead>
            <tr>
              <th>#</th>
              <th>Room Name</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <RenderLobby
              gamesCopy={gamesCopy}
              joinWithPassword={joinWithPassword}
              setJoinWithPassword={setJoinWithPassword}
              handleJoin={handleJoin}
            />
          </tbody>
        </Table>
      </section>

      <ToastContainer autoClose={3000} theme="dark" limit={3} />

      <Modal
        show={showCreate}
        onHide={handleCloseCreate}
        centered
        className="lobbyModal"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Title className="lobbyModal-title">Game Settings</Modal.Title>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <h3>Room Name</h3>
            <Form.Group controlId="formcreateRoomName">
              <Form.Control
                type="text"
                name="createRoomName"
                placeholder="Room Name"
                onChange={handleChange}
                value={createRoomName}
                className="lobbyModal-createRoomName-data"
              />
            </Form.Group>

            <h3 className="lobbyModal-Password">Password</h3>
            <Form.Group controlId="formPassword">
              <Form.Control
                type="text"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={createRoomPassword}
                className="lobbyModal-password-data"
              />
            </Form.Group>

            <div className="lobbyModal-buttons">
              <Button variant="danger" onClick={handleCloseCreate}>
                Cancel
              </Button>{" "}
              <Button variant="success" type="submit">
                Create Room
              </Button>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="lobbyModal-footer"></Modal.Footer>
      </Modal>
    </section>
  );
};

export default Lobbypage;
