import "./LeaderBoardLowerResolution.scss";
import { nanoid } from "nanoid";
import moment from "moment";

const LeaderBoardLowerResolution = ({
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
  const convertLastOnline = (lastOnline) => {
    const date = new Date(lastOnline);
    const dateFormatted = moment(date).format("MMMM DD, Y");
    return dateFormatted;
  };

  usersCopy.sort((a, b) => b.wins - a.wins);

  /* use after figuring out how to style for lower than 575px screens */
  return usersCopy.map((player, index) => {
    return (
      <tr key={nanoid()}>
        <td>{index + 1}</td>
        <td>{player.username}</td>
        <td>{player.wins}</td>
        <td>{player.ties}</td>
        <td>{player.loss}</td>
        <td className="lastOnline-data">
          {convertLastOnline(player.created_at)}
        </td>
      </tr>
    );
  });
};

/* use join date for now but find a way to do last online later (check anytime the user logs in or if their account is active) */

export default LeaderBoardLowerResolution;
