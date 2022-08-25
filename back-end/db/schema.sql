DROP DATABASE IF EXISTS world_wide_chess;
CREATE DATABASE world_wide_chess;

\c world_wide_chess;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS games;
CREATE TABLE games (
  id SERIAL NOT NULL PRIMARY KEY,
  userID INT NOT NULL REFERENCES users(id),
  opponentID INT NOT NULL REFERENCES users(id),
  winner TEXT REFERENCES users(username) DEFAULT NULL,
  moves TEXT[] DEFAULT array[]::TEXT[]
);

DROP TABLE IF EXISTS previous_games;
CREATE TABLE previous_games (
  id SERIAL NOT NULL PRIMARY KEY,
  userID INT NOT NULL REFERENCES users(id),
  gameID INT NOT NULL REFERENCES games(id),
  winner TEXT NOT NULL REFERENCES users(username),
  moves TEXT NOT NULL REFERENCES games(moves)
);