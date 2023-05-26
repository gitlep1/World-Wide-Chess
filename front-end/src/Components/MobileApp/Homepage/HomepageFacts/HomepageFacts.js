import "./HomepageFacts.scss";
import { useState } from "react";
import { nanoid } from "nanoid";
import HomepageFactsDraggable from "./HomepageFactsDraggable";

const HomepageFacts = () => {
  const [cards, setCards] = useState([
    {
      id: 1,
      title: "1/100",
      fact: "Legend has it that chess was invented around 200 B. C. by a commander, Hán Xin, who invented the game as a battle simulator. Soon after winning the battle, the game was forgotten, but it resurfaced in the 7th century.",
    },
    {
      id: 2,
      title: "2/100",
      fact: "Chess is a required school subject in Armenia.",
    },
    {
      id: 3,
      title: "3/100",
      fact: "The longest official game of chess took place in 1989 that went on for 20 hours and included 269 moves.",
    },
    {
      id: 4,
      title: "4/100",
      fact: "In a single game of chess, there are 400 possible moves after each move played.",
    },
  ]);

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
      {cards.map(({ id, title, fact }, index) => (
        <div key={nanoid()}>
          <HomepageFactsDraggable onSwipe={() => handleCardSwipe(index)}>
            <div>
              <h1>{title}</h1>
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
