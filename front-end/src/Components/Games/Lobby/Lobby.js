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
import DetectScreenSize from "../../../CustomFunctions/DetectScreenSize";

const API = process.env.REACT_APP_API_URL;

const Lobbypage = ({ screenVersion, user, authenticated, token, socket }) => {
  const navigate = useNavigate();

  const [game, setGame] = useState({});
  const [games, setGames] = useState([]);
  const [gamesCopy, setGamesCopy] = useState([]);
  const [player1Data, setPlayer1Data] = useState({});
  const [player2Data, setPlayer2Data] = useState({});
  const [createRoomName, setCreateRoomName] = useState("");
  const [createRoomPassword, setCreateRoomPassword] = useState("");
  const [joinWithPassword, setJoinWithPassword] = useState("");
  const [searchbar, setSearchbar] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [gameError, setGameError] = useState("");

  useEffect(() => {
    socket.emit("games-update-all-clients");

    socket.on("games", (games) => {
      setGames(games);
    });

    socket.on("games-update-all-clients-error", (error) => {
      setGameError(error);
    });

    return () => {
      socket.off("games");
      socket.off("games-update-all-clients-error");
    };
  }, [socket]);

  useEffect(() => {
    handleSearch();
  }, [searchbar, games]); // eslint-disable-line

  const handleSearch = () => {
    if (searchbar !== "") {
      const filteredGames = games.filter((game) =>
        game.room_name.toLowerCase().includes(searchbar.toLowerCase())
      );
      setGamesCopy(filteredGames);
    } else {
      setGamesCopy(games);
    }
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
      player1id: user.payload.id,
    };

    await axios
      .post(`${API}/games`, newGameData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        socket.emit("games-update-all-clients");
        socket.emit("room-created", res.data.payload);
        navigate(`/Room/${res.data.payload.id}/Settings`);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const handleJoin = async (gameID) => {
    let gameData = {};
    const updatePlayer2 = {
      player2id: user.payload.id,
    };

    for (const game of gamesCopy) {
      if (game.id === gameID) {
        gameData = game;
      }
    }

    const addDataToGame = async () => {
      return axios
        .put(`${API}/games/${gameData.id}`, updatePlayer2, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          socket.emit("games-update-all-clients");
          socket.emit("room-joined", res.data.payload);
          navigate(`/Room/${res.data.payload.id}/Settings`);
        })
        .catch((err) => {
          setError(err.response.data);
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

  const advancedSearchAnimation = useSpring({
    height: showAdvancedSearch ? "25em" : "0",
    opacity: showAdvancedSearch ? 1 : 0,
    config: { duration: 500 },
  });

  return (
    <section className={`${screenVersion}-lobby-container`}>
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
                  screenVersion={screenVersion}
                  setGamesCopy={setGamesCopy}
                  setGames={setGames}
                  games={games}
                  socket={socket}
                  token={token}
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
              screenVersion={screenVersion}
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
