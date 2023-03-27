import { useNavigate } from "react-router-dom";

const NavBarHigherResolution = ({ handleOpen }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="lobbyAndLeaderboard-container">
        <div
          id="navbarLink-lobby-container"
          onClick={() => {
            navigate("/Lobby");
          }}
        >
          Lobby
        </div>

        <div
          id="navbarLink-leaderboard-container"
          onClick={() => {
            navigate("/Leaderboard");
          }}
        >
          Leaderboard
        </div>
      </div>

      <div className="shopAndAccount-container">
        <div
          id="navbarLink-shop-container"
          onClick={() => {
            navigate("/Shop");
          }}
        >
          Shop
        </div>

        <div
          onClick={() => {
            handleOpen();
          }}
          id="navbarLink-account-container"
        >
          Account
        </div>
      </div>
    </>
  );
};

export default NavBarHigherResolution;
