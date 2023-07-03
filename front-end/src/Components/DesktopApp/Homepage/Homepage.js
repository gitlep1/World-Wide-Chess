import "./Homepage.scss";
import { useState } from "react";
import { Image } from "react-bootstrap";

import DailyTasks from "./HomepageTasks/DailyTasks";
import MonthlyTasks from "./HomepageTasks/MonthlyTasks";

import HomepageFacts from "./HomepageFacts/HomepageFacts";

const Homepage = () => {
  let topPlayer = {};

  const [dailyTaskSelected, setDailyTaskSelected] = useState(true);
  const [monthlyTaskSelected, setMonthlyTaskSelected] = useState(false);

  const handleSelectedTaskButton = (taskSelected) => {
    if (taskSelected === "daily") {
      setDailyTaskSelected(true);
      setMonthlyTaskSelected(false);
    } else if (taskSelected === "monthly") {
      setDailyTaskSelected(false);
      setMonthlyTaskSelected(true);
    }
  };

  return (
    <section className="desktop-homepage-container">
      <div className="homepage-topPlayer">
        <h1>
          Top Player: WIP
          {Object.keys(topPlayer).length > 0 ? (
            <span id="topPlayer-border">
              <Image src={topPlayer.profileimg} alt="top-player" />
              <span id="topPlayer-background"> {topPlayer.username}</span>
            </span>
          ) : null}
        </h1>
      </div>

      <div className="homepage-content">
        <div className="homepage-tasks-container">
          <div className="homepage-tasks">
            <div
              className={
                dailyTaskSelected
                  ? "desktop-dailyTasks-button-selected"
                  : "desktop-dailyTasks-button"
              }
              onClick={() => {
                handleSelectedTaskButton("daily");
              }}
            >
              <h3>
                Daily <br /> Tasks
              </h3>
            </div>
            <div
              className={
                monthlyTaskSelected
                  ? "desktop-monthlyTasks-button-selected"
                  : "desktop-monthlyTasks-button"
              }
              onClick={() => {
                handleSelectedTaskButton("monthly");
              }}
            >
              <h3>
                Monthly <br /> Tasks
              </h3>
            </div>
          </div>
          <div id="tasks-divider"></div>
          <div id="tasks-container">
            {dailyTaskSelected ? <DailyTasks /> : <MonthlyTasks />}
          </div>
        </div>

        <div className="homepage-facts-container">
          <h1>Daily Chess Facts</h1>
          <HomepageFacts />
          {/* <ul className="chessFacts">
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
          </ul> */}
        </div>
      </div>
    </section>
  );
};

export default Homepage;
