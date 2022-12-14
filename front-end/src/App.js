import "./App.scss";
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { MDBFooter } from "mdb-react-ui-kit";
import axios from "axios";

import NavBar from "./Components/NavBar/NavBar";
import Sidebar from "./Components/Sidebar/Sidebar";
import FoF from "./Components/FourOFour/FoF";

import Home from "./Pages/Home";

import Accounts from "./Pages/Accounts/Index";
import AccountPage from "./Pages/Accounts/Show";
import AccountDetails from "./Pages/Accounts/Edit";
import Signup from "./Pages/Accounts/New";
import Signin from "./Pages/Accounts/Signin";

import Lobby from "./Pages/Games/Index";
import GameSettings from "./Pages/Games/Edit";
// import NewGame from "./Pages/Games/New";
import GamePage from "./Pages/Games/Show";

const App = () => {
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const data = window.localStorage.getItem("Current_User");
    const authenticated = window.localStorage.getItem("Authenticated");

    if (data !== null && authenticated !== null) {
      setUser(JSON.parse(data));
      setAuthenticated(JSON.parse(authenticated));
    }

    getGames();
    getUsers();

    const gameAndUsersInterval = setInterval(() => {
      getGames();
      getUsers();
    }, 1000);

    return () => clearInterval(gameAndUsersInterval);
  }, []); // eslint-disable-line

  const getGames = async () => {
    await axios.get(`${API}/games`).then((res) => {
      setGames(res.data);
    });
  };

  const getUsers = async () => {
    await axios.get(`${API}/users`).then((res) => {
      setUsers(res.data);
    });
  };

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
    setIsOpen(false);
  };

  return (
    <section id="outer-container">
      <h1 id="worldWideChessHeader">WORLD WIDE CHESS</h1>
      <NavBar handleOpen={handleSidebarOpen} authenticated={authenticated} />
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
            <Route
              path="Accounts"
              element={<Accounts user={user} users={users} />}
            />
            <Route
              path="Accounts/Signup"
              element={<Signup handleUser={handleUser} users={users} />}
            />
            <Route
              path="Accounts/Signin"
              element={<Signin handleUser={handleUser} users={users} />}
            />
            <Route
              path="Accounts/:userID"
              element={<AccountPage user={user} />}
            />
            <Route
              path="Accounts/:userID/Edit"
              element={
                <AccountDetails
                  user={user}
                  users={users}
                  handleUser={handleUser}
                  handleLogout={handleLogout}
                />
              }
            />
            <Route
              path="Games/Lobby"
              element={<Lobby user={user} games={games} />}
            />
            {/* <Route path="Games/New" element={<NewGame user={user} />} /> */}
            <Route path="Games/:gameID" element={<GamePage user={user} />} />
            <Route
              path="Games/:gameID/Edit"
              element={<GameSettings user={user} />}
            />
            <Route path="*" element={<FoF />} />
          </Route>
        </Routes>
      </main>

      <MDBFooter id="footer">
        <div
          className="text-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
        >
          ??World Wide Chess Copyright:{" "}
          <a
            className="text-reset fw-bold"
            href="https://github.com/gitlep1"
            rel="nooppener noreferrer"
            target="_blank"
          >
            gitlep1
          </a>
        </div>
      </MDBFooter>
    </section>
  );
};

export default App;
