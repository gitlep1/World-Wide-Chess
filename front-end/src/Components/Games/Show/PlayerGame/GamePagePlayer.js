// import "../GamePage.scss";
import { useState, useRef, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Button, Modal } from "react-bootstrap";
import { Chess } from "chess.js";
import axios from "axios";

const GamePage = ({ user, game, endGame }) => {
  const API = process.env.REACT_APP_API_URL;

  const chessboardRef = useRef();
  const [chessGame, setChessGame] = useState(new Chess());
  const [recentMoves, setRecentMoves] = useState(game.currentPositions);
  // const [white, setWhite] = useState("");
  // const [black, setBlack] = useState("");
  // const [winner, setWinner] = useState("");

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    axios.get(`${API}/games/${game.id}`).then((res) => {
      setRecentMoves(res.data.currentpositions);
    });
  });

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
    // setChessGame(gameCopy);
    // let test = chessGame.fen();
    // test = test.split(" ");
    // test[1] = test[1] === "w" ? "b" : "w";
    // test = test.join(" ");
    // console.log("test swapping turns: ", test);
    if (move !== null) {
      updatePositions();
      setChessGame(gameCopy);
      return move;
    } else {
      return null;
    }
  }

  const updatePositions = () => {
    const updatedData = {
      player2id: game.player2id,
      player1color: game.player1color,
      player2color: game.player2color,
      in_progress: game.in_progress,
      current_positions: chessGame.fen(),
    };

    axios.put(`${API}/games/${game.id}`, updatedData).then((res) => {
      setRecentMoves(res.data.currentpositions);
    });
  };

  // const swapTurn = () => {
  //   let color = "";
  //   if (game.player1) {
  //     color = "w";
  //   } else if (game.player2) {
  //     color = "b";
  //   }

  //   let tokens = chessGame.fen().split(" ");
  //   tokens[1] = color;
  //   tokens[3] = "-";
  //   return chessGame.load(tokens.join(" "));
  // };

  return (
    <section className="gamePageSection">
      {/* {console.log(chessGame.turn())} */}
      <div>
        <Chessboard
          animationDuration={200}
          position={recentMoves}
          boardOrientation={user.id === game.player1id ? "white" : "black"}
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
