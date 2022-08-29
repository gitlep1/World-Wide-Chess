import "./GameSettings.scss";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import axios from "axios";

const GameSettings = ({ user }) => {
  const navigate = useNavigate();
  const { gameID } = useParams();
  const API = process.env.REACT_APP_API_URL;

  let player1 = "";
  let player2 = "";

  const [users, setUsers] = useState([]);
  const [game, setGame] = useState({});
  const [easyBot, setEasyBot] = useState(false);
  const [mediumBot, setMediumBot] = useState(false);
  const [hardBot, setHardBot] = useState(false);

  useEffect(() => {
    getGame();
    getUsers();
  }, []); // eslint-disable-line

  const getGame = () => {
    axios.get(`${API}/games/${gameID}`).then((res) => {
      setGame(res.data);
    });
  };

  const getUsers = () => {
    axios.get(`${API}/users`).then((res) => {
      setUsers(res.data);
    });
  };

  const handleChange = (e) => {
    const { value } = e.target;

    if (value === "Easy Bot") {
      setEasyBot(true);
      setMediumBot(false);
      setHardBot(false);
    } else if (value === "Medium Bot") {
      setMediumBot(true);
      setEasyBot(false);
      setHardBot(false);
    } else if (value === "Hard Bot") {
      setHardBot(true);
      setMediumBot(false);
      setEasyBot(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const easyBotID = 1;
    const mediumBotID = 2;
    const hardBotID = 3;

    let choosenBot = null;

    if (easyBot) {
      choosenBot = easyBotID;
    } else if (mediumBot) {
      choosenBot = mediumBotID;
    } else if (hardBotID) {
      choosenBot = hardBotID;
    }

    const startingPositions =
      "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

    const updateGameData = {
      player2ID: choosenBot,
      winner: null,
      inProgress: true,
      moves: [startingPositions],
    };

    axios.put(`${API}/games/${gameID}`, updateGameData).then((res) => {
      navigate(`/Games/${gameID}`);
    });
  };

  return (
    <section>
      <section className="editGameTitle">
        {users.map((player) => {
          if (player.id === game.player1id) {
            player1 = player.username;
          }
          return null;
        })}
        <h1>{player1}'s Chess Match</h1>
        <p>Opponent:</p>
        {player1 === user.username ? (
          <h3>Searching...</h3>
        ) : (
          <h3>{user.username}</h3>
        )}
      </section>
      <section className="editGameSettings">
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formSelectOpponent">
            <Form.Label>Bot Difficulty</Form.Label>
            <Form.Check
              value="Easy Bot"
              type="radio"
              aria-label="radio 1"
              label="Easy"
              onChange={handleChange}
              checked={easyBot}
            />
            <Form.Check
              value="Medium Bot"
              type="radio"
              aria-label="radio 2"
              label="Medium"
              onChange={handleChange}
              checked={mediumBot}
            />

            <Form.Check
              value="Hard Bot"
              type="radio"
              aria-label="radio 3"
              label="Hard"
              onChange={handleChange}
              checked={hardBot}
            />
          </Form.Group>

          <Button type="submit" variant="dark">
            Start Game
          </Button>
        </Form>
      </section>
    </section>
  );
};

export default GameSettings;
