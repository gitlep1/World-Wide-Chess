import "./Lobby.scss";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import axios from "axios";

const Lobbypage = ({ user, games }) => {
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  const handleCreate = async () => {
    const newGameData = {
      player1ID: user.id,
    };

    await axios.post(`${API}/games`, newGameData).then(async (res) => {
      navigate(`/Games/${res.data.id}/Edit`);
    });
  };

  const handleJoin = async (gameID) => {
    const updatePlayer2 = {
      player2ID: user.id,
      inProgress: true,
    };

    await axios.put(`${API}/games/${gameID}`, updatePlayer2).then((res) => {
      navigate(`/Games/${res.data.id}/Edit`);
    });
  };

  return (
    <section>
      <section className="lobbySection1">
        <div
          onClick={() => {
            handleCreate();
          }}
          className="createGameLink"
        >
          <div>CREATE</div>
        </div>
        <h1>Lobby</h1>
      </section>
      <section className="lobbySection2">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Players</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {games.map((game) => {
              return (
                <tr key={game.id}>
                  <td>{game.id}</td>
                  <td>
                    {game.player1id && game.player2id ? (
                      <>
                        {game.player1} VS {game.player2}
                      </>
                    ) : (
                      <>{game.player1} Is Searching for an opponent...</>
                    )}
                  </td>
                  <td className="status">
                    {game.player2 ? (
                      <section className="lobbyStatusLinks">
                        <Link
                          to={`/Games/${game.id}`}
                          className="lobbyStatus1Parent"
                        >
                          <div>SPECTATE</div>
                        </Link>
                        <div className="lobbyStatusParent2">
                          <div>JOIN</div>
                        </div>
                      </section>
                    ) : (
                      <section className="lobbyStatusLinks">
                        <div className="lobbyStatusParent2">
                          <div>SPECTATE</div>
                        </div>

                        <div
                          className="lobbyStatus1Parent"
                          onClick={() => {
                            handleJoin(game.id);
                          }}
                        >
                          <div>JOIN</div>
                        </div>
                      </section>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </section>
    </section>
  );
};

export default Lobbypage;
