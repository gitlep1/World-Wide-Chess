import "./MobileApp.scss";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { bubble as SidebarMenu } from "react-burger-menu";
import io from "socket.io-client";
import Cookies from "js-cookie";

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
import Signin from "./Accounts/Signin/Signin";
import Signup from "./Accounts/Signup/Signup";
import Signout from "./Accounts/Signout/Signout";

// Game stuff \\
import Lobby from "./Games/Lobby/Lobby";
import GameSettings from "./Games/GameSettings/GameSettings";
import GamePage from "./Games/GamePage/GamePage";

// Chat stuff \\
import ChatBox from "./ChatBox/ChatBox";

// const API = process.env.REACT_APP_API_URL;
// const socket = io(API, {
//   auth: {
//     token: JSON.parse(Cookies.get("token")),
//   },
// });

const MobileApp = ({
  handleSidebarOpen,
  user,
  authenticated,
  token,
  isOpen,
  openInventory,
  handleOpenInventory,
  handleUser,
  handleLogout,
  resize,
  socket,
}) => {
  const screenVersion = "mobile";

  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignout, setShowSignout] = useState(false);
  const [game, setGame] = useState({});
  const [player1Data, setPlayer1Data] = useState({});
  const [player2Data, setPlayer2Data] = useState({});

  const handleClose = () => {
    if (showSignUp || showSignIn || showSignout) {
      setShowSignUp(false);
      setShowSignIn(false);
      setShowSignout(false);
    }
  };

  return (
    <section id="mobile-outer-container" className="mobile-main-parent">
      <SidebarMenu
        outerContainerId={"mobile-outer-container"}
        pageWrapId={"mobile-page-wrap"}
        isOpen={isOpen}
        onClose={handleSidebarOpen}
        customBurgerIcon={false}
        right
        width={resize}
        id="mobile-sidebarmenu"
      >
        <Sidebar
          screenVersion={screenVersion}
          user={user}
          authenticated={authenticated}
          token={token}
          handleLogout={handleLogout}
          handleSidebarOpen={handleSidebarOpen}
          openInventory={openInventory}
          handleOpenInventory={handleOpenInventory}
          setShowSignIn={setShowSignIn}
          setShowSignUp={setShowSignUp}
          setShowSignout={setShowSignout}
        />
      </SidebarMenu>

      <NavBar
        screenVersion={screenVersion}
        handleOpen={handleSidebarOpen}
        authenticated={authenticated}
      />

      <main id="mobile-page-wrap">
        <Routes>
          <Route path="/">
            {/* Account Routes */}
            <Route
              path="/"
              index
              element={
                <Homepage
                  screenVersion={screenVersion}
                  user={user}
                  authenticated={authenticated}
                  token={token}
                />
              }
            />
            <Route
              path="Accounts/:userID"
              element={
                <AccountPage
                  screenVersion={screenVersion}
                  user={user}
                  authenticated={authenticated}
                  token={token}
                />
              }
            />
            <Route
              path="Accounts/:userID/Edit"
              element={
                <AccountSettings
                  screenVersion={screenVersion}
                  user={user}
                  authenticated={authenticated}
                  token={token}
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
                  screenVersion={screenVersion}
                  user={user}
                  isMultiplayer={isMultiplayer}
                  setIsMultiplayer={setIsMultiplayer}
                  authenticated={authenticated}
                  token={token}
                  socket={socket}
                />
              }
            />
            <Route
              path="Room/:gameID/Settings"
              element={
                <GameSettings
                  screenVersion={screenVersion}
                  user={user}
                  authenticated={authenticated}
                  token={token}
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
            <Route
              path="Room/:gameID"
              element={
                <GamePage
                  screenVersion={screenVersion}
                  user={user}
                  authenticated={authenticated}
                  token={token}
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
                <LeaderBoard
                  screenVersion={screenVersion}
                  user={user}
                  authenticated={authenticated}
                  token={token}
                  socket={socket}
                />
              }
            />
            {/* Shop Route */}
            <Route
              path="Shop"
              element={
                <Shop
                  screenVersion={screenVersion}
                  user={user}
                  authenticated={authenticated}
                  token={token}
                />
              }
            />
            {/* FoF Route */}
            <Route
              path="*"
              element={<FoF screenVersion={screenVersion} user={user} />}
            />
          </Route>
        </Routes>

        <ChatBox token={token} socket={socket} user={user} />
      </main>

      {openInventory ? (
        <Inventory
          screenVersion={screenVersion}
          openInventory={openInventory}
          handleOpenInventory={handleOpenInventory}
          user={user}
          authenticated={authenticated}
          token={token}
        />
      ) : null}

      {showSignIn ? (
        <Signin
          screenVersion={screenVersion}
          handleUser={handleUser}
          showSignIn={showSignIn}
          handleClose={handleClose}
        />
      ) : null}

      {showSignUp ? (
        <Signup
          screenVersion={screenVersion}
          handleUser={handleUser}
          showSignUp={showSignUp}
          handleClose={handleClose}
        />
      ) : null}

      {showSignout ? (
        <Signout
          screenVersion={screenVersion}
          handleLogout={handleLogout}
          showSignout={showSignout}
          handleClose={handleClose}
        />
      ) : null}
    </section>
  );
};

export default MobileApp;
