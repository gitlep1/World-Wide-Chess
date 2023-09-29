DROP DATABASE IF EXISTS world_wide_chess;
CREATE DATABASE world_wide_chess;

\c world_wide_chess;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
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

DROP TABLE IF EXISTS games;
CREATE TABLE games (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  room_name TEXT NOT NULL,
  room_password TEXT,
  botId INT REFERENCES bots(id) DEFAULT NULL,
  player1id UUID NOT NULL REFERENCES users(id),
  player2id UUID REFERENCES users(id) DEFAULT NULL,
  player1color TEXT DEFAULT 'w',
  player2color TEXT DEFAULT 'b',
  botColor TEXT DEFAULT 'b',
  current_positions TEXT,
  allow_specs BOOLEAN DEFAULT false,
  in_progress BOOLEAN DEFAULT false,
  is_multiplayer BOOLEAN DEFAULT false,
  game_time INT DEFAULT 0
);

DROP TABLE IF EXISTS spectators;
CREATE TABLE spectators (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  spec_id UUID REFERENCES users(id),
  games_id INT REFERENCES games(id)
);

DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  username TEXT NOT NULL REFERENCES users(username),
  profileimg TEXT NOT NULL,
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
  user_id UUID NOT NULL REFERENCES users(id),
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