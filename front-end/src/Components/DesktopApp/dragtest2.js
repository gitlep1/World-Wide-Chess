import { useSpring, animated } from "react-spring";
import { useDrag } from "@use-gesture/react";

function DraggableCard({ children, onSwipe }) {
  const [{ x }, api] = useSpring(() => ({ x: 0 }));
  const [{ x: nextX }, setNextX] = useSpring(() => ({
    x: window.innerWidth,
  }));

  const bind = useDrag(({ down, movement: [mx], velocity }) => {
    const threshold = window.innerWidth / 2.5;
    if (down && Math.abs(mx) > threshold) {
      onSwipe(() => {
        setNextX({ x: window.innerWidth });
        api.start({ x: window.innerWidth });
      });
    } else {
      api.start({ x: down ? mx : 0, immediate: down });
    }

    if (!down && Math.abs(velocity) > 0.1) {
      const v = Math.max(Math.abs(velocity), 3) * Math.sign(velocity);
      api.set({
        x: mx,
        immediate: false,
        config: { velocity: [v, 0], decay: true },
      });

      setNextX({ x: 0, immediate: false, delay: 100 });
    }
  });

  return (
    <div style={{ position: "relative", overflow: "hidden" }}>
      <animated.div
        className="draggableCard"
        {...bind()}
        style={{ x, touchAction: "none" }}
      >
        {children}
      </animated.div>
      <animated.div
        className="draggableCard"
        style={{ x: nextX, position: "absolute", touchAction: "none" }}
      >
        {children}
      </animated.div>
    </div>
  );
}

export default DraggableCard;
