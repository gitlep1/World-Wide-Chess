import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const LeavingPage = async (gameID, token, navigate) => {
  const warnUserLeavingPage = () => {
    window.addEventListener("beforeunload", alertUser);
    window.addEventListener("unload", handleEndPoint);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
      window.removeEventListener("unload", handleEndPoint);
    };
  };

  const alertUser = (e) => {
    e.preventDefault();
    e.returnValue = "Are you sure you want to leave this page?";
  };

  const handleEndPoint = async () => {
    console.log("user left page");
    // await axios.delete(`${API}/single-player-games/${gameID}`, {
    //   headers: {
    //     authorization: `Bearer ${token}`,
    //   },
    // });
    // navigate("/Lobby");
  };

  return warnUserLeavingPage();
};

export default LeavingPage;
