import "./Homepage.scss";
import { useState } from "react";
import { Image } from "react-bootstrap";

import DailyTasks from "./DailyTasks";
import MonthlyTasks from "./MonthlyTasks";

const Homepage = ({ users }) => {
  const [selectedTaskButton, setSelectedTaskButton] = useState(false);

  let topPlayer = {};

  users.map((player) => {
    if (player.id === 4) {
      player["wins"] = 3;
    }
    return null;
  });

  users.filter((player) => {
    if (player.wins > 0) {
      topPlayer = player;
    }
    return topPlayer;
  });

  return (
    <section className="homepageSection">
      <div className="homepage-topPlayer">
        <h1>
          * Top Player:
          <span id="topPlayer-border">
            <Image src={topPlayer.profileimg} alt="top-player" />
            <span id="topPlayer-background"> {topPlayer.username}</span>
          </span>
          *
        </h1>
      </div>

      <div className="homepage-content">
        <div className="homepage-tasks-container">
          <div className="homepage-tasks">
            <div
              className={
                selectedTaskButton
                  ? "dailyTasks-button"
                  : "dailyTasks-button-selected"
              }
              onClick={() => setSelectedTaskButton(!selectedTaskButton)}
            >
              <h3>Daily Tasks</h3>
            </div>
            <div
              className={
                selectedTaskButton
                  ? "monthlyTasks-button-selected"
                  : "monthlyTasks-button"
              }
              onClick={() => setSelectedTaskButton(!selectedTaskButton)}
            >
              <h3>Monthly Tasks</h3>
            </div>
          </div>
          <div id="tasks-divider"></div>
          <div id="tasks-container">
            {selectedTaskButton ? <MonthlyTasks /> : <DailyTasks />}
          </div>
        </div>

        <div className="homepage-facts">
          <h1>Daily Chess Facts</h1>
          <ul className="chessFacts">
            <li>
              Legend has it that chess was invented around 200 B. C. by a
              commander, Hán Xin, who invented the game as a battle simulator.
              Soon after winning the battle, the game was forgotten, but it
              resurfaced in the 7th century.
            </li>
            <br />

            <li>Chess is a required school subject in Armenia.</li>
            <br />

            <li>
              The longest official game of chess took place in 1989 that went on
              for 20 hours and included 269 moves.
            </li>
            <br />

            <li>
              In a single game of chess, there are 400 possible moves after each
              move played.
            </li>
            <br />

            <li>
              It is possible to checkmate your opponent in just two moves.
            </li>
            <br />

            <li>Chess is a proven way to improve memory function.</li>
            <br />

            <li>
              The world record for the number of moves without capture is 100,
              and was set in 1992.
            </li>
            <br />

            <li>
              About 70% of the adult population has played chess at some point
              in their lives, and about 605 million adults play chess regularly.
            </li>
            <br />

            <li>
              The game of chess is believed to have originated in India, where
              it was call Chaturange prior to the 6th century AD.
            </li>
            <br />

            <li>
              The game of chess reached Western Europe around the year 1000.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Homepage;
