import "./SinglePlayerGameSettings.scss";
import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const BotGameSettings = ({
  game,
  setGame,
  user,
  authenticated,
  token,
  error,
  socket,
  setPlayer1Data,
  setPlayer2Data,
}) => {
  const navigate = useNavigate();

  const [easyBot, setEasyBot] = useState(false);
  const [mediumBot, setMediumBot] = useState(false);
  const [hardBot, setHardBot] = useState(false);

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

  const handleSubmit = async (e) => {
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
      bot_id: choosenBot,
      winner: null,
      in_progress: true,
      current_positions: startingPositions,
      player_color: "white",
      bot_color: "black",
    };

    await axios
      .put(`${API}/single-player-games/${game.id}`, updateGameData, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        socket.emit("games-update-all-clients");
        socket.emit("start-game", res.data);
      });
  };

  const handleDelete = async (gameID) => {
    await axios
      .delete(`${API}/single-player-games/${gameID}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Game has been cancelled", {
          toastId: "hostCancelledBotGame",
          position: "top-center",
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          navigate("/Lobby/");
        }, 4100);
      });
  };

  return error ? (
    <h1>Game Cancelled</h1>
  ) : (
    <section className="single-player-game-settings-container">
      <div className="single-player-game-settings-title">
        <h1>{game.player1}'s Chess Match</h1>
        <h4>Opponent:</h4>
        {game.player2 ? <h3>{game.player2}</h3> : <h3>Searching...</h3>}
      </div>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formSelectOpponent">
          <Form.Label>Bot Difficulty</Form.Label>
          <Form.Check
            value="Easy Bot"
            type="radio"
            id="easy-bot"
            label="Easy"
            onChange={handleChange}
            checked={easyBot}
          />
          <Form.Check
            value="Medium Bot"
            type="radio"
            id="medium-bot"
            label="Medium"
            onChange={handleChange}
            checked={mediumBot}
          />
          <Form.Check
            value="Hard Bot"
            type="radio"
            id="hard-bot"
            label="Hard"
            onChange={handleChange}
            checked={hardBot}
          />
        </Form.Group>
        <Button type="submit" variant="dark">
          Start Game
        </Button>{" "}
        <Button
          variant="danger"
          onClick={() => {
            handleDelete(game.id);
          }}
        >
          Cancel
        </Button>
      </Form>
    </section>
  );
};

export default BotGameSettings;
