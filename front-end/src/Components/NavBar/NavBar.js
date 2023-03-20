import "./NavBar.scss";
// import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";

import Logo from "../../Images/Logo.png";

const NavBar = ({ handleOpen, authenticated }) => {
  return (
    <nav className="NavBar">
      <div id="worldWideChessHeader">
        <Image src={Logo} alt="Logo" id="mainlogoImg" />
        <h5>WORLD WIDE CHESS</h5>
      </div>

      <div id="navbarLink-lobby">
        <Link to="/">
          <div className="navbarLink-lobby">Lobby</div>
        </Link>
      </div>

      {/* <Link to="Games/" className="navbarLinkParent">
        <div className="navbarLink">Lobby</div>
      </Link>

      <Link to="/Accounts" className="navbarLinkParent">
        <div className="navbarLink">Players</div>
      </Link> */}

      <div
        onClick={() => {
          handleOpen();
        }}
        className="navbarLinkParent"
      >
        <div className="navbarLink">Account</div>
      </div>
    </nav>
  );
};

export default NavBar;
