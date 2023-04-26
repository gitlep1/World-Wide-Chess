import "./App.scss";
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { scaleRotate as SidebarMenu } from "react-burger-menu";
import io from "socket.io-client";

// Page stuff \\
import LandingPage from "./Components/LandingPage/LandingPage";
import Homepage from "./Components/Homepage/Homepage";
import LeaderBoard from "./Components/Leaderboard/LeaderBoard";

// Nav stuff \\
import NavBar from "./Components/NavBar/NavBar";
import Sidebar from "./Components/Sidebar/Sidebar";
import FoF from "./Components/FourOFour/FoF";

// Account stuff \\
import Accounts from "./Components/Accounts/Index/Accounts";
import AccountPage from "./Components/Accounts/Show/AccountPage";
import AccountDetails from "./Components/Accounts/Edit/AccountDetails";

// Game stuff \\
import Lobby from "./Components/Games/Index/Lobby";
import GameSettings from "./Components/Games/Edit/GameSettings";
import GamePage from "./Components/Games/Show/GamePage";

// Custom function stuff \\
import GetApi from "./CustomFunctions/GetApi";

const API = process.env.REACT_APP_API_URL;
const socket = io(API);

const App = () => {
  const navigate = useNavigate();
  const [getData, cancelRequests] = GetApi();

  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [resize, setResize] = useState("");

  useEffect(() => {
    setLocalStorage();

    const intervalFunctions = setInterval(() => {
      resizeSidebar();
    });

    return () => clearInterval(intervalFunctions);
  }, []);

  // const getGamesAndUsers = async () => {
  //   await getData(`${API}/games`, setGames);
  //   await getData(`${API}/users`, setUsers);

  //   return cancelRequests;
  // };

  useEffect(() => {
    socket.emit("visit");

    socket.on("users", (users) => {
      setUsers(users);
    });

    socket.on("user", (updatedUser) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
    });

    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });

    return () => {
      socket.off("users");
      socket.off("user");
      socket.off("error");
    };
  }, []);

  const setLocalStorage = async () => {
    const data = window.localStorage.getItem("Current_User");
    const authenticated = window.localStorage.getItem("Authenticated");

    if (data !== null && authenticated !== null) {
      setUser(JSON.parse(data));
      setAuthenticated(JSON.parse(authenticated));
    }
  };

  const resizeSidebar = () => {
    if (window.innerWidth > 1000) {
      setResize("20%");
    }
    if (window.innerWidth <= 1000) {
      setResize("25%");
    }
    if (window.innerWidth <= 800) {
      setResize("35%");
    }
    if (window.innerWidth <= 600) {
      setResize("45%");
    }
    if (window.innerWidth <= 400) {
      setResize("60%");
    }
  };

  const handleSidebarOpen = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  const handleUser = (user) => {
    if (user) {
      setUser(user);
      setAuthenticated(true);
      window.localStorage.setItem("Current_User", JSON.stringify(user));
      window.localStorage.setItem("Authenticated", JSON.stringify(true));
      navigate(`/`);
    } else {
      return null;
    }
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

  const handleRefresh = async () => {
    getData(`${API}/games`, setGames);
    return cancelRequests;
  };

  return user && authenticated ? (
    <section id="outer-container" className="mainParent">
      <NavBar handleOpen={handleSidebarOpen} authenticated={authenticated} />
      <SidebarMenu
        pageWrapId={"page-wrap"}
        outerContainerId={"outer-container"}
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

      <main id="page-wrap">
        <Routes>
          <Route path="/">
            {/* Account Routes */}
            <Route path="/" index element={<Homepage users={users} />} />
            <Route
              path="Accounts"
              element={<Accounts user={user} users={users} />}
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
            {/* Game Routes */}
            <Route
              path="Lobby"
              element={
                <Lobby
                  user={user}
                  users={users}
                  games={games}
                  handleRefresh={handleRefresh}
                />
              }
            />
            <Route
              path="Room/:gameID/Settings"
              element={
                <GameSettings user={user} games={games} socket={socket} />
              }
            />
            <Route
              path="Room/:gameID"
              element={
                <GamePage
                  user={user}
                  users={users}
                  games={games}
                  socket={socket}
                />
              }
            />
            {/* LeaderBoard Route */}
            <Route
              path="Leaderboard"
              element={<LeaderBoard user={user} users={users} />}
            />
            <Route path="*" element={<FoF />} />
          </Route>
        </Routes>
      </main>
    </section>
  ) : (
    <LandingPage handleUser={handleUser} users={users} />
  );
};

export default App;
