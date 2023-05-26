import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";

function HomepageFactsDraggable({ children, onSwipe }) {
  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const bind = useDrag(({ down, movement: [mx] }) => {
    const threshold = window.innerWidth / 2.5;
    if (down && Math.abs(mx) > threshold) {
      onSwipe(() => {
        api.start({ x: window.innerWidth });
      });
    } else {
      api.start({ x: down ? mx : 0, immediate: down });
    }
  });

  return (
    <div>
      <animated.div
        className="homepage-facts-card"
        {...bind()}
        style={{ x, touchAction: "none" }}
      >
        {children}
      </animated.div>
    </div>
  );
}

export default HomepageFactsDraggable;
