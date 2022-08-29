import "./App.scss";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    const data = window.localStorage.getItem("Current_User");
    const authenticated = window.localStorage.getItem("Authenticated");

    if (data !== null && authenticated !== null) {
      setUser(JSON.parse(data));
      setAuthenticated(JSON.parse(authenticated));
    }
  }, []);

  const handleSidebarOpen = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  const handleUser = (user) => {
    setUser(user);
    setAuthenticated(true);
    window.localStorage.setItem("Current_User", JSON.stringify(user));
    window.localStorage.setItem("Authenticated", JSON.stringify(true));
    navigate(`Games/Lobby`);
  };

  const handleLogout = () => {
    setUser({});
    setAuthenticated(false);
    const data = window.localStorage.getItem("Current_User");
    const authenticated = window.localStorage.getItem("Authenticated");

    if (data !== null && authenticated !== null) {
      window.localStorage.setItem("Current_User", JSON.stringify({}));
      window.localStorage.setItem("Authenticated", JSON.stringify(false));
    }
    navigate("/");
    handleSidebarOpen();
  };

  return (
    <section id="outer-container">
      <h1 id="worldWideChessHeader">WORLD WIDE CHESS</h1>
      <NavBar handleOpen={handleSidebarOpen} />
      <Sidebar
        pageWrapId={"page-wrap"}
        outerContainerId={"outer-container"}
        isOpen={isOpen}
        user={user}
        authenticated={authenticated}
        handleLogout={handleLogout}
        handleSidebarOpen={handleSidebarOpen}
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
            <Route
              path="Accounts/:userID"
              element={<AccountPage user={user} />}
            />
            <Route
              path="Accounts/:userID/Edit"
              element={<AccountDetails user={user} />}
            />
            <Route path="Games/Lobby" element={<Lobby user={user} />} />
            <Route path="Games/New" element={<NewGame user={user} />} />
            <Route path="Games/:gameID" element={<GamePage user={user} />} />
            <Route
              path="Games/:gameID/Edit"
              element={<GameSettings user={user} />}
            />
            <Route path="*" element={<FoF />} />
          </Route>
        </Routes>
      </main>
    </section>
  );
};

export default App;
