import { useState, useEffect } from "react";
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
  const [resize, setResize] = useState("");

  useEffect(() => {
    const resizeInterval = setInterval(() => {
      if (window.innerWidth > 1000) {
        setResize("20%");
      }
      if (window.innerWidth <= 1000) {
        setResize("25%");
      }
      if (window.innerWidth <= 800) {
        setResize("35%");
      }
      if (window.innerWidth <= 600) {
        setResize("45%");
      }
      if (window.innerWidth <= 400) {
        setResize("60%");
      }
    }, 1000);

    return () => clearInterval(resizeInterval);
  });

  return (
    <Menu right className="menuSideBar" isOpen={isOpen} width={resize}>
      {authenticated ? (
        <aside className="profileDataSection">
          <img src={user.profileimg} alt="profile" className="profileImg" />
          <h1>{user.username}</h1>
          <Link
            to={`/Accounts/${user.id}/Edit`}
            className="menu-item"
            onClick={handleSidebarOpen}
          >
            Settings
          </Link>{" "}
          <div className="menu-item" onClick={handleLogout}>
            Sign Out
          </div>
        </aside>
      ) : (
        <>
          <Link
            to="/Accounts/Signup"
            className="menu-item"
            onClick={handleSidebarOpen}
          >
            Sign Up
          </Link>{" "}
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
