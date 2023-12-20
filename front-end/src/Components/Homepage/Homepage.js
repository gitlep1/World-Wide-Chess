import "./Homepage.scss";
import { useState } from "react";
import { Image } from "react-bootstrap";

import Logo from "../../Images/Logo.png";

import DailyTasks from "./HomepageTasks/DailyTasks";
import MonthlyTasks from "./HomepageTasks/MonthlyTasks";

import HomepageFacts from "./HomepageFacts/HomepageFacts";

const Homepage = ({ screenVersion, user, token }) => {
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
      {/* <header id="homepage-header">
        <Image src={Logo} alt="Logo" id="logoImg" />
        <h1>WORLD WIDE CHESS</h1>
      </header> */}
      <div className="homepage-welcome-user">
        <h1>Welcome, {user.username}</h1>
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
          <h1>Chess Facts</h1>
          <HomepageFacts screenVersion={screenVersion} />
        </div>
      </div>
    </section>
  );
};

export default Homepage;
