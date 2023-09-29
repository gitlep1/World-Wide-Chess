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
import CustomToasts from "../../../CustomFunctions/CustomToasts";

const API = process.env.REACT_APP_API_URL;

const Lobbypage = ({
  screenVersion,
  user,
  isMultiplayer,
  setIsMultiplayer,
  authenticated,
  token,
  socket,
}) => {
  const navigate = useNavigate();

  const [singleGames, setSingleGames] = useState([]);
  const [singleGamesCopy, setSingleGamesCopy] = useState([]);
  const [multiGames, setMultiGames] = useState([]);
  const [multiGamesCopy, setMultiGamesCopy] = useState([]);

  const [createRoomName, setCreateRoomName] = useState("");
  const [createRoomPassword, setCreateRoomPassword] = useState("");
  const [joinWithPassword, setJoinWithPassword] = useState("");
  const [allowSpecs, setAllowSpecs] = useState(false);

  const [searchbar, setSearchbar] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshed, setRefreshed] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState("");

  useEffect(() => {
    socket.emit("get-single-games");
    socket.emit("get-multi-games");

    socket.on("single-games", (singleGames) => {
      setSingleGames(singleGames);
      setSingleGamesCopy(singleGames);
    });

    socket.on("multi-games", (multiGames) => {
      setMultiGames(multiGames);
      setMultiGamesCopy(multiGames);
    });

    socket.on("get-single-games-error", (error) => {
      setError(error);
    });

    socket.on("get-multi-games-error", (error) => {
      setError(error);
    });

    return () => {
      socket.off("single-games");
      socket.off("get-single-games-error");
      socket.off("multi-games");
      socket.off("get-multi-games-error");
    };
  }, [socket]);

  useEffect(() => {
    handleSearch();
  }, [searchbar]); // eslint-disable-line

  useEffect(() => {
    const checkCountdown = Cookies.get("countdown");

    if (checkCountdown) {
      setCountdown(JSON.parse(checkCountdown));
      setRefreshed(true);
    }

    // idea 1: \\
    // store timestamp
    // lobby checks how much time has passed sine the timestamp

    // idea 2: \\
    // store timestamp + 60 secs
    // lobby checks how much more secs until expiration time

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
    } else {
      setCountdown(60);
    }
  }, [countdown, refreshed]);

  const handleSearch = () => {
    if (searchbar !== "") {
      const filteredGamesSingle = singleGames.filter((game) =>
        game.room_name.toLowerCase().includes(searchbar.toLowerCase())
      );

      const filteredGamesMulti = multiGames.filter((game) =>
        game.room_name.toLowerCase().includes(searchbar.toLowerCase())
      );

      setSingleGamesCopy(filteredGamesSingle);
      setMultiGamesCopy(filteredGamesMulti);
    } else {
      setSingleGamesCopy(singleGames);
      setMultiGamesCopy(multiGames);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const singlePlayerGamesRequest = axios.get(`${API}/single-games`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const multiPlayerGamesRequest = axios.get(`${API}/multi-games`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      const [singlePlayerGamesResponse, multiPlayerGamesResponse] =
        await axios.all([singlePlayerGamesRequest, multiPlayerGamesRequest]);

      const singlePlayerGames = singlePlayerGamesResponse.data.payload;
      const multiPlayerGames = multiPlayerGamesResponse.data.payload;

      setSingleGamesCopy(singlePlayerGames);
      setMultiGamesCopy(multiPlayerGames);
      setRefreshed(true);
      setLoading(false);

      const currentTime = new Date();
      const expirationTime = new Date(currentTime.getTime() + 60000);

      Cookies.set("countdown", JSON.stringify(countdown), {
        path: "/",
        expires: expirationTime,
      });
    } catch (err) {
      setError(err.response.data);
      setLoading(false);
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
    } else if (name === "allowSpecs") {
      setAllowSpecs(!allowSpecs);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (createRoomName.length < 3 || createRoomName.length > 15) {
      return toast.error("Room Name must be between 3-15 characters.", {
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

    if (isMultiplayer) {
      const newMultiGameData = {
        room_name: createRoomName,
        room_password: createRoomPassword,
        player1id: user.id,
        allow_specs: allowSpecs,
        is_multiplayer: true,
      };

      await axios
        .post(`${API}/multi-games`, newMultiGameData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          socket.emit("get-multi-games");
          socket.emit("multi-room-created", res.data.payload);
          navigate(`/Room/${res.data.payload.id}/Settings`);
        })
        .catch((err) => {
          setError(err.message);
        });
    } else {
      const newSingleGameData = {
        room_name: createRoomName,
        room_password: createRoomPassword,
        player1id: user.id,
        allow_specs: allowSpecs,
        is_multiplayer: false,
      };

      await axios
        .post(`${API}/single-games`, newSingleGameData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          socket.emit("get-single-games");
          socket.emit("single-room-created", res.data.payload);
          navigate(`/Room/${res.data.payload.id}/Settings`);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  };

  const handleJoin = async (gameID) => {
    let gameData = {};

    const updatePlayer2 = {
      player2id: user.id,
      in_progress: true,
    };

    for (const game of multiGamesCopy) {
      if (game.id === gameID) {
        gameData = game;
      }
    }

    const addDataToGame = async () => {
      return axios
        .put(`${API}/multi-games/${gameData.id}`, updatePlayer2, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          socket.emit("get-multi-games");
          socket.emit("multi-room-joined", res.data.payload);
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
            // console.log(res.data);
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
                  singleGames={singleGames}
                  setSingleGamesCopy={setSingleGamesCopy}
                  multiGames={multiGames}
                  setMultiGamesCopy={setMultiGamesCopy}
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
            <h1 className="lobby-Table-header-title">Single Player</h1>
            <h1 className="lobby-Table-header-title">MultiPlayer</h1>
          </div>
          <div className="lobbyTable-body">
            <RenderLobby
              screenVersion={screenVersion}
              singleGames={singleGames}
              singleGamesCopy={singleGamesCopy}
              multiGamesCopy={multiGamesCopy}
              multiGames={multiGames}
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
        <Modal.Title className="lobbyModal-title">Room Settings</Modal.Title>
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
                className={isMultiplayer ? null : "lobbyModal-mode-button"}
                variant="primary"
                onClick={() => {
                  setIsMultiplayer(false);
                }}
              >
                SinglePlayer
              </Button>
              <Button
                className={isMultiplayer ? "lobbyModal-mode-button" : null}
                variant="success"
                onClick={() => {
                  setIsMultiplayer(true);
                }}
              >
                MultiPlayer
              </Button>

              <Form.Check
                type="checkbox"
                label="Allow Spectators?"
                name="allowSpecs"
                checked={allowSpecs}
                onChange={handleChange}
                className="lobbyModal-allowSpecs"
              />

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
