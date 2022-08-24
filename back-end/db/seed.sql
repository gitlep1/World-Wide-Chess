\c WorldWideChess

INSERT INTO users (username, password, email, created_at) VALUES
('test1', 'test1', 'test1@test.com', NOW()),
('test2', 'test2', 'test2@test.com', NOW()),
('test3', 'test3', 'test3@test.com', NOW());

INSERT INTO gameBoard (userID, color moves) VALUES
('1', 'black', '[
  {
    "bp1": "a6",
    "bp2": "b5",
    "bp3": "c6",
    "bb1": "b7"
  }
]')

INSERT INTO gameBoard (userID, color moves) VALUES
('1', 'white', '[
  {
    "wp1": "a3",
    "wp2": "b3",
    "wp3": "c6",
    "wb1": "b2"
  }
]')

INSERT INTO previousGames (gameID, userID, gameData) VALUES
('1', '1', '[
  {
    "bp1": "a6",
    "bp2": "b5",
    "bp3": "c6",
    "bb1": "b7",
    "wp1": "a3",
    "wp2": "b3",
    "wp3": "c6",
    "wb1": "b2"
  }
]')