import React, {
  useState,
  useEffect,
  useCallback,
  createRef,
  useRef
} from "react";
import gsap, { Power4 } from "gsap";
import Square from "./Icons/Square";
import Triangle from "./Icons/Triangle";

const STROKE_WIDTH = 0.9;
const POINTS = "0,0 60,30 0,60 0,30";
const DURATIONS = [0.6, 1.3];
const RADIUS = 50;
const INIT_RADIUS = 10;
const SQUARE_SIZE = 20;
const TRIANGLE_SIZE = 15;

let TIMELINE = null;

const ease = Power4.easeOut;

export default function Pescador({
  size = 400,
  delay,
  repeatDelay,
  repeat,
  style,
  onComplete,
  onStart,
  onRepeat,
  className
}) {
  const squareRef = useRef();
  const triangleRefs = useRef([...Array(3)].map(() => createRef()));
  const polygonRefs = useRef([...Array(3)].map(() => createRef()));
  const lineRefs = useRef([...Array(3)].map(() => createRef()));

  const [prevSize, setPrevSize] = useState(size);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const center = prevSize / 2;
  const angle = (2 * Math.PI) / 3;
  const prefixAngle = Math.PI / 6;
  const radius = (prevSize * RADIUS) / 100;
  const initRadius = (prevSize * INIT_RADIUS) / 100;
  const square = (SQUARE_SIZE * prevSize) / 100;
  const strokeWidth = (prevSize * STROKE_WIDTH) / 100;

  const dasharray = useCallback(
    array =>
      array
        .map(item => (square * 2 * item) / 100)
        .reduce((sum, item) => `${sum} ${item}`, ""),
    [square]
  );

  const animateSquare = useCallback(() => {
    const timeline = gsap.timeline();

    const startDasharray = dasharray([25, 75]);
    const endDashArray = dasharray([0, 100]);

    timeline.set(squareRef.current, {
      strokeDashoffset: 0,
      strokeDasharray: startDasharray
    });

    timeline.to(squareRef.current, {
      keyframes: [
        { strokeDashoffset: square * 4, duration: 1.2 },
        { strokeDasharray: endDashArray, duration: 0.2 }
      ],
      ease: Power4.easeOut
    });

    return timeline;
  }, [dasharray, square]);

  const animateTriangles = useCallback(() => {
    const timelines = [];

    triangleRefs.current.forEach((ref, i) => {
      const timeline = gsap.timeline({ ease });
      const x = Math.cos(-prefixAngle + i * angle);
      const y = Math.sin(-prefixAngle + i * angle);
      const size = ((TRIANGLE_SIZE / 2) * prevSize) / 100;

      timeline.set(ref.current, {
        rotate: ((angle * i - prefixAngle) * 180) / Math.PI
      });
      timeline.fromTo(
        ref.current,
        1,
        { scale: 0 },
        { scale: 1, transformOrigin: "center", ease: Power4.easeInOut }
      );
      timeline.fromTo(
        ref.current,
        1,
        { x: -size, y: -size },
        { x: radius * x - size, y: radius * y - size, ease: Power4.easeInOut },
        "-=1"
      );
      timeline.to(ref.current, 1, { scale: 0, ease: Power4.easeOut }, "-=0.4");

      timelines.push(timeline);
    });

    return timelines;
  }, [angle, prefixAngle, prevSize, radius]);

  const animateLines = useCallback(() => {
    const timelines = [];

    lineRefs.current.forEach((ref, i) => {
      const timeline = gsap.timeline();
      const cos = Math.cos(prefixAngle + i * angle);
      const sin = Math.sin(prefixAngle + i * angle);

      timeline
        .fromTo(
          ref.current,
          DURATIONS[0],
          {
            attr: {
              x1: center + initRadius * cos,
              y1: center + initRadius * sin
            }
          },
          {
            attr: { x1: center + radius * cos, y1: center + radius * sin },
            ease
          }
        )
        .fromTo(
          ref.current,
          DURATIONS[1],
          {
            attr: {
              x2: center + initRadius * cos,
              y2: center + initRadius * sin
            }
          },
          {
            attr: {
              x2: center + radius * cos,
              y2: center + radius * sin
            },
            ease
          },
          `-=${DURATIONS[0]}`
        );

      timelines.push(timeline);
    });

    return timelines;
  }, [angle, center, initRadius, prefixAngle, radius]);

  const animatePolygonShape = useCallback(() => {
    const timelines = [];

    polygonRefs.current.forEach(ref => {
      const timeline = gsap.timeline();

      timeline.fromTo(
        ref.current,
        1,
        { attr: { points: POINTS } },
        { attr: { points: "0,0 60,30 0,60 30,30" }, ease }
      );

      timelines.push(timeline);
    });

    return timelines;
  }, []);

  const explode = useCallback(() => {
    const squareTimeline = animateSquare();
    const triangleTimelines = animateTriangles();
    const polygonTimelines = animatePolygonShape();
    const lineTimelines = animateLines();

    TIMELINE = gsap.timeline({
      repeat: prevRepeat,
      delay: prevDelay,
      repeatDelay: prevRepeatDelay,
      onStart,
      onComplete,
      onRepeat
    });

    TIMELINE.add(squareTimeline, 0);
    TIMELINE.add(triangleTimelines, "-=0.8");
    TIMELINE.add(polygonTimelines, "-=1");
    TIMELINE.add(lineTimelines, "<");
  }, [
    prevRepeat,
    prevRepeatDelay,
    prevDelay,
    onStart,
    onComplete,
    onRepeat,
    animateSquare,
    animateTriangles,
    animatePolygonShape,
    animateLines
  ]);

  useEffect(() => {
    if (TIMELINE) TIMELINE.kill();
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
      className={className}
      style={{
        width: prevSize,
        height: prevSize,
        position: "relative",
        ...style
      }}
    >
      <Square
        shapeRef={squareRef}
        width={`${SQUARE_SIZE}%`}
        height={`${SQUARE_SIZE}%`}
        strokeWidth={strokeWidth}
        strokeDasharray="30 90"
        strokeDashoffset={0}
        color="#fed766"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(45deg)"
        }}
      />
      <>
        {Array.from(Array(3)).map((_, idx) => (
          <Triangle
            key={idx}
            points={POINTS}
            ref={triangleRefs.current[idx]}
            shapeRef={polygonRefs.current[idx]}
            color="#FF4D4D"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: `${TRIANGLE_SIZE}%`,
              height: `${TRIANGLE_SIZE}%`,
              transform: `
                translate(-50%, -50%)
                rotate(${((angle * 180) / Math.PI) * idx - 30}deg)
                scale(0)
              `
            }}
          />
        ))}
      </>
      <svg width={prevSize} height={prevSize}>
        {Array.from(Array(3)).map((_, idx) => (
          <line
            key={idx}
            x1={center}
            x2={center}
            y1={center}
            y2={center}
            ref={lineRefs.current[idx]}
            stroke="#fff"
            strokeWidth={strokeWidth}
          />
        ))}
      </svg>
    </div>
  );
}
