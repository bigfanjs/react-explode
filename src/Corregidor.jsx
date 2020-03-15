import React, {
  createRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from "react";
import gsap, { Power4 } from "gsap";
import Circle from "./Icons/Circle";

const LINES_RADIUS = 47.4;
const CIRCLE_STROKE_WIDTH = 0.1;
const LINE_STROKE_WIDTH = 1;
const COUNT = 32;

let TIME_LINE = null;

export default function Corregidor({
  size,
  delay,
  repeatDelay,
  repeat,
  style,
  color = "#fff",
  onComplete,
  onStart,
  onRepeat
}) {
  const circleRef = useRef();
  const linesRefs = useRef([...Array(COUNT)].map(() => createRef()));

  const [prevSize, setPrevSize] = useState(size);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const center = useMemo(() => prevSize / 2, [prevSize]);
  const circleStrokeWidth = useMemo(
    () => (prevSize * CIRCLE_STROKE_WIDTH) / 100,
    [prevSize]
  );
  const lineStrokeWidth = useMemo(() => (prevSize * LINE_STROKE_WIDTH) / 100, [
    prevSize
  ]);

  const animateCircle = useCallback(() => {
    const timeline = gsap.timeline();

    timeline
      .fromTo(
        circleRef.current,
        0.7,
        { scale: 0, transformOrigin: "center" },
        { scale: 1, ease: Power4.easeOut }
      )
      .fromTo(
        circleRef.current,
        0.4,
        { attr: { "stroke-width": circleStrokeWidth } },
        { attr: { "stroke-width": 0 }, ease: Power4.easeOut },
        "-=0.3"
      )
      .fromTo(
        circleRef.current,
        0.3,
        { opacity: 1 },
        { opacity: 0, ease: Power4.easeOut },
        "-=0.2"
      );

    return timeline;
  }, [circleStrokeWidth]);

  const animateLines = useCallback(() => {
    const timelines = [];
    const angle = Math.PI / (COUNT / 4);
    const radius = (prevSize * LINES_RADIUS) / 100;

    linesRefs.current.forEach((ref, i) => {
      const timeline = gsap.timeline({
        delay: Math.floor(i / (COUNT / 2)) * 0.4
      });
      const x = center + radius * Math.cos(i * angle);
      const y = center + radius * Math.sin(i * angle);
      const start = { x2: x, y2: y };
      const end = { x1: x, y1: y };

      timeline
        .fromTo(
          ref.current,
          1,
          { attr: { x2: center, y2: center } },
          { attr: start, ease: Power4.easeOut }
        )
        .fromTo(
          ref.current,
          1,
          { attr: { x1: center, y1: center } },
          { attr: end, ease: Power4.easeOut },
          "-=0.9"
        );

      timelines.push(timeline);
    });

    return timelines;
  }, [center, prevSize]);

  const explode = useCallback(() => {
    const linesTimelines = animateLines();
    const circletimeline = animateCircle();

    TIME_LINE = gsap.timeline({
      delay: prevDelay,
      repeat: prevRepeat,
      repeatDelay: prevRepeatDelay,
      onComplete,
      onStart,
      onRepeat
    });
    TIME_LINE.add(linesTimelines, 0);
    TIME_LINE.add(circletimeline, 0.3);
  }, [
    prevRepeat,
    prevDelay,
    prevRepeatDelay,
    onComplete,
    onStart,
    onRepeat,
    animateCircle,
    animateLines
  ]);

  useEffect(() => {
    setPrevSize(size);
    setPrevDelay(delay);
    setPrevRepeatDelay(repeatDelay);
    setPrevRepeat(repeat);
  }, [size, delay, repeatDelay, repeat]);

  useEffect(() => {
    if (TIME_LINE) TIME_LINE.kill();
    explode();
  }, [explode]);

  return (
    <div style={{ width: prevSize, height: prevSize, ...style }}>
      <svg width={prevSize} height={prevSize}>
        {linesRefs.current.map((ref, i) => (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={center}
            y2={center}
            ref={ref}
            strokeWidth={lineStrokeWidth}
            stroke={color}
          />
        ))}
      </svg>
      <Circle
        width={prevSize}
        height={prevSize}
        r="47%"
        strokeWidth={circleStrokeWidth}
        color={color}
        shapeRef={circleRef}
        style={{ position: "absolute", left: 0, top: 0 }}
      />
    </div>
  );
}
