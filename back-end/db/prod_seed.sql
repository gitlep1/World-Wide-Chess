\c dbdtebh87uhs8i;

INSERT INTO users (username, password, email, created_at) VALUES
('Easy Bot', 'o5b21e*F6Wan', 'easybot@bot.com', NOW()),
('Medium Bot', 'e%*m9ZW1ZZ64', 'mediumbot@bot.com', NOW()),
('Hard Bot', '30m5&Ce^Tnbb', 'hardbot@bot.com', NOW());

-- INSERT INTO games (player1ID, player2ID, in_progress, winner, moves) VALUES 
-- (1, 2, true, 'Easy Bot', '{
--   "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
--   "rnbqkbnr/pppppppp/8/8/8/7P/PPPPPPP1/RNBQKBNR b KQkq - 0 1",
--   "rnbqkbnr/1ppppppp/p7/8/8/7P/PPPPPPP1/RNBQKBNR w KQkq - 0 1"
--   }'),
-- (1, null, false, 'Medium Bot', '{
--   "n6k/2q1r3/3NP1P1/7p/p1Q1q3/6P1/1K4pp/n7 w - - 0 1",
--   "4b3/1k1P4/r4pP1/7K/2p2R1P/1Bb4p/p4p2/5Q2 w - - 0 1",
--   "1N2bn2/5pp1/2p2P1p/3k4/1q6/B3K1Q1/1Q5r/4R3 w - - 0 1"
--   }'),
-- (2, 3, true, 'Hard Bot', '{
--   "8/r1p1q1P1/p7/3rP2R/8/R2Q1K2/1P1qP2p/4k3 b - - 35 1",
--   "4n3/pQ5p/6PP/pB6/1P4k1/K1b4p/1P1p4/5r2 w - - 50 1",
--   "1N5n/2p3p1/4K1b1/6pp/p1pb3P/8/P3k1P1/R7 b - - 80 1"
--   }'),
-- (2, 3, true, 'Medium Bot', '{
--   "3k1K2/8/2p1p1Q1/RB2P2q/1Qq1r1p1/7R/5N2/B7 w - - 0 1",
--   "1K6/6p1/p1q5/1Q1QP2N/1r4q1/k4p2/2n1RP1p/8 w - - 0 1",
--   "K7/1rP3Q1/1R6/3PN3/Q3q3/pp4pB/1R6/r6k w - - 0 1"
--   }'),
-- (3, 1, true, 'Easy Bot', '{
--   "1nb1kbn1/ppp1pp1p/3p4/r2q3r/6p1/Q1PB2PP/PP1PPP11/RNB1K1NR b KQkq - 40 1",
--   "4k2n/p1p3p1/1B1P4/p4P2/8/K2R4/1nr2PP1/5N2 w - - 75 1",
--   "4r3/1PN5/3q1p2/6Rp/P2PPQ2/rk5B/1P6/1K6 b - - 85 1"
--   }'),
-- (3, null, false, 'Hard Bot', '{
--   "n7/p3N3/Rn2R3/4K1Qp/1kp4N/3P4/5P1P/3q4 w - - 0 1",
--   "7q/1pK5/3R4/p1pQPn2/8/2P3kp/q1p2NP1/8 w - - 0 1",
--   "8/P2N1B2/1p6/5kB1/5P1r/1q6/b2pQb2/3nRK2 w - - 0 1"
--   }');