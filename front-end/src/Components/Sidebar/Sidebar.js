import React from "react";
import { bubble as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import "./Sidebar.scss";

const Sidebar = ({ isOpen }) => {
  return (
    <Menu right className="menuSideBar" isOpen={isOpen}>
      <Link to="/Accounts/Signup" className="menu-item">
        Sign Up
      </Link>
      <Link to="/Accounts/Signin" className="menu-item">
        Sign In
      </Link>
      {/* <Link to={`/Accounts/${userID}/Settings`} className="menu-item">Settings</Link> */}
    </Menu>
  );
};

export default Sidebar;
