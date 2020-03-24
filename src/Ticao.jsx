import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  createRef,
  useMemo
} from "react";
import gsap, { Power4 } from "gsap";
import Circle from "./Icons/Circle";
import useGSAPAnimateStroke from "./hooks/useGSAPAnimateStroke";

const LINES_LENGTH = 4;
const LINE_LENGTH = 30;
const LINE_TOTAL_LENGTH = 60;
const CIRCLES_LENGTH = 4;
const CIRCLE_SIZE = 20;
const LINES_SIZE = 25;
const CIRCLE_RADIUS = 30;
const LINES_RADIUS = 30;
const CIRCLE_LINES_LENGTH = 9;
const ANGLE = Math.PI / 2;
const PREFIX_ANGLE = Math.PI / 4;
const LINE_STROKE_WIDTH = 1;
const CIRCLE_STROKE_WIDTH = 2;
let TIME_LINE;

function GrandUnit({ linesCenter, index, lineRef }) {
  const x = useMemo(
    () => linesCenter + Math.cos(index * ((2 * Math.PI) / 9)) * linesCenter,
    [index, linesCenter]
  );
  const y = useMemo(
    () => linesCenter + Math.sin(index * ((2 * Math.PI) / 9)) * linesCenter,
    [linesCenter, index]
  );

  return (
    <line
      key={index}
      x1={linesCenter}
      y1={linesCenter}
      x2={x}
      y2={y}
      stroke="#2ab7ca"
      ref={lineRef}
    />
  );
}

function Unit({ size, index, circlesRefs, circleLinesRefs }) {
  const center = size / 2;
  const x = useMemo(() => Math.cos(index * ANGLE), [index]);
  const y = useMemo(() => Math.sin(index * ANGLE), [index]);
  const circleSize = useMemo(() => (size * CIRCLE_SIZE) / 100, [size]);
  const linesSize = useMemo(() => (size * LINES_SIZE) / 100, [size]);
  const circleRadius = useMemo(() => (size * CIRCLE_RADIUS) / 100, [size]);
  const linesRadius = useMemo(() => (size * LINES_RADIUS) / 100, [size]);
  const circleCenter = circleSize / 2;
  const linesCenter = linesSize / 2;

  return (
    <>
      <Circle
        shapeRef={circlesRefs.current[index]}
        color="#fe4a49"
        style={{
          position: "absolute",
          top: center - circleCenter + y * circleRadius,
          left: center - circleCenter + x * circleRadius,
          width: `${CIRCLE_SIZE}%`,
          height: `${CIRCLE_SIZE}%`
        }}
      />
      <svg
        style={{
          position: "absolute",
          width: `${LINES_SIZE}%`,
          height: `${LINES_SIZE}%`,
          top: center - linesCenter + y * linesRadius,
          left: center - linesCenter + x * linesRadius
        }}
      >
        {Array.from(Array(CIRCLE_LINES_LENGTH)).map((_, j) => (
          <GrandUnit
            key={j + CIRCLE_LINES_LENGTH * index}
            index={j}
            linesCenter={linesCenter}
            lineRef={circleLinesRefs.current[j + CIRCLE_LINES_LENGTH * index]}
          />
        ))}
      </svg>
    </>
  );
}

