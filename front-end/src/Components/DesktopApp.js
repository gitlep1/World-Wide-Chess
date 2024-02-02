import "./DesktopApp.scss";
import { useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { pushRotate as SidebarMenu } from "react-burger-menu";
import { GiHamburgerMenu } from "react-icons/gi";
import io from "socket.io-client";
import Cookies from "js-cookie";

// Page stuff \\
import Homepage from "./Homepage/Homepage";
import LeaderBoard from "./Leaderboard/LeaderBoard";
import Shop from "./Shop/Shop";

// Nav stuff \\
import Navbar from "./Navbar/Navb";
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

// add socket token checking later idea 2 \\

// const API = process.env.REACT_APP_API_URL;
// const socket = io(API, {
//   auth: {
//     token: JSON.parse(Cookies.get("token")),
//   },
// });

const DesktopApp = ({
  handleSidebarOpen,
  user,
  setUser,
  token,
  isOpen,
  openInventory,
  handleOpenInventory,
  handleUser,
  handleLogout,
  resize,
  setResize,
  socket,
}) => {
  const screenVersion = "desktop";

  const [isMultiplayer, setIsMultiplayer] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignout, setShowSignout] = useState(false);
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
    <section id="desktop-outer-container" className="desktop-main-parent">
      <SidebarMenu
        outerContainerId={"desktop-outer-container"}
        pageWrapId={"desktop-page-wrap"}
        isOpen={isOpen}
        onClose={handleSidebarOpen}
        customBurgerIcon={false}
        left
        width={resize}
        id="desktop-sidebarmenu"
      >
        <Sidebar
          screenVersion={screenVersion}
          user={user}
          token={token}
          handleSidebarOpen={handleSidebarOpen}
          handleOpenInventory={handleOpenInventory}
          setShowSignIn={setShowSignIn}
          setShowSignUp={setShowSignUp}
          setShowSignout={setShowSignout}
        />
      </SidebarMenu>

      <main id="desktop-page-wrap">
        <Navbar
          screenVersion={screenVersion}
          handleSidebarOpen={handleSidebarOpen}
        />

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
                  token={token}
                />
              }
            />
            <Route
              path="Account"
              element={
                <AccountPage
                  screenVersion={screenVersion}
                  user={user}
                  token={token}
                />
              }
            />
            <Route
              path="Accounts/Settings"
              element={
                <AccountSettings
                  screenVersion={screenVersion}
                  user={user}
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
                  token={token}
                  socket={socket}
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
                  token={token}
                  socket={socket}
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
                  setUser={setUser}
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

export default DesktopApp;
