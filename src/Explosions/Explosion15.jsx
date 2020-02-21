import React, {
  useState,
  useEffect,
  useCallback,
  createRef,
  useRef
} from "react";
import gsap, { Power4, Power1, Power2, Linear } from "gsap";
//   import Circle from "../Icons/Circle";
import CircleIcon from "../Icons/Circle";
import SquareIcon from "../Icons/Square";
import TriangleIcon from "../Icons/Triangle";

const LINES_RADIUS = 30;
const SHAPES_RADIUS = 45;
const CIRCLE_STROKE_WIDTH = 0.4;
const SHAPE_SIZE = 6;

let TIME_LINE = null;

function Triangle({ innerRef, pos, style, strokeWidth }) {
  return (
    <TriangleIcon
      style={{ ...style, top: `${pos.t * 100}%` }}
      ref={innerRef}
      border={true}
      strokeWidth={3}
      color="#fed766"
    />
  );
}

function Square({ innerRef, pos, style }) {
  return (
    <SquareIcon
      style={{ ...style, top: `${pos.s * 100}%` }}
      ref={innerRef}
      strokeWidth={3}
      color="#fed766"
    />
  );
}

function Circle({ innerRef, pos, style }) {
  return (
    <CircleIcon
      style={{ ...style, top: `${pos.c * 100}%` }}
      ref={innerRef}
      radius={20}
      strokeWidth={3}
      color="#fed766"
    />
  );
}

