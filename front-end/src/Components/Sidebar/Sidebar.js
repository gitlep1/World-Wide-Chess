import React from "react";
import { bubble as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import "./Sidebar.scss";

const Sidebar = ({
  isOpen,
  user,
  authenticated,
  handleLogout,
  handleSidebarOpen,
}) => {
  return (
    <Menu right className="menuSideBar" isOpen={isOpen} width={"20%"}>
      {authenticated ? (
        <>
          <img src={user.profileimg} alt="profile" className="profileImg" />
          <h1>{user.username}</h1>
          <Link
            to={`/Accounts/${user.id}/Settings`}
            className="menu-item"
            onClick={handleSidebarOpen}
          >
            Settings
          </Link>
          <div className="menu-item" onClick={handleLogout}>
            Sign Out
          </div>
        </>
      ) : (
        <>
          <Link
            to="/Accounts/Signup"
            className="menu-item"
            onClick={handleSidebarOpen}
          >
            Sign Up
          </Link>
          <Link
            to="/Accounts/Signin"
            className="menu-item"
            onClick={handleSidebarOpen}
          >
            Sign In
          </Link>
        </>
      )}
    </Menu>
  );
};

export default Sidebar;
