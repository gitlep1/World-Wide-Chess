import "./App.scss";
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import NavBar from "./Components/NavBar/NavBar";
import Sidebar from "./Components/Sidebar/Sidebar";
import FoF from "./Components/FourOFour/FoF";

import Home from "./Pages/Home";

import Account from "./Pages/Accounts/Index";
import AccountPage from "./Pages/Accounts/Show";
import AccountDetails from "./Pages/Accounts/Edit";
import Signup from "./Pages/Accounts/New";
import Signin from "./Pages/Accounts/Signin";

import Lobby from "./Pages/Games/Index";
import GameSettings from "./Pages/Games/Edit";
import NewGame from "./Pages/Games/New";
import GamePage from "./Pages/Games/Show";

const App = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({});
  const [authenticated, setAuthenticated] = useState(false);

  const handleSidebarOpen = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  const handleUser = (user) => {
    setUser(user);
    setAuthenticated(true);
    navigate(`Games/Lobby`);
  };

  const handleLogout = () => {
    setUser({});
    setAuthenticated(false);
    navigate("/");
  };

  return (
    <section id="outer-container">
      <h1 id="worldWideChessHeader">WORLD WIDE CHESS</h1>
      <NavBar handleOpen={handleSidebarOpen} />
      <Sidebar
        pageWrapId={"page-wrap"}
        outerContainerId={"outer-container"}
        isOpen={isOpen}
        authenticated={authenticated}
        user={user}
        handleLogout={handleLogout}
      />

      <main id="page-wrap">
        <Routes>
          <Route path="/">
            <Route path="/" index element={<Home />} />
            <Route path="Accounts" element={<Account />} />
            <Route
              path="Accounts/Signup"
              element={<Signup handleUser={handleUser} />}
            />
            <Route
              path="Accounts/Signin"
              element={<Signin handleUser={handleUser} />}
            />
            <Route path="Accounts/:userID" element={<AccountPage />} />
            <Route path="Accounts/:userID/Edit" element={<AccountDetails />} />
            <Route path="Games/Lobby" element={<Lobby />} />
            <Route path="Games/New" element={<NewGame />} />
            <Route path="Games/:gameID" element={<GamePage />} />
            <Route path="Games/:gameID/Edit" element={<GameSettings />} />
            <Route path="*" element={<FoF />} />
          </Route>
        </Routes>
      </main>
    </section>
  );
};

export default App;