const groups = [
  [Square, Triangle, Circle],
  [Square, Circle, Triangle]
];

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
  const circleRefs = useRef([...Array(7)].map(() => createRef()));
  const lineRefs = useRef([...Array(9)].map(() => createRef()));
  const shapesRefs = useRef([...Array(6)].map(() => createRef()));

  const [prevSize, setPrevSize] = useState(400);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const center = prevSize / 2;
  const strokeWidth = (size * CIRCLE_STROKE_WIDTH) / 100;

  const explode = useCallback(() => {
    const timelines = [];
    const lineTimelines = [];
    const shapesTimelines = [];
    const shapesSize = ((SHAPE_SIZE / 2) * prevSize) / 100;

    circleRefs.current.forEach((ref, i) => {
      if (i > 1) {
        const timeline = gsap.timeline({ delay: (5 - i) * 0.07 });
        const radius = 5 + 2 * i;
        const circumference = radius * 2 * Math.PI;
        timeline.set(ref.current, {
          attr: { "stroke-dashoffset": circumference }
        });
        timeline.fromTo(
          ref.current,
          0.8,
          {
            attr: {
              "stroke-dashoffset": circumference,
              "stroke-dasharray": `${circumference} ${circumference}`
            },
            ease: Power1.easeIn
          },
          {
            attr: { "stroke-dasharray": `0 ${circumference}` },
            ease: Power1.easeOut
          }
        );
        timeline.fromTo(
          ref.current,
          0.3,
          { attr: { "stroke-width": strokeWidth - 0.1 * (7 - i) } },
          { attr: { "stroke-width": 0 } },
          "-=0.2"
        );
        timelines.push(timeline);
      } else if (i === 1) {
        const timeline = gsap.timeline();

        timeline.set(ref.current, { scale: 0, attr: { "stroke-width": 15 } });
        timeline.fromTo(
          ref.current,
          0.6,
          { scale: 0, transformOrigin: "center", attr: { "stroke-width": 15 } },
          {
            scale: 1,
            attr: { "stroke-width": strokeWidth - 0.1 * (7 - i) },
            ease: Power4.easeOut
          }
        );
        timeline.to(ref.current, 0.6, {
          scale: 0.7,
          transformOrigin: "center",
          attr: { "stroke-width": 0 },
          opacity: 0,
          ease: Power4.easeOut
        });

        timelines.push(timeline);
      } else {
        const timeline = gsap.timeline({ delay: 0.8 });

        timeline.set(ref.current, { scale: 0, attr: { "stroke-width": 15 } });
        timeline.fromTo(
          ref.current,
          0.5,
          { scale: 0, transformOrigin: "center", attr: { "stroke-width": 15 } },
          {
            scale: 1,
            attr: { "stroke-width": 0.3 },
            ease: Power4.easeOut
          }
        );
        timeline.to(
          ref.current,
          0.3,
          {
            attr: { "stroke-width": 0 },
            opacity: 0
          },
          "-=0.2"
        );

        timelines.push(timeline);
      }
    });

    // animate lines:
    lineRefs.current.forEach((ref, i) => {
      // const prefixAngle = 0;
      const radius = (prevSize * LINES_RADIUS) / 100;
      const angle = (2 * Math.PI) / 9;
      const x = center + radius * Math.cos(i * angle);
      const y = center + radius * Math.sin(i * angle);
      const start = { x2: x, y2: y };
      const end = { x1: x, y1: y };

      const timeline = gsap.timeline({ delay: 0.8 });

      timeline
        .fromTo(
          ref.current,
          0.7,
          { attr: { x2: center, y2: center } },
          { attr: start, ease: Power4.easeOut }
        )
        .fromTo(
          ref.current,
          0.6,
          { attr: { x1: center, y1: center } },
          { attr: end, ease: Power4.easeOut },
          "-=0.6"
        );

      lineTimelines.push(timeline);
    });

    // animate shapes:
    shapesRefs.current.forEach((ref, i) => {
      const timeline = gsap.timeline({
        delay: (i % 3) * 0.1
      });
      const radius = (prevSize * SHAPES_RADIUS) / 100;

      timeline.set(ref.current, { opacity: 0 });
      timeline.to(ref.current, 1.3, {
        keyframes: [
          { x: -shapesSize, opacity: 0 },
          {
            x: -shapesSize + radius * (i > 2 ? 1 : -1),
            opacity: 1,
            ease: Power2.easeOut
          },
          { x: -shapesSize, opacity: 0, ease: Power2.easeIn }
        ]
      });
      timeline.fromTo(
        ref.current,
        1,
        { rotate: 0 },
        { rotate: 250, ease: Power2.easeOut },
        "-=0.8"
      );

      shapesTimelines.push(timeline);
    });

    TIME_LINE = gsap.timeline({
      repeat: prevRepeat,
      delay: prevDelay,
      repeatDelay: prevRepeatDelay,
      onStart,
      onComplete,
      onRepeat
    });

    TIME_LINE.add(shapesTimelines, 0);
    TIME_LINE.add(timelines, 0.5);
    TIME_LINE.add(lineTimelines, 0.5);
  }, [
    prevRepeat,
    prevDelay,
    prevRepeatDelay,
    onComplete,
    onStart,
    onRepeat,
    prevSize,
    center,
    strokeWidth
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

  const positions = [
    { s: 0.3, t: 0.5, c: 0.7 },
    { s: 0.7, t: 0.3, c: 0.5 }
  ];

  return (
    <div style={{ width: size, height: size, ...style }}>
      {Array.from(Array(7)).map((_, i) => (
        <CircleIcon
          key={i}
          shapeRef={circleRefs.current[i]}
          radius={5 + 2 * (i === 0 ? i + 1 : i)}
          fill="none"
          color={i > 0 ? " #2ab7ca" : "#fe4a49"}
          strokeWidth={strokeWidth - 0.1 * (7 - i)}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            transform: `
              rotate(${90 * (i % 2 ? 1 : -1)}deg)
              rotateX(${i % 2 ? 180 : 0}deg)
            `
          }}
          strokeLinecap="round"
        />
      ))}
      <svg width={prevSize} height={prevSize}>
        {Array.from(Array(9)).map((_, i) => (
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center}
            ref={lineRefs.current[i]}
            key={i}
            strokeWidth={strokeWidth}
            stroke="#fe4a49"
          />
        ))}
      </svg>
      {Array.from(Array(2)).map((_, i) =>
        groups[i].map((Shape, j) => {
          return (
            <Shape
              key={j + 3 * i}
              innerRef={shapesRefs.current[j + 3 * i]}
              pos={positions[i]}
              strokeWidth={strokeWidth}
              stroke="#5ADFFF"
              style={{
                position: "absolute",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: `${SHAPE_SIZE}%`,
                height: `${SHAPE_SIZE}%`,
                opacity: 0
              }}
            />
          );
        })
      )}
    </div>
  );
}
