import "./Lobby.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { MdManageSearch } from "react-icons/md";
import { BiSearchAlt2 } from "react-icons/bi";
import axios from "axios";

import RenderLobby from "./RenderLobby/RenderLobby";
import AdvancedSearch from "./AdvancedSearch/AdvancedSearch";
import DetectScreenSize from "../../../../CustomFunctions/DetectScreenSize";

const API = process.env.REACT_APP_API_URL;

const Lobbypage = ({ user, games, socket, setGames }) => {
  // let gamesCopy = [...games];
  const navigate = useNavigate();

  let [gamesCopy, setGamesCopy] = useState([]);
  const [createRoomName, setCreateRoomName] = useState("");
  const [createRoomPassword, setCreateRoomPassword] = useState("");
  const [joinWithPassword, setJoinWithPassword] = useState("");
  const [searchbar, setSearchbar] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [screenSize, setScreenSize] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const intervalFunctions = setInterval(() => {
      getScreenSize();
    });

    return () => clearInterval(intervalFunctions);
  }, []);

  useEffect(() => {
    setGamesCopy([...games]);
  }, [games]);

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

    if (createRoomName.length < 3 || createRoomName.length > 10) {
      return toast.error("Room Name must be between 3-10 characters.", {
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

    await axios
      .post(`${API}/games`, newGameData)
      .then((res) => {
        socket.emit("games-update-all-clients");
        socket.emit("room-created", res.data);
        navigate(`/Room/${res.data.id}/Settings`);
      })
      .catch((err) => {
        console.log(err.message);
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
      return axios
        .put(`${API}/games/${gameData.id}`, updatePlayer2)
        .then((res) => {
          socket.emit("games-update-all-clients");
          socket.emit("room-joined", res.data);
          navigate(`/Room/${res.data.id}/Settings`);
        })
        .catch((err) => {
          setError(err.message);
        });
    };

    if (gameData.room_password) {
      if (
        gameData.room_password.toLowerCase() === joinWithPassword.toLowerCase()
      ) {
        toast
          .promise(addDataToGame(), {
            pending: "Joining Game ...",
            success: "Joining Game ...",
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
          pending: "Asking host ...",
          success: "Joining Game ...",
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
  }

  const advancedSearchAnimation = useSpring({
    height: showAdvancedSearch ? "26em" : "0",
    opacity: showAdvancedSearch ? 1 : 0,
    config: { duration: 500 },
  });

  return (
    <section className="mobile-lobby-container">
      <section className="lobbySection1-container">
        <div className="lobbySection1">
          <div
            onClick={() => {
              setShowCreate(true);
            }}
            className="lobby-create-button"
          >
            CREATE
          </div>
          <div className="lobby-searchbar-container">
            <div className="lobby-searchbar-1">
              <div className="lobby-searchbar-icon-1">
                <BiSearchAlt2 />
              </div>

              <Form.Group controlId="lobby-searchbar">
                <Form.Control
                  type="text"
                  name="searchbar"
                  placeholder="Search Room Name ..."
                  onChange={handleChange}
                  value={searchbar}
                />
              </Form.Group>

              <div
                className="lobby-searchbar-icon-2"
                onClick={() => {
                  setShowAdvancedSearch(!showAdvancedSearch);
                }}
              >
                <MdManageSearch />
              </div>
            </div>

            <animated.div
              className="lobby-searchbar-2"
              style={advancedSearchAnimation}
            >
              {showAdvancedSearch && (
                <AdvancedSearch
                  setGamesCopy={setGamesCopy}
                  setGames={setGames}
                  games={games}
                  socket={socket}
                />
              )}
            </animated.div>
          </div>
        </div>
      </section>
      <br />
      <section className="lobbySection2">
        <div className="lobbyTable-container">
          <div className="lobbyTable-header">
            <span id="room-name">Room Name</span>
            <span id="room-status">Status</span>
          </div>
          <div className="lobbyTable-body">
            <RenderLobby
              gamesCopy={gamesCopy}
              joinWithPassword={joinWithPassword}
              setJoinWithPassword={setJoinWithPassword}
              handleJoin={handleJoin}
            />
          </div>
        </div>
      </section>

      <ToastContainer autoClose={3000} theme="dark" limit={3} />

      <Modal
        show={showCreate}
        onHide={() => {
          setShowCreate(false);
        }}
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
            <br />
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
            <br />
            <div className="lobbyModal-buttons">
              <Button
                variant="danger"
                onClick={() => {
                  setShowCreate(false);
                }}
              >
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
