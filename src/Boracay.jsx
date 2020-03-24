import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  createRef
} from "react";
import gsap, { Power4 } from "gsap";

const STROKE_WIDTH = 0.5;
const RADIUS = 47.5;
const COUNT = 16;
const DURATIONS = [0.6, 1];

let TIME_LINE = null;

export default function Boracay({
  size,
  delay,
  repeatDelay,
  repeat,
  style,
  color = "#fff",
  onComplete,
  onStart,
  onRepeat,
  className
}) {
  const linesRefs = useRef([...Array(COUNT)].map(() => createRef()));
  const [prevSize, setPrevSize] = useState(size);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const center = size / 2;
  const strokeWidth = Math.ceil((size * STROKE_WIDTH) / 100);

  const explode = useCallback(() => {
    const ease = Power4.easeOut;
    const angle = Math.PI / 8;
    const radius = (prevSize * RADIUS) / 100;
    const durations = DURATIONS;
    const center = prevSize / 2;
    const timelines = [];

    TIME_LINE = gsap.timeline({
      repeat: prevRepeat,
      delay: prevDelay,
      repeatDelay: prevRepeatDelay,
      onComplete,
      onStart,
      onRepeat
    });

    linesRefs.current.forEach((ref, i) => {
      const timeline = gsap.timeline();
      const x = center + radius * Math.cos(i * angle);
      const y = center + radius * Math.sin(i * angle);
      const start = { x2: x, y2: y };
      const end = { x1: x, y1: y };

      timeline
        .fromTo(
          ref.current,
          durations[0],
          { attr: { x2: center, y2: center } },
          { attr: start, ease }
        )
        .fromTo(
          ref.current,
          durations[1],
          { attr: { x1: center, y1: center } },
          { attr: end, ease },
          `-=${durations[0]}`
        );

      timelines.push(timeline);
    });

    TIME_LINE.add(timelines);
  }, [
    prevSize,
    prevRepeat,
    prevDelay,
    prevRepeatDelay,
    onComplete,
    onStart,
    onRepeat
  ]);

  useEffect(() => {
    if (TIME_LINE) TIME_LINE.kill();
    explode();
  }, [explode]);

  useEffect(() => {
    setPrevSize(size);
    setPrevDelay(delay);
    setPrevRepeatDelay(repeatDelay);
    setPrevRepeat(repeat);
  }, [size, delay, repeatDelay, repeat]);

  return (
    <svg
      width={size}
      height={size}
      className={className}
      style={{ ...style, position: "relative" }}
    >
      <>
        {linesRefs.current.map((ref, i) => (
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center}
            ref={ref}
            key={i}
            strokeWidth={strokeWidth}
            stroke={color}
          />
        ))}
      </>
    </svg>
  );
}
