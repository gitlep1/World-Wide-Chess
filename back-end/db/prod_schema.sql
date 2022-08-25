\c dbdtebh87uhs8i;

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