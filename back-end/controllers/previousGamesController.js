const express = require("express");
const games = express.Router();

const {
  getAllPreviousGames,
  getPreviousGamesByID,
  // createPreviousGames,
  // updatePreviousGames,
  deletePreviousGames,
} = require("../queries/previousGames");

const { requireAuth } = require("../validation/requireAuth");

games.get("/:userID", requireAuth(), async (req, res) => {
  const { userID } = req.params;

  const userPreviousGames = await getAllPreviousGames(userID);
  if (userPreviousGames) {
    console.log("=== GET games", userPreviousGames, "===");
    res.status(200).json({ payload: userPreviousGames });
  } else {
    res.status(404).send("No chess games found.");
  }
});

games.get("/:userID/:id", requireAuth(), async (req, res) => {
  const { userID, id } = req.params;
  const previousGame = await getPreviousGamesByID(userID, id);

  if (previousGame.length > 0) {
    console.log("=== GET game", previousGame, "===");
    res.status(200).json({ payload: previousGame[0] });
  } else {
    res.status(404).send(`Cannot get chess game with ID: ${id}`);
  }
});

// games.post("/:userID", async (req, res) => {
//   const { userID } = req.params;
//   const newPreviousGame = {
//     userID: req.body.userID,
//     opponentID: req.body.opponentID,
//     winner: req.body.winner,
//     moves: req.body.moves,
//   };

//   const newGame = await createPreviousGames(
//     userID,
//     newPreviousGame.userID,
//     newPreviousGame.opponentID,
//     newPreviousGame.winner,
//     newPreviousGame.moves
//   );

//   if (newGame) {
//     console.log("=== CREATE game", newGame, "===");
//     res.status(200).json(newGame);
//   } else {
//     res.status(404).send("Cannot create a new game.");
//   }
// });

// games.put("/:userID/:id", async (req, res) => {
//   const { id } = req.params;
//   const updatePreviousGame = {
//     userID: req.body.userID,
//     opponentID: req.body.opponentID,
//     winner: req.body.winner,
//     moves: req.body.moves,
//   };

//   const updateGame = await updatePreviousGames(
//     id,
//     updatePreviousGame.userID,
//     updatePreviousGame.moves
//   );

//   if (updateGame) {
//     console.log("=== UPDATE game", updateGame, "===");
//     res.status(200).json(updateGame);
//   } else {
//     res.status(404).send("Couldn't update game.");
//   }
// });

games.delete("/:userID/:id", requireAuth(), async (req, res) => {
  const { userID, id } = req.params;
  const deletePreviousGame = await deletePreviousGames(userID, id);

  if (deletePreviousGame.id) {
    res.status(200).json({ payload: deletePreviousGame });
  } else {
    res.status(404).send(`Game with the ID: ${id} could not be deleted.`);
  }
});

module.exports = games;
