import React, {
  useState,
  useEffect,
  useCallback,
  createRef,
  useRef,
  useMemo
} from "react";
import gsap, { Power4, Power1 } from "gsap";
import Star from "./Icons/Star";
import Pentagon from "./Icons/Pentagon";

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

  const [prevSize, setPrevSize] = useState(size);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const center = useMemo(() => prevSize / 2, [prevSize]);

  const animatePentagon = useCallback(() => {
    const timeline = gsap.timeline();

    timeline.set(polygonRef.current, {
      attr: { "stroke-dasharray": "0 0 0 360", "stroke-dashoffset": "180" }
    });
    timeline.to(polygonRef.current, 1, {
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
      ease: Power4.easeInOut
    });

    return timeline;
  }, []);

  const animateStar = useCallback(() => {
    const timeline = gsap.timeline();

    timeline.fromTo(
      starRef.current,
      0.4,
      { scale: 0, transformOrigin: "center" },
      { scale: 1, ease: Power1.easeIn }
    );
    timeline.fromTo(
      starPolygonRef.current,
      0.4,
      { attr: { "stroke-dasharray": "177 2", "stroke-dashoffset": 88 } },
      {
        attr: { "stroke-dasharray": "0 179", "stroke-dashoffset": 0 },
        ease: Power1.easeOut
      },
      "-=0.1"
    );

    return timeline;
  }, []);

  const animateLines = useCallback(() => {
    const timelines = [];
    const angle = (2 * Math.PI) / 5;
    const prefixAngle = Math.PI / 10;
    const radius = (prevSize * RADIUS) / 100;

    linesRefs.current.forEach((ref, i) => {
      const timeline = gsap.timeline();

      const x = center + radius * Math.cos(prefixAngle + i * angle);
      const y = center + radius * Math.sin(prefixAngle + i * angle);
      const start = { x2: x, y2: y };
      const end = { x1: x, y1: y };

      timeline
        .fromTo(
          ref.current,
          0.5,
          { attr: start },
          { attr: { x2: center, y2: center, ease: Power4.easeIn } }
        )
        .fromTo(
          ref.current,
          0.5,
          { attr: end },
          { attr: { x1: center, y1: center, ease: Power4.easeIn } },
          "-=0.3"
        );

      timelines.push(timeline);
    });

    return timelines;
  }, [center, prevSize]);

  const explode = useCallback(() => {
    const pentagonTimeline = animatePentagon();
    const starTimeline = animateStar();
    const linesTimelines = animateLines();

    TIME_LINE = gsap.timeline({
      repeat: prevRepeat,
      delay: prevDelay,
      repeatDelay: prevRepeatDelay,
      onStart,
      onComplete,
      onRepeat
    });

    TIME_LINE.add(starTimeline, 0.1);
    TIME_LINE.add(linesTimelines, 0.1);
    TIME_LINE.add(pentagonTimeline, 0);
  }, [
    onRepeat,
    onStart,
    onComplete,
    prevRepeat,
    prevDelay,
    prevRepeatDelay,
    animatePentagon,
    animateStar,
    animateLines
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
    <div style={{ width: size, height: size, ...style }}>
      <Star
        strokeWidth={2}
        ref={starRef}
        starPolygonRef={starPolygonRef}
        strokeDasharray="177 2"
        strokeDashoffset="88"
        color="#2ab7ca"
        style={{
          position: "absolute",
          top: "1%",
          left: "5%",
          width: `${STAR_SIZE}%`,
          height: `${STAR_SIZE}%`,
          transform: "scale(0)",
          transformOrigin: "center"
        }}
      />
      <Pentagon
        strokeWidth={2}
        polygonRef={polygonRef}
        strokeDashoffset="180"
        strokeDasharray="0 0 0 360"
        color="#fe4a49"
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
            strokeWidth={2}
            stroke="#fed766"
          />
        ))}
      </svg>
    </div>
  );
}
