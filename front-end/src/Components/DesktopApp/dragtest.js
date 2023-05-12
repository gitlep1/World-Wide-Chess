import DraggableCard from "./dragtest2";
import { useState } from "react";
import { nanoid } from "nanoid";

const Dragtest = () => {
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
  ]);

  const handleCardSwipe = (cardIndex) => {
    setCards((prevCards) => {
      const newCards = [...prevCards];

      // Remove the current card from the array and move it to the bottom
      const [removed] = newCards.splice(cardIndex, 1);
      newCards.push(removed);

      return newCards;
    });
  };

  return (
    <div style={{ width: "500px", margin: "0 auto" }}>
      {cards.map(({ id, title, fact }, index) => (
        <div key={nanoid()}>
          <DraggableCard onSwipe={() => handleCardSwipe(index)}>
            <div
              style={{
                padding: "20px",
                backgroundColor: "white",
                boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
              }}
            >
              <h1>{title}</h1>
              <p>{fact}</p>
            </div>
          </DraggableCard>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Dragtest;
