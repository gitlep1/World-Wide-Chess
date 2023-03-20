const MediumBot = (chessGame, game, safeGameMutate) => {
  console.log("medium");
  const possibleMoves = chessGame.moves();

  if (chessGame.game_over() || possibleMoves.length === 0) {
    if (chessGame.turn() === "b") {
      alert(`${game.player1} won`);
    } else {
      alert(`${game.player2} won`);
    }
  }

  const randomIndex = Math.floor(Math.random() * possibleMoves.length);
  safeGameMutate((chessGame) => {
    chessGame.move(possibleMoves[randomIndex]);
  });
};

export default MediumBot;
