import "./AdvancedSearch.scss";
import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const FilterSearch = ({ setGamesCopy, setGames, games, socket }) => {
  const [minEloRating, setMinEloRating] = useState("");
  const [maxEloRating, setMaxEloRating] = useState("");
  const [roomsWithPasswords, setRoomsWithPasswords] = useState(false);
  const [fullRooms, setFullRooms] = useState(false);
  const [singlePlayer, setSinglePlayer] = useState(false);
  const [multiPlayer, setMultiPlayer] = useState(false);

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
    socket.off("games");

    let gamesList = [];

    if (roomsWithPasswords || fullRooms || singlePlayer || multiPlayer) {
      if (roomsWithPasswords) {
        gamesList = games.filter((game) => game.room_password);
      }

      if (fullRooms) {
        gamesList = games.filter((game) => game.in_progress);
      }

      if (singlePlayer) {
        gamesList = games.filter(
          (game) =>
            game.player1id !== 1 &&
            game.player1id !== 2 &&
            game.player1id !== 3 &&
            (game.player2id === 1 ||
              game.player2id === 2 ||
              game.player2id === 3)
        );
      }

      if (multiPlayer) {
        gamesList = games.filter(
          (game) =>
            game.player1id !== 1 &&
            game.player1id !== 2 &&
            game.player1id !== 3 &&
            game.player2id !== 1 &&
            game.player2id !== 2 &&
            game.player2id !== 3
        );
      }

      setGamesCopy(gamesList);
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
    await axios.get(`${API}/games`).then((res) => {
      setGames(res.data);
    });

    socket.on("games", (games) => {
      setGames(games);
    });
  };

  return (
    <div className="desktop-advancedSearch-container">
      <div id="advancedSearch-title">Advanced Search</div>

      <Form onSubmit={handleSubmit} className="advancedSearch-form">
        <div className="bg-dark advancedSearch-singleOrMulti">
          <div className="singleOrMultiButtons">
            <Form.Check
              label="Single Player"
              name="singleOrMultiCheckbox"
              type="checkbox"
              id="checkbox-1"
              value="single-player"
              checked={singlePlayer}
              onChange={() => {
                setSinglePlayer(!singlePlayer);
              }}
            />
            <Form.Check
              label="Multi Player"
              name="singleOrMultiCheckbox"
              type="checkbox"
              id="checkbox-2"
              value="multi-player"
              checked={multiPlayer}
              onChange={() => {
                setMultiPlayer(!multiPlayer);
              }}
            />
          </div>
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
