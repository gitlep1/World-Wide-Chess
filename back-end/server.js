const app = require("./app.js");

require("dotenv").config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Playing chess on port ${PORT} 
  ♜ ♞ ♝ ♛ ♚ ♝ ♞ ♜
  ⬜️⬛️⬜️⬛️⬜️⬛️⬜️⬛️
  ♟ ♟ ♟ ♟ ♟ ♟ ♟ ♟
  ⬛️⬜️⬛️⬜️⬛️⬜️⬛️⬜️
  ⬜️⬛️⬜️⬛️⬜️⬛️⬜️⬛️
  ♙ ♙ ♙ ♙ ♙ ♙ ♙ ♙
  ⬛️⬜️⬛️⬜️⬛️⬜️⬛️⬜️
  ♖ ♘ ♗ ♔ ♕ ♗ ♘ ♖
  `);
});
