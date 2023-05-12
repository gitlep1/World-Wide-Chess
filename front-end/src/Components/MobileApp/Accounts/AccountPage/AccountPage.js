import "./AccountPage.scss";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const AccountPage = ({ user }) => {
  const { userID } = useParams();

  const [username, setUsername] = useState("");
  const [profImg, setProfImg] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    const getUser = setInterval(async () => {
      await axios
        .get(`${API}/users/${userID}`)
        .then((res) => {
          setUsername(res.data[0].username);
          setProfImg(res.data[0].profileimg);
        })
        .catch((err) => {
          setError(err);
        });
    }, 1000);

    return () => clearInterval(getUser);
  }, []); // eslint-disable-line

  return (
    <section className="AccountPageSection">
      {error && <p>{error}</p>}
      <img src={profImg} alt="the players profile" />
      <h1>{username}</h1>
      <h3>Wins: 0</h3>
      <h3>Losses: 0</h3>
    </section>
  );
};

export default AccountPage;
