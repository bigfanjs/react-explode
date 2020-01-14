import React, {
  useState,
  useEffect,
  useCallback,
  createRef,
  useRef
} from "react";
import gsap, { Power4, Linear } from "gsap";
import Circle from "../Icons/Circle";

const RADIUS = 60;
const LINE_RADIUS = 35;
const CIRCLES_RADIUS = 50;
const STROKE_WIDTH = 1;
const DURATIONS = [0.6, 1];

let TIME_LINE = null;

export default function Explosion13({
  size,
  delay,
  repeatDelay,
  repeat,
  style,
  color = "white",
  onComplete,
  onStart,
  onRepeat
}) {
  const circleRef = useRef();
  const circlesRefs = useRef([...Array(4)].map(() => createRef()));
  const linesRefs = useRef([...Array(4)].map(() => createRef()));

  const [prevSize, setPrevSize] = useState(400);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const center = size / 2;
  const strokeWidth = Math.ceil((size * STROKE_WIDTH) / 100);

  const explode = useCallback(() => {
    const circleTimelines = [];
    const lineTimelines = [];
    const radius = (prevSize * LINE_RADIUS) / 100;
    const angle = Math.PI / 2;

    circlesRefs.current.forEach(ref => {
      const timeline = gsap.timeline();

      timeline.set(ref.current, {
        attr: { "stroke-dashoffset": 55, "stroke-dasharray": "0 157" }
      });
      timeline.to(ref.current, 1.7, {
        keyframes: [
          { attr: { "stroke-dasharray": "0 157", "stroke-dashoffset": 55 } },
          { attr: { "stroke-dasharray": "40 117", "stroke-dashoffset": -24 } },
          { attr: { "stroke-dasharray": "0 157", "stroke-dashoffset": -103 } }
        ],
        ease: Linear.easeNone
      });

      circleTimelines.push(timeline);
    });

    linesRefs.current.forEach((ref, i) => {
      const x = center + radius * Math.cos(Math.PI / 4 + i * angle);
      const y = center + radius * Math.sin(Math.PI / 4 + i * angle);
      const start = { x2: x, y2: y };
      const end = { x1: x, y1: y };

      const timeline = gsap.timeline();

      timeline
        .fromTo(
          ref.current,
          0.8,
          { attr: { x2: center, y2: center } },
          { attr: start, ease: Power4.easeIn }
        )
        .fromTo(
          ref.current,
          0.8,
          { attr: { x1: center, y1: center } },
          { attr: end, ease: Power4.easeOut },
          ">"
        );

      lineTimelines.push(timeline);
    });

    const timeline = gsap.timeline();

    timeline.fromTo(
      circleRef.current,
      0.7,
      {
        attr: {
          "stroke-dashoffset": -18,
          "stroke-dasharray": "0 39.25 0 39.25"
        }
      },
      {
        attr: { "stroke-dashoffset": 0, "stroke-dasharray": "39.25 0 39.25 0" }
      }
    );
    timeline.fromTo(
      circleRef.current,
      1.3,
      {
        attr: {
          "stroke-dashoffset": 18,
          "stroke-dasharray": "39.25 0 39.25 0"
        },
        ease: Power4.easeIn
      },
      {
        attr: { "stroke-dashoffset": 0, "stroke-dasharray": "0 39.25 0 39.25" },
        ease: Power4.easeOut
      }
    );

    TIME_LINE = gsap.timeline({
      repeat: prevRepeat,
      delay: prevDelay,
      repeatDelay: prevRepeatDelay,
      onStart,
      onComplete,
      onRepeat
    });

    TIME_LINE.add(circleTimelines, 0);
    TIME_LINE.add(lineTimelines, 0);
    TIME_LINE.add(timeline, "-=1");
  }, [
    prevRepeat,
    prevDelay,
    prevRepeatDelay,
    onComplete,
    onStart,
    onRepeat,
    center,
    prevSize
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

  const circlesRadius = (CIRCLES_RADIUS * prevSize) / 100;

  return (
    <div
      style={{ width: size, height: size, border: "1px solid #fff", ...style }}
    >
      {Array.from(Array(4)).map((_, i) => {
        const x = Math.cos(Math.PI / 4 + i * (Math.PI / 2));
        const y = Math.sin(Math.PI / 4 + i * (Math.PI / 2));
        const dist = Math.sqrt(Math.pow(circlesRadius, 2) * 2);

        return (
          <Circle
            key={i}
            radius={25}
            strokeWidth={1}
            color="#32a885"
            circleRef={circlesRefs.current[i]}
            style={{
              position: "absolute",
              left: center - circlesRadius / 2 + x * ((dist / 2) * 0.9),
              top: center - circlesRadius / 2 + y * ((dist / 2) * 0.9),
              width: circlesRadius,
              height: circlesRadius,
              transform: [
                "unset",
                "rotateY(180deg)",
                "rotate(180deg)",
                "rotateX(180deg)"
              ][i]
            }}
          />
        );
      })}
      <svg width={prevSize} height={prevSize}>
        {Array.from(Array(4)).map((_, i) => (
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center}
            ref={linesRefs.current[i]}
            key={i}
            strokeWidth={strokeWidth}
            stroke="#8526b5"
          />
        ))}
      </svg>
      <Circle
        radius={25}
        strokeWidth={1}
        color="#1da372"
        circleRef={circleRef}
        strokeDasharray="0 157"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: `${RADIUS}%`,
          height: `${RADIUS}%`
        }}
      />
    </div>
  );
}
