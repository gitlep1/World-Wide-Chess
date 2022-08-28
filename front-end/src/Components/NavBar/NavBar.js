import "./NavBar.scss";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NavBar = ({ handleOpen }) => {
  return (
    <>
      <nav className="NavBar">
        <Link to="/" className="navbarLinkParent">
          <div className="navbarLink">Home</div>
        </Link>

        <Link to="Games/Lobby" className="navbarLinkParent">
          <div className="navbarLink">Lobby</div>
        </Link>

        <Link to="/placeholder" className="navbarLinkParent">
          <div className="navbarLink">placeholder</div>
        </Link>

        <div
          onClick={() => {
            handleOpen();
          }}
          className="navbarLinkParent"
        >
          <div className="navbarLink">Account</div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
