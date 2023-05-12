import "./NavBar.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import { VscFoldDown, VscFoldUp } from "react-icons/vsc";

import Logo from "../../../Images/Logo.png";

const NavBar = ({ handleOpen, authenticated }) => {
  const navigate = useNavigate();

  const [hideNavbar, setHideNavbar] = useState(false);
  const [lobbyActive, setLobbyActive] = useState(false);
  const [leaderboardActive, setLeaderboardActive] = useState(false);
  const [shopActive, setShopActive] = useState(false);
  const [menuActive, setMenuActive] = useState(false);

  const handleActiveNav = (active) => {
    if (active === "lobby") {
      setLobbyActive(true);
      setLeaderboardActive(false);
      setShopActive(false);
      setMenuActive(false);
    } else if (active === "leaderboard") {
      setLobbyActive(false);
      setLeaderboardActive(true);
      setShopActive(false);
      setMenuActive(false);
    } else if (active === "shop") {
      setLobbyActive(false);
      setLeaderboardActive(false);
      setShopActive(true);
      setMenuActive(false);
    } else if (active === "menu") {
      setLobbyActive(false);
      setLeaderboardActive(false);
      setShopActive(false);
      setMenuActive(true);
    } else {
      setLobbyActive(false);
      setLeaderboardActive(false);
      setShopActive(false);
      setMenuActive(false);
    }
  };

  return (
    <nav className="desktop-NavBar-container">
      <div className={`desktop-NavBar ${hideNavbar ? "hide-navbar" : null} `}>
        <header id="desktop-NavBar-header">
          <div className="desktop-NavBar-header-navigation">
            <Image src={Logo} alt="Logo" id="mainlogoImg" />
            <h1>WORLD WIDE CHESS</h1>
          </div>
        </header>

        <div id="desktop-HomeAndLobby-container">
          <div
            className={`desktop-NavBar-home-container ${
              lobbyActive ? "active" : null
            }`}
            onClick={() => {
              handleActiveNav("lobby");
              navigate("/");
            }}
          >
            Home
          </div>

          <div
            className={`desktop-NavBar-lobby-container ${
              leaderboardActive ? "active" : null
            }`}
            onClick={() => {
              handleActiveNav("leaderboard");
              navigate("/Lobby");
            }}
          >
            Lobby
          </div>
        </div>

        <div id="desktop-shopAndMenu-container">
          <div
            className={`desktop-NavBar-shop-container ${
              shopActive ? "active" : null
            }`}
            onClick={() => {
              handleActiveNav("shop");
              navigate("/Shop");
            }}
          >
            Shop
          </div>

          <div
            onClick={() => {
              handleActiveNav("menu");
              handleOpen();
            }}
            className={`desktop-NavBar-menu-container ${
              menuActive ? "active" : null
            }`}
          >
            Menu
          </div>
        </div>
      </div>
      <div
        className="desktop-NavBar-arrow"
        onClick={() => {
          setHideNavbar(!hideNavbar);
        }}
      >
        {hideNavbar ? <VscFoldDown /> : <VscFoldUp />}
      </div>
    </nav>
  );
};

export default NavBar;
