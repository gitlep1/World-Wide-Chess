import "./NavBar.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import { VscFoldDown, VscFoldUp } from "react-icons/vsc";

import Logo from "../../Images/Logo.png";

const NavBar = ({ screenVersion, handleOpen, authenticated }) => {
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
    <nav className={`${screenVersion}-NavBar-container`}>
      <div className={`Navbar ${hideNavbar ? "hide-navbar" : null} `}>
        <header id="Navbar-header">
          <Image src={Logo} alt="Logo" id="logoImg" />
          <h1>WORLD WIDE CHESS</h1>
        </header>

        <div id="HomeAndLobby-container">
          <div
            className={`Navbar-home ${homeActive ? "Navbar-active" : null}`}
            onClick={() => {
              handleActiveNav("home");
              navigate("/");
            }}
          >
            Home
          </div>

          <div
            className={`Navbar-lobby ${lobbyActive ? "Navbar-active" : null}`}
            onClick={() => {
              handleActiveNav("lobby");
              navigate("/Lobby");
            }}
          >
            Lobby
          </div>
        </div>

        <div id="ShopAndMenu-container">
          <div
            className={`Navbar-shop ${shopActive ? "Navbar-active" : null}`}
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
            className={`Navbar-menu ${menuActive ? "Navbar-active" : null}`}
          >
            Menu
          </div>
        </div>
      </div>
      <div
        className="Navbar-arrow"
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
