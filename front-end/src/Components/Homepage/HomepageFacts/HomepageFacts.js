import "./HomepageFacts.scss";
import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

import HomepageFactsDraggable from "./HomepageFactsDraggable";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const HomepageFacts = ({ screenVersion }) => {
  const fakeLoadingArr = [1, 2, 3];

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
        <div className="homepage-skeleton-loading-container">
          <SkeletonTheme baseColor="#aaa" highlightColor="#555">
            {fakeLoadingArr.map((num) => {
              return (
                <div key={nanoid()} className="homepage-skeleton-loading-card">
                  <h1>
                    <Skeleton width="15%" />
                  </h1>
                  <p>
                    <Skeleton count={5} width="95%" />
                  </p>
                </div>
              );
            })}
          </SkeletonTheme>
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
