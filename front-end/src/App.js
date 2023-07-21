import "./App.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import io from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";

// App components \\
import DesktopApp from "./Components/DesktopApp";
import MobileApp from "./Components/MobileApp";

// Page components \\
// import LandingPage from "./Components/LandingPage/LandingPage";

// Custom functions \\
import DetectScreenSize from "./CustomFunctions/DetectScreenSize";

import DefaultProfImg from "./Images/DefaultProfImg.png";

const API = process.env.REACT_APP_API_URL;
const socket = io(API);

const App = () => {
  const navigate = useNavigate();
  const [screenSize, setScreenSize] = useState(0);
  const userData = Cookies.get("Current_User") || null;
  const authenticatedData = Cookies.get("Authenticated") || null;
  const token = JSON.parse(Cookies.get("Current_User")).token || null;

  const [user, setUser] = useState({});
  // const [game, setGame] = useState({});
  // const [games, setGames] = useState([]);
  // const [player1Data, setPlayer1Data] = useState({});
  // const [player2Data, setPlayer2Data] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [openInventory, setOpenInventory] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [resize, setResize] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    checkCookies();
  }, []); // eslint-disable-line

  useEffect(() => {
    const resizeSidebarInterval = setInterval(() => {
      resizeSidebar();
      setScreenSize(DetectScreenSize().width);
    }, 500);

    return () => {
      clearInterval(resizeSidebarInterval);
    };
  }, []); // eslint-disable-line

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

  const checkCookies = async () => {
    if (userData && authenticatedData) {
      setUser(JSON.parse(userData));
      setAuthenticated(JSON.parse(authenticatedData));
    } else {
      await handleGuest();
    }
    setLoading(false);
  };

  const handleUser = async (user) => {
    await axios
      .delete(`${API}/guests/delete`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        if (user) {
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 30);

          setUser(user);
          setAuthenticated(true);

          Cookies.set("Current_User", JSON.stringify(user), {
            expires: expirationDate,
            path: "/",
          });
          Cookies.set("Authenticated", JSON.stringify(true));

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
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);

        setUser(res.data);
        setAuthenticated(true);

        Cookies.set("Current_User", JSON.stringify(res.data), {
          expires: expirationDate,
          path: "/",
        });
        Cookies.set("Authenticated", JSON.stringify(true));

        navigate(`/`);
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  const handleLogout = async () => {
    setUser({});
    setAuthenticated(false);

    if (userData && authenticatedData) {
      Cookies.remove("Current_User");
      Cookies.remove("Authenticated");
    } else {
      await handleGuest();
    }

    setIsOpen(false);
    window.location.reload();
  };

  return screenSize >= 800 ? (
    <DesktopApp
      handleSidebarOpen={handleSidebarOpen}
      user={user}
      authenticated={authenticated}
      token={token}
      // game={game}
      // games={games}
      // setGame={setGame}
      // setGames={setGames}
      isOpen={isOpen}
      openInventory={openInventory}
      handleOpenInventory={handleOpenInventory}
      handleUser={handleUser}
      handleLogout={handleLogout}
      resize={resize}
      socket={socket}
      // player1Data={player1Data}
      // player2Data={player2Data}
      // setPlayer1Data={setPlayer1Data}
      // setPlayer2Data={setPlayer2Data}
      loading={loading}
    />
  ) : (
    <MobileApp
      handleSidebarOpen={handleSidebarOpen}
      user={user}
      authenticated={authenticated}
      token={token}
      // game={game}
      // games={games}
      // setGame={setGame}
      // setGames={setGames}
      isOpen={isOpen}
      openInventory={openInventory}
      handleOpenInventory={handleOpenInventory}
      handleUser={handleUser}
      handleLogout={handleLogout}
      resize={resize}
      socket={socket}
      // player1Data={player1Data}
      // player2Data={player2Data}
      // setPlayer1Data={setPlayer1Data}
      // setPlayer2Data={setPlayer2Data}
      loading={loading}
    />
  );
};

export default App;
