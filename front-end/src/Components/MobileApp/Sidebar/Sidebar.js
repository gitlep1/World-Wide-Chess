import "./Sidebar.scss";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  user,
  authenticated,
  handleLogout,
  handleSidebarOpen,
  handleOpenInventory,
}) => {
  const navigate = useNavigate();

  return (
    <section className="mobile-menuSideBar-container">
      {authenticated && user ? (
        <div className="mobile-menuSideBar">
          <aside className="mobile-menuSideBar-userInfo">
            <img
              src={user.profileimg}
              alt="user profile"
              className="profileImg"
            />
            <h1>{user.username}</h1>
            <h3>Rating:</h3>
          </aside>

          <aside className="mobile-menuSideBar-buttons-container1">
            <Button
              className="mobile-menu-item1"
              variant="dark"
              onClick={() => {
                handleOpenInventory();
                // handleSidebarOpen();
              }}
            >
              Inventory
            </Button>

            <Button
              className="mobile-menu-item1"
              variant="light"
              onClick={() => {
                navigate(`/Leaderboard`);
                handleSidebarOpen();
              }}
            >
              Leaderboard
            </Button>

            <Button
              className="mobile-menu-item1"
              variant="light"
              onClick={() => {
                navigate(`/Accounts/${user.id}/Inbox`);
                handleSidebarOpen();
              }}
            >
              Inbox
            </Button>

            <Button
              className="mobile-menu-item1"
              variant="dark"
              onClick={() => {
                navigate(`/Accounts/${user.id}/History`);
                handleSidebarOpen();
              }}
            >
              History
            </Button>
          </aside>

          <aside className="mobile-menuSideBar-buttons-container2">
            <Button
              className="mobile-menu-item2"
              variant="dark"
              onClick={() => {
                navigate(`/Accounts/${user.id}/Settings`);
                handleSidebarOpen();
              }}
            >
              Account Settings
            </Button>
            <br />
            <Button
              className="mobile-menu-item2"
              onClick={handleLogout}
              variant="danger"
            >
              Sign Out
            </Button>
          </aside>
        </div>
      ) : null}
    </section>
  );
};

export default Sidebar;
