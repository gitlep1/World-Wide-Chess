import "./GameSettings.scss";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const GameSettings = ({ user }) => {
  const navigate = useNavigate();
  const { gameID } = useParams();
  const API = process.env.REACT_APP_API_URL;

  const [game, setGame] = useState({});
  const [easyBot, setEasyBot] = useState(false);
  const [mediumBot, setMediumBot] = useState(false);
  const [hardBot, setHardBot] = useState(false);

  useEffect(() => {
    getGame();

    const interval = setInterval(() => {
      getGame();
    }, 1000);

    return () => clearInterval(interval);
  }, []); // eslint-disable-line

  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    window.addEventListener("unload", handleEndPoint);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
      window.removeEventListener("unload", handleEndPoint);
    };
  }, []); // eslint-disable-line

  const getGame = () => {
    axios.get(`${API}/games/${gameID}`).then((res) => {
      setGame(res.data);
    });
  };

  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "";
  };

  const handleEndPoint = async () => {
    console.log("inside endpoint");
    axios.put(`${API}/games/${gameID}`, { inProgress: false }).then((res) => {
      // alert(`${game.player1} Has left the game.`);
      // console.log("inside endpoint");
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

    if (game.player2) {
      updateGameData.player2ID = game.player2ID;
    }

    axios.put(`${API}/games/${gameID}`, updateGameData).then((res) => {
      navigate(`/Games/${gameID}`);
    });
  };

  const handleDelete = async (gameID) => {
    await axios
      .put(`${API}/games/${gameID}`, { inProgress: false })
      .then((res) => {
        console.log("inside handleDelete put");
      });
    await axios.delete(`${API}/games/${gameID}`).then(() => {
      toast.success(
        "Host has cancelled the game. \n You will be redirected in 3 seconds.",
        {
          position: "top-center",
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          draggable: true,
          progress: undefined,
        }
      );
      setTimeout(() => {
        navigate("/Games/Lobby");
      }, 4100);
    });
  };

  const handleLeaveGame = () => {
    axios.put(`${API}/games/${gameID}`, { inProgress: false }).then(() => {
      alert(`${game.player2} has left the game.`);
    });
  };

  const renderPlayerGame = () =>
    game.in_progress ? (
      user.id === game.player1id ? (
        <Form onSubmit={handleSubmit}>
          <Button type="submit" variant="dark">
            Start Game vs {game.player2}
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
      ) : (
        <>
          <h3>Waiting for host to start</h3>
          <Button
            variant="dark"
            onClick={() => {
              handleLeaveGame();
            }}
          >
            Leave Game
          </Button>
        </>
      )
    ) : (
      <h1>{game.player2} has left the game.</h1>
    );

  const renderBotGame = () => (
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

  return (
    <section>
      <section className="editGameTitle">
        <h1>{game.player1}'s Chess Match</h1>
        <p>Opponent:</p>
        {game.player2 ? <h3>{game.player2}</h3> : <h3>Searching...</h3>}
      </section>
      <section className="editGameSettings">
        {game.player2 ? renderPlayerGame() : renderBotGame()}
      </section>
      <ToastContainer autoClose={3000} theme="dark" />
    </section>
  );
};

export default GameSettings;
