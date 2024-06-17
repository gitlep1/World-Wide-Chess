import "./SinglePlayerGame.scss";
import { useRef, useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Button, Modal, Image } from "react-bootstrap";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { nanoid } from "nanoid";
import axios from "axios";

import DetectScreenSize from "../../../../CustomFunctions/DetectScreenSize";
import controlWidth from "../../../../CustomFunctions/ControlWidth";

import BotLogic from "./BotLogic";

import spectatorLight1 from "../../../../Images/Spectators/spectatorLight1.png";
import spectatorLight2 from "../../../../Images/Spectators/spectatorLight2.png";
import spectatorLight3 from "../../../../Images/Spectators/spectatorLight3.png";

// import spectatorDark1 from "../../../../Images/spectatorDark1.png";
// import spectatorDark2 from "../../../../Images/spectatorDark2.png";
// import spectatorDark3 from "../../../../Images/spectatorDark3.png";

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

const SinglePlayerGame = ({
  screenVersion,
  user,
  game,
  setGame,
  player1Data,
  player2Data,
  setPlayer1Data,
  setPlayer2Data,
  endGame,
  socket,
  token,
}) => {
  let currGameData = {};

  const { gameID } = useParams();
  const navigate = useNavigate();
  const [screenSize, setScreenSize] = useState(0);
  const prevBoard = useRef([]);
  const scrollMoveHistory = useRef(null);

  const [chessGame, setChessGame] = useState(new Chess(game.current_positions));
  const [fen, setFen] = useState(chessGame.fen());
  const [promotionMove, setPromotionMove] = useState(null);
  const [showPromotion, setShowPromotion] = useState(false);
  const [currentTimeout, setCurrentTimeout] = useState(null);
  const [isThinking, setIsThinking] = useState(false);
  const [inGameMessages, setInGameMessages] = useState([]);
  const [playerMoveHistory, setPlayerMoveHistory] = useState([]);
  const [botMoveData, setBotMoveData] = useState({});
  const [botMoveHistory, setBotMoveHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

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
    scrollToBottom();
  }, [playerMoveHistory, botMoveHistory]);

  useEffect(() => {
    const loadData = async () => {
      try {
        await toast.promise(reloadPlayerAndGameData(), {
          containerId: "loadChessMatchData",
          success: "Game Data Reloaded!",
          error: "Error loading game",
        });
      } catch (error) {
        console.error("Error loading game:", error);
      }
    };

    loadData();
  }, []); // eslint-disable-line

  const reloadPlayerAndGameData = async () => {
    return new Promise((resolve, reject) => {
      socket.emit("get-single-game-data", gameID);

      socket.on(
        "single-player-reconnected",
        async (gameData, player1, player2) => {
          try {
            const currentPosition = gameData.current_positions;
            setFen(currentPosition);

            setGame(gameData);
            setChessGame(new Chess(currentPosition));
            setPlayer1Data(player1);
            setPlayer2Data(player2);

            currGameData = gameData;

            const checkIfBotsTurn = gameData.current_positions.split(" ")[1];

            // if (checkIfBotsTurn === "b") {
            //   await makeRandomMove();
            // } else {
            //   resolve();
            // }

            resolve();
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  useEffect(() => {
    socket.on(
      "single-game-state-updated",
      async (singleGameUpdated, updatedMoveHistory) => {
        setGame(singleGameUpdated);
        setFen(singleGameUpdated.current_positions);
      }
    );

    socket.on("single-game-ended", (errorMessage) => {
      toast.error(errorMessage, {
        containerId: "toast-notify",
      });
      socket.off("single-player-reconnected");
      navigate("/Lobby");
    });

    socket.on("single-game-state-updated-error", async (errorMessage) => {
      // console.log(errorMessage);
    });

    return () => {
      socket.off("single-game-state-updated");
      socket.off("single-game-ended");
      socket.off("single-game-state-updated-error");
    };
  }, [navigate, setGame, socket]);

  useEffect(() => {
    prevBoard.current.push(fen);
  }, [fen]);

  useEffect(() => {
    checkForEndGame();

    const intervalFunction = setInterval(() => {
      const isEnded = checkForEndGame();

      if (isEnded === "checkmate" || isEnded === "stalemate") {
        return;
      }
    }, 1000);

    return () => clearInterval(intervalFunction);
  }, []); // eslint-disable-line

  const checkForEndGame = () => {
    if (chessGame.in_checkmate()) {
      if (chessGame.turn() === "w") {
        if (game.player1color === "w") {
          setWinner(player2Data);
        } else if (game.botcolor === "w") {
          setWinner(player1Data);
        }
      } else if (chessGame.turn() === "b") {
        if (game.player1color === "b") {
          setWinner(player2Data);
        } else if (game.botcolor === "b") {
          setWinner(player1Data);
        }
      }
      setShowWinner(true);
      return "checkmate";
    }

    if (chessGame.in_stalemate()) {
      setStalemate(true);

      return "stalemate";
    }
  };

  const makeRandomMove = async () => {
    // console.log("inside random", chessGame.turn());
    // if (chessGame.turn() === "w") {
    //   console.log("inside if color");
    //   return;
    // }

    const isEnded = checkForEndGame();

    if (isEnded === "checkmate" || isEnded === "stalemate") {
      return;
    }

    let depth = 0;
    setIsThinking(true);

    if (game.botid === 1 || currGameData.botid === 1) {
      depth = 1;
    } else if (game.botid === 2 || currGameData.botid === 2) {
      depth = 2;
    } else if (game.botid === 3 || currGameData.botid === 3) {
      depth = 3;
    }

    const delayedFunction = BotLogic(
      chessGame,
      depth,
      setIsThinking,
      botMoveHistory,
      setBotMoveHistory,
      setBotMoveData
    );

    delayedFunction((bestMove) => {
      chessGame.move(bestMove);
      setFen(chessGame.fen());
    });

    // console.log({ botMoveData });
    // if (Object.keys(botMoveData).length > 0) {
    //   console.log("inside if bot");
    //   console.log({ bot: botMoveData });
    //   socket.emit(
    //     "single-move-piece",
    //     game,
    //     botMoveData,
    //     botMoveData.piece,
    //     "b"
    //   );
    // }

    return;
  };

  const handleMove = async (from, to, piece) => {
    const isEnded = checkForEndGame();

    if (isEnded === "checkmate" || isEnded === "stalemate") {
      return;
    }

    const isPromotion = piece === "wP" && from[1] === "7" && to[1] === "8";
    const isPromotion2 = piece === "bP" && from[1] === "2" && to[1] === "1";

    if (isPromotion || isPromotion2) {
      const promotion = { from, to };
      setPromotionMove(promotion);
      setShowPromotion(true);
      return;
    }

    const move = chessGame.move({ from, to });
    if (move) {
      const updatedPositions = {
        current_positions: chessGame.fen(),
        from: from,
        to: to,
      };
      // console.log({ player: updatedPositions });
      socket.emit("single-move-piece", game, updatedPositions, piece, "w");

      const history = {
        from,
        to,
        piece,
      };

      setPlayerMoveHistory([...playerMoveHistory, history]);

      if (currentTimeout !== null) {
        clearTimeout(currentTimeout);
      }
      const timeout = setTimeout(async () => {
        await makeRandomMove();
        setCurrentTimeout(null);
      }, 200);
      setCurrentTimeout(timeout);
    } else {
      setPromotionMove(null);
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
      setShowPromotion(false);

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

  const handleBoardOrientation = () => {
    if (user.id === game.player1id) {
      if (game.player1color === "w") {
        return "white";
      } else {
        return "black";
      }
    } else {
      return "white";
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
        <div className="playerMoveHistory-container">
          <h4>player</h4>
          <div className="playerMoveHistory" ref={scrollMoveHistory}>
            {playerMoveHistory.map((move, index) => (
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

        <div className="botMoveHistory-container">
          <h4>bot</h4>
          <div className="botMoveHistory" ref={scrollMoveHistory}>
            {botMoveHistory.map((move, index) => (
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

  return (
    <section className={`${screenVersion}-singlePlayerGame-container`}>
      <div className="singlePlayerGame">
        <div className="singlePlayerGame-header-container">
          <div className="singlePlayerGame-header">
            <span
              className="singlePlayerGame-spectatorCount"
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
                className="singlePlayerGame-spactatorIcon"
              />
            </span>
            <h3 className="singlePlayerGame-roomName">
              Room Name: {game.room_name}
            </h3>
          </div>

          <div
            className={`singlePlayerGame-playerOne-data ${
              chessGame.turn() === "w" ? "active-turn" : null
            }`}
          >
            <div className="profile-pic-container">
              <Image
                src={player1Data.profileimg}
                className="singlePlayerGame-player-image"
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
            className={`singlePlayerGame-playerTwo-data ${
              chessGame.turn() === "b" ? "active-turn" : null
            }`}
          >
            <div className="profile-pic-container">
              <Image
                src={player2Data.profileimg}
                className="singlePlayerGame-player-image"
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
              <h4
                style={{
                  color: "yellow",
                }}
              >
                {isThinking ? "Thinking" : null}
              </h4>
            </span>
          </div>
        </div>

        <div className="singleplayer-main-content-container">
          <div className="singlePlayerGame-chessboard-container">
            <Chessboard
              id="PlayerVsComputer"
              boardOrientation={handleBoardOrientation()}
              position={fen}
              onPieceDrop={(from, to, piece) => handleMove(from, to, piece)}
              customBoardStyle={{
                borderRadius: "15%",
                boxShadow: "0 5px 23px rgba(0, 0, 0, 1)",
              }}
              areArrowsAllowed={false}
              animationDuration={400}
              boardWidth={controlWidth(screenSize)}
              customLightSquareStyle={{
                borderRadius: "1em",
                boxShadow: "0 0 15px rgba(255, 255, 255, 1)",
                backgroundColor: "rgba(225, 225, 225, 1)",
              }}
              customDarkSquareStyle={{
                borderRadius: "1em",
                boxShadow: "0 0 15px rgba(0, 0, 0, 1)",
                backgroundColor: "rgba(70, 70, 70, 1)",
              }}
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

          <div className="singlePlayerGame-chatBox-container">
            <h1 className="singlePlayer-chatbox-title">ChatBox</h1>
            <div className="singlePlayerGame-chatBox">
              {/* put messages here */}
            </div>
          </div>

          <div className="singlePlayerGame-buttons">
            <Button
              onClick={() => {
                endGame(game.id);
              }}
              variant="danger"
              className="singlePlayerGame-endGame-button"
            >
              End Game
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
      </div>
    </section>
  );
};

export default SinglePlayerGame;
