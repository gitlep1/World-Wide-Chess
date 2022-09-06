import "./GamePage.scss";
import { useState, useRef } from "react";
import { Chessboard } from "react-chessboard";
import { Button, Modal } from "react-bootstrap";
import { Chess } from "chess.js";
import axios from "axios";

const GamePage = ({ user, game, endGame }) => {
  const API = process.env.REACT_APP_API_URL;

  const chessboardRef = useRef();
  const [chessGame, setChessGame] = useState(new Chess());
  // const [winner, setWinner] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // use for future rematch feature \\
  // const safeGameMutate = (modify) => {
  //   setChessGame((g) => {
  //     const update = { ...g };
  //     modify(update);
  //     return update;
  //   });
  // };

  function onDrop(sourceSquare, targetSquare) {
    const gameCopy = { ...chessGame };
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    console.log(gameCopy.move);
    setChessGame(gameCopy);
    if (move !== null) {
      updatePositions();
    }
    return move;
  }

  const updatePositions = () => {
    const updatedData = {
      player2ID: game.player2id,
      player1img: game.player1img,
      player2img: game.player2img,
      winner: null,
      inProgress: game.in_progress,
      currentPositions: chessGame.fen(),
    };

    axios.put(`${API}/games/${game.id}`, updatedData).then((res) => {
      // setChessGame(res.data.currentpositions);
      console.log(res.data.currentpositions);
    });
  };

  return (
    <section className="gamePageSection">
      <div>
        <Chessboard
          id="PlayerVsPlayer"
          animationDuration={200}
          position={game.currentpositions}
          onPieceDrop={onDrop}
          ref={chessboardRef}
        />
      </div>
      <div className="playerNames">
        <h1>
          <img src={game.player1img} alt="player profile" />
          {game.player1}
        </h1>
        <p>VS</p>
        <h1>
          <img src={game.player2img} alt="player profile" />
          {game.player2}
        </h1>
      </div>
      <Button variant="danger" onClick={handleShow}>
        FORFEIT
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>FORFEITTING MATCH!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to forfeit?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            NO WAY!
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              endGame(game.id);
            }}
          >
            GIVE UP!
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default GamePage;
