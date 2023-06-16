import "./HomepageFacts.scss";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import HomepageFactsDraggable from "./HomepageFactsDraggable";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const HomepageFacts = () => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/facts`)
      .then((res) => {
        setCards(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

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
      {cards.map(({ fact_num, fact }, index) => (
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
      ))}
    </div>
  );
};

export default HomepageFacts;
