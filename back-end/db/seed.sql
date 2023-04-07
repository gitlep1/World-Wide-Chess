\c world_wide_chess;

INSERT INTO users (profileimg, username, password, email, theme, wins, ties, loss, preferred_color, last_online) VALUES
('https://i.imgur.com/8puTSd9.png', 'Easy Bot', 'o5b21e*F6Wan', 'easybot@bot.com', 'default', 1, 1, 1, 'black', NOW()),
('https://i.imgur.com/MmLQSDV.png', 'Medium Bot', 'e%*m9ZW1ZZ64', 'mediumbot@bot.com', 'default', 2, 2, 2, 'black', NOW()),
('https://i.imgur.com/ZlrcYvd.png', 'Hard Bot', '30m5&Ce^Tnbb', 'hardbot@bot.com', 'default', 3, 3, 3, 'black', NOW());

INSERT INTO games (room_name, room_password, player1id, player2id, player1color, player2color, in_progress, current_positions) VALUES 
('come fight me', null, 1, 2, 'white', 'black', true, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'),
('ima lose', null, 1, null, 'white', 'black', false, 'n6k/2q1r3/3NP1P1/7p/p1Q1q3/6P1/1K4pp/n7 b - - 0 1'),
('easy win', 'lol', 2, 3, 'black', 'white', true, '8/r1p1q1P1/p7/3rP2R/8/R2Q1K2/1P1qP2p/4k3 w - - 35 1'),
('pro', 'pro', 2, 3, 'black', 'white', true, '3k1K2/8/2p1p1Q1/RB2P2q/1Qq1r1p1/7R/5N2/B7 b - - 0 1'),
('g54ett4gtdr', null, 3, 1, 'white', 'black', true, '1nb1kbn1/ppp1pp1p/3p4/r2q3r/6p1/Q1PB2PP/PP1PPP11/RNB1K1NR w KQkq - 40 1'),
('how do i delete this', 'test', 3, null, 'black', 'white', false, 'n7/p3N3/Rn2R3/4K1Qp/1kp4N/3P4/5P1P/3q4 b - - 0 1');
