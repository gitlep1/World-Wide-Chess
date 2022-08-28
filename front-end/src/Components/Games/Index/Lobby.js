import "./Lobby.scss";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import axios from "axios";

const Lobbypage = () => {
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API_URL;

  const [games, setGames] = useState([]);
  const [users, setUsers] = useState([]);

  const getUsers = async () => {
    await axios.get(`${API}/users`).then((res) => {
      setUsers(res.data);
    });
  };

  const getGames = async () => {
    await axios.get(`${API}/games`).then((res) => {
      setGames(res.data);
    });
  };

  useEffect(() => {
    getUsers();
    getGames();

    const interval = setInterval(() => {
      getUsers();
      getGames();
    }, 1000);

    return () => clearInterval(interval);
  }, []); // eslint-disable-line

  const handleCreate = () => {
    axios.post(`${API}/games`).then(async (res) => {
      console.log(res.data);
      // await getGames();
      // navigate(`/Games/${games[games.length - 1].id}`);
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
                        {game.player1id} VS {game.player2id}
                      </>
                    ) : (
                      <>{game.player1id} Is Searching for an opponent...</>
                    )}
                  </td>
                  <td className="status">
                    {game.in_progress ? (
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

                        <Link
                          to={`/Games/${game.id}/Edit`}
                          className="lobbyStatus1Parent"
                        >
                          <div>JOIN</div>
                        </Link>
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