function Line({ size, index, lineRef, lineTotalLength }) {
  const center = size / 2;
  const circleSize = useMemo(() => (size * CIRCLE_SIZE) / 100, [size]);
  const circleRadius = useMemo(() => (size * CIRCLE_RADIUS) / 100, [size]);
  const circleCenter = circleSize / 2;
  const radius = circleRadius - circleCenter + 5;
  const x =
    center -
    lineTotalLength / 2 +
    Math.cos(PREFIX_ANGLE + index * ANGLE) * radius;
  const y = center - 5 / 2 + Math.sin(PREFIX_ANGLE + index * ANGLE) * radius;

  return (
    <svg
      key={index}
      width={lineTotalLength}
      height={5}
      style={{
        top: y,
        left: x,
        position: "absolute",
        transform: ` rotate(${135 + 90 * index}deg)`
      }}
    >
      <line
        ref={lineRef}
        strokeWidth={0}
        strokeDasharray={`0 ${lineTotalLength}`}
        x1="0"
        y1="50%"
        x2="100%"
        y2="50%"
        stroke="#fed766"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Ticao({
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
  const linesRefs = useRef([...Array(LINES_LENGTH)].map(() => createRef()));
  const circleLinesRefs = useRef(
    [...Array(CIRCLE_LINES_LENGTH * 4)].map(() => createRef())
  );
  const circlesRefs = useRef([...Array(CIRCLES_LENGTH)].map(() => createRef()));

  const [prevSize, setPrevSize] = useState(size);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const lineTotalLength = useMemo(() => (prevSize * LINE_TOTAL_LENGTH) / 100, [
    prevSize
  ]);
  const lineStrokeWidth = useMemo(() => (prevSize * LINE_STROKE_WIDTH) / 100, [
    prevSize
  ]);
  const linesSize = useMemo(() => (prevSize * LINES_SIZE) / 100, [prevSize]);
  const lineLength = useMemo(() => (prevSize * LINE_LENGTH) / 100, [prevSize]);
  const animateStroke = useGSAPAnimateStroke({
    length: lineLength,
    totalLength: lineTotalLength,
    speed: 1.3
  });

  const animateLines = useCallback(() => {
    const timelines = [];

    linesRefs.current.forEach((ref, i) => {
      const timeline = gsap.timeline({ delay: 0.07 * i });
      animateStroke({
        elem: ref.current,
        timeline,
        strokeWidth: lineStrokeWidth
      });
      timelines.push(timeline);
    });

    return timelines;
  }, [animateStroke, lineStrokeWidth]);

  const animateCircles = useCallback(() => {
    const timelines = [];
    const strokeWidth = (prevSize * CIRCLE_STROKE_WIDTH) / 100;

    circlesRefs.current.forEach((ref, i) => {
      const timeline = gsap.timeline({ delay: 0.08 * i });

      timeline.set(ref.current, { attr: { "stroke-width": 20 }, scale: 0 });
      timeline.set(ref.current, { opacity: 1 });
      timeline.fromTo(
        ref.current,
        0.5,
        { attr: { "stroke-width": 20 }, scale: 0, transformOrigin: "center" },
        {
          attr: { "stroke-width": strokeWidth },
          scale: 1,
          ease: Power4.easeInOut
        }
      );
      timeline.to(
        ref.current,
        0.5,
        { attr: { "stroke-width": 0 }, ease: Power4.easeInOut },
        "-=0.45"
      );
      timeline.fromTo(
        ref.current,
        0.4,
        { opacity: 1 },
        { opacity: 0, ease: Power4.easeInOut },
        "-=0.3"
      );

      timelines.push(timeline);
    });

    return timelines;
  }, [prevSize]);

  const animateCircleLines = useCallback(() => {
    const timelines = [];

    circleLinesRefs.current.forEach((ref, i) => {
      const radius = linesSize / 2;
      const angle = (2 * Math.PI) / 9;
      const x = radius + radius * Math.cos(i * angle);
      const y = radius + radius * Math.sin(i * angle);
      const start = { x2: x, y2: y };
      const end = { x1: x, y1: y };

      const timeline = gsap.timeline({ delay: 0.08 * Math.floor(i / 9) });

      timeline
        .fromTo(
          ref.current,
          0.7,
          { attr: { x2: radius, y2: radius } },
          { attr: start, ease: Power4.easeInOut }
        )
        .fromTo(
          ref.current,
          0.6,
          { attr: { x1: radius, y1: radius } },
          { attr: end, ease: Power4.easeInOut },
          "-=0.6"
        );

      timelines.push(timeline);
    });

    return timelines;
  }, [linesSize]);

  const explode = useCallback(() => {
    const linesRefs = animateLines();
    const circlesRefs = animateCircles();
    const circleLinesRefs = animateCircleLines();

    TIME_LINE = gsap.timeline({
      repeat: prevRepeat,
      delay: prevDelay,
      repeatDelay: prevRepeatDelay,
      onStart,
      onComplete,
      onRepeat
    });

    TIME_LINE.add(linesRefs, 0);
    TIME_LINE.add(circlesRefs, 0.15);
    TIME_LINE.add(circleLinesRefs, 0.15);
  }, [
    animateCircles,
    animateLines,
    animateCircleLines,
    onComplete,
    onStart,
    onRepeat,
    prevRepeat,
    prevDelay,
    prevRepeatDelay
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
      className={className}
      style={{
        width: prevSize,
        height: prevSize,
        position: "relative",
        ...style
      }}
    >
      {linesRefs.current.map((ref, i) => (
        <Line
          key={i}
          index={i}
          lineRef={ref}
          size={prevSize}
          strokeWidth={lineStrokeWidth}
          lineTotalLength={lineTotalLength}
        />
      ))}
      {Array.from(Array(4)).map((_, i) => (
        <Unit
          key={i}
          index={i}
          circleLinesRefs={circleLinesRefs}
          circlesRefs={circlesRefs}
          size={prevSize}
        />
      ))}
    </div>
  );
}
