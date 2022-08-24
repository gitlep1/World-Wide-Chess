DROP DATABASE IF EXISTS WorldWideChess;
CREATE DATABASE WorldWideChess;

\c WorldWideChess;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS gameBoard;
CREATE TABLE gameBoard (
  id SERIAL NOT NULL PRIMARY KEY,
  userID INT NOT NULL REFERENCES users(id),
  color TEXT
  moves JSONB
);

DROP TABLE IF EXISTS previousGames;
CREATE TABLE previousGames (
  id SERIAL NOT NULL PRIMARY KEY,
  gameID INT NOT NULL REFERENCES gameBoard(id),
  userID INT NOT NULL REFERENCES users(id),
  gameData JSONB
);