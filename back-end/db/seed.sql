\c world_wide_chess;

INSERT INTO users (profileimg, username, password, email, theme, chess_coins, wins, ties, loss, rating, preferred_color, is_guest, last_online) VALUES
('https://www.randomlists.com/img/animals/tiger.webp', 'test1', 'test1', 'test1@test.com', 'default', 100, 3, 2, 1, 1050, 'white', false, NOW()),
('https://brianrushwriter.files.wordpress.com/2014/11/27566315_s.jpg', 'test2', 'test', 'test2@test.com', 'light', 300, 3, 2, 5, 1000, 'black', false, NOW()),
('https://i.natgeofe.com/k/02444b59-a50d-48e6-939b-4db10f895e66/5-reasons-eagle_4x3.jpg', 'test3', 'test3', 'test3@test.com', 'dark', 500, 5, 5, 5, 0, 'white', false, NOW());

INSERT INTO bots (profileimg, username, wins, ties, loss) VALUES 
('https://i.imgur.com/8puTSd9.png', 'Easy Bot', 10, 1, 1),
('https://i.imgur.com/MmLQSDV.png', 'Medium Bot', 50, 2, 2),
('https://i.imgur.com/ZlrcYvd.png', 'Hard Bot', 100, 3, 3);

INSERT INTO single_player_games (room_name, room_password, player_id, bot_id, player_color, bot_color, in_progress, current_positions, game_time) VALUES
('Game 1', null, 1, 1, 'white', 'black', true, 'rnbqkbnr/pp1ppppp/8/2p5/8/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 4', CURRENT_TIMESTAMP - (RANDOM() * 60 * 60 * 24 * 30)::INT * '1 second'::INTERVAL),
('Game 2', null, 2, 1, 'black', 'white', false, 'rnbqkbnr/pppp1ppp/8/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3', CURRENT_TIMESTAMP - (RANDOM() * 60 * 60 * 24 * 30)::INT * '1 second'::INTERVAL),
('Game 3', null, 3, 1, 'white', 'black', true, 'rnb1kbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', CURRENT_TIMESTAMP - (RANDOM() * 60 * 60 * 24 * 30)::INT * '1 second'::INTERVAL);

INSERT INTO multi_player_games (room_name, room_password, player1id, player2id, player1color, player2color, in_progress, current_positions, game_time) VALUES 
('Game 1', null, 1, 2, 'white', 'black', true, 'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 4', CURRENT_TIMESTAMP - (RANDOM() * 60 * 60 * 24 * 30)::INT * '1 second'::INTERVAL);

INSERT INTO spectators (spec_id, single_player_room_id, multi_player_room_id) VALUES
(1, 1, null),
(2, null, 1),
(3, 1, null);

INSERT INTO messages (user_id, username, profileimg, message) VALUES
(1, 'test1', 'https://www.randomlists.com/img/animals/tiger.webp', 'hello'),
(2, 'test2', 'https://brianrushwriter.files.wordpress.com/2014/11/27566315_s.jpg', 'noooobs'),
(3, 'test3', 'https://i.natgeofe.com/k/02444b59-a50d-48e6-939b-4db10f895e66/5-reasons-eagle_4x3.jpg', 'lol');

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

INSERT INTO guest_inventory (item_id) VALUES
(5), (8), (11);

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