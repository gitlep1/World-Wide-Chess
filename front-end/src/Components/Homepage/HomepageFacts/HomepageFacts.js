import "./HomepageFacts.scss";
import { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { IoArrowRedoSharp, IoArrowUndo } from "react-icons/io5";
import axios from "axios";

import HomepageFactsDraggable from "./HomepageFactsDraggable";

const API = process.env.REACT_APP_API_URL;

const HomepageFacts = ({ screenVersion }) => {
  const fakeLoadingArr = [1, 2, 3];

  const [factHeight, setFactHeight] = useState(null);
  const factRef = useRef(null);

  const [facts, setFacts] = useState([]);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllFacts();
  }, []);

  useEffect(() => {
    if (factRef.current) {
      setFactHeight(factRef.current.offsetHeight);
    }
  }, [facts]);

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

  const handleArrowClick = (direction) => {
    if (direction === "left") {
      setCurrentFactIndex((prevIndex) =>
        prevIndex === 0 ? facts.length - 1 : prevIndex - 1
      );
    } else if (direction === "right") {
      setCurrentFactIndex((prevIndex) =>
        prevIndex === facts.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const renderFacts = () => {
    if (loading) {
      return (
        <div className="homepage-skeleton-loading-container">
          <SkeletonTheme baseColor="#aaa" highlightColor="#555">
            {fakeLoadingArr.map(() => {
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
      return (
        <div className="homepage-facts-card">
          <h1 className="homepage-facts-title">Chess Facts</h1>
          <div className="homepage-fact-number-container">
            <h3 className="homepage-fact-number">
              {facts[currentFactIndex].fact_num}/{facts.length}
            </h3>

            <div className="homepage-fact-left-arrow">
              <IoArrowUndo
                className="homepage-arrow"
                onClick={() => handleArrowClick("left")}
              />
            </div>
            <div className="homepage-fact-right-arrow">
              <IoArrowRedoSharp
                className="homepage-arrow"
                onClick={() => handleArrowClick("right")}
              />
            </div>
          </div>

          <p
            ref={factRef}
            className="homepage-fact"
            style={{ height: `${factHeight}px`, overflow: "hidden" }}
          >
            {facts[currentFactIndex].fact}
          </p>
        </div>
      );
    }
  };

  return renderFacts();
};

export default HomepageFacts;
