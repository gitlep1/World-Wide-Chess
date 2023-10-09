import "./MainLoader.scss";
import { useEffect, useState } from "react";

const Loading = ({ screenVersion, mainLoading }) => {
  const [count, setCount] = useState(0);

  const handleCount = () => {
    if (count === 100) {
      setCount(0);
    } else {
      setCount((prevCount) => prevCount + 5);
    }
  };

  useEffect(() => {
    const countInterval = setInterval(handleCount, 1000);
    return () => clearInterval(countInterval);
  }, []); // eslint-disable-line

  return (
    <div className={`${screenVersion}-loading-page-container`}>
      <h1>Loading</h1>
      <div className="loading-bar-container">
        <div className="loading-bar">{count}</div>
      </div>
    </div>
  );
};

export default Loading;
