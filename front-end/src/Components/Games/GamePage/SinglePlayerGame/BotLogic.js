const BotLogic = (
  chessGame,
  maxDepth,
  setIsThinking,
  botMoveHistory,
  setBotMoveHistory,
  setBotMoveData
) => {
  const transpositionTable = {};
  const currentPositions = chessGame.fen();

  const evaluateBoard = (board) => {
    let score = 0;

    for (let i = 0; i < board.length; i++) {
      const row = board[i];
      for (let j = 0; j < row.length; j++) {
        const piece = row[j];
        if (piece) {
          const pieceValue = getPieceValue(piece.type, piece.color);
          score += pieceValue;
          if (piece.color === "w") {
            score += getPositionValue(piece.type, i, j);
          } else {
            score -= getPositionValue(piece.type, i, j);
          }
        }
      }
    }

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

  const minimax = (board, depth, alpha, beta, maximizingPlayer) => {
    const key = JSON.stringify(board);

    if (transpositionTable[key] !== undefined) {
      return transpositionTable[key];
    }

    if (depth === 0 || chessGame.game_over()) {
      // Base case: if the depth is 0 or the game is over, evaluate the board and return a score
      return evaluateBoard(board);
    }

    if (chessGame.in_checkmate()) {
      // If the current player is in checkmate, return -Infinity
      return -Infinity;
    }

    if (chessGame.in_stalemate()) {
      // If the game is in stalemate, return 0
      return 0;
    }

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      // For each possible move, make the move on the game board, call minimax with the opposite player and a reduced depth, then undo the move
      const moves = chessGame.moves();

      for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        chessGame.move(move);
        const evalMax = minimax(board, depth - 1, alpha, beta, false);
        chessGame.undo();
        // Update the maxEval variable with the maximum evaluation found so far
        maxEval = Math.max(maxEval, evalMax);
        // Update the alpha variable with the maxEval value - this is used for alpha-beta pruning
        alpha = Math.max(alpha, evalMax);
        // If beta is less than or equal to alpha, a beta cutoff has occurred.
        if (beta <= alpha) {
          break; // Exit the loop early
        }
      }

      transpositionTable[key] = maxEval;

      // Return the maximum evaluation found
      return maxEval;
    } else {
      let minEval = Infinity;
      // Same as above, but with the opposite player and a minimum evaluation
      const moves = chessGame.moves();
      for (let i = 0; i < moves.length; i++) {
        const move = moves[i];
        chessGame.move(move);
        const evalMin = minimax(board, depth - 1, alpha, beta, true);
        chessGame.undo();
        minEval = Math.min(minEval, evalMin);
        beta = Math.min(beta, evalMin);
        if (beta <= alpha) {
          break; // Exit the loop early
        }
      }

      transpositionTable[key] = minEval;

      return minEval;
    }
  };

  const bestMove = () => {
    setIsThinking(true);

    let timeLimit = 3000;
    let startTime = Date.now();
    let bestMoveVar = null;
    let bestEval = -Infinity;
    let timerCount = 0;

    const evaluateAndSelectMove = () => {
      timerCount += 1000;

      for (let d = 1; d <= maxDepth; d++) {
        let evalArray = [];
        let moves = chessGame.moves({ verbose: true });

        for (let i = 0; i < moves.length; i++) {
          const move = moves[i];

          chessGame.move(move);
          const evalBestMove = minimax(
            chessGame.board(),
            d,
            -Infinity,
            Infinity,
            false
          );

          chessGame.undo();
          evalArray.push(evalBestMove);
        }

        let evalMax = Math.max(...evalArray);

        if (evalMax > bestEval) {
          bestEval = evalMax;
          bestMoveVar = moves[evalArray.indexOf(evalMax)];
        }
      }

      return bestMoveVar;
    };

    while (timerCount <= timeLimit) {
      timerCount += 1000;

      if (timerCount >= timeLimit) {
        break;
      }

      evaluateAndSelectMove();
    }

    const result = chessGame.move(bestMoveVar);

    const botMoveObj = {
      current_positions: currentPositions,
      from: bestMoveVar.from,
      to: bestMoveVar.to,
      piece: `b${bestMoveVar.piece.toUpperCase()}`,
    };

    // if (result.color === "w") {
    //   return;
    // }

    setBotMoveData(botMoveObj);
    setBotMoveHistory([...botMoveHistory, botMoveObj]);
    setIsThinking(false);

    // console.log({ result });
    return result;
  };

  return (callback) => {
    setTimeout(() => {
      const result = bestMove();
      callback(result);
    }, 500);
  };
};

export default BotLogic;
