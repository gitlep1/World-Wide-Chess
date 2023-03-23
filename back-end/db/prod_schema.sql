\c world-wide-chess-main-db-045fd67346474fc11;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  profileImg TEXT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  theme TEXT DEFAULT null,
  preferred_color TEXT DEFAULT null
  created_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS games;
CREATE TABLE games (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  player1ID INT NOT NULL REFERENCES users(id),
  player2ID INT REFERENCES users(id) DEFAULT NULL,
  player1Color TEXT DEFAULT white
  player2Color TEXT DEFAULT black
  in_progress BOOLEAN DEFAULT false,
  currentPositions TEXT
);