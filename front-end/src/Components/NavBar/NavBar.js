import "./Navbar.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";

import Logo from "../../Images/Logo.png";

const NavBar = ({ screenVersion, handleSidebarOpen }) => {
  const navigate = useNavigate();

  const [homeActive, setHomeActive] = useState(false);
  const [lobbyActive, setLobbyActive] = useState(false);
  const [shopActive, setShopActive] = useState(false);
  const [leaderboardActive, setLeaderboardActive] = useState(false);
  const [menuActive, setMenuActive] = useState(false);

  const handleActiveNav = (active) => {
    if (active === "home") {
      setHomeActive(true);
      setLobbyActive(false);
      setShopActive(false);
      setLeaderboardActive(false);
      setMenuActive(false);
    } else if (active === "lobby") {
      setHomeActive(false);
      setLobbyActive(true);
      setShopActive(false);
      setLeaderboardActive(false);
      setMenuActive(false);
    } else if (active === "shop") {
      setHomeActive(false);
      setLobbyActive(false);
      setShopActive(true);
      setLeaderboardActive(false);
      setMenuActive(false);
    } else if (active === "leaderboard") {
      setHomeActive(false);
      setLobbyActive(false);
      setShopActive(false);
      setLeaderboardActive(true);
      setMenuActive(false);
    } else if (active === "menu") {
      setHomeActive(false);
      setLobbyActive(false);
      setShopActive(false);
      setLeaderboardActive(false);
      setMenuActive(true);
    } else {
      setHomeActive(false);
      setLobbyActive(false);
      setShopActive(false);
      setLeaderboardActive(false);
      setMenuActive(false);
    }
  };

  if (
    homeActive ||
    lobbyActive ||
    shopActive ||
    leaderboardActive ||
    menuActive
  ) {
    setTimeout(() => {
      handleActiveNav("none");
    }, 3000);
  }

  return (
    <nav className={`${screenVersion}-navbar-container`}>
      <div className="navbar-top-filler-space"></div>
      <div className="navbar">
        <header className="navbar-header">
          <Image src={Logo} alt="Logo" id="logoImg" />
          <h1 id="logoText">WORLD WIDE CHESS</h1>
        </header>
      </div>
      <div
        className={`navbar-button ${homeActive ? "navbar-active" : null}`}
        onClick={() => {
          handleActiveNav("home");
          navigate("/");
        }}
      >
        Home
      </div>
      <div
        className={`navbar-button ${lobbyActive ? "navbar-active" : null}`}
        onClick={() => {
          handleActiveNav("lobby");
          navigate("/Lobby");
        }}
      >
        Lobby
      </div>
      <div
        className={`navbar-button ${shopActive ? "navbar-active" : null}`}
        onClick={() => {
          handleActiveNav("shop");
          navigate("/Shop");
        }}
      >
        Shop
      </div>
      <div
        className={`navbar-button ${
          leaderboardActive ? "navbar-active" : null
        }`}
        onClick={() => {
          handleActiveNav("leaderboard");
          navigate("/Leaderboard");
        }}
      >
        Leaderboard
      </div>
      <div
        className={`navbar-button ${menuActive ? "navbar-active" : null}`}
        onClick={() => {
          handleActiveNav("menu");
          handleSidebarOpen();
        }}
      >
        Menu
      </div>
    </nav>
  );
};

export default NavBar;
