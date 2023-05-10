import "./LeaderBoardHigherResolution.scss";
import { Image } from "react-bootstrap";
import { nanoid } from "nanoid";
import moment from "moment";
import "moment-timezone";

const LeaderBoardHigherResolution = ({
  user,
  usersCopy,
  isRankAscending,
  isUsernameAscending,
  isWinsAscending,
  isTiesAscending,
  isLossesAscending,
  isLastOnlineAscending,
  rankClicked,
  usernameClicked,
  winsClicked,
  tiesClicked,
  lossesClicked,
  lastOnlineClicked,
}) => {
  const convertLastOnline = (lastOnline, timezone) => {
    const lastOnlineMoment = moment.tz(lastOnline, timezone);
    const now = moment.tz(timezone);
    const duration = moment.duration(now.diff(lastOnlineMoment));
    const seconds = duration.asSeconds();

    switch (true) {
      case seconds < 60:
        return "Just now";
      case seconds < 3600:
        const minutes = Math.floor(seconds / 60);
        return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
      case seconds < 86400:
        const hours = Math.floor(seconds / 3600);
        return `${hours} hour${hours === 1 ? "" : "s"} ago`;
      case seconds < 604800:
        const days = Math.floor(seconds / 86400);
        return `${days} day${days === 1 ? "" : "s"} ago`;
      case seconds < 2419200:
        const weeks = Math.floor(seconds / 604800);
        return `${weeks} week${weeks === 1 ? "" : "s"} ago`;
      case seconds < 31536000:
        const months = Math.floor(seconds / 2419200);
        return `${months} month${months === 1 ? "" : "s"} ago`;
      default:
        const years = Math.floor(seconds / 31536000);
        return `${years} year${years === 1 ? "" : "s"} ago`;
    }
  };

  if (rankClicked) {
    if (isRankAscending) {
      usersCopy.sort((a, b) => b.wins - a.wins);
    } else {
      usersCopy.sort((a, b) => b.wins + a.wins);
    }
  }

  if (usernameClicked) {
    const compare = (a, b) => {
      const aName = a.username.toLowerCase();
      const bName = b.username.toLowerCase();
      if (isUsernameAscending) {
        if (aName < bName) {
          return -1;
        } else if (aName > bName) {
          return 1;
        } else {
          return 0;
        }
      } else {
        if (aName < bName) {
          return 1;
        } else if (aName > bName) {
          return -1;
        } else {
          return 0;
        }
      }
    };
    usersCopy.sort(compare);
  }

  if (winsClicked) {
    if (isWinsAscending) {
      usersCopy.sort((a, b) => b.wins - a.wins);
    } else {
      usersCopy.sort((a, b) => b.wins + a.wins);
    }
  }

  if (tiesClicked) {
    if (isTiesAscending) {
      usersCopy.sort((a, b) => b.ties - a.ties);
    } else {
      usersCopy.sort((a, b) => b.ties + a.ties);
    }
  }

  if (lossesClicked) {
    if (isLossesAscending) {
      usersCopy.sort((a, b) => b.loss - a.loss);
    } else {
      usersCopy.sort((a, b) => b.loss + a.loss);
    }
  }

  if (lastOnlineClicked) {
    const compare = (a, b) => {
      const aTimestamp = moment.tz(a.last_online, "UTC").unix();
      const bTimestamp = moment.tz(b.last_online, "UTC").unix();
      if (isLastOnlineAscending) {
        return aTimestamp - bTimestamp;
      } else {
        return bTimestamp - aTimestamp;
      }
    };
    usersCopy.sort(compare);
  }

  return (
    <>
      {usersCopy.map((player, index) => {
        return (
          <tr key={nanoid()} className="leaderboard-table-head-tr">
            <td className="leaderboard-table-head-td">{index + 1}</td>
            {/* <td className="leaderboard-table-head-td">{player.id}</td> */}
            {player.id === user.id ? (
              <td className="leaderboard-table-head-td leaderboard-table-user">
                {/* <Image src={player.profileimg} alt="player profile" /> */}
                {player.username}
              </td>
            ) : (
              <td className="leaderboard-table-head-td">
                {/* <Image src={player.profileimg} alt="player profile" /> */}
                {player.username}
              </td>
            )}

            <td className="leaderboard-table-head-td">{player.wins}</td>
            <td className="leaderboard-table-head-td">{player.ties}</td>
            <td className="leaderboard-table-head-td">{player.loss}</td>
            <td className="leaderboard-table-head-td">
              {convertLastOnline(player.last_online, "UTC")}
            </td>
          </tr>
        );
      })}
    </>
  );
};

export default LeaderBoardHigherResolution;
