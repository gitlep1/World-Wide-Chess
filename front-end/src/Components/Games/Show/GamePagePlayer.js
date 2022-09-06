import "./GamePage.scss";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import axios from "axios";

const GamePage = ({ user, game }) => {
  const API = process.env.REACT_APP_API_URL;

  const chessboardRef = useRef();
  const [chessGame, setChessGame] = useState(new Chess());
  // const [winner, setWinner] = useState("");
  const [error, setError] = useState("");

  const safeGameMutate = (modify) => {
    setChessGame((g) => {
      const update = { ...g };
      modify(update);
      return update;
    });
  };

  function onDrop(sourceSquare, targetSquare) {
    const gameCopy = { ...chessGame };
    const move = gameCopy.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });
    setChessGame(gameCopy);
    if (move !== null) {
      updatePositions();
    }
    return move;
  }

  const updatePositions = () => {
    const updatedData = {
      player2ID: game.player2id,
      player1img: game.player1img,
      player2img: game.player2img,
      winner: null,
      inProgress: true,
      currentPositions: chessGame.fen(),
    };

    // axios.put(`${API}/games/${gameID}`, updatedData).then((res) => {
    //   // console.log(res.data.moves);
    //   // getChessMatch();
    // });
  };

  // const checkMoves = () => {
  //   console.log("the game: ", game);
  //   if (game === {} || game === undefined || game === null) {
  //     console.log("inside if", game);
  //     return chessGame.fen();
  //   } else {
  //     console.log("inside else", game);
  //     return game.moves[0];
  //   }
  // };

  return (
    <section className="gamePageSection">
      <div>
        <Chessboard
          id="PlayerVsPlayer"
          animationDuration={200}
          // position={moves > 0 ? game.moves[0] : chessGame.fen()}
          position={game.currentPositions}
          onPieceDrop={onDrop}
          ref={chessboardRef}
        />
      </div>
      <button
        className="rc-button"
        onClick={() => {
          safeGameMutate((game) => {
            chessGame.reset();
          });
          chessboardRef.current.clearPremoves();
        }}
      >
        reset
      </button>
      <div>
        {error && <p>{error}</p>}
        <h1>
          <img src={game.player1img} alt="player profile" />
          {game.player1}
        </h1>
        <p>VS</p>
        <h1>
          <img src={game.player2img} alt="player profile" />
          {game.player2}
        </h1>
      </div>
    </section>
  );
};

export default GamePage;
