import "./MultiPlayerGame.scss";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chessboard } from "react-chessboard";
import { Button, Modal, Image } from "react-bootstrap";
import { Chess } from "chess.js";
import axios from "axios";
import io from "socket.io-client";

import DetectScreenSize from "../../../../CustomFunctions/DetectScreenSize";
import controlWidth from "../../../../CustomFunctions/ControlWidth";

import spectatorDark1 from "../../../../Images/Spectators/spectatorDark1.png";
import spectatorDark2 from "../../../../Images/Spectators/spectatorDark2.png";
import spectatorDark3 from "../../../../Images/Spectators/spectatorDark3.png";

const API = process.env.REACT_APP_API_URL;

const MultiPlayerGame = ({
  screenVersion,
  user,
  game,
  setGame,
  player1Data,
  player2Data,
  setPlayer1Data,
  setPlayer2Data,
  forfeitNotify,
  endGame,
  socket,
}) => {
  const navigate = useNavigate();

  const [screenSize, setScreenSize] = useState(0);
  const prevBoard = useRef([]);

  const [chessGame, setChessGame] = useState(new Chess());
  const [recentMoves, setRecentMoves] = useState(game.current_positions);
  const [promotionMove, setPromotionMove] = useState(null);
  const [showPromotion, setShowPromotion] = useState(false);
  const [showStalemate, setShowStalemate] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [winner, setWinner] = useState({});
  const [gameEnded, setGameEnded] = useState(false);
  const [playerLeft, setPlayerLeft] = useState({});

  const [error, setError] = useState("");

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
    socket.emit("get-multi-game-data", game.id);

    socket.on("multi-player-reconnected-player1", (gameData, playerOneData) => {
      setGame(gameData);
      setPlayer1Data(playerOneData);
    });

    socket.on("multi-player-reconnected-player2", (gameData, playerTwoData) => {
      setGame(gameData);
      setPlayer2Data(playerTwoData);
    });

    socket.on("player1left", (gameData, playerOneData) => {
      setGame(gameData);
      setGameEnded(true);
      setPlayerLeft(playerOneData);
    });

    socket.on("player2left", (gameData, playerTwoData) => {
      setGame(gameData);
      setGameEnded(true);
      setPlayerLeft(playerTwoData);
    });

    const intervalFunctions = setInterval(() => {
      socket.emit("get-multi-game-data", game.id);

      socket.on(
        "multi-player-reconnected-player1",
        (gameData, playerOneData) => {
          setGame(gameData);
          setPlayer1Data(playerOneData);
        }
      );

      socket.on(
        "multi-player-reconnected-player2",
        (gameData, playerTwoData) => {
          setGame(gameData);
          setPlayer2Data(playerTwoData);
        }
      );
    }, 30000);

    return () => {
      clearInterval(intervalFunctions);
      socket.off("multi-player-reconnected-player1");
      socket.off("multi-player-reconnected-player2");
      socket.off("player1left");
      socket.off("player2left");
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    const game = new Chess(recentMoves);
    setChessGame(game);
  }, [recentMoves]);

  useEffect(() => {
    prevBoard.current.push(recentMoves);
  }, [recentMoves]);

  const updateGameState = (newMoveData) => {
    setRecentMoves(newMoveData.current_positions);
  };

  useEffect(() => {
    socket.on("multi-game-state-updated", (moveData) => {
      updateGameState(moveData);
    });

    return () => {
      socket.off("multi-game-state-updated");
    };
  }, [socket]);

  useEffect(() => {
    if (chessGame.in_stalemate()) {
      setShowStalemate(true);
    }

    if (chessGame.turn() === "w") {
      if (chessGame.in_checkmate()) {
        setShowWinner(true);
        setWinner(player2Data);
      }
    } else if (chessGame.turn() === "b") {
      if (chessGame.in_checkmate()) {
        setShowWinner(true);
        setWinner(player1Data);
      }
    }
  }, [chessGame, player1Data, player2Data]);

  const handleMove = async (from, to, piece) => {
    socket.emit("get-multi-game-data", game.id);

    if (chessGame.turn() === "w") {
      if (user.id === game.player1id) {
        if (piece[0] === "w") {
          const isPromotion =
            piece === "wP" && from[1] === "7" && to[1] === "8";

          if (isPromotion) {
            const promotion = { from, to };
            setPromotionMove(promotion);
            setShowPromotion(true);
            return;
          }

          const move = chessGame.move({ from, to });
          if (move) {
            const updatedGameData = {
              current_positions: chessGame.fen(),
              from: from,
              to: to,
            };
            socket.emit("multi-move-piece", game, updatedGameData);
          } else {
            setPromotionMove(null);
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else if (chessGame.turn() === "b") {
      if (user.id === game.player2id) {
        if (piece[0] === "b") {
          const isPromotion =
            piece === "bP" && from[1] === "2" && to[1] === "1";

          if (isPromotion) {
            const promotion = { from, to };
            setPromotionMove(promotion);
            setShowPromotion(true);
            return;
          }

          const move = chessGame.move({ from, to });
          if (move) {
            const updatedGameData = {
              current_positions: chessGame.fen(),
              from: from,
              to: to,
            };
            socket.emit("multi-move-piece", game, updatedGameData);
          } else {
            setPromotionMove(null);
            return null;
          }
        } else {
          return null;
        }
      } else {
        return null;
      }
    }
  };

  const handlePromotionChoice = (pieceType) => {
    const { from, to } = promotionMove;

    const newMove = chessGame.move({
      from: from,
      to: to,
      promotion: pieceType,
    });

    if (newMove) {
      handlePromotion(newMove);
      setShowPromotion(false);
    }
  };

  const handlePromotion = async (newMove) => {
    const updatedGameData = {
      current_positions: chessGame.fen(),
      from: newMove.from,
      to: newMove.to,
      promotion: newMove.promotion,
    };

    socket.emit("multi-piece-promo", game, updatedGameData);
  };

  game["spectators"] = 5;

  const renderSpectatorIcon = () => {
    if (game.spectators < 1) {
      return spectatorDark1;
    } else if (game.spectators >= 1 && game.spectators <= 10) {
      return spectatorDark2;
    } else if (game.spectators > 10) {
      return spectatorDark3;
    }
  };

  const controlBoardOrientation = () => {
    if (user.id === game.player1id) {
      return "white";
    }
    if (user.id === game.player2id) {
      return "black";
    }
  };

  return (
    <section className={`${screenVersion}-gamePagePlayer`}>
      {!player1Data || !player2Data ? forfeitNotify() : null}

      <div className="gamePagePlayer-header-container">
        <div className="gamePagePlayer-header">
          <h3 id="gamePagePlayer-roomName">Room Name: {game.room_name}</h3>
          <span
            id="gamePagePlayer-spectatorCount"
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
            id="gamePagePlayer-spactatorIcon"
          ></Image>
        </div>
      </div>

      <div className="gamePagePlayer-players-data">
        {user.id === game.player1id ? (
          <>
            <div className="gamePagePlayer-playerTwo-data square bg-secondary rounded-pill">
              <Image
                src={player2Data.profileimg}
                className="gamePagePlayer-player-image"
                alt="player 2"
              />
              <span
                style={{
                  color: "white",
                }}
              >
                {player2Data.username}
              </span>
            </div>

            <div className="gamePagePlayer-playerOne-data square bg-secondary rounded-pill">
              <Image
                src={player1Data.profileimg}
                className="gamePagePlayer-player-image"
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
            <div className="gamePagePlayer-playerOne-data square bg-secondary rounded-pill">
              <Image
                src={player1Data.profileimg}
                className="gamePagePlayer-player-image"
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
            <div className="gamePagePlayer-playerTwo-data square bg-secondary rounded-pill">
              <Image
                src={player2Data.profileimg}
                className="gamePagePlayer-player-image"
                alt="player 2"
              />
              <span
                style={{
                  color: "white",
                }}
              >
                {player2Data.username}
              </span>
            </div>
          </>
        )}
      </div>

      <div className="gamePagePlayer-chessboard-container">
        <Chessboard
          id="PlayVsRandom"
          boardOrientation={controlBoardOrientation()}
          position={recentMoves}
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

        {winner ? (
          <Modal
            className="winner-modal-container"
            show={showWinner}
            centered
            backdrop="static"
          >
            <Modal.Header className="winner-modal-header">
              <Modal.Title>
                Winner: <h1>{winner.username}</h1>
              </Modal.Title>
            </Modal.Header>
            <Modal.Footer className="winner-modal-footer">
              <Button
                onClick={() => {
                  endGame();
                }}
              >
                End Game
              </Button>
            </Modal.Footer>
          </Modal>
        ) : null}

        <Modal
          className="winner-modal-container"
          show={showStalemate}
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
                endGame();
              }}
            >
              End Game
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      <div className="gamePagePlayer-buttons">
        <Button variant="danger" onClick={handleShow}>
          FORFEIT
        </Button>
        <Button
          variant="warning"
          onClick={() => {
            console.log("call for a draw");
          }}
        >
          DRAW
        </Button>
      </div>

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
              endGame();
            }}
          >
            GIVE UP!
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={gameEnded} backdrop="static">
        <Modal.Header>
          <Modal.Title>Game Ended!</Modal.Title>
        </Modal.Header>
        <Modal.Body>{playerLeft.username} has left the game!</Modal.Body>
        <Modal.Footer>
          <Button
            onClick={() => {
              navigate("/Lobby");
            }}
          >
            Return to Lobby
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="gamePagePlayer-chatBox-container rounded-5">
        <div className="gamePagePlayer-chatBox rounded-5">Chat Box</div>
      </div>
    </section>
  );
};

export default MultiPlayerGame;
