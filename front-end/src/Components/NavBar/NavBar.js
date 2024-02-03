import "./Navbar.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import { IoMdArrowDropup } from "react-icons/io";

import Logo from "../../Images/Logo.png";

const NavBar = ({ screenVersion, handleSidebarOpen }) => {
  const navigate = useNavigate();

  const [homeActive, setHomeActive] = useState(false);
  const [lobbyActive, setLobbyActive] = useState(false);
  const [shopActive, setShopActive] = useState(false);
  const [leaderboardActive, setLeaderboardActive] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  console.log("yes");

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

  return (
    <nav className={`${screenVersion}-navbar-container`}>
      <div className="navbar-top-filler-space"></div>
      <div className="navbar">
        <header className="navbar-header">
          <Image src={Logo} alt="Logo" id="logoImg" />
          <h1 id="logoText">WORLD WIDE CHESS</h1>
        </header>
      </div>

      <div className="navbar-buttons-container">
        <div
          className="navbar-button"
          onClick={() => {
            handleActiveNav("home");
            navigate("/");
          }}
        >
          Home
          <div style={{ display: homeActive ? "block" : "none" }}>
            <IoMdArrowDropup className="navbar-active-arrow" />
          </div>
        </div>
        <div
          className="navbar-button"
          onClick={() => {
            handleActiveNav("lobby");
            navigate("/Lobby");
          }}
        >
          Lobby
          <div style={{ display: lobbyActive ? "block" : "none" }}>
            <IoMdArrowDropup className="navbar-active-arrow" />
          </div>
        </div>
        <div
          className="navbar-button"
          onClick={() => {
            handleActiveNav("shop");
            navigate("/Shop");
          }}
        >
          Shop
          <div style={{ display: shopActive ? "block" : "none" }}>
            <IoMdArrowDropup className="navbar-active-arrow" />
          </div>
        </div>
        <div
          className="navbar-button"
          onClick={() => {
            handleActiveNav("leaderboard");
            navigate("/Leaderboard");
          }}
        >
          Leaderboard
          <div style={{ display: leaderboardActive ? "block" : "none" }}>
            <IoMdArrowDropup className="navbar-active-arrow" />
          </div>
        </div>
        <div
          className="navbar-button"
          onClick={() => {
            handleActiveNav("menu");
            handleSidebarOpen();
          }}
        >
          Menu
          <div style={{ display: menuActive ? "block" : "none" }}>
            <IoMdArrowDropup className="navbar-active-arrow" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
