import "./NavBar.scss";
// import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const NavBar = ({ handleOpen, authenticated }) => {
  return (
    <nav className="NavBar">
      {authenticated ? (
        <>
          <Link to="/" className="navbarLinkParent">
            <div className="navbarLink">Home</div>
          </Link>

          <Link to="Games/" className="navbarLinkParent">
            <div className="navbarLink">Lobby</div>
          </Link>

          <Link to="/Accounts" className="navbarLinkParent">
            <div className="navbarLink">Players</div>
          </Link>

          <div
            onClick={() => {
              handleOpen();
            }}
            className="navbarLinkParent"
          >
            <div className="navbarLink">Account</div>
          </div>
        </>
      ) : (
        <>
          <h5 className="notAuth">
            Please select account to continue
            -------------------------------------
            {">"}
          </h5>
          <div
            onClick={() => {
              handleOpen();
            }}
            className="navbarLinkParent"
          >
            <div className="navbarLink">Account</div>
          </div>
        </>
      )}
    </nav>
  );
};

export default NavBar;
