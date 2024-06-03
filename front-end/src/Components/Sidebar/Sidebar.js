import "./Sidebar.scss";
import { useState } from "react";
import { Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";

import ChessCoinIcon from "../../Images/Chess_Coins.png";
import HomeIcon from "../../Images/home_icon.png";
import LobbyIcon from "../../Images/lobbyDark.png";
import ShopIcon from "../../Images/shop_icon.png";
import InventoryIcon from "../../Images/inventoryDark.png";
import LeaderboardIcon from "../../Images/Leaderboardlight.png";
import InboxIcon from "../../Images/inboxDark.png";
import HistoryIcon from "../../Images/History.png";
import AccountSettingsIcon from "../../Images/AccountSettingsDark.png";
import SignInIcon from "../../Images/sign_in.png";
import SignUpIcon from "../../Images/sign_up.png";
import SignOutIcon from "../../Images/sign_out.png";

const Sidebar = ({
  screenVersion,
  user,
  handleSidebarOpen,
  handleOpenInventory,
  setShowSignIn,
  setShowSignUp,
  setShowSignout,
}) => {
  const navigate = useNavigate();

  const [profileActive, setProfileActive] = useState(false);
  const [homeActive, setHomeActive] = useState(false);
  const [lobbyActive, setLobbyActive] = useState(false);
  const [shopActive, setShopActive] = useState(false);
  const [inventoryActive, setInventoryActive] = useState(false);
  const [rankingActive, setRankingActive] = useState(false);
  const [inboxActive, setInboxActive] = useState(false);
  const [historyActive, setHistoryActive] = useState(false);
  const [accountSettingsActive, setAccountSettingsActive] = useState(false);

  const [isHoveringProfile, setIsHoveringProfile] = useState(false);
  const [isHoveringHome, setIsHoveringHome] = useState(false);
  const [isHoveringLobby, setIsHoveringLobby] = useState(false);
  const [isHoveringShop, setIsHoveringShop] = useState(false);
  const [isHoveringInventory, setIsHoveringInventory] = useState(false);
  const [isHoveringRanking, setIsHoveringRanking] = useState(false);
  const [isHoveringInbox, setIsHoveringInbox] = useState(false);
  const [isHoveringHistory, setIsHoveringHistory] = useState(false);
  const [isHoveringAccountSettings, setIsHoveringAccountSettings] =
    useState(false);

  const handleActiveNav = (active) => {
    if (active === "profile") {
      setProfileActive(true);
      setHomeActive(false);
      setLobbyActive(false);
      setShopActive(false);
      setInventoryActive(false);
      setRankingActive(false);
      setInboxActive(false);
      setHistoryActive(false);
      setAccountSettingsActive(false);
    } else if (active === "home") {
      setProfileActive(false);
      setHomeActive(true);
      setLobbyActive(false);
      setShopActive(false);
      setInventoryActive(false);
      setRankingActive(false);
      setInboxActive(false);
      setHistoryActive(false);
      setAccountSettingsActive(false);
    } else if (active === "lobby") {
      setHomeActive(false);
      setLobbyActive(true);
      setShopActive(false);
      setInventoryActive(false);
      setRankingActive(false);
      setInboxActive(false);
      setHistoryActive(false);
      setAccountSettingsActive(false);
    } else if (active === "shop") {
      setHomeActive(false);
      setLobbyActive(false);
      setShopActive(true);
      setInventoryActive(false);
      setRankingActive(false);
      setInboxActive(false);
      setHistoryActive(false);
      setAccountSettingsActive(false);
    } else if (active === "inventory") {
      setHomeActive(false);
      setLobbyActive(false);
      setShopActive(false);
      setInventoryActive(true);
      setRankingActive(false);
      setInboxActive(false);
      setHistoryActive(false);
      setAccountSettingsActive(false);
    } else if (active === "ranking") {
      setHomeActive(false);
      setLobbyActive(false);
      setShopActive(false);
      setInventoryActive(false);
      setRankingActive(true);
      setInboxActive(false);
      setHistoryActive(false);
      setAccountSettingsActive(false);
    } else if (active === "inbox") {
      setHomeActive(false);
      setLobbyActive(false);
      setShopActive(false);
      setInventoryActive(false);
      setRankingActive(false);
      setInboxActive(true);
      setHistoryActive(false);
      setAccountSettingsActive(false);
    } else if (active === "history") {
      setHomeActive(false);
      setLobbyActive(false);
      setShopActive(false);
      setInventoryActive(false);
      setRankingActive(false);
      setInboxActive(false);
      setHistoryActive(true);
      setAccountSettingsActive(false);
    } else if (active === "settings") {
      setHomeActive(false);
      setLobbyActive(false);
      setShopActive(false);
      setInventoryActive(false);
      setRankingActive(false);
      setInboxActive(false);
      setHistoryActive(false);
      setAccountSettingsActive(true);
    } else {
      setHomeActive(false);
      setLobbyActive(false);
      setShopActive(false);
      setInventoryActive(false);
      setRankingActive(false);
      setInboxActive(false);
      setHistoryActive(false);
      setAccountSettingsActive(false);
    }
  };

  const convertChessCoins = () => {
    if (user.chess_coins >= 1000000000000) {
      return formatNumber(user.chess_coins / 1000000000000) + "T";
    } else if (user.chess_coins >= 1000000000) {
      return formatNumber(user.chess_coins / 1000000000) + "B";
    } else if (user.chess_coins >= 1000000) {
      return formatNumber(user.chess_coins / 1000000) + "M";
    } else if (user.chess_coins >= 1000) {
      return formatNumber(user.chess_coins / 1000) + "K";
    }
    return user.chess_coins;
  };

  const formatNumber = (number) => {
    const formatted = Math.floor(number * 10) / 10;
    if (formatted % 1 === 0) {
      return formatted.toString();
    }
    return formatted.toFixed(1);
  };

  const renderProfileSidebar = () => {
    return (
      <div className="profile-sidebar">
        <div className="profile-sidebar-user-info">
          <Image
            fluid
            roundedCircle
            src={user.profileimg}
            alt="user profile"
            className="profileImg"
          />
          <h3>{user.username}</h3>
          <div
            className="chess-coins-container"
            data-tooltip-id="chess-coins-tooltip"
            data-tooltip-content={user.chess_coins}
            data-tooltip-place="right"
            data-tooltip-variant="light"
          >
            <Image
              src={ChessCoinIcon}
              alt="chess coins"
              className="chess-coin-icon"
            />{" "}
            {convertChessCoins()}
          </div>
          <h3>Rating: {user.rating}</h3>
        </div>
        <div className="profile-sidebar-user-stats">
          <h3>Wins: {user.wins}</h3>
          <h3>Loss: {user.loss}</h3>
          <h3>Ties: {user.ties}</h3>
        </div>
        <Tooltip id="chess-coins-tooltip" />
      </div>
    );
  };

  const renderHomeSidebar = () => {
    return (
      <div className="home-sidebar">
        <h1>home</h1>
      </div>
    );
  };

  return (
    <section className={`${screenVersion}-menuSideBar-container`}>
      <div
        className="menuSideBar-userInfo"
        onMouseEnter={() => {
          setIsHoveringProfile(true);
        }}
        onMouseLeave={() => {
          setIsHoveringProfile(false);
        }}
      >
        <Image
          fluid
          roundedCircle
          src={user.profileimg}
          alt="user profile"
          className="profileImg"
          onClick={() => {
            handleActiveNav("profile");
            navigate("/Account");
          }}
        />
        <br />
        Profile
      </div>

      {isHoveringProfile && (
        <div
          className="profile-sidebar-container"
          onMouseEnter={() => {
            setIsHoveringProfile(true);
          }}
          onMouseLeave={() => {
            setIsHoveringProfile(false);
          }}
        >
          {renderProfileSidebar()}
        </div>
      )}

      <div
        className={`menu-item-1 ${homeActive ? "sidebar-active" : null}`}
        onMouseEnter={() => {
          setIsHoveringHome(true);
        }}
        onMouseLeave={() => {
          setIsHoveringHome(false);
        }}
      >
        <Image
          src={HomeIcon}
          alt="home icon"
          className="button-image"
          onClick={() => {
            handleActiveNav("home");
            navigate("/");
          }}
        />
        <br />
        Home
      </div>

      {isHoveringHome && (
        <div
          className="home-sidebar-container"
          onMouseEnter={() => {
            setIsHoveringHome(true);
          }}
          onMouseLeave={() => {
            setIsHoveringHome(false);
          }}
        >
          {renderHomeSidebar()}
        </div>
      )}

      <div
        className={`menu-item-2 ${lobbyActive ? "sidebar-active" : null}`}
        onMouseEnter={() => {
          setIsHoveringLobby(true);
        }}
        onMouseLeave={() => {
          setIsHoveringLobby(false);
        }}
      >
        <Image
          src={LobbyIcon}
          alt="lobby icon"
          className="button-image"
          onClick={() => {
            handleActiveNav("lobby");
            navigate("/Lobby");
          }}
        />
        <br />
        Lobby
      </div>

      {isHoveringLobby && (
        <div
          className="lobby-sidebar-container"
          onMouseEnter={() => {
            setIsHoveringLobby(true);
          }}
          onMouseLeave={() => {
            setIsHoveringLobby(false);
          }}
        >
          {/* {renderLobbySidebar()} */}
        </div>
      )}

      <div
        className={`menu-item-1 ${shopActive ? "sidebar-active" : null}`}
        onMouseEnter={() => {
          setIsHoveringShop(true);
        }}
        onMouseLeave={() => {
          setIsHoveringShop(false);
        }}
      >
        <Image
          src={ShopIcon}
          alt="shop icon"
          className="button-image"
          onClick={() => {
            handleActiveNav("shop");
            navigate("/Shop");
          }}
        />
        <br />
        Shop
      </div>

      {isHoveringShop && (
        <div
          className="shop-sidebar-container"
          onMouseEnter={() => {
            setIsHoveringShop(true);
          }}
          onMouseLeave={() => {
            setIsHoveringShop(false);
          }}
        >
          {/* {renderShopSidebar()} */}
        </div>
      )}

      <div
        className={`menu-item-2 ${inventoryActive ? "sidebar-active" : null}`}
      >
        <Image
          src={InventoryIcon}
          alt="inventory icon"
          className="button-image"
          onClick={() => {
            handleActiveNav("inventory");
            handleOpenInventory();
          }}
        />
        <br />
        Inventory
      </div>

      <div
        className={`menu-item-1 ${rankingActive ? "sidebar-active" : null}`}
        onMouseEnter={() => {
          setIsHoveringRanking(true);
        }}
        onMouseLeave={() => {
          setIsHoveringRanking(false);
        }}
      >
        <Image
          src={LeaderboardIcon}
          alt="leaderboard icon"
          className="button-image"
          onClick={() => {
            handleActiveNav("ranking");
            navigate("/Leaderboard");
          }}
        />
        <br />
        Ranking
      </div>

      {isHoveringRanking && (
        <div
          className="ranking-sidebar-container"
          onMouseEnter={() => {
            setIsHoveringRanking(true);
          }}
          onMouseLeave={() => {
            setIsHoveringRanking(false);
          }}
        >
          {/* {renderRankingSidebar()} */}
        </div>
      )}

      <div className={`menu-item-2 ${inboxActive ? "sidebar-active" : null}`}>
        <Image
          src={InboxIcon}
          alt="inbox icon"
          className="button-image"
          onClick={() => {
            handleActiveNav("inbox");
            navigate("/Inbox");
          }}
        />
        <br />
        Inbox
      </div>

      <div className={`menu-item-1 ${historyActive ? "sidebar-active" : null}`}>
        <Image
          src={HistoryIcon}
          alt="history icon"
          className="button-image"
          onClick={() => {
            handleActiveNav("history");
            navigate("/History");
          }}
        />
        <br />
        History
      </div>

      <div
        className={`menu-item-2 ${
          accountSettingsActive ? "sidebar-active" : null
        }`}
      >
        <Image
          src={AccountSettingsIcon}
          alt="account settings icon"
          className="button-image"
          onClick={() => {
            handleActiveNav("settings");
            navigate("/Accounts/Settings");
          }}
        />
        <br />
        Settings
      </div>

      <div className="sidebar-login-buttons">
        {user.is_guest === false ? (
          <div className="menu-item-sign-out">
            <Image
              src={SignOutIcon}
              alt="sign out icon"
              className="button-image"
              onClick={() => {
                setShowSignout(true);
                handleSidebarOpen();
              }}
            />
            <br />
            Sign Out
          </div>
        ) : (
          <>
            <div className="menu-item-sign-up">
              <Image
                src={SignUpIcon}
                alt="sign up icon"
                className="button-image"
                onClick={() => {
                  setShowSignUp(true);
                  handleSidebarOpen();
                }}
              />
              <br />
              Sign Up
            </div>

            <div className="menu-item-sign-in">
              <Image
                src={SignInIcon}
                alt="sign in icon"
                className="button-image"
                onClick={() => {
                  setShowSignIn(true);
                  handleSidebarOpen();
                }}
              />
              <br />
              Sign In
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Sidebar;
