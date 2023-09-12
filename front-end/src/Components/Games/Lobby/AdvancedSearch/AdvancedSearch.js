import "./AdvancedSearch.scss";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const FilterSearch = ({
  screenVersion,
  singleGames,
  setSingleGamesCopy,
  multiGames,
  setMultiGamesCopy,
  socket,
  token,
}) => {
  const [minEloRating, setMinEloRating] = useState("");
  const [maxEloRating, setMaxEloRating] = useState("");
  const [roomsWithPasswords, setRoomsWithPasswords] = useState(false);
  const [fullRooms, setFullRooms] = useState(false);

  const [singleGamesError, setSingleGamesError] = useState("");
  const [multiGamesError, setMultiGamesError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "minElo") {
      setMinEloRating(value);
    } else if (name === "maxElo") {
      setMaxEloRating(value);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.off("get-single-games");
    socket.off("get-multi-games");

    let singleGamesList = [];
    let multiGamesList = [];

    if (roomsWithPasswords || fullRooms) {
      if (roomsWithPasswords) {
        singleGamesList = singleGames.filter((game) => game.room_password);

        multiGamesList = multiGames.filter((game) => game.room_password);
      }

      if (fullRooms) {
        singleGamesList = singleGames.filter((game) => game.in_progress);

        multiGamesList = multiGames.filter((game) => game.in_progress);
      }

      setSingleGamesCopy(singleGamesList);
      setMultiGamesCopy(multiGamesList);
    } else {
      revertSearch();
    }

    // do elo rating later \\
    // if (minEloRating !== "") {
    //   gamesList = games.filter(
    //     (game) => Number(game.player1rating) >= Number(minEloRating)
    //   );
    // }

    // if (minEloRating !== "") {
    //   gamesList = games.filter(
    //     (game) => Number(game.player1rating) <= Number(minEloRating)
    //   );
    // }
  };

  const revertSearch = async () => {
    const singlePlayerGamesRequest = axios
      .get(`${API}/single-player-games`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => {
        setSingleGamesError(err);
      });

    const multiPlayerGamesRequest = axios
      .get(`${API}/multi-player-games`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => {
        setMultiGamesError(err);
      });

    const [singlePlayerGamesResponse, multiPlayerGamesResponse] =
      await axios.all([singlePlayerGamesRequest, multiPlayerGamesRequest]);

    const singlePlayerGames = singlePlayerGamesResponse.data.payload;
    const multiPlayerGames = multiPlayerGamesResponse.data.payload;

    setSingleGamesCopy(singlePlayerGames);
    setMultiGamesCopy(multiPlayerGames);

    socket.emit("get-single-games");
    socket.emit("get-multi-games");
  };

  return (
    <div className={`${screenVersion}-advancedSearch-container`}>
      <div id="advancedSearch-title">Advanced Search</div>

      <Form onSubmit={handleSubmit} className="advancedSearch-form">
        <div className="bg-dark advancedSearch-singleOrMulti">
          <div className="singleOrMultiButtons">placeholder</div>
        </div>
        <div className="bg-dark advancedSearch-roomPassword-container">
          password
          <Form.Check
            name="roomPassword"
            type="switch"
            className="custom-switch"
            value="password"
            checked={roomsWithPasswords}
            onChange={() => {
              setRoomsWithPasswords(!roomsWithPasswords);
            }}
          />
        </div>
        <div className="bg-dark advancedSearch-eloRating-container">
          <span className="advancedSearch-eloRating-title">Elo Rating</span>
          <Form.Group controlId="eloRating-min">
            <Form.Control
              type="number"
              name="minElo"
              placeholder="min ..."
              onChange={handleChange}
              value={minEloRating}
            />
          </Form.Group>
          <div id="elo-divider"></div>
          <Form.Group controlId="eloRating-max">
            <Form.Control
              type="number"
              name="maxElo"
              placeholder="max ..."
              onChange={handleChange}
              value={maxEloRating}
            />
          </Form.Group>
        </div>
        <div className="bg-dark advancedSearch-roomFull-container">
          full
          <Form.Check
            name="roomFull"
            type="switch"
            className="custom-switch"
            value="full"
            checked={fullRooms}
            onChange={() => {
              setFullRooms(!fullRooms);
            }}
          />
        </div>

        <Button
          variant="dark"
          type="submit"
          className="bg-dark advancedSearch-button"
        >
          Search
        </Button>
      </Form>
    </div>
  );
};

export default FilterSearch;
