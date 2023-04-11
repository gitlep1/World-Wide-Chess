import "./GamePageBot.scss";
import { useRef, useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Button, Modal, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import EasyBot from "./BotLogic/EasyBot";
import MediumBot from "./BotLogic/MediumBot";
import HardBot from "./BotLogic/HardBot";

import DetectScreenSize from "../../../../../CustomFunctions/DetectScreenSize";
import controlWidth from "../../../../../CustomFunctions/ControlWidth";

const PlayVsBot = ({
  user,
  game,
  endGame,
  player1Data,
  player2Data,
  forfeitNotify,
}) => {
  const navigate = useNavigate();
  const [screenSize, setScreenSize] = useState(0);

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
    const intervalFunctions = setInterval(() => {
      setScreenSize(DetectScreenSize().width);
    });

    return () => clearInterval(intervalFunctions);
  }, []);

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

  // const controlBoardWidth = (screenSize) => {
  //   if (controlWidth(screenSize) <= 600) {
  //     return controlWidth(screenSize);
  //   } else if (controlWidth(screenSize) <= 700) {
  //     return 600;
  //   } else if (controlWidth(screenSize) <= 750) {
  //     return 650;
  //   } else if (controlWidth(screenSize) <= 800) {
  //     return 600;
  //   } else if (controlWidth(screenSize) <= 850) {
  //     return 500;
  //   } else if (controlWidth(screenSize) <= 900) {
  //     return 600;
  //   } else if (controlWidth(screenSize) <= 950) {
  //     return 650;
  //   } else if (controlWidth(screenSize) <= 1000) {
  //     return 700;
  //   } else if (controlWidth(screenSize) <= 1050) {
  //     return 550;
  //   } else if (controlWidth(screenSize) <= 1050) {
  //     return 550;
  //   }
  // };

  return (
    <section className="gamePageBot">
      {!player1Data[0] || !player2Data[0] ? forfeitNotify() : null}
      <div className="gamePageBot-players-data">
        {game.player1color === "white" ? (
          <>
            <div className="gamePageBot-playerTwo-data">
              <Image
                src={player2Data[0].profileimg}
                className="gamePageBot-player-image"
                alt="player 2"
              />
              <span>{player2Data[0].username}</span>
            </div>

            <div className="gamePageBot-playerOne-data">
              <Image
                src={player1Data[0].profileimg}
                className="gamePageBot-player-image"
                alt="player 1"
              />{" "}
              <span>{player1Data[0].username}</span>
            </div>
          </>
        ) : (
          <>
            <div className="gamePageBot-playerOne-data">
              <Image
                src={player1Data[0].profileimg}
                className="gamePageBot-player-image"
                alt="player 1"
              />{" "}
              <span>{player1Data[0].username}</span>
            </div>
            <div className="gamePageBot-playerTwo-data">
              <Image
                src={player2Data[0].profileimg}
                className="gamePageBot-player-image"
                alt="player 2"
              />
              <span>{player2Data[0].username}</span>
            </div>
          </>
        )}
      </div>
      <div className="gamePageBot-chessboard-container">
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
          // animationDuration={500}
          boardWidth={controlWidth(screenSize)}
          // do custom square styling later  \\
          // customLightSquareStyle={{
          //   borderRadius: "15%",
          //   boxShadow: "0 0 15px rgba(255, 255, 255, 1)",
          // }}
          // customDarkSquareStyle={{
          //   borderRadius: "15%",
          //   boxShadow: "0 0 15px rgba(0, 0, 0, 1)",
          // }}
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
      <div className="gamePageBot-chatBox">Chat Box</div>
    </section>
  );
};

export default PlayVsBot;
