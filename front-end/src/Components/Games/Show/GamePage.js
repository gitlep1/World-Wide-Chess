import "./GamePage.scss";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import axios from "axios";

const GamePage = ({ user }) => {
  const { gameID } = useParams();
  const API = process.env.REACT_APP_API_URL;
  let game = {};

  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [moves, setMoves] = useState([]);
  // const [chessGame, setChessGame] = useState(new Chess());
  // const [winner, setWinner] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getChessMatch();

    const interval = setInterval(() => {
      getChessMatch();
    }, 1000);

    return () => clearInterval(interval);
  }, []); // eslint-disable-line

  const getChessMatch = async () => {
    await axios.get(`${API}/games/${gameID}`).then((res) => {
      game = res.data;
    });
    getUsers();
  };

  const getUsers = async () => {
    await axios.get(`${API}/users/${game.player1id}`).then((res) => {
      setPlayer1(res.data[0].username);
    });

    await axios.get(`${API}/users/${game.player2id}`).then((res) => {
      setPlayer2(res.data[0].username);
    });
  };

  // const updatePositions = async (moves) => {
  //   const newMoves = {
  //     moves: moves,
  //   };

  //   await axios.put(`${API}/games/${gameID}`, newMoves).then((res) => {
  //     // setMoves.push(res)
  //   });
  // };
  // updatePositions(moves);

  // const makeAMove = (move) => {
  //   const gameCopy = { ...chessGame };
  //   const result = gameCopy.move(move);
  //   setChessGame(gameCopy);
  //   return result; // null if the move was illegal, the move object if the move was legal
  // };

  // const makeRandomMove = () => {
  //   const possibleMoves = chessGame.moves();
  //   if (
  //     chessGame.game_over() ||
  //     chessGame.in_draw() ||
  //     possibleMoves.length === 0
  //   )
  //     return; // exit if the chessGame is over
  //   const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  //   makeAMove(possibleMoves[randomIndex]);
  // };

  // const onDrop = (sourceSquare, targetSquare) => {
  //   // console.log(chessGame.fen(sourceSquare), targetSquare);
  //   const move = makeAMove({
  //     from: sourceSquare,
  //     to: targetSquare,
  //     promotion: "q", // always promote to a queen for example simplicity
  //   });

  //   if (move === null) return false;

  //   setTimeout(makeRandomMove, 200);
  //   return true;
  // };

  return (
    <section className="gamePageSection">
      <div>
        <h1>{player1}</h1>
        <p>VS</p>
        <h1>{player2}</h1>
      </div>
      <div>
        {/* <Chessboard position={chessGame.fen()} onPieceDrop={onDrop} /> */}
      </div>
    </section>
  );
};

export default GamePage;
