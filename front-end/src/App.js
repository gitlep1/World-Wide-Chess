import "./App.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import Cookies from "js-cookie";

import MainLoader from "./CustomLoaders/MainLoader/MainLoader";

// App components \\
import DesktopApp from "./Components/DesktopApp";
import MobileApp from "./Components/MobileApp";

// Page components \\
// import LandingPage from "./Components/LandingPage/LandingPage";

// Custom functions \\
import DetectScreenSize from "./CustomFunctions/DetectScreenSize";
import LeavingPage from "./CustomFunctions/LeavingPage";

import DefaultProfImg from "./Images/Profiles/DefaultProfImg.png";

import CustomToastContainers from "./CustomFunctions/CustomToastContainers";

const API = process.env.REACT_APP_API_URL;
const socket = io(API);

// const socket = io(API, {
//   auth: {
//     token: JSON.parse(Cookies.get("token")),
//   },
// });

const App = () => {
  const desktopVersion = "desktop";
  const mobileVersion = "mobile";

  const navigate = useNavigate();
  const [screenSize, setScreenSize] = useState(DetectScreenSize().width);

  const userData = Cookies.get("Current_User") || null;
  const authenticatedData = Cookies.get("Authenticated") || null;
  const tokenData = Cookies.get("token") || null;

  const [user, setUser] = useState({});
  const [token, setToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openInventory, setOpenInventory] = useState(false);
  const [resize, setResize] = useState("");

  const [mainLoading, setMainLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const handleStuff = async () => {
      await checkCookies();
      // handleSockets();
      LeavingPage();
    };
    handleStuff();
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
      setResize("8%");
    }
    if (window.innerWidth <= 1000) {
      setResize("10%");
    }
    if (window.innerWidth <= 900) {
      setResize("11%");
    }
    if (window.innerWidth <= 800) {
      setResize("12%");
    }
    if (window.innerWidth <= 700) {
      setResize("15%");
    }
    if (window.innerWidth <= 600) {
      setResize("16%");
    }
    if (window.innerWidth <= 500) {
      setResize("20%");
    }
    if (window.innerWidth <= 400) {
      setResize("23%");
    }
    if (window.innerWidth <= 325) {
      setResize("25%");
    }
  };

  const handleSidebarOpen = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  const handleOpenInventory = () => {
    setOpenInventory((prev) => !prev);
  };

  const checkCookies = async () => {
    if (userData && authenticatedData && tokenData) {
      setUser(JSON.parse(userData));
      setAuthenticated(JSON.parse(authenticatedData));
      setToken(JSON.parse(tokenData));
    } else {
      await handleGuest();
    }
    setMainLoading(false);
  };

  // add socket token checking later idea 1 \\

  // const handleSockets = () => {
  //   socket.emit("check-token", token);

  //   // console.log(token);
  //   // console.log(tokenData);

  //   socket.on("invalid-token-error", (err) => {
  //     setError(err);
  //     setLoading(false);
  //   });

  //   socket.on("invalid-scope-error", (err) => {
  //     setError(err);
  //     setLoading(false);
  //   });

  //   return () => {
  //     socket.off("invalid-token-error");
  //     socket.off("invalid-scope-error");
  //   };
  // };

  const generateAlphaNumericID = (length) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      result += charset[randomIndex];
    }

    return result;
  };

  const handleUser = async (user) => {
    if (user) {
      Cookies.remove("Current_User");
      Cookies.remove("Authenticated");
      Cookies.remove("token");

      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 30);

      Cookies.set("Current_User", JSON.stringify(user.payload), {
        expires: expirationDate,
        path: "/",
        sameSite: "strict",
      });
      Cookies.set("Authenticated", JSON.stringify(true), {
        expires: expirationDate,
        path: "/",
        sameSite: "strict",
      });
      Cookies.set("token", JSON.stringify(user.token), {
        expires: expirationDate,
        path: "/",
        sameSite: "strict",
      });

      setUser(user.payload);
      setToken(user.token);
      setAuthenticated(true);

      navigate(`/`);
    } else {
      return null;
    }

    await axios
      .delete(`${API}/guests/delete`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .catch((err) => {
        setError(err.response.data);
      });
  };

  const handleGuest = async () => {
    const newGuest = {
      profileimg: DefaultProfImg,
      username: `Guest-${generateAlphaNumericID(5)}`,
      is_guest: true,
    };

    return axios
      .post(`${API}/guests/signup`, newGuest)
      .then((res) => {
        Cookies.remove("Current_User");
        Cookies.remove("Authenticated");
        Cookies.remove("token");

        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 1);

        Cookies.set("Current_User", JSON.stringify(res.data.payload), {
          expires: expirationDate,
          path: "/",
          sameSite: "strict",
        });
        Cookies.set("Authenticated", JSON.stringify(true), {
          expires: expirationDate,
          path: "/",
          sameSite: "strict",
        });
        Cookies.set("token", JSON.stringify(res.data.token), {
          expires: expirationDate,
          path: "/",
          sameSite: "strict",
        });

        setUser(res.data.payload);
        setToken(res.data.token);
        setAuthenticated(true);

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
      Cookies.remove("token");
      Cookies.remove("gameid");
    } else {
      await handleGuest();
    }

    setIsOpen(false);
    window.location.reload();
  };

  const renderDesktop = () => {
    if (mainLoading) {
      return (
        <MainLoader screenVersion={desktopVersion} mainLoading={mainLoading} />
      );
    } else if (error) {
      return <h1>ERROR: {error}</h1>;
    } else {
      return (
        <DesktopApp
          handleSidebarOpen={handleSidebarOpen}
          user={user}
          setUser={setUser}
          authenticated={authenticated}
          token={token}
          isOpen={isOpen}
          openInventory={openInventory}
          handleOpenInventory={handleOpenInventory}
          handleUser={handleUser}
          handleLogout={handleLogout}
          resize={resize}
          setResize={setResize}
          socket={socket}
        />
      );
    }
  };

  const renderMobile = () => {
    if (mainLoading) {
      return (
        <MainLoader screenVersion={mobileVersion} mainLoading={mainLoading} />
      );
    } else if (error) {
      return <h1>ERROR: {error}</h1>;
    } else {
      return (
        <MobileApp
          handleSidebarOpen={handleSidebarOpen}
          user={user}
          setUser={setUser}
          authenticated={authenticated}
          token={token}
          isOpen={isOpen}
          openInventory={openInventory}
          handleOpenInventory={handleOpenInventory}
          handleUser={handleUser}
          handleLogout={handleLogout}
          resize={resize}
          socket={socket}
        />
      );
    }
  };

  return (
    <section>
      <CustomToastContainers />
      {screenSize >= 800 ? renderDesktop() : renderMobile()}
    </section>
  );
};

export default App;
