DROP DATABASE IF EXISTS world_wide_chess;
CREATE DATABASE world_wide_chess;

\c world_wide_chess;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  profileimg TEXT,
  username TEXT UNIQUE NOT NULL,
  password TEXT,
  email TEXT UNIQUE,
  theme TEXT DEFAULT 'default',
  chess_coins INT DEFAULT 100,
  wins INT DEFAULT 0,
  ties INT DEFAULT 0,
  loss INT DEFAULT 0,
  rating INT DEFAULT 1000,
  preferred_color TEXT,
  is_guest BOOLEAN DEFAULT false,
  last_online TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS bots;
CREATE TABLE bots (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  profileimg TEXT,
  username TEXT UNIQUE NOT NULL,
  wins INT DEFAULT 0,
  ties INT DEFAULT 0,
  loss INT DEFAULT 0
);

DROP TABLE IF EXISTS single_player_games;
CREATE TABLE single_player_games (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  room_name TEXT NOT NULL,
  room_password TEXT,
  player_id INT NOT NULL REFERENCES users(id),
  bot_id INT REFERENCES bots(id) DEFAULT 1,
  player_color TEXT,
  bot_color TEXT,
  in_progress BOOLEAN DEFAULT false,
  current_positions TEXT,
  game_time TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS multi_player_games;
CREATE TABLE multi_player_games (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  room_name TEXT NOT NULL,
  room_password TEXT,
  player1id INT NOT NULL REFERENCES users(id),
  player2id INT REFERENCES users(id) DEFAULT NULL,
  player1color TEXT,
  player2color TEXT,
  in_progress BOOLEAN DEFAULT false,
  current_positions TEXT,
  game_time TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS spectators;
CREATE TABLE spectators (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  spec_id INT REFERENCES users(id),
  single_player_room_id INT REFERENCES single_player_games(id),
  multi_player_room_id INT REFERENCES multi_player_games(id)
);

DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  message TEXT
);

DROP TABLE IF EXISTS shop;
CREATE TABLE shop (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  item_img TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_price INT NOT NULL
);

DROP TABLE IF EXISTS user_inventory;
CREATE TABLE user_inventory (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  item_id INT REFERENCES shop(id)
);

DROP TABLE IF EXISTS guest_inventory;
CREATE TABLE guest_inventory (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  item_id INT REFERENCES shop(id)
);

DROP TABLE IF EXISTS facts;
CREATE TABLE facts (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  fact_num INT NOT NULL,
  fact TEXT NOT NULL
);