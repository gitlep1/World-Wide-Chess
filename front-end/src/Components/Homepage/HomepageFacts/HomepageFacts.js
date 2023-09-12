import "./HomepageFacts.scss";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import HomepageFactsDraggable from "./HomepageFactsDraggable";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const HomepageFacts = ({ screenVersion }) => {
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllFacts();
  }, []);

  const getAllFacts = async () => {
    setLoading(true);
    return axios
      .get(`${API}/facts`)
      .then((res) => {
        setFacts(res.data.payload);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  const handleCardSwipe = (cardIndex) => {
    setFacts((prevFacts) => {
      const newCards = [...prevFacts];
      const [removed] = newCards.splice(cardIndex, 1);
      newCards.push(removed);

      return newCards;
    });
  };

  const renderFacts = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-bar">Loading...</div>
        </div>
      );
    } else if (error) {
      return <h1>Error: {error}</h1>;
    } else {
      return facts.map(({ fact_num, fact }, index) => (
        <div key={nanoid()}>
          <HomepageFactsDraggable onSwipe={() => handleCardSwipe(index)}>
            <div>
              <h1>
                {fact_num}/{facts.length}
              </h1>
              <p>{fact}</p>
            </div>
          </HomepageFactsDraggable>
          <br />
        </div>
      ));
    }
  };

  return (
    <div className={`${screenVersion}-homepage-facts`}>{renderFacts()}</div>
  );
};

export default HomepageFacts;
