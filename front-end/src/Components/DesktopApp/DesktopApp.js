import "./DesktopApp.scss";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { scaleRotate as SidebarMenu } from "react-burger-menu";

// Page stuff \\
import Homepage from "./Homepage/Homepage";
import LeaderBoard from "./Leaderboard/LeaderBoard";
import Shop from "./Shop/Shop";

// Nav stuff \\
import NavBar from "./NavBar/NavBar";
import Sidebar from "./Sidebar/Sidebar";
import FoF from "./FourOFour/FoF";

// Account stuff \\
import AccountPage from "./Accounts/AccountPage/AccountPage";
import AccountSettings from "./Accounts/AccountSettings/AccountSettings";
import Inventory from "./Accounts/Inventory/Inventory";
import Signin from "../../Signin/SignIn";
import Signup from "../../Signup/SignUp";

// Game stuff \\
import Lobby from "./Games/Lobby/Lobby";
import GameSettings from "./Games/GameSettings/GameSettings";
import GamePage from "./Games/GamePage/GamePage";

const DesktopApp = ({
  handleSidebarOpen,
  user,
  users,
  authenticated,
  game,
  games,
  setGame,
  setGames,
  isOpen,
  openInventory,
  handleOpenInventory,
  handleUser,
  handleLogout,
  resize,
  socket,
  player1Data,
  player2Data,
  setPlayer1Data,
  setPlayer2Data,
}) => {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleClose = () => {
    if (showSignUp || showSignIn) {
      setShowSignUp(false);
      setShowSignIn(false);
    }
  };
  return (
    <section id="desktop-outer-container" className="desktop-main-parent">
      <SidebarMenu
        outerContainerId={"desktop-outer-container"}
        pageWrapId={"desktop-page-wrap"}
        isOpen={isOpen}
        onClose={handleSidebarOpen}
        customBurgerIcon={false}
        right
        width={resize}
        id="desktop-sidebarmenu"
      >
        <Sidebar
          user={user}
          authenticated={authenticated}
          handleLogout={handleLogout}
          handleSidebarOpen={handleSidebarOpen}
          handleOpenInventory={handleOpenInventory}
          setShowSignIn={setShowSignIn}
          setShowSignUp={setShowSignUp}
        />
      </SidebarMenu>

      <NavBar handleOpen={handleSidebarOpen} authenticated={authenticated} />

      <main id="desktop-page-wrap">
        <Routes>
          <Route path="/">
            {/* Account Routes */}
            <Route path="/" index element={<Homepage users={users} />} />
            <Route
              path="Accounts/:userID"
              element={<AccountPage user={user} />}
            />
            <Route
              path="Accounts/:userID/Settings"
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
            {/* Shop Route */}
            <Route path="Shop" element={<Shop />} />
            {/* FoF Route */}
            <Route path="*" element={<FoF />} />
          </Route>
        </Routes>
      </main>

      {openInventory ? (
        <Inventory
          openInventory={openInventory}
          handleOpenInventory={handleOpenInventory}
          user={user}
        />
      ) : null}

      {showSignIn ? (
        <Signin
          handleUser={handleUser}
          users={users}
          showSignIn={showSignIn}
          handleClose={handleClose}
        />
      ) : null}

      {showSignUp ? (
        <Signup
          handleUser={handleUser}
          users={users}
          showSignUp={showSignUp}
          handleClose={handleClose}
        />
      ) : null}
    </section>
  );
};

export default DesktopApp;
