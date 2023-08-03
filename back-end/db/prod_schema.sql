\c world-wide-chess-main-db-045fd67346474fc11;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  profileimg TEXT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  theme TEXT DEFAULT 'default',
  chess_coins INT DEFAULT 100,
  wins INT DEFAULT 0,
  ties INT DEFAULT 0,
  loss INT DEFAULT 0,
  rating INT DEFAULT 1000,
  preferred_color TEXT,
  last_online TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS bots;
CREATE TABLE bots (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  profileimg TEXT,
  username TEXT UNIQUE NOT NULL,
  wins INT DEFAULT 0,
  ties INT DEFAULT 0,
  loss INT DEFAULT 0,
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
  current_positions TEXT
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
  current_positions TEXT
);

DROP TABLE IF EXISTS spectators;
CREATE TABLE spectators (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  spec_id INT REFERENCES users(id),
  multi_player_room_id INT REFERENCES single_player_games(id),
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
  item_price INT NOT NULL,
);

DROP TABLE IF EXISTS inventory;
CREATE TABLE inventory (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id),
  item_id TEXT REFERENCES shop(id),
);

DROP TABLE IF EXISTS facts;
CREATE TABLE facts (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  fact_num INT NOT NULL,
  fact TEXT NOT NULL
);