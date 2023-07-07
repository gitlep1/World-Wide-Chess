import "./Homepage.scss";
import { useState } from "react";
import { Image } from "react-bootstrap";

import DailyTasks from "./HomepageTasks/DailyTasks";
import MonthlyTasks from "./HomepageTasks/MonthlyTasks";

import HomepageFacts from "./HomepageFacts/HomepageFacts";

const Homepage = ({ screenVersion }) => {
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
    <section className={`${screenVersion}-homepage-container`}>
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
                  ? "dailyTasks-button-selected"
                  : "dailyTasks-button"
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
                  ? "monthlyTasks-button-selected"
                  : "monthlyTasks-button"
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
          <HomepageFacts screenVersion={screenVersion} />
        </div>
      </div>
    </section>
  );
};

export default Homepage;
