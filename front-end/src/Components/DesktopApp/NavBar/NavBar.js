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
    <nav className="desktop-NavBar-container">
      <div
        className={`desktop-NavBar ${
          hideNavbar ? "desktop-hide-navbar" : null
        } `}
      >
        <header id="desktop-NavBar-header">
          <Image src={Logo} alt="Logo" id="desktop-mainlogoImg" />
          <h1>WORLD WIDE CHESS</h1>
        </header>

        <div id="desktop-HomeAndLobby-container">
          <div
            className={`desktop-NavBar-home ${
              homeActive ? "desktop-active" : null
            }`}
            onClick={() => {
              handleActiveNav("home");
              navigate("/");
            }}
          >
            Home
          </div>

          <div
            className={`desktop-NavBar-lobby ${
              lobbyActive ? "desktop-active" : null
            }`}
            onClick={() => {
              handleActiveNav("lobby");
              navigate("/Lobby");
            }}
          >
            Lobby
          </div>
        </div>

        <div id="desktop-shopAndMenu-container">
          <div
            className={`desktop-NavBar-shop ${
              shopActive ? "desktop-active" : null
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
            className={`desktop-NavBar-menu ${
              menuActive ? "desktop-active" : null
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
