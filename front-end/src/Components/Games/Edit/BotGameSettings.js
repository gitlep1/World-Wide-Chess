import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BotGameSettings = ({ game, error }) => {
  const API = process.env.REACT_APP_API_URL;
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
      player2ID: choosenBot,
      winner: null,
      inProgress: true,
      currentPositions: startingPositions,
      player1Color: "white",
      player2Color: "black",
    };

    await axios.put(`${API}/games/${game.id}`, updateGameData).then((res) => {
      navigate(`/Games/${game.id}`);
    });
  };

  const handleDelete = (gameID) => {
    axios.delete(`${API}/games/${gameID}`).then(() => {
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
        navigate("/Games/");
      }, 4100);
    });
  };

  return error ? (
    <h1>Game Cancelled</h1>
  ) : (
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
        Start Game vs bot
      </Button>
      <Button
        variant="danger"
        onClick={() => {
          handleDelete(game.id);
        }}
      >
        Cancel
      </Button>
    </Form>
  );
};

export default BotGameSettings;
