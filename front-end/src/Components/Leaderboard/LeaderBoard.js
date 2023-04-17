import "./LeaderBoard.scss";
import { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import DetectScreenSize from "../../CustomFunctions/DetectScreenSize";
import LeaderBoardLowerResolution from "./LeaderBoardLowerResolution/LeaderBoardLowerResolution";
import LeaderBoardHigherResolution from "./LeaderBoardHigherResolution/LeaderBoardHigherResolution";

const LeaderBoard = ({ user, users }) => {
  let usersCopy = [];

  const [searchbar, setSearchbar] = useState("");
  const [screenSize, setScreenSize] = useState(0);

  /* Hooks that control arrows showing on hover and
    ascending/descending order
  */
  const [rankClicked, setRankClicked] = useState(false);
  const [usernameClicked, setusernameClicked] = useState(false);
  const [winsClicked, setWinsClicked] = useState(false);
  const [tiesClicked, setTiesClicked] = useState(false);
  const [lossesClicked, setLossesClicked] = useState(false);
  const [lastOnlineClicked, setLastOnlineClicked] = useState(false);

  const [showRankArrows, setShowRankArrows] = useState(false);
  const [isRankAscending, setIsRankAscending] = useState(true);
  const [showUsernameArrows, setShowUsernameArrows] = useState(false);
  const [isUsernameAscending, setIsUsernameAscending] = useState(true);
  const [showWinsArrows, setShowWinsArrows] = useState(false);
  const [isWinsAscending, setIsWinsAscending] = useState(true);
  const [showTiesArrows, setShowTiesArrows] = useState(false);
  const [isTiesAscending, setIsTiesAscending] = useState(true);
  const [showLossesArrows, setShowLossesArrows] = useState(false);
  const [isLossesAscending, setIsLossesAscending] = useState(true);
  const [showLastOnlineArrows, setShowLastOnlineArrows] = useState(false);
  const [isLastOnlineAscending, setIsLastOnlineAscending] = useState(true);

  useEffect(() => {
    const intervalFunctions = setInterval(() => {
      getScreenSize();
    });

    return () => clearInterval(intervalFunctions);
  }, []);

  const getScreenSize = () => {
    return setScreenSize(DetectScreenSize().width);
  };

  const handleChange = (e) => {
    setSearchbar(e.target.value);
  };

  if (searchbar !== "") {
    const usersList = [...users];
    usersCopy = usersList.filter((player) =>
      player.username.toLowerCase().includes(searchbar.toLowerCase())
    );
  } else {
    usersCopy = [...users];
  }

  // const handleRankClick = (event) => {
  //   // check if the click was on the word "Rank"
  //   if (event.target.textContent === "Rank") {
  //     const usersCopySorted = [...usersCopy].sort((userA, userB) => {
  //       // compare ranks, depending on the current order
  //       const compare = isRankAscending ? 1 : -1;
  //       return compare * (userA.rank - userB.rank);
  //     });
  //     usersCopy = usersCopySorted;
  //     setIsRankAscending(!isRankAscending); // toggle order
  //   }
  // };

  return (
    <section className="leaderboard-container">
      <div className="leaderboard-searchbar-container">
        <Form className="leaderboard-searchbar-form">
          <Form.Group controlId="leaderboard-searchbar-control">
            <h3>Player Name:</h3>
            <Form.Control
              type="text"
              placeholder="Search Player Name"
              onChange={handleChange}
              value={searchbar}
            />
          </Form.Group>
        </Form>
        <br />
      </div>
      <Table striped bordered hover className="leaderboard-table">
        <thead>
          <tr className="leaderboard-table-head-tr">
            <th className="leaderboard-table-head-th">
              <span
                className="showLeaderboardArrows"
                style={{ visibility: showRankArrows ? "visible" : "hidden" }}
              >
                {isRankAscending ? "↑" : "↓"}
              </span>
              <span
                onMouseEnter={() => setShowRankArrows(true)}
                onMouseLeave={() => setShowRankArrows(false)}
                onClick={() => {
                  setRankClicked(true);
                  setusernameClicked(false);
                  setWinsClicked(false);
                  setTiesClicked(false);
                  setLossesClicked(false);
                  setLastOnlineClicked(false);
                  setIsRankAscending(!isRankAscending);
                }}
                style={{ cursor: "pointer" }}
              >
                Rank{" "}
              </span>
              <span
                className="showLeaderboardArrows"
                style={{ visibility: showRankArrows ? "visible" : "hidden" }}
              >
                {isRankAscending ? "↑" : "↓"}
              </span>
            </th>
            <th className="leaderboard-table-head-th">
              <span
                className="showLeaderboardArrows"
                style={{
                  visibility: showUsernameArrows ? "visible" : "hidden",
                }}
              >
                {isUsernameAscending ? "↑" : "↓"}
              </span>
              <span
                onMouseEnter={() => setShowUsernameArrows(true)}
                onMouseLeave={() => setShowUsernameArrows(false)}
                onClick={() => {
                  setRankClicked(false);
                  setusernameClicked(true);
                  setWinsClicked(false);
                  setTiesClicked(false);
                  setLossesClicked(false);
                  setLastOnlineClicked(false);
                  setIsUsernameAscending(!isUsernameAscending);
                }}
                style={{ cursor: "pointer" }}
              >
                Username{" "}
              </span>
              <span
                className="showLeaderboardArrows"
                style={{
                  visibility: showUsernameArrows ? "visible" : "hidden",
                }}
              >
                {isUsernameAscending ? "↑" : "↓"}
              </span>
            </th>
            <th className="leaderboard-table-head-th">
              <span
                className="showLeaderboardArrows"
                style={{
                  visibility: showWinsArrows ? "visible" : "hidden",
                }}
              >
                {isWinsAscending ? "↑" : "↓"}
              </span>
              <span
                onMouseEnter={() => setShowWinsArrows(true)}
                onMouseLeave={() => setShowWinsArrows(false)}
                onClick={() => {
                  setRankClicked(false);
                  setusernameClicked(false);
                  setWinsClicked(true);
                  setTiesClicked(false);
                  setLossesClicked(false);
                  setLastOnlineClicked(false);
                  setIsWinsAscending(!isWinsAscending);
                }}
                style={{ cursor: "pointer" }}
              >
                Wins{" "}
              </span>
              <span
                className="showLeaderboardArrows"
                style={{
                  visibility: showWinsArrows ? "visible" : "hidden",
                }}
              >
                {isWinsAscending ? "↑" : "↓"}
              </span>
            </th>
            <th className="leaderboard-table-head-th">
              <span
                className="showLeaderboardArrows"
                style={{
                  visibility: showTiesArrows ? "visible" : "hidden",
                }}
              >
                {isTiesAscending ? "↑" : "↓"}
              </span>
              <span
                onMouseEnter={() => setShowTiesArrows(true)}
                onMouseLeave={() => setShowTiesArrows(false)}
                onClick={() => {
                  setRankClicked(false);
                  setusernameClicked(false);
                  setWinsClicked(false);
                  setTiesClicked(true);
                  setLossesClicked(false);
                  setLastOnlineClicked(false);
                  setIsTiesAscending(!isTiesAscending);
                }}
                style={{ cursor: "pointer" }}
              >
                Ties{" "}
              </span>
              <span
                className="showLeaderboardArrows"
                style={{
                  visibility: showTiesArrows ? "visible" : "hidden",
                }}
              >
                {isTiesAscending ? "↑" : "↓"}
              </span>
            </th>
            <th className="leaderboard-table-head-th">
              <span
                className="showLeaderboardArrows"
                style={{
                  visibility: showLossesArrows ? "visible" : "hidden",
                }}
              >
                {isLossesAscending ? "↑" : "↓"}
              </span>
              <span
                onMouseEnter={() => setShowLossesArrows(true)}
                onMouseLeave={() => setShowLossesArrows(false)}
                onClick={() => {
                  setRankClicked(false);
                  setusernameClicked(false);
                  setWinsClicked(false);
                  setTiesClicked(false);
                  setLossesClicked(true);
                  setLastOnlineClicked(false);
                  setIsLossesAscending(!isLossesAscending);
                }}
                style={{ cursor: "pointer" }}
              >
                Losses{" "}
              </span>
              <span
                className="showLeaderboardArrows"
                style={{
                  visibility: showLossesArrows ? "visible" : "hidden",
                }}
              >
                {isLossesAscending ? "↑" : "↓"}
              </span>
            </th>
            <th className="leaderboard-table-head-th">
              <span
                className="showLeaderboardArrows"
                style={{
                  visibility: showLastOnlineArrows ? "visible" : "hidden",
                }}
              >
                {isLastOnlineAscending ? "↑" : "↓"}
              </span>
              <span
                onMouseEnter={() => setShowLastOnlineArrows(true)}
                onMouseLeave={() => setShowLastOnlineArrows(false)}
                onClick={() => {
                  setRankClicked(false);
                  setusernameClicked(false);
                  setWinsClicked(false);
                  setTiesClicked(false);
                  setLossesClicked(false);
                  setLastOnlineClicked(true);
                  setIsLastOnlineAscending(!isLastOnlineAscending);
                }}
                style={{ cursor: "pointer" }}
              >
                Last Online{" "}
              </span>
              <span
                className="showLeaderboardArrows"
                style={{
                  visibility: showLastOnlineArrows ? "visible" : "hidden",
                }}
              >
                {isLastOnlineAscending ? "↑" : "↓"}
              </span>
            </th>
          </tr>
        </thead>
        <tbody className="leaderboard-table-body">
          {screenSize < 575 ? (
            <LeaderBoardLowerResolution
              user={user}
              usersCopy={usersCopy}
              isRankAscending={isRankAscending}
              isUsernameAscending={isUsernameAscending}
              isWinsAscending={isWinsAscending}
              isTiesAscending={isTiesAscending}
              isLossesAscending={isLossesAscending}
              isLastOnlineAscending={isLastOnlineAscending}
              rankClicked={rankClicked}
              usernameClicked={usernameClicked}
              winsClicked={winsClicked}
              tiesClicked={tiesClicked}
              lossesClicked={lossesClicked}
              lastOnlineClicked={lastOnlineClicked}
            />
          ) : (
            <LeaderBoardHigherResolution
              user={user}
              usersCopy={usersCopy}
              isRankAscending={isRankAscending}
              isUsernameAscending={isUsernameAscending}
              isWinsAscending={isWinsAscending}
              isTiesAscending={isTiesAscending}
              isLossesAscending={isLossesAscending}
              isLastOnlineAscending={isLastOnlineAscending}
              rankClicked={rankClicked}
              usernameClicked={usernameClicked}
              winsClicked={winsClicked}
              tiesClicked={tiesClicked}
              lossesClicked={lossesClicked}
              lastOnlineClicked={lastOnlineClicked}
            />
          )}
        </tbody>
      </Table>
    </section>
  );
};

export default LeaderBoard;
