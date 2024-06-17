import "./MultiPlayerGame.scss";
import { useRef, useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Button, Modal, Image } from "react-bootstrap";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import Cookies from "js-cookie";
import axios from "axios";

import DetectScreenSize from "../../../../CustomFunctions/DetectScreenSize";
import controlWidth from "../../../../CustomFunctions/ControlWidth";

import spectatorDark1 from "../../../../Images/Spectators/spectatorDark1.png";
import spectatorDark2 from "../../../../Images/Spectators/spectatorDark2.png";
import spectatorDark3 from "../../../../Images/Spectators/spectatorDark3.png";

import blackPawn from "../../../../Images/Themes/Pieces/Default/Black/black-pawn.png";
import blackKnight from "../../../../Images/Themes/Pieces/Default/Black/black-knight.png";
import blackBishop from "../../../../Images/Themes/Pieces/Default/Black/black-bishop.png";
import blackRook from "../../../../Images/Themes/Pieces/Default/Black/black-rook.png";
import blackQueen from "../../../../Images/Themes/Pieces/Default/Black/black-queen.png";
import blackKing from "../../../../Images/Themes/Pieces/Default/Black/black-king.png";

import whitePawn from "../../../../Images/Themes/Pieces/Default/White/white-pawn.png";
import whiteKnight from "../../../../Images/Themes/Pieces/Default/White/white-knight.png";
import whiteBishop from "../../../../Images/Themes/Pieces/Default/White/white-bishop.png";
import whiteRook from "../../../../Images/Themes/Pieces/Default/White/white-rook.png";
import whiteQueen from "../../../../Images/Themes/Pieces/Default/White/white-queen.png";
import whiteKing from "../../../../Images/Themes/Pieces/Default/White/white-king.png";

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
  token,
}) => {
  const navigate = useNavigate();

  const [screenSize, setScreenSize] = useState(0);
  const prevBoard = useRef([]);
  const scrollMoveHistory = useRef(null);

  const [chessGame, setChessGame] = useState(new Chess());
  const [recentMoves, setRecentMoves] = useState(game.current_positions);
  const [promotionMove, setPromotionMove] = useState(null);
  const [showPromotion, setShowPromotion] = useState(false);
  const [player1MoveHistory, setPlayer1MoveHistory] = useState([]);
  const [player2MoveHistory, setPlayer2MoveHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
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
    scrollToBottom();
  }, [player1MoveHistory, player2MoveHistory]);

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

    socket.on("multi-game-state-updated", (moveData, updatedMoveHistory) => {
      setRecentMoves(moveData.current_positions);
    });

    socket.on("player1left", (gameData, playerOneData) => {
      setGame(gameData);
      setGameEnded(true);
      setPlayerLeft(playerOneData);

      if (!playerOneData.is_guest && !user.is_guest) {
        handlePlayerLeaving(playerOneData);
      }
    });

    socket.on("player2left", (gameData, playerTwoData) => {
      setGame(gameData);
      setGameEnded(true);
      setPlayerLeft(playerTwoData);

      if (!playerTwoData.is_guest && !user.is_guest) {
        handlePlayerLeaving(playerTwoData);
      }
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

      socket.on("multi-game-state-updated", (moveData) => {
        setRecentMoves(moveData.current_positions);
      });
    }, 5000);

    return () => {
      clearInterval(intervalFunctions);
      socket.off("multi-player-reconnected-player1");
      socket.off("multi-player-reconnected-player2");
      socket.off("multi-game-state-updated");
      socket.off("player1left");
      socket.off("player2left");
    };
  }, [socket]); // eslint-disable-line

  useEffect(() => {
    const game = new Chess(recentMoves);
    setChessGame(game);
  }, [recentMoves]);

  useEffect(() => {
    prevBoard.current.push(recentMoves);
  }, [recentMoves]);

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
  }, [chessGame, player1Data, player2Data]); // eslint-disable-line

  const handlePlayerLeaving = async (playerLeftData) => {
    const getUserData = await axios
      .get(`${API}/users/user`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => {
        setError(err.response.data);
      });

    const currentUserData = getUserData.data.payload;

    if (currentUserData.id === playerLeftData.id) {
      const updateUserData = {
        loss: (currentUserData.loss += 1),
        games_played: (currentUserData.games_played += 1),
        last_online: new Date(),
      };

      await axios
        .put(`${API}/users/update`, updateUserData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then(async (res) => {
          const updatedUserData = {
            data: res.data.payload,
            currentGamesPlayed: currentUserData.games_played,
            currentLastOnline: currentUserData.last_online,
          };

          await axios
            .put(`${API}/daily-tasks`, updatedUserData, {
              headers: {
                authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              // update tasks here \\
            });
        })
        .catch((err) => {
          setError(err.response.data);
        });
    } else {
      const beforeWins = currentUserData.wins;
      const updateUserData = {
        wins: (currentUserData.wins += 1),
        games_played: (currentUserData.games_played += 1),
        last_online: new Date(),
      };

      await axios
        .put(`${API}/users/update`, updateUserData, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then(async (res) => {
          const oldUserData = {
            data: res.data.payload,
            oldWins: beforeWins,
            oldGamesPlayed: currentUserData.games_played,
            oldLastOnline: currentUserData.last_online,
          };

          await axios
            .put(`${API}/daily-tasks`, oldUserData, {
              headers: {
                authorization: `Bearer ${token}`,
              },
            })
            .then((res) => {
              console.log({ data: res.data.payload });
            });
        })
        .catch((err) => {
          setError(err.response.data);
        });
    }
  };

  const handleMove = async (from, to, piece) => {
    if (chessGame.turn() === "w" && user.id === game.player1id) {
      if (piece[0] === "w") {
        const isPromotion = piece === "wP" && from[1] === "7" && to[1] === "8";

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

          socket.emit("multi-move-piece", game, updatedGameData, piece, "w");

          const history = { from, to, piece };
          setPlayer1MoveHistory([...player1MoveHistory, history]);
        } else {
          setPromotionMove(null);
          return null;
        }
      } else {
        return null;
      }
    } else if (chessGame.turn() === "b" && user.id === game.player2id) {
      if (piece[0] === "b") {
        const isPromotion = piece === "bP" && from[1] === "2" && to[1] === "1";

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

          socket.emit("multi-move-piece", game, updatedGameData, piece, "b");

          const history = { from, to, piece };
          setPlayer2MoveHistory([...player2MoveHistory, history]);
        } else {
          setPromotionMove(null);
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

  const handleImageSrc = (piece) => {
    if (piece === "wP") {
      return whitePawn;
    } else if (piece === "wN") {
      return whiteKnight;
    } else if (piece === "wB") {
      return whiteBishop;
    } else if (piece === "wR") {
      return whiteRook;
    } else if (piece === "wQ") {
      return whiteQueen;
    } else if (piece === "wK") {
      return whiteKing;
    } else if (piece === "bP") {
      return blackPawn;
    } else if (piece === "bN") {
      return blackKnight;
    } else if (piece === "bB") {
      return blackBishop;
    } else if (piece === "bR") {
      return blackRook;
    } else if (piece === "bQ") {
      return blackQueen;
    } else if (piece === "bK") {
      return blackKing;
    }
  };

  const handleMoveHistory = () => {
    return (
      <div className="move-history">
        <div className="player1MoveHistory-container">
          <h4>
            Player 1 <br />{" "}
            <span className="player1MoveHistory-name">
              ({player1Data.username})
            </span>
          </h4>
          <div className="player1MoveHistory" ref={scrollMoveHistory}>
            {player1MoveHistory.map((move, index) => (
              <div key={nanoid()}>
                {index + 1}.{" "}
                <Image
                  src={handleImageSrc(move.piece)}
                  alt={"chess piece icon"}
                  className="chess-piece-icon"
                />{" "}
                {move.from} {"=>"} {move.to}
              </div>
            ))}
          </div>
        </div>

        <div className="player2MoveHistory-container">
          <h4>
            Player 2 <br />{" "}
            <span className="player2MoveHistory-name">
              ({player2Data.username})
            </span>
          </h4>
          <div className="player2MoveHistory" ref={scrollMoveHistory}>
            {player2MoveHistory.map((move, index) => (
              <div key={nanoid()}>
                {index + 1}.{" "}
                <Image
                  src={handleImageSrc(move.piece)}
                  alt={"chess piece icon"}
                  className="chess-piece-icon"
                />{" "}
                {move.from} {"=>"} {move.to}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const scrollToBottom = () => {
    if (scrollMoveHistory.current) {
      const scrollMoveHistoryRef = scrollMoveHistory.current;

      const scrollDiff =
        scrollMoveHistoryRef.scrollHeight -
        (scrollMoveHistoryRef.scrollTop - scrollMoveHistoryRef.clientHeight);

      if (scrollDiff <= 800) {
        if (typeof scrollMoveHistoryRef.scrollTo === "function") {
          scrollMoveHistoryRef.scrollTo({
            top: scrollMoveHistoryRef.scrollHeight,
            behavior: "smooth",
          });
        } else {
          scrollMoveHistoryRef.scrollTop = scrollMoveHistoryRef.scrollHeight;
        }
      }
    }
  };

  const highlightValidPositions = (piece, sourceSquare) => {};

  return (
    <section className={`${screenVersion}-multiPlayerGame-container`}>
      {!player1Data || !player2Data ? forfeitNotify() : null}
      <div className="multiPlayerGame">
        <div className="multiPlayerGame-header-container">
          <div className="multiPlayerGame-header">
            <span
              className="multiPlayerGame-spectatorCount"
              style={
                game.spectators >= 1
                  ? { visibility: "visible" }
                  : { visibility: "hidden" }
              }
            >
              {game.spectators >= 1 ? game.spectators : null}
              <Image
                src={renderSpectatorIcon()}
                alt="spectator icon"
                className="multiPlayerGame-spactatorIcon"
              />
            </span>
            <h3 className="multiPlayerGame-roomName">
              Room Name: {game.room_name}
            </h3>
          </div>

          <div
            className={`multiPlayerGame-playerOne-data ${
              chessGame.turn() === "w" ? "active-turn" : null
            }`}
          >
            <div className="profile-pic-container">
              <Image
                src={player1Data.profileimg}
                className="multiPlayerGame-player-image"
                alt="player 1"
                roundedCircle
              />
            </div>
            <span
              style={{
                color: "white",
              }}
            >
              {player1Data.username}
            </span>
          </div>

          <div
            className={`multiPlayerGame-playerTwo-data ${
              chessGame.turn() === "b" ? "active-turn" : null
            }`}
          >
            <div className="profile-pic-container">
              <Image
                src={player2Data.profileimg}
                className="multiPlayerGame-player-image"
                alt="player 2"
                roundedCircle
              />
            </div>
            <span
              style={{
                color: "white",
              }}
            >
              {player2Data.username}
            </span>
          </div>
        </div>

        <div className="multiPlayer-main-content-container">
          <div className="multiPlayerGame-chessboard-container">
            <Chessboard
              id="PlayerVsPlayer"
              boardOrientation={controlBoardOrientation()}
              position={recentMoves}
              onPieceDrop={(from, to, piece) => handleMove(from, to, piece)}
              customBoardStyle={{
                borderRadius: "15%",
                boxShadow: "0 5px 23px rgba(0, 0, 0, 1)",
              }}
              areArrowsAllowed={false}
              animationDuration={400}
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
              onPieceDragBegin={(piece, sourceSquare) => {
                highlightValidPositions(piece, sourceSquare);
              }}
              onMouseOverSquare={(square) => {}}
            />
          </div>

          <div
            className={`move-history-container ${
              showHistory ? "move-history-active" : null
            }`}
          >
            <span
              className={`${
                showHistory ? "move-history-title-active" : "move-history-title"
              }`}
            >
              Move History
            </span>
            <span
              className={`move-history-icons ${
                showHistory ? "move-history-icons-active" : null
              }`}
              onClick={() => {
                setShowHistory(!showHistory);
              }}
            >
              {showHistory ? (
                <>
                  <MdKeyboardDoubleArrowRight />
                  <MdKeyboardDoubleArrowRight />
                </>
              ) : (
                <>
                  <MdKeyboardDoubleArrowLeft />

                  <MdKeyboardDoubleArrowLeft />
                </>
              )}
            </span>
            <div
              className={`${
                showHistory
                  ? "move-history-content-show"
                  : "move-history-content-hide"
              }`}
            >
              {handleMoveHistory()}
            </div>
          </div>

          <div className="multiPlayerGame-chatBox-container">
            <h1 className="multiPlayer-chatbox-title">ChatBox</h1>
            <div className="multiPlayerGame-chatBox">
              {/* put messages here */}
            </div>
          </div>

          <div className="multiPlayerGame-buttons">
            <Button variant="danger" onClick={handleShow}>
              FORFEIT
            </Button>
            <Button
              variant="warning"
              onClick={() => {
                // console.log("call for a draw");
              }}
            >
              DRAW
            </Button>
          </div>

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
                {user.id === player1Data.id ? (
                  <Button
                    onClick={() => {
                      endGame();
                    }}
                  >
                    End Game
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      navigate("/Lobby");
                    }}
                  >
                    Back to Lobby
                  </Button>
                )}
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
              {user.id === player1Data.id ? (
                <Button
                  onClick={() => {
                    endGame();
                  }}
                >
                  End Game
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    navigate("/Lobby");
                  }}
                >
                  Back to Lobby
                </Button>
              )}
            </Modal.Footer>
          </Modal>

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
                  Cookies.remove("gameid");
                }}
              >
                Return to Lobby
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </section>
  );
};

export default MultiPlayerGame;
