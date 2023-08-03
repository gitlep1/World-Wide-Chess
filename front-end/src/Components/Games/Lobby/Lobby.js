import "./Lobby.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { useSpring, animated } from "react-spring";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { MdManageSearch } from "react-icons/md";
import { BiSearchAlt2 } from "react-icons/bi";
import axios from "axios";
import Cookies from "js-cookie";

import RenderLobby from "./RenderLobby/RenderLobby";
import AdvancedSearch from "./AdvancedSearch/AdvancedSearch";
import DetectScreenSize from "../../../CustomFunctions/DetectScreenSize";

const API = process.env.REACT_APP_API_URL;

const Lobbypage = ({
  screenVersion,
  user,
  gameMode,
  setGameMode,
  authenticated,
  token,
  socket,
}) => {
  const navigate = useNavigate();

  const [games, setGames] = useState([]);
  const [gamesCopy, setGamesCopy] = useState([]);
  const [createRoomName, setCreateRoomName] = useState("");
  const [createRoomPassword, setCreateRoomPassword] = useState("");
  const [joinWithPassword, setJoinWithPassword] = useState("");
  const [searchbar, setSearchbar] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const [loading, setLoading] = useState(false);
  const [refreshed, setRefreshed] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState("");
  const [gameError, setGameError] = useState("");

  useEffect(() => {
    socket.emit("get-updated-games-list");

    socket.on("games", (games) => {
      setGames(games);
    });

    socket.on("get-updated-games-list-error", (error) => {
      setGameError(error);
    });

    return () => {
      socket.off("games");
      socket.off("get-updated-games-list-error");
    };
  }, [socket]);

  useEffect(() => {
    handleSearch();
  }, [searchbar, games]); // eslint-disable-line

  useEffect(() => {
    const checkCountdown = Cookies.get("countdown");

    if (checkCountdown) {
      setCountdown(JSON.parse(checkCountdown));
      setRefreshed(true);
    }

    if (refreshed) {
      const refreshInterval = setInterval(() => {
        setCountdown((prevCountdown) => {
          const newCountdown = prevCountdown - 1;

          if (newCountdown <= 0) {
            setCountdown(60);
            setRefreshed(false);
            Cookies.remove("countdown", { path: "/" });
            clearInterval(refreshInterval);
          } else {
            const currentTime = new Date();
            const expirationTime = new Date(currentTime.getTime() + 60000);

            Cookies.set("countdown", JSON.stringify(newCountdown), {
              path: "/",
              expires: expirationTime,
            });
          }

          return newCountdown;
        });
      }, 1000);

      return () => {
        clearInterval(refreshInterval);
      };
    }
  }, [countdown, refreshed]);

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

  const handleRefresh = async () => {
    try {
      const singlePlayerGamesRequest = axios.get(`${API}/single-player-games`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const multiPlayerGamesRequest = axios.get(`${API}/multi-player-games`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const [singlePlayerGamesResponse, multiPlayerGamesResponse] =
        await axios.all([singlePlayerGamesRequest, multiPlayerGamesRequest]);

      const singlePlayerGames = singlePlayerGamesResponse.data.payload;
      const multiPlayerGames = multiPlayerGamesResponse.data.payload;

      const combinedGames = [...singlePlayerGames, ...multiPlayerGames];

      setGames(combinedGames);
      setRefreshed(true);

      const currentTime = new Date();
      const expirationTime = new Date(currentTime.getTime() + 60000);

      Cookies.set("countdown", JSON.stringify(countdown), {
        path: "/",
        expires: expirationTime,
      });
    } catch (err) {
      console.log(err.response.data);
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

    if (gameMode) {
      const newMultiGameData = {
        room_name: createRoomName,
        room_password: createRoomPassword,
        player1id: user.id,
      };

      await axios
        .post(`${API}/multi-player-games`, newMultiGameData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          socket.emit("get-updated-games-list");
          socket.emit("room-created", res.data.payload);
          navigate(`/Room/${res.data.payload.id}/Settings`);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      const newSingleGameData = {
        room_name: createRoomName,
        room_password: createRoomPassword,
        player_id: user.id,
      };

      await axios
        .post(`${API}/single-player-games`, newSingleGameData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          socket.emit("get-updated-games-list");
          socket.emit("room-created", res.data.payload);
          navigate(`/Room/${res.data.payload.id}/Settings`);
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
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
        .put(`${API}/games/${gameData.id}`, updatePlayer2, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          socket.emit("get-updated-games-list");
          socket.emit("room-joined", res.data.payload);
          navigate(`/Room/${res.data.payload.id}/Settings`);
        })
        .catch((err) => {
          setError(err.response.data);
        });
    };

    if (gameData.room_password) {
      if (gameData.room_password === joinWithPassword) {
        await toast
          .promise(addDataToGame(), {
            pending: "Joining Game ...",
            success: "Joined Game ...",
            error: "Error",
          })
          .then((res) => {
            console.log(res.data);
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
            className="lobby-button"
          >
            CREATE
          </div>
          {refreshed ? (
            <div className="lobby-button">{countdown}</div>
          ) : (
            <div
              onClick={() => {
                handleRefresh();
              }}
              className="lobby-button"
            >
              REFRESH
            </div>
          )}
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
            {gamesCopy.map((game) => {
              return (
                <RenderLobby
                  key={nanoid()}
                  screenVersion={screenVersion}
                  game={game}
                  joinWithPassword={joinWithPassword}
                  setJoinWithPassword={setJoinWithPassword}
                  handleJoin={handleJoin}
                />
              );
            })}
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
        <Modal.Body className="lobbyModal-body">
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
            <p
              style={{
                color: "red",
              }}
            >
              * Leave blank if you don't want to set a password for this room.*
            </p>
            <br />
            <div className="lobbyModal-buttons">
              <Button
                className={gameMode ? null : "lobbyModal-mode-button"}
                variant="primary"
                onClick={() => {
                  setGameMode(false);
                }}
              >
                SinglePlayer
              </Button>
              <Button
                className={gameMode ? "lobbyModal-mode-button" : null}
                variant="success"
                onClick={() => {
                  setGameMode(true);
                }}
              >
                MultiPlayer
              </Button>
              <Button
                className="lobbyModal-create-button"
                variant="dark"
                type="submit"
              >
                Create
              </Button>
              <Button
                className="lobbyModal-cancel-button"
                variant="danger"
                onClick={() => {
                  setShowCreate(false);
                }}
              >
                Cancel
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
