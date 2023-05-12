import "./MobileApp.scss";
import { Routes, Route } from "react-router-dom";
import { bubble as SidebarMenu } from "react-burger-menu";

// Page stuff \\
import Homepage from "./Homepage/Homepage";
import LeaderBoard from "./Leaderboard/LeaderBoard";

// Nav stuff \\
import NavBar from "./NavBar/NavBar";
import Sidebar from "./Sidebar/Sidebar";
import FoF from "./FourOFour/FoF";

// Account stuff \\
import AccountPage from "./Accounts/AccountPage/AccountPage";
import AccountSettings from "./Accounts/AccountSettings/AccountSettings";

// Game stuff \\
import Lobby from "./Games/Lobby/Lobby";
import GameSettings from "./Games/GameSettings/GameSettings";
import GamePage from "./Games/GamePage/GamePage";

const MobileApp = ({
  handleSidebarOpen,
  user,
  users,
  authenticated,
  game,
  games,
  setGame,
  setGames,
  isOpen,
  handleUser,
  handleLogout,
  resize,
  socket,
  player1Data,
  player2Data,
  setPlayer1Data,
  setPlayer2Data,
}) => {
  return (
    <section id="mobile-outer-container" className="mobile-main-parent">
      <NavBar handleOpen={handleSidebarOpen} authenticated={authenticated} />
      <SidebarMenu
        pageWrapId={"mobile-page-wrap"}
        outerContainerId={"mobile-outer-container"}
        isOpen={isOpen}
        onClose={handleSidebarOpen}
        customBurgerIcon={false}
        right
        width={resize}
      >
        <Sidebar
          user={user}
          authenticated={authenticated}
          handleLogout={handleLogout}
          handleSidebarOpen={handleSidebarOpen}
        />
      </SidebarMenu>

      <main id="mobile-page-wrap">
        <Routes>
          <Route path="/">
            {/* Account Routes */}
            <Route path="/" index element={<Homepage users={users} />} />
            <Route
              path="Accounts/:userID"
              element={<AccountPage user={user} />}
            />
            <Route
              path="Accounts/:userID/Edit"
              element={
                <AccountSettings
                  user={user}
                  users={users}
                  handleUser={handleUser}
                  handleLogout={handleLogout}
                />
              }
            />
            {/* Game Routes */}
            <Route
              path="Lobby"
              element={
                <Lobby
                  user={user}
                  users={users}
                  games={games}
                  socket={socket}
                  setGames={setGames}
                />
              }
            />
            <Route
              path="Room/:gameID/Settings"
              element={
                <GameSettings
                  user={user}
                  socket={socket}
                  game={game}
                  setGame={setGame}
                  setPlayer1Data={setPlayer1Data}
                  setPlayer2Data={setPlayer2Data}
                />
              }
            />
            <Route
              path="Room/:gameID"
              element={
                <GamePage
                  user={user}
                  users={users}
                  socket={socket}
                  game={game}
                  setGame={setGame}
                  player1Data={player1Data}
                  player2Data={player2Data}
                  setPlayer1Data={setPlayer1Data}
                  setPlayer2Data={setPlayer2Data}
                />
              }
            />
            {/* LeaderBoard Route */}
            <Route
              path="Leaderboard"
              element={
                <LeaderBoard user={user} users={users} socket={socket} />
              }
            />
            <Route path="*" element={<FoF />} />
          </Route>
        </Routes>
      </main>
    </section>
  );
};

export default MobileApp;
