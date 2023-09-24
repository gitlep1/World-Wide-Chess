import "./SinglePlayerGame.scss";
import { useRef, useState, useEffect } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { Button, Modal, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

import DetectScreenSize from "../../../../CustomFunctions/DetectScreenSize";
import controlWidth from "../../../../CustomFunctions/ControlWidth";
import {
  captureSound,
  castleSound,
  winnerSound,
  loserSound,
  tieSound,
  moveSound,
  checkSound,
  promoteSound,
  notifySound,
} from "../../../../CustomFunctions/SoundEffects";

import spectatorLight1 from "../../../../Images/spectatorLight1.png";
import spectatorLight2 from "../../../../Images/spectatorLight2.png";
import spectatorLight3 from "../../../../Images/spectatorLight3.png";

// import spectatorDark1 from "../../../../Images/spectatorDark1.png";
// import spectatorDark2 from "../../../../Images/spectatorDark2.png";
// import spectatorDark3 from "../../../../Images/spectatorDark3.png";

import BotLogic from "./BotLogic";

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
  forfeitNotify,
  socket,
  token,
}) => {
  const { gameID } = useParams();
  const navigate = useNavigate();
  const [screenSize, setScreenSize] = useState(0);
  const prevBoard = useRef([]);

  const [chessGame, setChessGame] = useState(new Chess(game.current_positions));
  const [fen, setFen] = useState(chessGame.fen());
  const [promotionMove, setPromotionMove] = useState(null);
  const [showPromotion, setShowPromotion] = useState(false);
  const [currentTimeout, setCurrentTimeout] = useState(null);
  const [isThinking, setIsThinking] = useState(false);

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
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";

      return "Are you sure you want to leave? Your progress will be lost.";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []); // eslint-disable-line

  useEffect(() => {
    reloadData();
  }, []); // eslint-disable-line

  const reloadData = async () => {
    await toast.promise(reloadPlayerAndGameData(), {
      containerId: "loadChessMatchData",
      // pending: "Loading Game Data...",
      success: "Game Data Reloaded!",
      error: "Error loading game",
    });
  };

  const reloadPlayerAndGameData = async () => {
    return new Promise(async (resolve, reject) => {
      socket.emit("get-single-game-data", gameID);

      socket.on(
        "single-player-reconnected",
        async (gameData, player1, player2) => {
          // setGame(gameData);
          setPlayer1Data(player1);
          setPlayer2Data(player2);
          // setFen(gameData.current_positions);

          // console.log(fen);
          // console.log(gameData.current_positions);

          // const checkIfBotsTurn = gameData.current_positions.split(" ")[1];
          // if (checkIfBotsTurn === "b") {
          //   await makeRandomMove();
          // }
        }
      );

      await axios
        .get(`${API}/single-games/${gameID}`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res.data.payload.current_positions);
          setGame(res.data.payload);
          setFen(res.data.payload.current_positions);

          const checkIfBotsTurn =
            res.data.payload.current_positions.split(" ")[1];
          if (checkIfBotsTurn === "b") {
            makeRandomMove();
          }
        });

      resolve();
    });
  };

  useEffect(() => {
    socket.on("single-game-state-updated", async (singleGameUpdated) => {
      console.log("singleGameUpdated: ", singleGameUpdated);
      setGame(singleGameUpdated);
      setFen(singleGameUpdated.current_positions);
    });

    socket.on("single-game-ended", (errorMessage) => {
      toast.error(errorMessage);
      socket.off("single-player-reconnected");
      navigate("/Lobby");
    });

    socket.on("single-game-state-updated-error", async (errorMessage) => {
      console.log(errorMessage);
    });

    return () => {
      socket.off("single-game-state-updated");
      socket.off("single-game-ended");
      socket.off("single-game-state-updated-error");
    };
  }, [navigate, setGame, socket]);

  const endGame = async (gameID) => {
    await axios
      .delete(`${API}/single-games/${gameID}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        toast.success("Game Ended", {
          containerId: "GameEnded",
          position: "top-center",
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: false,
          pauseOnFocusLoss: false,
          draggable: true,
          progress: undefined,
        });
        socket.emit("get-single-game-data");
        setTimeout(() => {
          navigate("/Lobby");
        }, 4100);
      });
  };

  useEffect(() => {
    prevBoard.current.push(fen);
  }, [fen]);

  useEffect(() => {
    checkForEndGame();

    const intervalFunction = setInterval(() => {
      checkForEndGame();
    }, 1000);

    return () => clearInterval(intervalFunction);
  }, []); // eslint-disable-line

  const checkForEndGame = () => {
    if (chessGame.in_checkmate()) {
      if (chessGame.turn() === "w") {
        if (game.player1color === "w") {
          console.log("player 2 won");
          setWinner(player2Data);
        } else if (game.botcolor === "w") {
          console.log("player 1 won");
          setWinner(player1Data);
        }
      } else if (chessGame.turn() === "b") {
        if (game.player1color === "b") {
          console.log("player 2 won");
          setWinner(player2Data);
        } else if (game.botcolor === "b") {
          console.log("player 1 won");
          setWinner(player1Data);
        }
      }
      setShowWinner(true);
    }

    if (chessGame.in_stalemate()) {
      setStalemate(true);
    }
  };

  const makeRandomMove = async () => {
    let depth = 0;
    setIsThinking(true);

    if (game.botid === 1) {
      depth = 2;
    } else if (game.botid === 2) {
      depth = 3;
    } else if (game.botid === 3) {
      depth = 4;
    }

    const delayedFunction = BotLogic(chessGame, setFen, depth, setIsThinking);

    delayedFunction((bestMove) => {
      chessGame.move(bestMove);
      setFen(chessGame.fen());
    });
  };

  const handleMove = async (from, to, piece) => {
    // Check if the move is a pawn promotion
    const isPromotion = piece === "wP" && from[1] === "7" && to[1] === "8";
    const isPromotion2 = piece === "bP" && from[1] === "2" && to[1] === "1";

    if (isPromotion || isPromotion2) {
      // Store the promotion move and wait for user choice
      const promotion = { from, to };
      setPromotionMove(promotion);
      setShowPromotion(true);
      return;
    }

    // Validate the move before making it
    const move = chessGame.move({ from, to });
    if (move) {
      const updatedPositions = {
        current_positions: chessGame.fen(),
        from: from,
        to: to,
      };
      await socket.emit("player-single-move-piece", game, updatedPositions);

      // Make the AI move after the user move
      if (currentTimeout !== null) {
        clearTimeout(currentTimeout);
      }
      const timeout = setTimeout(async () => {
        await makeRandomMove();
        socket.emit("bot-single-move-piece", gameID, chessGame.fen());
        setCurrentTimeout(null);
      }, 200);
      setCurrentTimeout(timeout);
    } else {
      // Invalid move, reset the promotion move
      setPromotionMove(null);
    }
    playSound();
  };

  const playSound = () => {
    winnerSound.play();
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

  return (
    <section className={`${screenVersion}-gamePageBot`}>
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
          />
        </div>
      </div>

      <div className="gamePageBot-players-data">
        {game.player1color === "w" ? (
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
          boardOrientation={handleBoardOrientation()}
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

      <div className="gamePageBot-buttons">
        <Button
          onClick={() => {
            endGame(game.id);
          }}
          variant="danger"
        >
          End Game
        </Button>

        <Button variant="dark" onClick={playSound}>
          test sound
        </Button>
      </div>

      <div className="gamePageBot-chatBox-container rounded-5">
        <div className="gamePageBot-chatBox rounded-5">Chat Box</div>
      </div>
    </section>
  );
};

export default SinglePlayerGame;
