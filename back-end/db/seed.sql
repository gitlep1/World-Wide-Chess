\c world_wide_chess;

INSERT INTO users (profileimg, username, password, email, theme, chess_coins, wins, ties, loss, rating, preferred_color, is_guest, is_bot, last_online) VALUES
('https://i.imgur.com/8puTSd9.png', 'Easy Bot', 'o5b21e*F6Wan', 'easybot@bot.com', 'default', 10, 1, 1, 1, 950, 'black', false, true, NOW()),
('https://i.imgur.com/MmLQSDV.png', 'Medium Bot', 'e%*m9ZW1ZZ64', 'mediumbot@bot.com', 'default', 50, 2, 2, 2, 1200, 'white', false, true, NOW()),
('https://i.imgur.com/ZlrcYvd.png', 'Hard Bot', '30m5&Ce^Tnbb', 'hardbot@bot.com', 'default', 100, 3, 3, 3, 2000,'black', false, true, NOW()),
('https://www.randomlists.com/img/animals/tiger.webp', 'test1', 'test1', 'test1@test.com', 'dark', 100, 3, 2, 1, 1050, 'white', false, false, NOW());

INSERT INTO games (room_name, room_password, player1id, player2id, player1color, player2color, in_progress, current_positions) VALUES 
('come fight me', null, 1, 2, 'white', 'black', true, 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'),
('ima lose', null, 1, null, 'white', 'black', false, 'n6k/2q1r3/3NP1P1/7p/p1Q1q3/6P1/1K4pp/n7 b - - 0 1'),
('easy win', 'lol', 2, 3, 'black', 'white', true, '8/r1p1q1P1/p7/3rP2R/8/R2Q1K2/1P1qP2p/4k3 w - - 35 1'),
('pro', 'pro', 2, 3, 'black', 'white', true, '3k1K2/8/2p1p1Q1/RB2P2q/1Qq1r1p1/7R/5N2/B7 b - - 0 1'),
('g54ett4gtdr', null, 3, 1, 'white', 'black', true, '1nb1kbn1/ppp1pp1p/3p4/r2q3r/6p1/Q1PB2PP/PP1PPP11/RNB1K1NR w KQkq - 40 1'),
('how do i delete this', 'test', 3, null, 'black', 'white', false, 'n7/p3N3/Rn2R3/4K1Qp/1kp4N/3P4/5P1P/3q4 b - - 0 1');

INSERT INTO spectators (spec_id, room_id) VALUES
(1, 1),
(2, 1),
(3, 1);

INSERT INTO messages (user_id, message) VALUES
(1, 'hello'),
(2, 'noooobs'),
(3, 'lol');

INSERT INTO shop (item_img, item_name, item_price) VALUES
('https://picsum.photos/150/150', 'Dragon Border', 1000),
('https://picsum.photos/150/150', 'Knight Border', 800),
('https://picsum.photos/150/150', 'Bishop Border', 750),
('https://picsum.photos/150/150', 'Castle Border', 900),
('https://picsum.photos/150/150', 'Pawn Border', 500),
('https://picsum.photos/150/150', 'Marble Piece Set', 1500),
('https://picsum.photos/150/150', 'Wooden Piece Set', 1000),
('https://picsum.photos/150/150', 'Glass Piece Set', 1200),
('https://picsum.photos/150/150', 'Metal Piece Set', 1300),
('https://picsum.photos/150/150', 'Classic Board Style', 500),
('https://picsum.photos/150/150', 'Modern Board Style', 700),
('https://picsum.photos/150/150', 'Futuristic Board Style', 900),
('https://picsum.photos/150/150', 'Dark Theme', 300),
('https://picsum.photos/150/150', 'Light Theme', 400),
('https://picsum.photos/150/150', 'Rainbow Chat Effects', 2000),
('https://picsum.photos/150/150', 'Monochronic Chat Effects', 4000);

INSERT INTO inventory (user_id,  item_id) VALUES
(1, 3), (1, 8), (1, 11),
(2, 2), (2, 6), (2, 12),
(3, 4), (3, 7), (3, 15),
(4, 1), (4, 9), (4, 14);

INSERT INTO facts (fact_num, fact) VALUES
(1, 'Legend has it that chess was invented around 200 B. C. by a commander, Hán Xin, who invented the game as a battle simulator. Soon after winning the battle, the game was forgotten, but it resurfaced in the 7th century.'),
(2, 'Chess is a required school subject in Armenia.'),
(3, 'The longest official game of chess took place in 1989 that went on for 20 hours and included 269 moves. It ended in a draw.'),
(4, 'In a single game of chess, there are 400 possible moves after each move played.'),
(5, 'The oldest recorded chess game was played in 1475 between Leonardo da Cutri and Francesco di Castellvi.'),
(6, 'The word "checkmate" comes from the Persian phrase "shah mat," meaning "the king is dead."'),
(7, 'The first chess club in the world was formed in London in 1844.'),
(8, 'The Chess Olympiad, which began in 1924, is the largest international team event in the world, with more than 150 participating countries.'),
(9, 'In 2002, a chess game was played between Russian cosmonauts and US astronaut Greg Chamitoff, who played the game remotely from space.'),
(10, 'In 1997, world chess champion Garry Kasparov played a six-game chess match against IBM''s Deep Blue computer. In the final game, Kasparov lost to a move that he later called "the most beautiful move of chess ever played" - and which was chosen by the computer randomly!');