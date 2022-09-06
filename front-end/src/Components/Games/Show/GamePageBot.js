import { useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";

const PlayVsBot = ({ user, game }) => {
  const chessboardRef = useRef();
  const [chessGame, setChessGame] = useState(new Chess());
  const [arrows, setArrows] = useState([]);
  const [boardOrientation, setBoardOrientation] = useState("white");
  const [currentTimeout, setCurrentTimeout] = useState(undefined);

  function safeGameMutate(modify) {
    setChessGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  }

  function makeRandomMove() {
    const possibleMoves = chessGame.moves();

    if (
      chessGame.game_over() ||
      chessGame.in_draw() ||
      possibleMoves.length === 0
    )
      return;

    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    safeGameMutate((chessGame) => {
      chessGame.move(possibleMoves[randomIndex]);
    });
  }

  function onDrop(sourceSquare, targetSquare) {
    const gameCopy = { ...chessGame };
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });
    setChessGame(gameCopy);

    // illegal move
    if (move === null) {
      return false;
    }

    // store timeout so it can be cleared on undo/reset so computer doesn't execute move
    const newTimeout = setTimeout(makeRandomMove, 200);
    setCurrentTimeout(newTimeout);
    return true;
  }

  return (
    <div>
      <Chessboard
        id="PlayVsRandom"
        animationDuration={200}
        boardOrientation={boardOrientation}
        customArrows={arrows}
        position={chessGame.fen()}
        onPieceDrop={onDrop}
        customBoardStyle={{
          borderRadius: "4px",
          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.5)",
        }}
        ref={chessboardRef}
      />
      <button
        className="rc-button"
        onClick={() => {
          safeGameMutate((chessGame) => {
            chessGame.reset();
          });
          // stop any current timeouts
          clearTimeout(currentTimeout);
        }}
      >
        reset
      </button>
      <button
        className="rc-button"
        onClick={() => {
          setBoardOrientation((currentOrientation) =>
            currentOrientation === "white" ? "black" : "white"
          );
        }}
      >
        flip board
      </button>
      <button
        className="rc-button"
        onClick={() => {
          safeGameMutate((chessGame) => {
            chessGame.undo();
          });
          // stop any current timeouts
          clearTimeout(currentTimeout);
        }}
      >
        undo
      </button>
      <button
        className="rc-button"
        onClick={() => {
          setArrows([
            ["a3", "a5"],
            ["g1", "f3"],
          ]);
        }}
      >
        Set Custom Arrows
      </button>
    </div>
  );
};

export default PlayVsBot;
