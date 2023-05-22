import "./NavBar.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import { VscFoldDown, VscFoldUp } from "react-icons/vsc";

import Logo from "../../../Images/Logo.png";

const NavBar = ({ handleOpen, authenticated }) => {
  const navigate = useNavigate();

  const [hideNavbar, setHideNavbar] = useState(false);
  const [homeActive, setHomeActive] = useState(false);
  const [lobbyActive, setLobbyActive] = useState(false);
  const [shopActive, setShopActive] = useState(false);
  const [menuActive, setMenuActive] = useState(false);

  const handleActiveNav = (active) => {
    if (active === "home") {
      setHomeActive(true);
      setLobbyActive(false);
      setShopActive(false);
      setMenuActive(false);
    } else if (active === "lobby") {
      setHomeActive(false);
      setLobbyActive(true);
      setShopActive(false);
      setMenuActive(false);
    } else if (active === "shop") {
      setHomeActive(false);
      setLobbyActive(false);
      setShopActive(true);
      setMenuActive(false);
    } else if (active === "menu") {
      setHomeActive(false);
      setLobbyActive(false);
      setShopActive(false);
      setMenuActive(true);
    } else {
      setHomeActive(false);
      setLobbyActive(false);
      setShopActive(false);
      setMenuActive(false);
    }
  };

  return (
    <nav className="mobile-NavBar-container">
      <div
        className={`mobile-NavBar ${hideNavbar ? "mobile-hide-navbar" : null} `}
      >
        <header id="mobile-NavBar-header">
          <Image src={Logo} alt="Logo" id="mobile-mainlogoImg" />
          <h1>WORLD WIDE CHESS</h1>
        </header>

        <div id="mobile-HomeAndLobby-container">
          <div
            className={`mobile-NavBar-home ${
              homeActive ? "mobile-active" : null
            }`}
            onClick={() => {
              handleActiveNav("home");
              navigate("/");
            }}
          >
            Home
          </div>

          <div
            className={`mobile-NavBar-lobby ${
              lobbyActive ? "mobile-active" : null
            }`}
            onClick={() => {
              handleActiveNav("lobby");
              navigate("/Lobby");
            }}
          >
            Lobby
          </div>
        </div>

        <div id="mobile-shopAndMenu-container">
          <div
            className={`mobile-NavBar-shop ${
              shopActive ? "mobile-active" : null
            }`}
            onClick={() => {
              handleActiveNav("shop");
              navigate("/Shop");
            }}
          >
            Shop
          </div>

          <div
            className={`mobile-NavBar-menu ${
              menuActive ? "mobile-active" : null
            }`}
            onClick={() => {
              handleActiveNav("menu");
              handleOpen();
            }}
          >
            Menu
          </div>
        </div>
      </div>
      <div
        className="mobile-NavBar-arrow"
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
