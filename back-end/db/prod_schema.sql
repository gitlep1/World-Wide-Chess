\c dbdtebh87uhs8i;

DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id SERIAL UNIQUE NOT NULL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

DROP TABLE IF EXISTS games;
CREATE TABLE games (
  id SERIAL UNIQUE NOT NULL PRIMARY KEY,
  player1ID INT NOT NULL REFERENCES users(id),
  player2ID INT REFERENCES users(id) DEFAULT NULL,
  in_progress BOOLEAN DEFAULT false,
  winner TEXT REFERENCES users(username) DEFAULT NULL,
  moves TEXT[] DEFAULT array[]::TEXT[]
);