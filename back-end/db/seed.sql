\c world_wide_chess;

INSERT INTO users (profileimg, username, password, email, theme, chess_coins, wins, ties, loss, rating, preferred_color, is_guest, last_online) VALUES
('https://www.randomlists.com/img/animals/tiger.webp', 'test1', 'test1', 'test1@test.com', 'default', 5000, 3, 2, 1, 1050, 'w', false, NOW()),
('https://brianrushwriter.files.wordpress.com/2014/11/27566315_s.jpg', 'test2', 'test', 'test2@test.com', 'light', 3000, 3, 2, 5, 1000, 'b', false, NOW()),
('https://i.natgeofe.com/k/02444b59-a50d-48e6-939b-4db10f895e66/5-reasons-eagle_4x3.jpg', 'test3', 'test3', 'test3@test.com', 'dark', 2000, 5, 5, 5, 0, 'w', false, NOW());

INSERT INTO bots (profileimg, username, wins, ties, loss) VALUES 
('https://i.imgur.com/8puTSd9.png', 'Easy Bot', 10, 1, 1),
('https://i.imgur.com/MmLQSDV.png', 'Medium Bot', 50, 2, 2),
('https://i.imgur.com/ZlrcYvd.png', 'Hard Bot', 100, 3, 3);

INSERT INTO games (room_name, room_password, botId, player1id, player2id, player1color, player2color, botColor, current_positions, allow_specs, in_progress, is_multiplayer, game_time) VALUES
('come watch', null, 1, '56fe4069-616e-4351-9a85-c720521dcfea', null, 'w', null, 'b', 'rnbqkbnr/pp1ppppp/8/2p5/8/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0', false, true, false, 100000),
('lol noobs', 'noobs', null, '12ab1853-81aa-4d05-9873-7b2a71f89755', null, 'b', null, null, 'rnbqkbnr/pp2pppp/3p4/8/3P4/8/PPP2PPP/RNBQKBNR w KQkq - 0', false, false, true, 200000),
('easy game', 'hard game', 3, '1c7651a4-7f15-4a18-adf5-8de319a74940', null, 'w', null, 'b', '2kr3r/ppp1bppp/3q1n2/3p4/2PP4/2N2N2/PP2QPPP/R1B1K2R w KQ - 0', true, true, false, 300000),
('the best', null, null, '56fe4069-616e-4351-9a85-c720521dcfea', '1c7651a4-7f15-4a18-adf5-8de319a74940', 'w', 'b', null, 'r1bqkbnr/ppp1pppp/2n5/3p4/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0', true, true, true, 400000);

INSERT INTO spectators (spec_id, games_id) VALUES
('56fe4069-616e-4351-9a85-c720521dcfea', 1),
('12ab1853-81aa-4d05-9873-7b2a71f89755', 2),
('1c7651a4-7f15-4a18-adf5-8de319a74940', 3);

INSERT INTO messages (user_id, username, profileimg, message) VALUES
('56fe4069-616e-4351-9a85-c720521dcfea', 'test1', 'https://www.randomlists.com/img/animals/tiger.webp', 'hello'),
('12ab1853-81aa-4d05-9873-7b2a71f89755', 'test2', 'https://brianrushwriter.files.wordpress.com/2014/11/27566315_s.jpg', 'noooobs'),
('1c7651a4-7f15-4a18-adf5-8de319a74940', 'test3', 'https://i.natgeofe.com/k/02444b59-a50d-48e6-939b-4db10f895e66/5-reasons-eagle_4x3.jpg', 'lol');

INSERT INTO shop (item_img, item_name, item_price) VALUES
('https://picsum.photos/150/150', 'Dragon Border', 1000),
('https://picsum.photos/151/151', 'Knight Border', 800),
('https://picsum.photos/152/152', 'Bishop Border', 750),
('https://picsum.photos/153/153', 'Castle Border', 900),
('https://picsum.photos/154/154', 'Pawn Border', 500),
('https://picsum.photos/155/155', 'Marble Piece Set', 1500),
('https://picsum.photos/156/156', 'Wooden Piece Set', 1000),
('https://picsum.photos/157/157', 'Glass Piece Set', 1200),
('https://picsum.photos/158/158', 'Metal Piece Set', 1300),
('https://picsum.photos/159/159', 'Classic Board Style', 500),
('https://picsum.photos/160/160', 'Modern Board Style', 700),
('https://picsum.photos/161/161', 'Futuristic Board Style', 900),
('https://picsum.photos/162/162', 'Dark Theme', 300),
('https://picsum.photos/163/163', 'Light Theme', 400),
('https://picsum.photos/164/164', 'Rainbow Chat Effects', 2000),
('https://picsum.photos/165/165', 'Monochronic Chat Effects', 4000);

INSERT INTO guest_inventory (guest_id, item_id, item_img, item_name) VALUES
('12f6756d-50ae-4370-b06c-1757549f3469', 5, 'https://picsum.photos/154/154', 'Pawn Border'), ('12f6756d-50ae-4370-b06c-1757549f3469', 8, 'https://picsum.photos/157/157', 'Glass Piece Set'), ('12f6756d-50ae-4370-b06c-1757549f3469', 11, 'https://picsum.photos/160/160', 'Modern Board Style');

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