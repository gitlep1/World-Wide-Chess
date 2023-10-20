import "./Sidebar.scss";
import { Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import ChessCoinIcon from "../../Images/Chess_Coins.png";
import InventoryIcon from "../../Images/Inventory.png";
import LeaderboardIcon from "../../Images/Leaderboard.png";
import InboxIcon from "../../Images/Inbox.png";
import HistoryIcon from "../../Images/History.png";
import AccountSettingsIcon from "../../Images/AccountSettings.png";
import SignOutIcon from "../../Images/SignOut.png";

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
        <aside className="menuSideBar-userInfo">
          <Image
            fluid
            roundedCircle
            src={user.profileimg}
            alt="user profile"
            className="profileImg"
          />
          <h2>{user.username}</h2>
          <h2 className="chess-coins-container">
            <Image
              fluid
              src={ChessCoinIcon}
              alt="chess coins"
              className="chess-coin-icon"
            />{" "}
            {user.chess_coins}
          </h2>
          <h3>Rating: {user.rating}</h3>
        </aside>

        <aside className="menuSideBar-buttons-container1">
          <Button
            className="desktop-menu-item1"
            variant="dark"
            onClick={() => {
              handleOpenInventory();
              handleSidebarOpen();
            }}
          >
            <Image
              src={InventoryIcon}
              alt="inventory icon"
              className="button-image"
            />{" "}
            Inventory
          </Button>

          <Button
            className="menu-item1"
            variant="light"
            onClick={() => {
              navigate(`/Leaderboard`);
              handleSidebarOpen();
            }}
          >
            <Image
              src={LeaderboardIcon}
              alt="leaderboard icon"
              className="button-image"
            />{" "}
            Leaderboard
          </Button>

          <Button
            className="menu-item1"
            variant="light"
            onClick={() => {
              navigate(`/Accounts/${user.id}/Inbox`);
              handleSidebarOpen();
            }}
          >
            <Image src={InboxIcon} alt="inbox icon" className="button-image" />{" "}
            Inbox
          </Button>

          <Button
            className="menu-item1"
            variant="dark"
            onClick={() => {
              navigate(`/Accounts/${user.id}/History`);
              handleSidebarOpen();
            }}
          >
            <Image
              src={HistoryIcon}
              alt="history icon"
              className="button-image"
            />{" "}
            History
          </Button>
        </aside>

        <aside className="menuSideBar-buttons-container2">
          <Button
            className="menu-item2"
            variant="dark"
            onClick={() => {
              navigate(`/Accounts/${user.id}/Settings`);
              handleSidebarOpen();
            }}
          >
            <Image
              src={AccountSettingsIcon}
              alt="account settings icon"
              className="button-image"
            />{" "}
            Account Settings
          </Button>
          <br />
          <Button
            className="menu-item2"
            onClick={() => {
              setShowSignout(true);
              handleSidebarOpen();
            }}
            variant="danger"
          >
            <Image
              src={SignOutIcon}
              alt="sign out icon"
              className="button-image"
            />{" "}
            Sign Out
          </Button>
        </aside>
      </>
    );
  };

  const renderGuestSidebar = () => {
    return (
      <>
        <aside className="menuSideBar-guestInfo">
          <img
            src={user.profileimg}
            alt="user profile"
            className="profileImg"
          />
          <h2>{user.username}</h2>
        </aside>

        <Button
          className="menu-guest-inventory"
          variant="dark"
          onClick={() => {
            handleOpenInventory();
            handleSidebarOpen();
          }}
        >
          <Image
            src={InventoryIcon}
            alt="inventory icon"
            className="button-image"
          />{" "}
          Inventory
        </Button>

        <aside className="menuSideBar-guest-buttons">
          <Button
            className="menu-guest-signup"
            onClick={() => {
              setShowSignUp(true);
              handleSidebarOpen();
            }}
            variant="success"
          >
            Sign Up
          </Button>

          <Button
            className="menu-guest-signin"
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
    <section className={`${screenVersion}-menuSideBar-container`}>
      <div className="menuSideBar">
        {user.is_guest === false && authenticated
          ? renderUserSidebar()
          : renderGuestSidebar()}
      </div>
    </section>
  );
};

export default Sidebar;
