import React, {
  useState,
  useEffect,
  useCallback,
  createRef,
  useRef,
  useMemo
} from "react";
import gsap, { Power4 } from "gsap";
import Circle from "./Icons/Circle";

const RADIUS = 60;
const LINE_RADIUS = 35;
const CIRCLES_RADIUS = 50;
const STROKE_WIDTH = 1;

let TIME_LINE = null;

export default function Balabac({
  size,
  delay,
  repeatDelay,
  repeat,
  style,
  onComplete,
  onStart,
  onRepeat,
  className
}) {
  const circleRef = useRef();
  const circlesRefs = useRef([...Array(4)].map(() => createRef()));
  const linesRefs = useRef([...Array(4)].map(() => createRef()));

  const [prevSize, setPrevSize] = useState(size);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const center = size / 2;
  const strokeWidth = Math.ceil((size * STROKE_WIDTH) / 100);

  const animateCircles = useCallback(() => {
    const timelines = [];
    const totalLength = 157;
    const offset = 55;
    const length = 40;

    circlesRefs.current.forEach(ref => {
      const timeline = gsap.timeline();

      timeline.set(ref.current, {
        attr: {
          "stroke-dashoffset": offset,
          "stroke-dasharray": `0, ${totalLength}`
        }
      });

      timeline.to(ref.current, 1.5, {
        keyframes: [
          {
            attr: {
              "stroke-dasharray": `${length} ${totalLength - length}`,
              "stroke-dashoffset": -20
            },
            ease: Power4.easeIn
          },
          {
            attr: {
              "stroke-dasharray": `0 ${totalLength}`,
              "stroke-dashoffset": totalLength * -1 + offset
            },
            ease: Power4.easeOut
          }
        ]
      });

      timelines.push(timeline);
    });

    return timelines;
  }, []);

  const animateCircle = useCallback(() => {
    const timeline = gsap.timeline();

    timeline.fromTo(
      circleRef.current,
      0.5,
      {
        attr: {
          "stroke-dashoffset": -18,
          "stroke-dasharray": "0 39.25 0 39.25"
        },
        ease: Power4.easeOut
      },
      {
        attr: { "stroke-dashoffset": 0, "stroke-dasharray": "39.25 0 39.25 0" },
        ease: Power4.easeIn
      }
    );
    timeline.fromTo(
      circleRef.current,
      1,
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

    return timeline;
  }, []);

  const animateLines = useCallback(() => {
    const timelines = [];
    const radius = (prevSize * LINE_RADIUS) / 100;
    const angle = Math.PI / 2;

    linesRefs.current.forEach((ref, i) => {
      const x = center + radius * Math.cos(Math.PI / 4 + i * angle);
      const y = center + radius * Math.sin(Math.PI / 4 + i * angle);
      const start = { x2: x, y2: y };
      const end = { x1: x, y1: y };

      const timeline = gsap.timeline();

      timeline
        .fromTo(
          ref.current,
          0.5,
          { attr: { x2: center, y2: center } },
          { attr: start, ease: Power4.easeIn }
        )
        .fromTo(
          ref.current,
          0.5,
          { attr: { x1: center, y1: center } },
          { attr: end, ease: Power4.easeOut },
          ">"
        );

      timelines.push(timeline);
    });

    return timelines;
  }, [center, prevSize]);

  const explode = useCallback(() => {
    const circlesTimelines = animateCircles();
    const linesTimelines = animateLines();
    const circleTimeline = animateCircle();

    TIME_LINE = gsap.timeline({
      repeat: prevRepeat,
      delay: prevDelay,
      repeatDelay: prevRepeatDelay,
      onStart,
      onComplete,
      onRepeat
    });

    TIME_LINE.add(circlesTimelines, 0);
    TIME_LINE.add(linesTimelines, "-=1");
    TIME_LINE.add(circleTimeline, "-=1");
  }, [
    prevRepeat,
    prevDelay,
    prevRepeatDelay,
    onComplete,
    onStart,
    onRepeat,
    animateCircles,
    animateLines,
    animateCircle
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

  const circlesRadius = useMemo(() => (CIRCLES_RADIUS * prevSize) / 100, [
    prevSize
  ]);

  return (
    <div
      className={className}
      style={{ width: size, height: size, position: "relative", ...style }}
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
            shapeRef={circlesRefs.current[i]}
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
        shapeRef={circleRef}
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
