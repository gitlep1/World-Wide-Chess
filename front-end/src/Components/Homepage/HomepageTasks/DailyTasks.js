import "./tasks.scss";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { Line } from "rc-progress";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const DailyTasks = ({ user, token }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUsersTasks();
  }, []); // eslint-disable-line

  const getUsersTasks = async () => {
    setError("");
    setLoading(true);

    await axios
      .get(`${API}/daily-tasks`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTasks(res.data.payload);
      })
      .catch((err) => {
        setError(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderData = () => {
    if (loading) {
      return (
        <SkeletonTheme baseColor="#202020" highlightColor="#444">
          <Skeleton count={4} />
        </SkeletonTheme>
      );
    } else if (error) {
      return <p style={{ color: "red" }}>ERROR: {error}</p>;
    } else if (tasks.length === 0) {
      return (
        <p>
          Please create an account to participate in daily and monhtly tasks for
          rewards.
        </p>
      );
    } else {
      return tasks.map((task) => {
        return (
          <div key={nanoid()} className="task-container">
            <div className="task-name">{task.task_name}</div>
            <div className="task-progress">
              <div className="progress-container">
                {task.task_current > 0 ? (
                  <Line
                    percent={(task.task_current / task.task_total) * 100}
                    strokeWidth="8"
                    trailWidth="8"
                    trailColor="none"
                    strokeColor="goldenrod"
                    strokeLinecap="square"
                  />
                ) : null}
                <div className="task-info">
                  {task.completed ? (
                    <span className="task-completed">COMPLETED</span>
                  ) : (
                    <>
                      <span>{task.task_current}</span>
                      <span className="task-slash">/</span>
                      <span>{task.task_total}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      });
    }
  };

  return renderData();
};

export default DailyTasks;
