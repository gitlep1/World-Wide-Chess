import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.scss";

const Sidebar = ({ user, authenticated, handleLogout, handleSidebarOpen }) => {
  const navigate = useNavigate();

  return (
    <section className="menuSideBar">
      {authenticated ? (
        <aside className="profileDataSection">
          <img src={user.profileimg} alt="profile" className="profileImg" />
          <h1>{user.username}</h1>
          <Button
            className="menu-item"
            onClick={() => {
              navigate(`/Accounts/${user.id}/Edit`);
              handleSidebarOpen();
            }}
          >
            Settings
          </Button>
          <br />
          <Button className="menu-item" onClick={handleLogout} variant="danger">
            Sign Out
          </Button>
        </aside>
      ) : (
        <>
          <Link
            to="/Accounts/Signup"
            className="menu-item"
            onClick={handleSidebarOpen}
          >
            Sign Up
          </Link>
          <br />
          <Link
            to="/Accounts/Signin"
            className="menu-item"
            onClick={handleSidebarOpen}
          >
            Sign In
          </Link>
        </>
      )}
    </section>
  );
};

export default Sidebar;
