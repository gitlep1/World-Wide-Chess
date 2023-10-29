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

import spectatorLight1 from "../../../../Images/Spectators/spectatorLight1.png";
import spectatorLight2 from "../../../../Images/Spectators/spectatorLight2.png";
import spectatorLight3 from "../../../../Images/Spectators/spectatorLight3.png";

// import spectatorDark1 from "../../../../Images/spectatorDark1.png";
// import spectatorDark2 from "../../../../Images/spectatorDark2.png";
// import spectatorDark3 from "../../../../Images/spectatorDark3.png";

import BotLogic from "./BotLogic";
import { nanoid } from "nanoid";

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
  const [inGameMessages, setInGameMessages] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);

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
          // console.log(res.data.payload.current_positions);
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
      // console.log("singleGameUpdated: ", singleGameUpdated);
      setGame(singleGameUpdated);
      setFen(singleGameUpdated.current_positions);
    });

    socket.on("single-game-ended", (errorMessage) => {
      toast.error(errorMessage, {
        containerId: "toast-notify",
      });
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

  // useEffect(() => {
  //   checkForEndGame();

  //   const intervalFunction = setInterval(() => {
  //     checkForEndGame();
  //   }, 1000);

  //   return () => clearInterval(intervalFunction);
  // }, []); // eslint-disable-line

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
    checkForEndGame();

    let depth = 0;
    setIsThinking(true);

    if (game.botid === 1) {
      depth = 2;
    } else if (game.botid === 2) {
      depth = 3;
    } else if (game.botid === 3) {
      depth = 4;
    }

    const delayedFunction = BotLogic(
      chessGame,
      setFen,
      depth,
      setIsThinking,
      moveHistory,
      setMoveHistory
    );

    delayedFunction((bestMove) => {
      chessGame.move(bestMove);
      setFen(chessGame.fen());
    });
  };

  const handleMove = async (from, to, piece) => {
    checkForEndGame();

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
      // setMoveHistory([...moveHistory, move]);
      const updatedPositions = {
        current_positions: chessGame.fen(),
        from: from,
        to: to,
      };
      await socket.emit("player-single-move-piece", game, updatedPositions);

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
      // setMoveHistory([...moveHistory, newMove]);
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

  const handleMoveHistory = () => {
    const isGameEnded = checkForEndGame();

    if (isGameEnded === "checkmate" || isGameEnded === "stalemate") {
      return;
    }

    return moveHistory.map((move, index) => (
      <div key={nanoid()}>{move.san}</div>
    ));
  };

  return (
    <section className={`${screenVersion}-singlePlayerGame`}>
      {!player1Data || !player2Data ? forfeitNotify() : null}
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
      </div>

      <div className="singlePlayerGame-players-data">
        <div className="singlePlayerGame-playerOne-data square bg-secondary rounded-pill">
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
        <div className="singlePlayerGame-playerTwo-data square bg-secondary rounded-pill">
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
              color: "black",
            }}
          >
            {player2Data.username}
          </span>
        </div>
      </div>

      <div className="singleplayer-main-content-container">
        <div className="singlePlayerGame-chessboard-container">
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
        </div>

        {/* <div className="singlePlayerGame-chatBox-moveHistory-container rounded-5"> */}
        <div className="singlePlayerGame-moveHistory-container rounded-5">
          <h1 className="singlePlayer-history-title">History</h1>
          {handleMoveHistory()}
        </div>
        <div className="singlePlayerGame-chatBox-container rounded-5">
          <h1 className="singlePlayer-chatbox-title">ChatBox</h1>
          <h1>random text</h1>
          <h1>random text</h1>
          <h1>random text</h1>
          <h1>random text</h1>
          <h1>random text</h1>
          <h1>random text</h1>
          <h1>random text</h1>
          <h1>random text</h1>
          <h1>random text</h1>
          <h1>random text</h1>
        </div>
        {/* </div> */}

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
    </section>
  );
};

export default SinglePlayerGame;
