import React, {
  useState,
  useEffect,
  useCallback,
  createRef,
  useRef
} from "react";
import gsap, { Power4, Power1 } from "gsap";
import Star from "../Icons/Star";
import Pentagon from "../Icons/Pentagon";

const RADIUS = 50;
//   const LINE_RADIUS = 35;
const STROKE_WIDTH = 1;
const STAR_SIZE = 90;
const PENTAGON_SIZE = 95;
const LINES = 5;
//   const DURATIONS = [0.6, 1];

let TIME_LINE = null;

export default function Babuyan({
  size,
  delay,
  repeatDelay,
  repeat,
  style,
  onComplete,
  onStart,
  onRepeat
}) {
  const starRef = useRef();
  const starPolygonRef = useRef();
  const polygonRef = useRef();
  const linesRefs = useRef([...Array(5)].map(() => createRef()));
  //   const vShapesRef = useRef([...Array(5)].map(() => createRef()));

  const [prevSize, setPrevSize] = useState(400);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const center = size / 2;
  const strokeWidth = Math.ceil((size * STROKE_WIDTH) / 100);
  const angle = (2 * Math.PI) / 5;
  const prefixAngle = Math.PI / 10;
  const radius = (prevSize * RADIUS) / 100;

  const explode = useCallback(() => {
    const starTL = gsap.timeline();

    starTL.fromTo(
      starRef.current,
      0.5,
      { scale: 0 },
      { scale: 1, ease: Power1.easeIn }
    );
    starTL.fromTo(
      starPolygonRef.current,
      0.5,
      { attr: { "stroke-dasharray": "177 2", "stroke-dashoffset": 88 } },
      {
        attr: { "stroke-dasharray": "0 179", "stroke-dashoffset": 0 },
        ease: Power1.easeOut
      },
      "-=0.1"
    );
    // starTL.to(starRef.current, 1, { scale: 0.8 }, "-=0.2");

    const pentagonTL = gsap.timeline();

    pentagonTL.set(polygonRef.current, {
      attr: { "stroke-dasharray": "0 0 0 360", "stroke-dashoffset": "180" }
    });
    pentagonTL.to(polygonRef.current, 1.5, {
      keyframes: [
        {
          attr: {
            "stroke-dasharray": "100 0 100 160",
            "stroke-dashoffset": "270"
          }
        },
        {
          attr: {
            "stroke-dasharray": "50 260 50 0",
            "stroke-dashoffset": "360"
          }
        },
        {
          attr: { "stroke-dasharray": "0 360 0 0", "stroke-dashoffset": "360" }
        }
      ],
      ease: Power4.easeOut
    });

    const lineTimelines = [];
    linesRefs.current.forEach((ref, i) => {
      const x = center + radius * Math.cos(prefixAngle + i * angle);
      const y = center + radius * Math.sin(prefixAngle + i * angle);
      const start = { x2: x, y2: y };
      const end = { x1: x, y1: y };

      const timeline = gsap.timeline();

      timeline
        .fromTo(
          ref.current,
          0.8,
          { attr: start },
          { attr: { x2: center, y2: center, ease: Power4.easeIn } }
        )
        .fromTo(
          ref.current,
          0.8,
          { attr: end },
          { attr: { x1: center, y1: center, ease: Power4.easeIn } },
          "-=0.6"
        );

      lineTimelines.push(timeline);
    });

    TIME_LINE = gsap.timeline({
      repeat: prevRepeat,
      delay: prevDelay,
      repeatDelay: prevRepeatDelay,
      onStart,
      onComplete,
      onRepeat
    });

    TIME_LINE.add(starTL, 0);
    TIME_LINE.add(lineTimelines, "-=0.8");
    TIME_LINE.add(pentagonTL, 0.4);
  }, [
    angle,
    onRepeat,
    onStart,
    onComplete,
    prevRepeat,
    prevDelay,
    prevRepeatDelay,
    center,
    radius,
    prefixAngle
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
    <div
      style={{ width: size, height: size, border: "1px solid #fff", ...style }}
    >
      <Star
        strokeWidth={strokeWidth}
        ref={starRef}
        starPolygonRef={starPolygonRef}
        strokeDasharray="177 2"
        strokeDashoffset="88"
        color="#1da372"
        style={{
          position: "absolute",
          top: "46%",
          left: "50%",
          width: `${STAR_SIZE}%`,
          height: `${STAR_SIZE}%`,
          transform: "translate(-50%, -50%) scale(0)"
        }}
      />
      <Pentagon
        strokeWidth={strokeWidth}
        polygonRef={polygonRef}
        strokeDashoffset="180"
        strokeDasharray="0 0 0 360"
        color="#ff4d4d"
        style={{
          position: "absolute",
          top: "54%",
          left: "50%",
          width: `${PENTAGON_SIZE}%`,
          height: `${PENTAGON_SIZE}%`,
          transform: "translate(-50%, -50%)"
        }}
      />
      <svg width={prevSize} height={prevSize}>
        {[...Array(LINES)].map((_, i) => (
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
    </div>
  );
}
