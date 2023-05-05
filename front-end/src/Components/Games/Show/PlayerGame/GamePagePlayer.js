import "./GamePagePlayer.scss";
import { useState, useRef, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Button, Modal, Image } from "react-bootstrap";
import { Chess } from "chess.js";
import axios from "axios";
import io from "socket.io-client";

import DetectScreenSize from "../../../../CustomFunctions/DetectScreenSize";
import controlWidth from "../../../../CustomFunctions/ControlWidth";

import spectatorDark1 from "../../../../Images/spectatorDark1.png";
import spectatorDark2 from "../../../../Images/spectatorDark2.png";
import spectatorDark3 from "../../../../Images/spectatorDark3.png";

const API = process.env.REACT_APP_API_URL;

const GamePagePlayer = ({
  user,
  game,
  player1Data,
  player2Data,
  forfeitNotify,
  endGame,
  socket,
}) => {
  const [screenSize, setScreenSize] = useState(0);
  const prevBoard = useRef([]);

  const [chessGame, setChessGame] = useState(new Chess());
  const [recentMoves, setRecentMoves] = useState(game.current_positions);
  // const [fen, setFen] = useState(chessGame.fen());
  const [promotionMove, setPromotionMove] = useState(null);
  const [showPromotion, setShowPromotion] = useState(false);
  const [stalemate, setStalemate] = useState(false);
  const [showWinner, setShowWinner] = useState(false);
  const [winner, setWinner] = useState({});
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
    socket.on("game-state-updated", (moveData) => {
      // updateGameState(moveData);
      console.log(moveData);
    });

    return () => {
      socket.off("game-state-updated");
    };
  }, [socket]);

  useEffect(() => {
    const game = new Chess(recentMoves);
    setChessGame(game);
  }, [recentMoves]);

  useEffect(() => {
    prevBoard.current.push(recentMoves);
  }, [recentMoves]);

  // const updateGameState = (newMoveData) => {
  //   console.log("recentMoves: ", recentMoves);
  //   console.log("newMoveData: ", newMoveData);
  //   // setRecentMoves(newMoveData);
  // };

  const handleMove = async (from, to, piece) => {
    // check if turn is currently white
    if (chessGame.turn() === "w") {
      // check if the current user matches the 1st player's id so only that player can move
      if (user.id === game.player1id) {
        // check if the piece begins with "w" (white) so the 1st player can only move white
        if (piece[0] === "w") {
          // Check if the move is a pawn promotion
          const isPromotion = piece === "wP" && to[1] === "8";

          if (isPromotion) {
            // Store the promotion move and wait for user choice
            const promotion = { from, to };
            setPromotionMove(promotion);
            setShowPromotion(true);
            return;
          }

          const move = chessGame.move({ from, to });
          if (move) {
            // const updatedGameData = {
            //   player2id: game.player2id,
            //   player1color: game.player1color,
            //   player2color: game.player2color,
            //   in_progress: game.in_progress,
            //   current_positions: chessGame.fen(),
            //   from: from,
            //   to: to,
            // };
            const updatedGameData = {
              current_positions: chessGame.fen(),
              from: from,
              to: to,
            };
            socket.emit("move-piece", game, updatedGameData);

            // await axios
            //   .put(`${API}/games/${game.id}/move`, updatedGameData)
            //   .then((res) => {
            //     updateGameState(res.data);
            //   })
            //   .catch((err) => {
            //     console.log("error: ", err);
            //   });
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
          // Check if the move is a pawn promotion
          const isPromotion = piece === "bP" && to[1] === "1";

          if (isPromotion) {
            // Store the promotion move and wait for user choice
            const promotion = { from, to };
            setPromotionMove(promotion);
            setShowPromotion(true);
            return;
          }

          const move = chessGame.move({ from, to });
          if (move) {
            // const updatedGameData = {
            //   player2id: game.player2id,
            //   player1color: game.player1color,
            //   player2color: game.player2color,
            //   in_progress: game.in_progress,
            //   current_positions: chessGame.fen(),
            //   from: from,
            //   to: to,
            // };
            const updatedGameData = {
              current_positions: chessGame.fen(),
              from: from,
              to: to,
            };
            socket.emit("move-piece", game, updatedGameData);
            // socket.once("game-state-updated", (updatedGame) => {
            //   updateGameState(updatedGame);
            // });

            // await axios
            //   .put(`${API}/games/${game.id}/move`, updatedGameData)
            //   .then((res) => {
            //     updateGameState(res.data);
            //   })
            //   .catch((err) => {
            //     console.log("error: ", err);
            //   });
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

    // Update the promotion move with the chosen piece
    const newMove = chessGame.move({
      from: from,
      to: to,
      promotion: pieceType,
    });

    if (newMove) {
      updatePositions(newMove);
      setShowPromotion(false);
    }
  };

  const updatePositions = async (newMove) => {
    const updatedData = {
      player2id: game.player2id,
      player1color: game.player1color,
      player2color: game.player2color,
      in_progress: game.in_progress,
      current_positions: chessGame.fen(),
      from: newMove.from,
      to: newMove.to,
      promotion: newMove.promotion,
    };

    // await axios
    //   .put(`${API}/games/${game.id}/move`, updatedData)
    //   .then((res) => {
    //     updateGameState(res.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
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

  return (
    <section className="gamePagePlayer">
      {/* {console.log(chessGame.turn())} */}
      {/* {console.log(recentMoves)} */}
      {/* {console.log(game)} */}
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
          boardOrientation={user.id === game.player1id ? "white" : "black"}
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
                  endGame(game.id);
                }}
              >
                End Game
              </Button>
            </Modal.Footer>
          </Modal>
        ) : null}

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
              endGame(game.id);
            }}
          >
            GIVE UP!
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="gamePagePlayer-chatBox-container rounded-5">
        <div className="gamePagePlayer-chatBox rounded-5">Chat Box</div>
      </div>
    </section>
  );
};

export default GamePagePlayer;
