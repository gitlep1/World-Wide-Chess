import "./NavBar.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image } from "react-bootstrap";
import { VscFoldDown, VscFoldUp } from "react-icons/vsc";
import { GiHamburgerMenu } from "react-icons/gi";

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
      <div className={`Navbar ${hideNavbar ? "hide-navbar" : null} `}></div>
      <div
        className="Navbar-arrow"
        onClick={() => {
          setHideNavbar(!hideNavbar);
        }}
      >
        <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default NavBar;
