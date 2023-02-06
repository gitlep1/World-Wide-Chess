import { useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Button, Modal } from "react-bootstrap";

const PlayVsBot = ({ user, game, endGame }) => {
  const chessboardRef = useRef();
  const [chessGame, setChessGame] = useState(new Chess());
  const [boardOrientation, setBoardOrientation] = useState("white");
  const [currentTimeout, setCurrentTimeout] = useState(undefined);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  function safeGameMutate(modify) {
    setChessGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function makeRandomMove() {
    const possibleMoves = chessGame.moves();

    if (
      chessGame.game_over() ||
      chessGame.in_draw() ||
      possibleMoves.length === 0
    ) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((chessGame) => {
      chessGame.move(possibleMoves[randomIndex]);
    });
  }

  function onDrop(sourceSquare, targetSquare) {
    const gameCopy = { ...chessGame };
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    setChessGame(gameCopy);

    // illegal move
    if (move === null) {
      return false;
    }

    // store timeout so it can be cleared on undo/reset so computer doesn't execute move
    const newTimeout = setTimeout(makeRandomMove, 200);
    setCurrentTimeout(newTimeout);
    return true;
  }

  return (
    <section className="botBoard">
      <div className="playerNames">
        <span className="player2">
          <img src={game.player2img} alt="player profile" />
          <h3>{game.player2}</h3>
        </span>
        <p>VS</p>
        <span className="player1">
          <img src={game.player1img} alt="player profile" />
          <h3>{game.player1}</h3>
        </span>
      </div>
      <div className="chessboard">
        <Chessboard
          id="PlayVsRandom"
          animationDuration={200}
          boardOrientation={boardOrientation}
          position={chessGame.fen()}
          onPieceDrop={onDrop}
          customBoardStyle={{
            borderRadius: "4px",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
          }}
          ref={chessboardRef}
        />
      </div>

      <div className="botGameButtons">
        <Button
          variant="secondary"
          className="rc-button"
          onClick={() => {
            safeGameMutate((chessGame) => {
              chessGame.reset();
            });
            // stop any current timeouts
            clearTimeout(currentTimeout);
          }}
        >
          reset
        </Button>
        <Button
          variant="dark"
          className="rc-button"
          onClick={() => {
            setBoardOrientation((currentOrientation) =>
              currentOrientation === "white" ? "black" : "white"
            );
          }}
        >
          flip board
        </Button>
        <Button
          variant="primary"
          className="rc-button"
          onClick={() => {
            safeGameMutate((chessGame) => {
              chessGame.undo();
            });
            // stop any current timeouts
            clearTimeout(currentTimeout);
          }}
        >
          undo
        </Button>
        <Button variant="danger" onClick={handleShow}>
          END GAME
        </Button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Do you want to end this game?</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              endGame(game.id);
            }}
          >
            End Game
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default PlayVsBot;
