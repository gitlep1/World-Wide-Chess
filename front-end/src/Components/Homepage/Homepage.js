import "./Homepage.scss";
import { useState } from "react";
import { Image } from "react-bootstrap";

import Logo from "../../Images/Logo.png";
import homepageBackground from "../../Images/Background/homepageBackground.png";

import DailyTasks from "./HomepageTasks/DailyTasks";
import MonthlyTasks from "./HomepageTasks/MonthlyTasks";

import HomepageFacts from "./HomepageFacts/HomepageFacts";

const Homepage = ({ screenVersion, user, token }) => {
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
      <section className="homepage-main-section">
        <div className="homepage-section-one">
          <div className="homepage-welcome-user">
            <h1>
              Welcome: <br /> {user.username}
            </h1>
          </div>
        </div>

        <div className="homepage-section-two">
          <h1>Site updates</h1>
        </div>

        <div className="homepage-section-three">
          {/* empty section to show the background image */}
        </div>
      </section>
    </section>
  );
};

export default Homepage;
