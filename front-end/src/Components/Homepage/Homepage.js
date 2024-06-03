import "./Homepage.scss";
import { useState } from "react";

import DailyTasks from "./HomepageTasks/DailyTasks";
import MonthlyTasks from "./HomepageTasks/MonthlyTasks";

import HomepageFacts from "./HomepageFacts/HomepageFacts";

const Homepage = ({ screenVersion, user, token }) => {
  const [dailyTaskSelected, setDailyTaskSelected] = useState(true);

  const handleSelectedTaskButton = (taskSelected) => {
    if (taskSelected === "daily") {
      setDailyTaskSelected(true);
    } else if (taskSelected === "monthly") {
      setDailyTaskSelected(false);
    }
  };

  return (
    <section className={`${screenVersion}-homepage-container`}>
      <section className="homepage-main-section">
        <div className="homepage-section-one">
          <div className="homepage-welcome-user">
            <h3>
              Welcome <br /> {user.username}
            </h3>
          </div>

          <div className="homepage-previous-matches">Previous Matches</div>
        </div>

        <div className="homepage-section-two">
          <h3>Tasks</h3>
          <div className="homepage-section-two-tasks">
            <div className="tasks-container">
              <div className="task-button-container">
                <h4
                  className={`task-button ${
                    dailyTaskSelected ? "task-selected" : null
                  }`}
                  onClick={() => {
                    handleSelectedTaskButton("daily");
                  }}
                >
                  Daily
                </h4>
                <h4
                  className={`task-button ${
                    dailyTaskSelected ? null : "task-selected"
                  }`}
                  onClick={() => {
                    handleSelectedTaskButton("monthly");
                  }}
                >
                  Monthly
                </h4>
              </div>
              <div className="tasks-content">
                {dailyTaskSelected ? (
                  <DailyTasks user={user} token={token} />
                ) : (
                  <MonthlyTasks user={user} token={token} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="homepage-footer-container">
        <HomepageFacts />
        <div className="homepage-filler-space"></div>
        <h4 className="homepage-footer-title">
          World Wide Chess <br />
          &copy; 2022
        </h4>
      </footer>
    </section>
  );
};

export default Homepage;
