const HardBot = (chessGame, setFen, maxDepth, setIsThinking) => {
  const evaluateBoard = (board) => {
    let score = 0;

    // Add up the scores for all pieces on the board
    board.forEach((row, rowIndex) => {
      row.forEach((piece, colIndex) => {
        if (piece) {
          // Add points for the piece's value
          score += getPieceValue(piece.type, piece.color);

          // Add or subtract points based on the piece's position
          if (piece.color === "w") {
            score += getPositionValue(piece.type, rowIndex, colIndex);
          } else {
            score -= getPositionValue(piece.type, rowIndex, colIndex);
          }
        }
      });
    });

    return score;
  };

  const getPieceValue = (pieceType, pieceColor) => {
    const pieceValues = {
      p: 1,
      n: 3,
      b: 3,
      r: 5,
      q: 9,
      k: 0,
    };

    const colorMultipliers = {
      w: 1,
      b: -1,
    };

    const pieceValue = pieceValues[pieceType];
    const colorMultiplier = colorMultipliers[pieceColor];

    return pieceValue * colorMultiplier;
  };

  const getPositionValue = (pieceType, row, col) => {
    const positionValues = {
      p: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [50, 50, 50, 50, 50, 50, 50, 50],
        [10, 10, 20, 30, 30, 20, 10, 10],
        [5, 5, 10, 25, 25, 10, 5, 5],
        [0, 0, 0, 20, 20, 0, 0, 0],
        [5, -5, -10, 0, 0, -10, -5, 5],
        [5, 10, 10, -20, -20, 10, 10, 5],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ],
      n: [
        [-50, -40, -30, -30, -30, -30, -40, -50],
        [-40, -20, 0, 5, 5, 0, -20, -40],
        [-30, 5, 10, 15, 15, 10, 5, -30],
        [-30, 0, 15, 20, 20, 15, 0, -30],
        [-30, 5, 15, 20, 20, 15, 5, -30],
        [-30, 0, 10, 15, 15, 10, 0, -30],
        [-40, -20, 0, 0, 0, 0, -20, -40],
        [-50, -40, -30, -30, -30, -30, -40, -50],
      ],
      b: [
        [-20, -10, -10, -10, -10, -10, -10, -20],
        [-10, 5, 0, 0, 0, 0, 5, -10],
        [-10, 10, 10, 10, 10, 10, 10, -10],
        [-10, 0, 10, 10, 10, 10, 0, -10],
        [-10, 5, 5, 10, 10, 5, 5, -10],
        [-10, 0, 5, 10, 10, 5, 0, -10],
        [-10, 0, 0, 0, 0, 0, 0, -10],
        [-20, -10, -10, -10, -10, -10, -10, -20],
      ],
      r: [
        [0, 0, 0, 5, 5, 0, 0, 0],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [-5, 0, 0, 0, 0, 0, 0, -5],
        [5, 10, 10, 10, 10, 10, 10, 5],
        [0, 0, 0, 0, 0, 0, 0, 0],
      ],
      q: [
        [-20, -10, -10, -5, -5, -10, -10, -20],
        [-10, 0, 0, 0, 0, 0, 0, -10],
        [-10, 5, 5, 5, 5, 5, 0, -10],
        [0, 0, 5, 10, 10, 5, 0, -10],
        [-5, 0, 5, 10, 10, 5, 0, -5],
        [-10, 0, 5, 5, 5, 5, 0, -10],
        [-10, 0, 0, 0, 0, 0, 0, -10],
        [-20, -10, -10, -5, -5, -10, -10, -20],
      ],
    };

    const pieceValues = {
      p: 1,
      n: 3,
      b: 3,
      r: 5,
      q: 9,
      k: 0,
    };

    const colorMultipliers = {
      w: 1,
      b: -1,
    };

    const pieceValue = pieceValues[pieceType];
    const colorMultiplier = colorMultipliers[row < 4 ? "w" : "b"];

    const positionValue = positionValues[pieceType]
      ? positionValues[pieceType][row][col]
      : 0;

    return pieceValue * colorMultiplier * positionValue;
  };

  const minimax = (depth, alpha, beta, isMaximizingPlayer) => {
    if (depth === 0 || chessGame.game_over()) {
      // Base case: if the depth is 0 or the game is over, evaluate the board and return a score
      return evaluateBoard(chessGame.board());
    }

    if (chessGame.in_checkmate()) {
      // If the current player is in checkmate, return -Infinity
      return -Infinity;
    }

    if (chessGame.in_stalemate()) {
      // If the game is in stalemate, return 0
      return 0;
    }

    if (isMaximizingPlayer) {
      let maxEval = -Infinity;
      let betaCutoff = false;
      // For each possible move, make the move on the game board, call minimax with the opposite player and a reduced depth, then undo the move
      const moves = chessGame.moves();

      for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        chessGame.move(move);
        const evalMax = minimax(depth - 1, alpha, beta, false);
        chessGame.undo();
        // Update the maxEval variable with the maximum evaluation found so far
        maxEval = Math.max(maxEval, evalMax);
        // Update the alpha variable with the maxEval value - this is used for alpha-beta pruning
        alpha = Math.max(alpha, evalMax);
        // If beta is less than or equal to alpha, a beta cutoff has occurred.
        if (beta <= alpha) {
          betaCutoff = true; // Set the flag variable to true
          break; // Exit the loop early
        }
      }

      if (betaCutoff) {
        return maxEval; // Exit the function early
      }
      // Return the maximum evaluation found
      return maxEval;
    } else {
      let minEval = Infinity;
      let alphaCutoff = false; // New flag variable for alpha cutoffs
      // Same as above, but with the opposite player and a minimum evaluation
      const moves = chessGame.moves();
      for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        chessGame.move(move);
        const evalMin = minimax(depth - 1, alpha, beta, true);
        chessGame.undo();
        minEval = Math.min(minEval, evalMin);
        beta = Math.min(beta, evalMin);
        if (beta <= alpha) {
          alphaCutoff = true; // Set the flag variable to true
          break; // Exit the loop early
        }
      }

      if (alphaCutoff) {
        return minEval; // Exit the function early
      }
      return minEval;
    }
  };

  const bestMove = () => {
    setIsThinking(true);

    let timeLimit = 3000; // Set a time limit of 3 seconds
    let startTime = Date.now();
    let bestMoveVar = null;
    let bestEval = -Infinity;
    let evalArray = [];

    for (let depth = 1; depth <= maxDepth; depth++) {
      let moves = chessGame.moves();

      for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        chessGame.move(move);
        const evalBestMove = minimax(depth, -Infinity, Infinity, false);
        chessGame.undo();

        evalArray.push(evalBestMove);
      }

      // keep in case something messes up \\
      // let evalMax = Math.max(...evalArray);

      let evalMaxIndex = Math.floor(Math.random() * evalArray.length);
      let evalMax = evalArray[evalMaxIndex];

      if (evalMax > bestEval) {
        bestEval = evalMax;
        bestMoveVar = moves[evalArray.indexOf(evalMax)];
        evalArray = [];
      }

      let timeElapsed = Date.now() - startTime;
      if (timeElapsed > timeLimit) {
        break; // Exit the loop if the time limit is reached
      }
    }

    chessGame.move(bestMoveVar);
    setFen(chessGame.fen());

    setIsThinking(false);
  };

  // Return a function that returns the function that makes the best move after a delay
  return () => {
    return () => {
      setTimeout(() => bestMove(), 500);
    };
  };
};

export default HardBot;
