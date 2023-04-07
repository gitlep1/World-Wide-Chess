import { Chess } from "chess.js";

const HardBot = (chessGame, setFen, depth) => {
  // console.log("inside hardbot func");

  const makeMove = (game, move) => {
    // console.log("inside makeMove function");

    game.move(move);
    return game.fen();
  };

  const generateMoves = (game) => {
    // console.log("inside generateMoves function");

    const moves = game.moves();
    return moves.map((move) => makeMove(new Chess(game.fen()), move));
  };

  const evaluate = (fen) => {
    // console.log("evaluate function");

    const game = new Chess(fen);
    let score = 0;
    const pieceValues = {
      p: 1,
      n: 3,
      b: 3,
      r: 5,
      q: 9,
      k: 0,
    };

    // Loop through all the pieces on the board
    game.SQUARES.forEach((square) => {
      const piece = game.get(square);

      // If there is no piece on the square, move on to the next one
      if (piece === null) {
        return;
      }

      // Get the value of the piece based on its type
      const value = pieceValues[piece.type];

      // If the piece belongs to the AI player, add its value to the score
      if (piece.color === game.turn()) {
        score += value;
      } else {
        // If the piece belongs to the human player, subtract its value from the score
        score -= value;
      }
    });

    return score;
  };

  const generateTree = (fen, depth) => {
    // console.log("generating tree");

    const game = new Chess(fen);
    if (depth === 0 || game.game_over()) {
      return { fen, score: evaluate(fen) };
    }
    const moves = generateMoves(game);
    const children = moves.map((fen) => generateTree(fen, depth - 1));
    return {
      fen,
      children,
      score:
        depth % 2 === 0
          ? Math.max(...children.map((child) => child.score))
          : Math.min(...children.map((child) => child.score)),
    };
  };

  const minimax = (tree, depth, isMaximizingPlayer) => {
    // console.log("minimax function");

    if (depth === 0 || tree.children.length === 0) {
      return tree.score;
    }
    if (isMaximizingPlayer) {
      let bestScore = -Infinity;
      for (const child of tree.children) {
        const score = minimax(child, depth - 1, false);
        bestScore = Math.max(bestScore, score);
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (const child of tree.children) {
        const score = minimax(child, depth - 1, true);
        bestScore = Math.min(bestScore, score);
      }
      return bestScore;
    }
  };

  const chooseMove = (fen) => {
    // console.log("chooseMove function");

    const tree = generateTree(fen, depth);
    let bestScore = -Infinity;
    let bestMove;
    for (const child of tree.children) {
      const score = minimax(child, depth - 1, false);
      if (score > bestScore) {
        bestScore = score;
        bestMove = child.fen;
      }
    }
    return bestMove;
  };

  const game = new Chess(chessGame);
  const move = chooseMove(chessGame);
  const newFen = makeMove(game, move);
  // console.log("new fen: ", newFen);
  // setFen(newFen);
};

export default HardBot;
