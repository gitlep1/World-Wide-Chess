import "./HomepageFacts.scss";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import HomepageFactsDraggable from "./HomepageFactsDraggable";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const HomepageFacts = () => {
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllFacts();
  }, []);

  const getAllFacts = async () => {
    return axios
      .get(`${API}/facts`)
      .then((res) => {
        setCards(res.data.payload);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  // example of using headers in axios \\
  // const getAllFacts = async () => {
  //   let authToken = "";
  //   const data = window.localStorage.getItem("Current_User");
  //   const authenticated = window.localStorage.getItem("Authenticated");

  //   if (data !== null && authenticated !== null) {
  //     authToken = JSON.parse(data).token;
  //   }
  //   return axios
  //     .get(`${API}/facts`, {
  //       headers: {
  //         Authorization: `Bearer ${authToken}`,
  //       },
  //     })
  //     .then((res) => {
  //       setCards(res.data.payload);
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     });
  // };

  const handleCardSwipe = (cardIndex) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];
      const [removed] = newCards.splice(cardIndex, 1);
      newCards.push(removed);

      return newCards;
    });
  };

  return (
    <div className="homepage-facts">
      {!error ? (
        cards.map(({ fact_num, fact }, index) => (
          <div key={nanoid()}>
            <HomepageFactsDraggable onSwipe={() => handleCardSwipe(index)}>
              <div>
                <h1>
                  {fact_num}/{cards.length}
                </h1>
                <p>{fact}</p>
              </div>
            </HomepageFactsDraggable>
            <br />
          </div>
        ))
      ) : (
        <h1>{error}</h1>
      )}
    </div>
  );
};

export default HomepageFacts;
