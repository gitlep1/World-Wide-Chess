import "./Sidebar.scss";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaCoins } from "react-icons/fa";

const Sidebar = ({
  user,
  authenticated,
  handleSidebarOpen,
  handleOpenInventory,
  setShowSignIn,
  setShowSignUp,
  setShowSignout,
}) => {
  const navigate = useNavigate();

  return (
    <section className="mobile-menuSideBar-container">
      <div className="mobile-menuSideBar">
        {user.payload.is_guest === false && authenticated ? (
          <>
            <aside className="mobile-menuSideBar-userInfo">
              <img
                src={user.payload.profileimg}
                alt="user profile"
                className="profileImg"
              />
              <h1>{user.payload.username}</h1>
              <h2>
                <FaCoins /> {user.payload.chess_coins}
              </h2>
              <h3>Rating:</h3>
            </aside>

            <aside className="mobile-menuSideBar-buttons-container1">
              <Button
                className="mobile-menu-item1"
                variant="dark"
                onClick={() => {
                  handleOpenInventory();
                  handleSidebarOpen();
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
                variant="dark"
                onClick={() => {
                  navigate(`/Accounts/${user.payload.id}/Inbox`);
                  handleSidebarOpen();
                }}
              >
                Inbox
              </Button>

              <Button
                className="mobile-menu-item1"
                variant="light"
                onClick={() => {
                  navigate(`/Accounts/${user.payload.id}/History`);
                  handleSidebarOpen();
                }}
              >
                History
              </Button>
            </aside>

            <aside className="mobile-menuSideBar-buttons-container2">
              <Button
                className="mobile-menu-item2"
                variant="success"
                onClick={() => {
                  navigate(`/Accounts/${user.payload.id}/Settings`);
                  handleSidebarOpen();
                }}
              >
                Account Settings
              </Button>
              <br />
              <Button
                className="mobile-menu-item2"
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
        ) : (
          <>
            <aside className="mobile-menuSideBar-guestInfo">
              <img
                src={user.payload.profileimg}
                alt="user profile"
                className="profileImg"
              />
              <h2>{user.payload.username}</h2>
            </aside>

            <Button
              className="mobile-menu-guest-inventory"
              variant="dark"
              onClick={() => {
                handleOpenInventory();
                handleSidebarOpen();
              }}
            >
              Inventory
            </Button>

            <aside className="mobile-menuSideBar-guest-buttons">
              <Button
                className="mobile-menu-guest-signup"
                onClick={() => {
                  setShowSignUp(true);
                  handleSidebarOpen();
                }}
                variant="success"
              >
                Sign Up
              </Button>

              <Button
                className="mobile-menu-guest-signin"
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
        )}
      </div>
    </section>
  );
};

export default Sidebar;
