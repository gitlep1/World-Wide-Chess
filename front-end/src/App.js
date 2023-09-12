import "./App.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

// App stuff \\
import DesktopApp from "./Components/DesktopApp/DesktopApp";
import MobileApp from "./Components/MobileApp/MobileApp";

// Page stuff \\
import LandingPage from "./Components/LandingPage/LandingPage";

// Custom function stuff \\
import DetectScreenSize from "./CustomFunctions/DetectScreenSize";

const API = process.env.REACT_APP_API_URL;
const socket = io(API);

const App = () => {
  const navigate = useNavigate();
  const [screenSize, setScreenSize] = useState(0);

  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [game, setGame] = useState({});
  const [games, setGames] = useState([]);
  const [player1Data, setPlayer1Data] = useState({});
  const [player2Data, setPlayer2Data] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [openInventory, setOpenInventory] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [resize, setResize] = useState("");
  const [userError, setUserError] = useState("");
  const [gameError, setGameError] = useState("");

  useEffect(() => {
    setLocalStorage();
    setScreenSize(DetectScreenSize().width);

    const handleResize = () => {
      resizeSidebar();
      setScreenSize(DetectScreenSize().width);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    socket.emit("users-update-all-clients");
    socket.emit("games-update-all-clients");

    socket.on("users", (users) => {
      setUsers(users);
    });

    socket.on("games", (games) => {
      console.log(games);
      setGames(games);
    });

    socket.on("users-update-all-clients-error", (error) => {
      setUserError(error);
    });

    socket.on("games-update-all-clients-error", (error) => {
      setGameError(error);
    });

    return () => {
      socket.off("users");
      socket.off("users-update-all-clients-error");
      socket.off("games");
      socket.off("games-update-all-clients-error");
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

  const handleOpenInventory = () => {
    setOpenInventory((prev) => !prev);
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

  return user && authenticated ? (
    screenSize >= 800 ? (
      <>
        <DesktopApp
          handleSidebarOpen={handleSidebarOpen}
          user={user}
          users={users}
          authenticated={authenticated}
          game={game}
          games={games}
          setGame={setGame}
          setGames={setGames}
          isOpen={isOpen}
          openInventory={openInventory}
          handleOpenInventory={handleOpenInventory}
          handleUser={handleUser}
          handleLogout={handleLogout}
          resize={resize}
          socket={socket}
          player1Data={player1Data}
          player2Data={player2Data}
          setPlayer1Data={setPlayer1Data}
          setPlayer2Data={setPlayer2Data}
        />
      </>
    ) : (
      <>
        <MobileApp
          handleSidebarOpen={handleSidebarOpen}
          user={user}
          users={users}
          authenticated={authenticated}
          game={game}
          games={games}
          setGame={setGame}
          setGames={setGames}
          isOpen={isOpen}
          openInventory={openInventory}
          handleOpenInventory={handleOpenInventory}
          handleUser={handleUser}
          handleLogout={handleLogout}
          resize={resize}
          socket={socket}
          player1Data={player1Data}
          player2Data={player2Data}
          setPlayer1Data={setPlayer1Data}
          setPlayer2Data={setPlayer2Data}
        />
      </>
    )
  ) : (
    <LandingPage handleUser={handleUser} users={users} />
  );
};

export default App;
