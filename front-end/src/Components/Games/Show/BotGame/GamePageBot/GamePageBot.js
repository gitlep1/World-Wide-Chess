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

import spectatorLight1 from "../../../../../Images/spectatorLight1.png";
import spectatorLight2 from "../../../../../Images/spectatorLight2.png";
import spectatorLight3 from "../../../../../Images/spectatorLight3.png";

import spectatorDark1 from "../../../../../Images/spectatorDark1.png";
import spectatorDark2 from "../../../../../Images/spectatorDark2.png";
import spectatorDark3 from "../../../../../Images/spectatorDark3.png";

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

  game["spectators"] = 5;

  const renderSpectatorIcon = () => {
    if (game.spectators < 1) {
      return spectatorLight1;
    } else if (game.spectators >= 1 && game.spectators <= 10) {
      return spectatorLight2;
    } else if (game.spectators > 10) {
      return spectatorLight3;
    }
  };

  return (
    <section className="gamePageBot">
      {!player1Data[0] || !player2Data[0] ? forfeitNotify() : null}
      <div className="gamePageBot-header-container">
        <div className="gamePageBot-header">
          <h3 id="gamePageBot-roomName">Room Name: {game.room_name}</h3>
          <span
            id="gamePageBot-spectatorCount"
            style={
              game.spectators >= 1
                ? { visibility: "visible" }
                : { visibility: "hidden" }
            }
          >
            {game.spectators >= 1 ? game.spectators : null}
          </span>
          <Image
            src={renderSpectatorIcon()}
            alt="spectator icon"
            id="gamePageBot-spactatorIcon"
          ></Image>
        </div>
      </div>

      <div className="gamePageBot-players-data">
        {game.player1color === "white" ? (
          <>
            <div className="gamePageBot-playerTwo-data square bg-secondary rounded-pill">
              <Image
                src={player2Data[0].profileimg}
                className="gamePageBot-player-image"
                alt="player 2"
              />
              <span
                style={{
                  color: "white",
                }}
              >
                {player2Data[0].username}
              </span>
            </div>

            <div className="gamePageBot-playerOne-data square bg-secondary rounded-pill">
              <Image
                src={player1Data[0].profileimg}
                className="gamePageBot-player-image"
                alt="player 1"
              />{" "}
              <span
                style={{
                  color: "black",
                }}
              >
                {player1Data[0].username}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="gamePageBot-playerOne-data square bg-secondary rounded-pill">
              <Image
                src={player1Data[0].profileimg}
                className="gamePageBot-player-image"
                alt="player 1"
              />{" "}
              <span
                style={{
                  color: "white",
                }}
              >
                {player1Data[0].username}
              </span>
            </div>
            <div className="gamePageBot-playerTwo-data square bg-secondary rounded-pill">
              <Image
                src={player2Data[0].profileimg}
                className="gamePageBot-player-image"
                alt="player 2"
              />
              <span
                style={{
                  color: "black",
                }}
              >
                {player2Data[0].username}
              </span>
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
            boxShadow: "0 5px 23px rgba(0, 0, 0, 1)",
          }}
          areArrowsAllowed={false}
          // animationDuration={500}
          boardWidth={controlWidth(screenSize)}
          // do custom square styling later  \\
          customLightSquareStyle={{
            borderRadius: "15%",
            boxShadow: "0 0 15px rgba(255, 255, 255, 1)",
            backgroundColor: "rgba(225, 225, 225, 1)",
          }}
          customDarkSquareStyle={{
            borderRadius: "15%",
            boxShadow: "0 0 15px rgba(0, 0, 0, 1)",
            backgroundColor: "rgba(70, 70, 70, 1)",
          }}
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

      <div className="gamePageBot-chatBox-container rounded-5">
        <div className="gamePageBot-chatBox rounded-5">Chat Box</div>
      </div>
    </section>
  );
};

export default PlayVsBot;
