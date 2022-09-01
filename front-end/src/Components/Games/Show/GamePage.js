import "./GamePage.scss";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import axios from "axios";

const GamePage = ({ user }) => {
  const { gameID } = useParams();
  const API = process.env.REACT_APP_API_URL;
  const moves = [];

  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [game, setGame] = useState({});
  // const [moves, setMoves] = useState([]);
  const [chessGame, setChessGame] = useState(new Chess());
  // const [winner, setWinner] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getChessMatch();
    // updatePositions();

    const chessMatchInterval = setInterval(() => {
      getChessMatch();
      // updatePositions();
    }, 1000);

    return () => clearInterval(chessMatchInterval);
  }, []); // eslint-disable-line

  const getChessMatch = async () => {
    await axios
      .get(`${API}/games/${gameID}`)
      .then((res) => {
        setGame(res.data);
      })
      .catch((err) => {
        setError(err);
      });
  };

  const updatePositions = async (moves) => {
    const newMoves = {
      moves: [...moves],
    };

    await axios.put(`${API}/games/${gameID}`, newMoves).then((res) => {
      console.log(res.data);
    });
  };
  // updatePositions(moves);

  const makeAMove = (move) => {
    const gameCopy = { ...chessGame };
    const result = gameCopy.move(move);
    setChessGame(gameCopy);
    return result; // null if the move was illegal, the move object if the move was legal
  };

  const makeRandomMove = () => {
    const possibleMoves = chessGame.moves();
    if (
      chessGame.game_over() ||
      chessGame.in_draw() ||
      possibleMoves.length === 0
    )
      return; // exit if the chessGame is over
    const randomIndex = Math.floor(Math.random() * possibleMoves.length);
    makeAMove(possibleMoves[randomIndex]);
  };

  const onDrop = (sourceSquare, targetSquare) => {
    // console.log(chessGame.fen(sourceSquare), targetSquare);
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // always promote to a queen for example simplicity
    });

    if (move === null) {
      return false;
    }

    setTimeout(makeRandomMove, 200);
    return true;
  };

  return (
    <section className="gamePageSection">
      <div>
        {error && <p>{error}</p>}
        <h1>{game.player1}</h1>
        <p>VS</p>
        <h1>{game.player2}</h1>
      </div>
      <div>
        <Chessboard position={chessGame.fen()} onPieceDrop={onDrop} />
      </div>
    </section>
  );
};

export default GamePage;
