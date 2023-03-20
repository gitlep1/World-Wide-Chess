import { useRef, useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Button, Modal, Image } from "react-bootstrap";

import QueenImg from "../../../../Images/Queen.png";
import RookImg from "../../../../Images/Rook.png";
import BishopImg from "../../../../Images/Bishop.png";
import KnightImg from "../../../../Images/Knight.png";

import EasyBot from "./BotLogic/EasyBot";
import MediumBot from "./BotLogic/MediumBot";
import HardBot from "./BotLogic/HardBot";

import { animalPieceTheme } from "../../../Accounts/Themes/Pieces/AnimalPieces";

const PlayVsBot = ({ user, game, endGame }) => {
  const chessboardRef = useRef();
  const [chessGame, setChessGame] = useState(new Chess());
  const [boardOrientation, setBoardOrientation] = useState("white");
  const [currentTimeout, setCurrentTimeout] = useState(undefined);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [promoPiece, setPromoPiece] = useState("");
  const [promoShow, setPromoShow] = useState(false);
  const handlePromoClose = () => setPromoShow(false);
  const handlePromoShow = () => setPromoShow(true);

  let player1 = game.player1id;
  let player2 = game.player2id;

  function safeGameMutate(modify) {
    setChessGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function makeRandomMove() {
    if (game.player2id === 1) {
      EasyBot(chessGame, game, safeGameMutate);
    } else if (game.player2id === 2) {
      MediumBot(chessGame, game, safeGameMutate);
    } else if (game.player2id === 3) {
      HardBot(chessGame, game, safeGameMutate);
    }
  }

  const onDrop = (sourceSquare, targetSquare, piece) => {
    let promoArrWhite = ["a8", "b8", "c8", "d8", "e8", "f8", "g8", "h8"];
    // use when allowing user to switch colors \\
    // let promoArrBlack = ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"];

    const gameCopy = { ...chessGame };

    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
    });

    if (move === null) {
      return "snapback";
    }

    if (piece === "wP") {
      for (const promote of promoArrWhite) {
        if (targetSquare === promote) {
          gameCopy.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: prompt("q, n, b, r"), // q, n, b, r
          });
          const newTimeout = setTimeout(makeRandomMove, 200);
          setCurrentTimeout(newTimeout);
          return true;
        }
      }
    }

    // illegal move
    if (move === null) {
      return "snapback";
    }

    setChessGame(gameCopy);

    const newTimeout = setTimeout(makeRandomMove, 200);
    setCurrentTimeout(newTimeout);
    return true;
  };

  const onDragStart = (source, piece, position, orientation) => {
    if (chessGame.game_over()) {
      return false;
    }
    if (chessGame.in_check()) {
      console.log("check");
    }
  };

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
          id="PlayVsRandom" // use only if multiple boards
          boardOrientation={boardOrientation}
          position={chessGame.fen()}
          onPieceDrop={onDrop}
          customBoardStyle={{
            borderRadius: "15%",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 1)",
          }}
          ref={chessboardRef}
          onPieceDragBegin={onDragStart}
          areArrowsAllowed={false}
          customPieces={animalPieceTheme}
        />
      </div>

      {user.id === game.player1id ? (
        <div className="botGameButtons">
          <Button
            variant="secondary"
            className="rc-button"
            onClick={() => {
              safeGameMutate((chessGame) => {
                chessGame.reset();
              });
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
                chessGame.undo();
              });
              clearTimeout(currentTimeout);
            }}
          >
            undo
          </Button>
          <Button variant="danger" onClick={handleShow}>
            END GAME
          </Button>
        </div>
      ) : null}

      <Modal show={show} onHide={handleClose} className="endgameModal">
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

      <Modal
        show={promoShow}
        onHide={handlePromoClose}
        className="pawnPromotionModal"
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>Pawn Promotion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pawnPromotionBody">
          <Button
            variant="secondary"
            onClick={() => {
              setPromoPiece("q");
              handlePromoClose();
            }}
          >
            <Image src={QueenImg} width={80} />
            Queen
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setPromoPiece("r");
              handlePromoClose();
            }}
          >
            <Image src={RookImg} width={80} />
            Rook
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setPromoPiece("b");
              handlePromoClose();
            }}
          >
            <Image src={BishopImg} width={80} />
            Bishop
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setPromoPiece("n");
              handlePromoClose();
            }}
          >
            <Image src={KnightImg} width={80} />
            Knight
          </Button>
        </Modal.Body>
      </Modal>
    </section>
  );
};

export default PlayVsBot;
