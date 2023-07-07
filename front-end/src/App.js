import "./App.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import io from "socket.io-client";
import axios from "axios";

// App stuff \\
import DesktopApp from "./Components/DesktopApp";
import MobileApp from "./Components/MobileApp";

// Page stuff \\
// import LandingPage from "./Components/LandingPage/LandingPage";

// Custom function stuff \\
import DetectScreenSize from "./CustomFunctions/DetectScreenSize";

import DefaultProfImg from "./Images/DefaultProfImg.png";

const API = process.env.REACT_APP_API_URL;
const socket = io(API);

const App = () => {
  const navigate = useNavigate();
  const [screenSize, setScreenSize] = useState(0);
  const userData = window.localStorage.getItem("Current_User");
  const authenticatedData = window.localStorage.getItem("Authenticated");

  const [user, setUser] = useState({});
  const [game, setGame] = useState({});
  const [games, setGames] = useState([]);
  const [player1Data, setPlayer1Data] = useState({});
  const [player2Data, setPlayer2Data] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [openInventory, setOpenInventory] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [resize, setResize] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
  }, []); // eslint-disable-line

  useEffect(() => {
    socket.emit("games-update-all-clients");

    socket.on("games", (games) => {
      setGames(games);
    });

    socket.on("games-update-all-clients-error", (error) => {
      setGameError(error);
    });

    return () => {
      socket.off("games");
      socket.off("games-update-all-clients-error");
    };
  }, []);

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

  const setLocalStorage = async () => {
    if (userData !== null && authenticatedData !== null) {
      setUser(JSON.parse(userData));
      setAuthenticated(JSON.parse(authenticatedData));
    } else {
      await handleGuest();
    }
    setLoading(false);
  };

  const handleUser = async (user) => {
    let token = JSON.parse(window.localStorage.getItem("Current_User")).token;
    await axios
      .delete(`${API}/guests/delete`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        if (user) {
          setUser(user);
          setAuthenticated(true);
          window.localStorage.setItem("Current_User", JSON.stringify(user));
          window.localStorage.setItem("Authenticated", JSON.stringify(true));
          navigate(`/`);
        } else {
          return null;
        }
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  const handleGuest = async () => {
    const newGuest = {
      profileimg: DefaultProfImg,
      username: `Guest-${nanoid(5)}`,
      is_guest: true,
    };
    return axios
      .post(`${API}/guests/signup`, newGuest)
      .then((res) => {
        setUser(res.data);
        setAuthenticated(true);
        window.localStorage.setItem("Current_User", JSON.stringify(res.data));
        window.localStorage.setItem("Authenticated", JSON.stringify(true));
        navigate(`/`);
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  const handleLogout = async () => {
    setUser({});
    setAuthenticated(false);

    if (userData !== null && authenticatedData !== null) {
      window.localStorage.removeItem("Current_User");
      window.localStorage.removeItem("Authenticated");
      await setLocalStorage();
    }
    setIsOpen(false);
    window.location.reload();
  };

  return screenSize >= 800 ? (
    <>
      <DesktopApp
        handleSidebarOpen={handleSidebarOpen}
        user={user}
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
        loading={loading}
      />
    </>
  ) : (
    <>
      <MobileApp
        handleSidebarOpen={handleSidebarOpen}
        user={user}
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
        loading={loading}
      />
    </>
  );
};

export default App;
