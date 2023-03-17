import "./App.scss";
import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { scaleRotate as SidebarMenu } from "react-burger-menu";
// import { MDBFooter } from "mdb-react-ui-kit";

// Nav stuff \\
import Home from "./Components/Homepage/Homepage";
import NavBar from "./Components/NavBar/NavBar";
import Sidebar from "./Components/Sidebar/Sidebar";
import FoF from "./Components/FourOFour/FoF";

// Account stuff \\
import Accounts from "./Components/Accounts/Index/Accounts";
import AccountPage from "./Components/Accounts/Show/AccountPage";
import AccountDetails from "./Components/Accounts/Edit/AccountDetails";
// import Signup from "./Components/Accounts/Signup/SignUp";
// import Signin from "./Components/Accounts/Signin/SignIn";

// Game stuff \\
import Lobby from "./Components/Games/Index/Lobby";
import GameSettings from "./Components/Games/Edit/GameSettings";
import GamePage from "./Components/Games/Show/GamePage";

// Custom hooks stuff \\
import GetApi from "./CustomHooks/GetApi";

// V2 Wireframe stuff \\
import LandingPage from "./Components/LandingPage/LandingPage";
import Homepage from "./Components/Homepage/Homepage";

const App = () => {
  const API = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();
  const [getData, cancelRequests] = GetApi();

  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  const [games, setGames] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [resize, setResize] = useState("");

  useEffect(() => {
    getGamesAndUsers();
    setLocalStorage();

    const intervalFunctions = setInterval(() => {
      resizeSidebar();
    }, 1000);

    return () => clearInterval(intervalFunctions);
  }, []); // eslint-disable-line

  const getGamesAndUsers = async () => {
    await getData(`${API}/games`, setGames);
    await getData(`${API}/users`, setUsers);

    return cancelRequests;
  };

  const setLocalStorage = async () => {
    const data = window.localStorage.getItem("Current_User");
    const authenticated = window.localStorage.getItem("Authenticated");

    if (data !== null && authenticated !== null) {
      setUser(JSON.parse(data));
      setAuthenticated(JSON.parse(authenticated));
    }
  };

  const resizeSidebar = () => {
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
  };

  const handleSidebarOpen = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  const handleUser = (user) => {
    if (user) {
      setUser(user);
      setAuthenticated(true);
      window.localStorage.setItem("Current_User", JSON.stringify(user));
      window.localStorage.setItem("Authenticated", JSON.stringify(true));
      navigate(`/Homepage`);
    } else {
      return;
    }
  };

  const handleLogout = () => {
    setUser({});
    setAuthenticated(false);
    const data = window.localStorage.getItem("Current_User");
    const authenticated = window.localStorage.getItem("Authenticated");

    if (data !== null && authenticated !== null) {
      window.localStorage.setItem("Current_User", JSON.stringify({}));
      window.localStorage.setItem("Authenticated", JSON.stringify(false));
    }
    navigate("/");
    setIsOpen(false);
  };

  const handleRefresh = async () => {
    getData(`${API}/games`, setGames);
    return cancelRequests;
  };

  return (
    <section id="outer-container">
      {user && authenticated ? (
        <>
          <h1 id="worldWideChessHeader">WORLD WIDE CHESS</h1>
          <NavBar
            handleOpen={handleSidebarOpen}
            authenticated={authenticated}
          />
          <SidebarMenu
            pageWrapId={"page-wrap"}
            outerContainerId={"outer-container"}
            isOpen={isOpen}
            onClose={handleSidebarOpen}
            customBurgerIcon={false}
            right
            width={resize}
          >
            <Sidebar
              user={user}
              authenticated={authenticated}
              handleLogout={handleLogout}
              handleSidebarOpen={handleSidebarOpen}
            />
          </SidebarMenu>

          <main id="page-wrap">
            <Routes>
              <Route path="/">
                {/* Account Routes */}
                <Route path="/" index element={<Homepage />} />
                <Route
                  path="Accounts"
                  element={<Accounts user={user} users={users} />}
                />
                <Route
                  path="Accounts/:userID"
                  element={<AccountPage user={user} />}
                />
                <Route
                  path="Accounts/:userID/Edit"
                  element={
                    <AccountDetails
                      user={user}
                      users={users}
                      handleUser={handleUser}
                      handleLogout={handleLogout}
                    />
                  }
                />
                {/* Game routes */}
                <Route
                  path="Games/"
                  element={
                    <Lobby
                      user={user}
                      games={games}
                      handleRefresh={handleRefresh}
                    />
                  }
                />
                <Route
                  path="Games/:gameID"
                  element={<GamePage user={user} />}
                />
                <Route
                  path="Games/:gameID/Edit"
                  element={<GameSettings user={user} games={games} />}
                />
                <Route path="*" element={<FoF />} />
              </Route>
            </Routes>
          </main>
        </>
      ) : (
        <LandingPage handleUser={handleUser} users={users} />
      )}

      {/* add different info for footer later */}
      {/* <MDBFooter id="footer">
        <div
          className="text-center p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.05)" }}
        >
          ©World Wide Chess Copyright:{" "}
          <a
            className="text-reset fw-bold"
            href="https://github.com/gitlep1"
            rel="nooppener noreferrer"
            target="_blank"
          >
            gitlep1
          </a>
        </div>
      </MDBFooter> */}
    </section>
  );
};

export default App;
