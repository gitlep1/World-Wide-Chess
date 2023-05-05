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
  player1Data,
  player2Data,
  forfeitNotify,
  endGame,
  socket,
}) => {
  const navigate = useNavigate();
  const [screenSize, setScreenSize] = useState(0);
  const prevBoard = useRef([]);

  const [chessGame] = useState(new Chess());
  const [fen, setFen] = useState(chessGame.fen());
  const [promotionMove, setPromotionMove] = useState(null);
  const [currentTimeout, setCurrentTimeout] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [showPromotion, setShowPromotion] = useState(false);
  const [stalemate, setStalemate] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [winner, setWinner] = useState({});

  useEffect(() => {
    const intervalFunctions = setInterval(() => {
      setScreenSize(DetectScreenSize().width);
    });

    return () => clearInterval(intervalFunctions);
  }, []);

  useEffect(() => {
    prevBoard.current.push(fen);
  }, [fen]);

  // useEffect(() => {

  // })

  const makeRandomMove = () => {
    if (game.player2id === 1) {
      const depth = 2;
      setIsThinking(true);
      const delayedFunction = EasyBot(chessGame, setFen, depth, setIsThinking);
      delayedFunction((bestMove) => {
        chessGame.move(bestMove);
        setFen(chessGame.fen());
      });
    } else if (game.player2id === 2) {
      const depth = 3;
      setIsThinking(true);
      const delayedFunction = MediumBot(
        chessGame,
        setFen,
        depth,
        setIsThinking
      );
      delayedFunction((bestMove) => {
        chessGame.move(bestMove);
        setFen(chessGame.fen());
      });
    } else if (game.player2id === 3) {
      const depth = 4;
      setIsThinking(true);
      const delayedFunction = HardBot(chessGame, setFen, depth, setIsThinking);
      delayedFunction((bestMove) => {
        chessGame.move(bestMove);
        setFen(chessGame.fen());
      });
    }

    if (chessGame.in_checkmate()) {
      if (chessGame.turn() === "w") {
        if (game.player1color[0] === "w") {
          setWinner(player2Data);
        } else if (game.player2color[0] === "w") {
          setWinner(player1Data);
        }
      } else if (chessGame.turn() === "b") {
        if (game.player1color[0] === "b") {
          setWinner(player2Data);
        } else if (game.player2color[0] === "b") {
          setWinner(player1Data);
        }
      }
      setShowWinner(true);
    }

    if (chessGame.in_stalemate()) {
      setStalemate(true);
    }
  };

  const handleMove = (from, to, piece) => {
    // Check if the move is a pawn promotion
    const isPromotion = piece === "wP" && from[1] === "7" && to[1] === "8";

    if (isPromotion) {
      // Store the promotion move and wait for user choice
      const promotion = { from, to };
      setPromotionMove(promotion);
      setShowPromotion(true);
      return;
    }

    // Validate the move before making it
    const move = chessGame.move({ from, to });
    if (move) {
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
    const { from, to } = promotionMove;

    // Update the promotion move with the chosen piece
    const newMove = chessGame.move({
      from: from,
      to: to,
      promotion: pieceType,
    });

    if (newMove) {
      setShowPromotion(false);
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
      {!player1Data || !player2Data ? forfeitNotify() : null}
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
                src={player2Data.profileimg}
                className="gamePageBot-player-image"
                alt="player 2"
              />
              <span
                style={{
                  color: "white",
                }}
              >
                <h5
                  style={
                    isThinking
                      ? { color: "yellow", visibility: "visible" }
                      : { visibility: "hidden" }
                  }
                >
                  Thinking
                </h5>
                {player2Data.username}
              </span>
            </div>

            <div className="gamePageBot-playerOne-data square bg-secondary rounded-pill">
              <Image
                src={player1Data.profileimg}
                className="gamePageBot-player-image"
                alt="player 1"
              />{" "}
              <span
                style={{
                  color: "black",
                }}
              >
                {player1Data.username}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="gamePageBot-playerOne-data square bg-secondary rounded-pill">
              <Image
                src={player1Data.profileimg}
                className="gamePageBot-player-image"
                alt="player 1"
              />{" "}
              <span
                style={{
                  color: "white",
                }}
              >
                {player1Data.username}
              </span>
            </div>
            <div className="gamePageBot-playerTwo-data square bg-secondary rounded-pill">
              <Image
                src={player2Data.profileimg}
                className="gamePageBot-player-image"
                alt="player 2"
              />
              <span
                style={{
                  color: "black",
                }}
              >
                {player2Data.username}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="gamePageBot-chessboard-container">
        <Chessboard
          id="PlayVsRandom"
          boardOrientation={user.id === game.player1id ? "white" : "black"}
          position={fen}
          onPieceDrop={(from, to, piece) => handleMove(from, to, piece)}
          customBoardStyle={{
            borderRadius: "15%",
            boxShadow: "0 5px 23px rgba(0, 0, 0, 1)",
          }}
          areArrowsAllowed={false}
          animationDuration={500}
          boardWidth={controlWidth(screenSize)}
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

        <Modal
          className="promotion-modal-container"
          show={showPromotion}
          centered
          backdrop="static"
        >
          <Modal.Header>
            <Modal.Title>Select a piece to promote to:</Modal.Title>
          </Modal.Header>
          <Modal.Body className="promotion-modal-body">
            <Button
              variant="light"
              onClick={() => handlePromotionChoice("q")}
              id="queenButton"
              className="promotion-modal-buttons"
            >
              Queen
            </Button>
            <Button
              variant="light"
              onClick={() => handlePromotionChoice("r")}
              id="rookButton"
              className="promotion-modal-buttons"
            >
              Rook
            </Button>
            <Button
              variant="light"
              onClick={() => handlePromotionChoice("b")}
              id="bishopButton"
              className="promotion-modal-buttons"
            >
              Bishop
            </Button>
            <Button
              variant="light"
              onClick={() => handlePromotionChoice("n")}
              id="knightButton"
              className="promotion-modal-buttons"
            >
              Knight
            </Button>
          </Modal.Body>
        </Modal>

        {winner[0] && (
          <Modal
            className="winner-modal-container"
            show={showWinner}
            centered
            backdrop="static"
          >
            <Modal.Header className="winner-modal-header">
              <Modal.Title>
                Winner: <h1>{winner[0].username}</h1>
              </Modal.Title>
            </Modal.Header>
            <Modal.Footer className="winner-modal-footer">
              <Button
                onClick={() => {
                  endGame(game.id);
                }}
              >
                End Game
              </Button>
            </Modal.Footer>
          </Modal>
        )}

        <Modal
          className="winner-modal-container"
          show={stalemate}
          centered
          backdrop="static"
        >
          <Modal.Header className="winner-modal-header">
            <Modal.Title>
              <h1>Game ended in a DRAW!</h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Footer className="winner-modal-footer">
            <Button
              onClick={() => {
                endGame(game.id);
              }}
            >
              End Game
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="gamePageBot-buttons">
        <Button
          onClick={() => {
            endGame(game.id);
          }}
          variant="danger"
        >
          End Game
        </Button>
      </div>

      <div className="gamePageBot-chatBox-container rounded-5">
        <div className="gamePageBot-chatBox rounded-5">Chat Box</div>
      </div>
    </section>
  );
};

export default PlayVsBot;
