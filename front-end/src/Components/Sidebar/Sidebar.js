import "./Sidebar.scss";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCoins } from "react-icons/fa";

const Sidebar = ({
  screenVersion,
  user,
  authenticated,
  handleSidebarOpen,
  handleOpenInventory,
  setShowSignIn,
  setShowSignUp,
  setShowSignout,
}) => {
  const navigate = useNavigate();

  const renderUserSidebar = () => {
    return (
      <>
        <aside className="desktop-menuSideBar-userInfo">
          <img
            src={user.profileimg}
            alt="user profile"
            className="profileImg"
          />
          <h2>{user.username}</h2>
          <h2>
            <FaCoins /> {user.chess_coins}
          </h2>
          <h3>Rating:</h3>
        </aside>

        <aside className="desktop-menuSideBar-buttons-container1">
          <Button
            className="desktop-menu-item1"
            variant="dark"
            onClick={() => {
              handleOpenInventory();
              handleSidebarOpen();
            }}
          >
            Inventory
          </Button>

          <Button
            className="desktop-menu-item1"
            variant="light"
            onClick={() => {
              navigate(`/Leaderboard`);
              handleSidebarOpen();
            }}
          >
            Leaderboard
          </Button>

          <Button
            className="desktop-menu-item1"
            variant="light"
            onClick={() => {
              navigate(`/Accounts/${user.id}/Inbox`);
              handleSidebarOpen();
            }}
          >
            Inbox
          </Button>

          <Button
            className="desktop-menu-item1"
            variant="dark"
            onClick={() => {
              navigate(`/Accounts/${user.id}/History`);
              handleSidebarOpen();
            }}
          >
            History
          </Button>
        </aside>

        <aside className="desktop-menuSideBar-buttons-container2">
          <Button
            className="desktop-menu-item2"
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
            className="desktop-menu-item2"
            onClick={() => {
              setShowSignout(true);
              handleSidebarOpen();
            }}
            variant="danger"
          >
            Sign Out
          </Button>
        </aside>
      </>
    );
  };

  const renderGuestSidebar = () => {
    return (
      <>
        <aside className="desktop-menuSideBar-guestInfo">
          <img
            src={user.profileimg}
            alt="user profile"
            className="profileImg"
          />
          <h2>{user.username}</h2>
        </aside>

        <Button
          className="desktop-menu-guest-inventory"
          variant="dark"
          onClick={() => {
            handleOpenInventory();
            handleSidebarOpen();
          }}
        >
          Inventory
        </Button>

        <aside className="desktop-menuSideBar-guest-buttons">
          <Button
            className="desktop-menu-guest-signup"
            onClick={() => {
              setShowSignUp(true);
              handleSidebarOpen();
            }}
            variant="success"
          >
            Sign Up
          </Button>

          <Button
            className="desktop-menu-guest-signin"
            onClick={() => {
              setShowSignIn(true);
              handleSidebarOpen();
            }}
            variant="danger"
          >
            Sign In
          </Button>
        </aside>
      </>
    );
  };

  return (
    <section className="desktop-menuSideBar-container">
      <div className="desktop-menuSideBar">
        {user.is_guest === false && authenticated
          ? renderUserSidebar()
          : renderGuestSidebar()}
      </div>
    </section>
  );
};

export default Sidebar;
