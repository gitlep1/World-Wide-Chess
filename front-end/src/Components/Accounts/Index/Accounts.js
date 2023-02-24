import "./Accounts.scss";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

const Accounts = ({ user, users }) => {
  const renderPlayers = () => {
    return users.map((player) => {
      return (
        <tr key={player.id}>
          <td>
            {player.id === user.id ? (
              <div className="matchingPlayer">
                <Link to={`/Accounts/${player.id}`} className="playerLinks">
                  <img src={player.profileimg} alt="profile" />{" "}
                  <strong>{player.username}</strong>
                </Link>
              </div>
            ) : (
              <Link to={`/Accounts/${player.id}`} className="playerLinks">
                <img src={player.profileimg} alt="profile" />{" "}
                <strong>{player.username}</strong>
              </Link>
            )}
          </td>
          <td>0</td>
          <td>0</td>
        </tr>
      );
    });
  };

  return (
    <section className="playerAccountsSection">
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>username</th>
            <th>Wins</th>
            <th>Losses</th>
          </tr>
        </thead>
        <tbody>{renderPlayers()}</tbody>
      </Table>
    </section>
  );
};

export default Accounts;
