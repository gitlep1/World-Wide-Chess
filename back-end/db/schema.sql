DROP DATABASE IF EXISTS world_wide_chess;
CREATE DATABASE world_wide_chess;

\c world_wide_chess;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  profileimg TEXT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  theme TEXT DEFAULT null,
  chess_coins INT DEFAULT 0,
  wins INT DEFAULT 0,
  ties INT DEFAULT 0,
  loss INT DEFAULT 0,
  preferred_color TEXT DEFAULT null,
  last_online TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS games;
CREATE TABLE games (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  room_name TEXT NOT NULL,
  room_password TEXT,
  player1id INT NOT NULL REFERENCES users(id),
  player2id INT REFERENCES users(id) DEFAULT NULL,
  player1color TEXT,
  player2color TEXT,
  in_progress BOOLEAN DEFAULT false,
  current_positions TEXT
);

DROP TABLE IF EXISTS spectators;
CREATE TABLE spectators (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  spec_id INT REFERENCES users(id),
  room_id INT REFERENCES games(id)
);

DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  message TEXT
);

DROP TABLE IF EXISTS facts;
CREATE TABLE facts (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  fact_num INT,
  fact TEXT
);
