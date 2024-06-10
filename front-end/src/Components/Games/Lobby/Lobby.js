import "./Lobby.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSpring, animated } from "react-spring";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { MdManageSearch } from "react-icons/md";
import { BiSearchAlt2 } from "react-icons/bi";
import axios from "axios";
import Cookies from "js-cookie";

import AdvancedSearch from "./AdvancedSearch/AdvancedSearch";

import RenderSingleGames from "./RenderLobby/RenderSingleGames";
import RenderMultiGames from "./RenderLobby/RenderMultiGames";

import CustomToasts from "../../../CustomToasts/CustomToasts";

import {
  SetCookies,
  RemoveCookies,
} from "../../../CustomFunctions/HandleCookies";

const API = process.env.REACT_APP_API_URL;

const Lobbypage = ({
  screenVersion,
  user,
  isMultiplayer,
  setIsMultiplayer,
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
  const [showRoomSortingButtonsSingle, setShowRoomSortingButtonsSingle] =
    useState(false);
  const [showRoomSortingButtonsMulti, setShowRoomSortingButtonsMulti] =
    useState(false);
  const [sortingByTextSingle, setSortingByTextSingle] = useState(
    "Room Number (Default)"
  );
  const [sortingByTextMulti, setSortingByTextMulti] = useState(
    "Room Number (Default)"
  );

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
      setLoading(false);
    });

    socket.on("multi-games", (multiGames) => {
      setMultiGames(multiGames);
      setMultiGamesCopy(multiGames);
      setLoading(false);
    });

    socket.on("asking-host", async () => {
      handlePlayerJoining();
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
      socket.off("asking-host");
      socket.off("host-accepted");
      socket.off("host-denied");
    };
  }, [socket]); // eslint-disable-line

  useEffect(() => {
    handleSearch();
  }, [searchbar]); // eslint-disable-line

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

            RemoveCookies("countdown");

            clearInterval(refreshInterval);
          } else {
            const currentTime = new Date();
            const expirationTime = new Date(currentTime.getTime() + 60000);

            SetCookies("countdown", newCountdown, expirationTime);
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

      const currentTime = new Date();
      const expirationTime = new Date(currentTime.getTime() + 60000);

      SetCookies("countdown", countdown, expirationTime);
    } catch (err) {
      setError(err.response.data);
    } finally {
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

  const handleCreateGame = async (e) => {
    e.preventDefault();

    if (createRoomName.length < 3 || createRoomName.length > 15) {
      return toast.error("Room Name must be between 3-15 characters.", {
        containerId: "toast-notify",
      });
    }

    RemoveCookies("gameid");

    if (isMultiplayer) {
      const newMultiGameData = {
        room_name: createRoomName,
        room_password: createRoomPassword,
        allow_specs: allowSpecs,
      };

      await axios
        .post(`${API}/multi-games`, newMultiGameData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          socket.emit("get-multi-games");
          socket.emit("multi-room-created", res.data.payload, user.id);

          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 7);

          const gameData = {
            id: res.data.payload.id,
            isMulti: res.data.payload.is_multiplayer,
          };

          SetCookies("gameid", gameData, expirationDate);

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

          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 7);

          const gameData = {
            id: res.data.payload.id,
            isMulti: res.data.payload.is_multiplayer,
          };

          SetCookies("gameid", gameData, expirationDate);

          navigate(`/Room/${res.data.payload.id}/Settings`);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  };

  const handleJoin = async (gameID) => {
    const player2ID = user.id;

    RemoveCookies("gameid");

    await axios
      .get(`${API}/multi-games/${gameID}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const gamePayload = res.data.payload;

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 7);

        const gameData = {
          id: res.data.payload.id,
          isMulti: res.data.payload.is_multiplayer,
        };

        SetCookies("gameid", gameData, expirationDate);

        if (gamePayload.room_password) {
          if (gamePayload.room_password === joinWithPassword) {
            socket.emit("ask-to-join", gamePayload, player2ID);
          } else {
            return toast.error("Incorrect room password.", {
              containerId: "toast-notify",
            });
          }
        } else {
          socket.emit("ask-to-join", gamePayload, player2ID);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const handlePlayerJoining = async () => {
    handlePlayerJoiningPromise()
      .then((result) => {
        toast.success(result, {
          containerId: "general-toast",
        });
      })
      .catch((error) => {
        toast.error(error, {
          containerId: "general-toast",
        });
      });
  };

  const handlePlayerJoiningPromise = async () => {
    const toastId = toast.info("Asking Host...", {
      containerId: "general-toast",
    });

    return new Promise(async (resolve, reject) => {
      let result = "";

      const timeoutId = setTimeout(() => {
        result = "The host did not respond in time.";
        reject(result);
      }, 5000);

      await socket.on("host-accepted", async (gameData) => {
        result = "The host accepted the challenge.";
        toast.dismiss(toastId);
        clearTimeout(timeoutId);
        navigate(`/Room/${gameData.id}/Settings`);
        resolve(result);
      });

      await socket.on("host-denied", async () => {
        result = "The host denied the challenge.";
        toast.dismiss(toastId);
        clearTimeout(timeoutId);
        reject(result);
      });
    });
  };

  const changeSortingByText = (isMulti, option) => {
    if (!isMulti) {
      if (option === "Room Number") {
        setSortingByTextSingle("Room Number (Default)");
      } else if (option === "Name") {
        setSortingByTextSingle("Name");
      } else if (option === "Rank") {
        setSortingByTextSingle("Rank");
      } else if (option === "Region") {
        setSortingByTextSingle("Region");
      }
    } else {
      if (option === "Room Number") {
        setSortingByTextMulti("Room Number (Default)");
      } else if (option === "Name") {
        setSortingByTextMulti("Name");
      } else if (option === "Rank") {
        setSortingByTextMulti("Rank");
      } else if (option === "Region") {
        setSortingByTextMulti("Region");
      }
    }
  };

  const advancedSearchAnimation = useSpring({
    height: showAdvancedSearch ? "20.5em" : "0",
    opacity: showAdvancedSearch ? 1 : 0,
    config: { duration: 500 },
  });

  const roomSortingDropDownSingleAnimation = useSpring({
    height: showRoomSortingButtonsSingle ? "10em" : "0",
    opacity: showRoomSortingButtonsSingle ? 1 : 0,
    config: { duration: 500 },
  });

  const roomSortingDropDownMultiAnimation = useSpring({
    height: showRoomSortingButtonsMulti ? "10em" : "0",
    opacity: showRoomSortingButtonsMulti ? 1 : 0,
    config: { duration: 500 },
  });

  return (
    <section className={`${screenVersion}-lobby-container`}>
      <section className="lobby-top-container">
        <div className="lobby-button-container">
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
        </div>
        <div className="lobby-searchbar-container">
          <div className="lobby-searchbar-basic">
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

          <animated.div style={advancedSearchAnimation}>
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
      </section>

      <br />

      <section className="lobby-bottom-container">
        <div className="lobby-table-container">
          <div className="lobby-single-player-container">
            <div className="lobby-table-header">
              <h3 className="lobby-table-header-title">Single Player</h3>
              <Button
                variant="dark"
                className="sortingByButton"
                onClick={() => {
                  setShowRoomSortingButtonsSingle(
                    !showRoomSortingButtonsSingle
                  );
                }}
              >
                Sorting By: {sortingByTextSingle}
              </Button>
              <animated.div
                className="lobby-table-sorting-buttons"
                style={roomSortingDropDownSingleAnimation}
              >
                {showRoomSortingButtonsSingle && (
                  <>
                    <Button
                      variant="dark"
                      onClick={() => {
                        changeSortingByText(false, "Room Number");
                      }}
                    >
                      Room Number
                    </Button>
                    <Button
                      variant="dark"
                      onClick={() => {
                        changeSortingByText(false, "Name");
                      }}
                    >
                      Name
                    </Button>
                    <Button
                      variant="dark"
                      onClick={() => {
                        changeSortingByText(false, "Rank");
                      }}
                    >
                      Rank
                    </Button>
                    <Button
                      variant="dark"
                      onClick={() => {
                        changeSortingByText(false, "Region");
                      }}
                    >
                      Region
                    </Button>
                  </>
                )}
              </animated.div>
            </div>
            <RenderSingleGames
              screenVersion={screenVersion}
              singleGamesCopy={singleGamesCopy}
              joinWithPassword={joinWithPassword}
              setJoinWithPassword={setJoinWithPassword}
              handleJoin={handleJoin}
              sortingByTextSingle={sortingByTextSingle}
              loading={loading}
              error={error}
            />
          </div>
          <div className="lobby-multi-player-container">
            <div className="lobby-table-header">
              <h3 className="lobby-table-header-title">Multi Player</h3>
              <Button
                variant="dark"
                className="sortingByButton"
                onClick={() => {
                  setShowRoomSortingButtonsMulti(!showRoomSortingButtonsMulti);
                }}
              >
                Sorting By: {sortingByTextMulti}
              </Button>
              <animated.div
                className="lobby-table-sorting-buttons"
                style={roomSortingDropDownMultiAnimation}
              >
                {showRoomSortingButtonsMulti && (
                  <>
                    <Button
                      variant="dark"
                      onClick={() => {
                        changeSortingByText(true, "Room Number");
                      }}
                    >
                      Room Number
                    </Button>
                    <Button
                      variant="dark"
                      onClick={() => {
                        changeSortingByText(true, "Name");
                      }}
                    >
                      Name
                    </Button>
                    <Button
                      variant="dark"
                      onClick={() => {
                        changeSortingByText(true, "Rank");
                      }}
                    >
                      Rank
                    </Button>
                    <Button
                      variant="dark"
                      onClick={() => {
                        changeSortingByText(true, "Region");
                      }}
                    >
                      Region
                    </Button>
                  </>
                )}
              </animated.div>
            </div>
            <RenderMultiGames
              screenVersion={screenVersion}
              multiGamesCopy={multiGamesCopy}
              joinWithPassword={joinWithPassword}
              setJoinWithPassword={setJoinWithPassword}
              handleJoin={handleJoin}
              sortingByTextMulti={sortingByTextMulti}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      </section>

      <Modal
        show={showCreate}
        onHide={() => {
          setShowCreate(false);
        }}
        centered
        className="lobby-modal-container"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Title className="lobby-modal-title">Room Settings</Modal.Title>
        <Modal.Body className="lobby-modal-body">
          <Form onSubmit={handleCreateGame}>
            <h3>Room Name</h3>
            <Form.Group controlId="formcreateRoomName">
              <Form.Control
                type="text"
                name="createRoomName"
                placeholder="Room Name"
                onChange={handleChange}
                value={createRoomName}
                className="lobby-modal-name-data"
              />
            </Form.Group>
            <br />
            <h3 className="lobby-modal-Password">Password</h3>
            <Form.Group controlId="formPassword">
              <Form.Control
                type="text"
                name="password"
                placeholder="Password"
                onChange={handleChange}
                value={createRoomPassword}
                className="lobby-modal-password-data"
              />
            </Form.Group>
            <p
              style={{
                color: "red",
              }}
            >
              * Leave blank if you do not want to set a password for this room.*
            </p>
            <br />
            <div className="lobby-modal-buttons">
              <Button
                className={isMultiplayer ? null : "lobby-modal-mode-button"}
                variant="primary"
                onClick={() => {
                  setIsMultiplayer(false);
                }}
              >
                SinglePlayer
              </Button>
              <Button
                className={isMultiplayer ? "lobby-modal-mode-button" : null}
                variant="success"
                onClick={() => {
                  setIsMultiplayer(true);
                }}
              >
                MultiPlayer
              </Button>

              <Form.Label className="lobby-modal-allowSpecs">
                Allow Spectators?
                <Form.Check
                  type="checkbox"
                  name="allowSpecs"
                  checked={allowSpecs}
                  onChange={handleChange}
                />
              </Form.Label>

              <Button
                className="lobby-modal-create-button"
                variant="dark"
                type="submit"
              >
                Create
              </Button>
              <Button
                className="lobby-modal-cancel-button"
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
        <Modal.Footer className="lobby-modal-footer"></Modal.Footer>
      </Modal>
    </section>
  );
};

export default Lobbypage;
