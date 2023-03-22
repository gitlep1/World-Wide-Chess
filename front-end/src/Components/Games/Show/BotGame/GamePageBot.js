import { useRef, useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Button, Modal, Image } from "react-bootstrap";

import EasyBot from "./BotLogic/EasyBot";
import MediumBot from "./BotLogic/MediumBot";
import HardBot from "./BotLogic/HardBot";

const PlayVsBot = ({ user, game, endGame }) => {
  const prevBoard = useRef([]);
  const depth = 4;

  const [chessGame, setChessGame] = useState(new Chess());
  const [boardOrientation, setBoardOrientation] = useState("white");
  const [fen, setFen] = useState(chessGame.fen());
  const [promotionMove, setPromotionMove] = useState(null);
  const [currentTimeout, setCurrentTimeout] = useState(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    prevBoard.current.push(fen);
  }, [fen]);

  const makeRandomMove = () => {
    if (game.player2id === 1) {
      EasyBot(chessGame, game);
    } else if (game.player2id === 2) {
      MediumBot(chessGame, game);
    } else if (game.player2id === 3) {
      HardBot(chessGame, setFen, depth);
    }
  };

  const handleMove = (from, to, piece) => {
    // Validate the move before making it
    const move = chessGame.move({ from, to });
    if (move) {
      // Check for pawn promotion
      if (move.flags.includes("p")) {
        // Wait for promotion choice before making AI move
        setPromotionMove({ from, to, piece });
        return;
      }

      // Make the AI move after the user move
      if (currentTimeout !== null) {
        clearTimeout(currentTimeout);
      }
      const timeout = setTimeout(() => {
        makeRandomMove();
        setFen(chessGame.fen());
        setCurrentTimeout(null);
      }, 200);
      setCurrentTimeout(timeout);
    } else {
      // Invalid move, reset the promotion move
      setPromotionMove(null);
    }
  };

  const handlePromotionChoice = (pieceType) => {
    // Update the promotion move with the chosen piece
    const newPiece = {
      type: pieceType.toLowerCase(),
      color: promotionMove.piece.color,
    };
    const newMove = chessGame.move({
      from: promotionMove.from,
      to: promotionMove.to,
      promotion: newPiece.type,
    });
    chessGame.setPiece(newMove);

    // Make the AI move after the user promotion
    if (currentTimeout !== null) {
      clearTimeout(currentTimeout);
    }
    const timeout = setTimeout(() => {
      makeRandomMove();
      setFen(chessGame.fen());
      setCurrentTimeout(null);
    }, 200);
    setCurrentTimeout(timeout);

    // Reset the promotion move
    setPromotionMove(null);
  };

  return (
    <section className="botBoard">
      <div className="chessboard">
        <Chessboard
          id="PlayVsRandom" // use only if multiple boards
          boardOrientation={boardOrientation}
          position={fen}
          onPieceDrop={(from, to, piece) => handleMove(from, to, piece)}
          customBoardStyle={{
            borderRadius: "15%",
            boxShadow: "0 5px 15px rgba(0, 0, 0, 1)",
          }}
          areArrowsAllowed={false}
          // customPieces={animalPieceTheme}
          animationDuration={500}
        />
        {promotionMove && (
          <div className="promotion-modal">
            <button onClick={() => handlePromotionChoice("q")}>Queen</button>
            <button onClick={() => handlePromotionChoice("r")}>Rook</button>
            <button onClick={() => handlePromotionChoice("b")}>Bishop</button>
            <button onClick={() => handlePromotionChoice("n")}>Knight</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlayVsBot;
