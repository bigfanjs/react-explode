import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useRef
} from "react";
import { TimelineMax, Power4 } from "gsap";

const TARGETS = [[]];
const RADIUSES = [47.4, 30];
const CIRCLE_STROKE_WIDTH = 2;
const LINE_STROKE_WIDTH = 1;
const COUNT = 16;

let TIME_LINE = null;

export default function Explosion3({
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
  const [prevSize, setPrevSize] = useState(400);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const center = prevSize / 2;
  const circleStrokeWidth = Math.ceil((prevSize * CIRCLE_STROKE_WIDTH) / 100);
  const lineStrokeWidth = Math.ceil((prevSize * LINE_STROKE_WIDTH) / 100);

  const explode = useCallback(() => {
    const angle = Math.PI / (COUNT / 2);
    const ease = Power4.easeOut;
    const radiuses = RADIUSES.map(radius => (prevSize * radius) / 100);
    const center = prevSize / 2;
    const timeline = new TimelineMax({
      delay: 0.35,
      onComplete: onComplete && onComplete.bind(null, 2),
      onStart: onStart && onStart.bind(null, 2),
      onRepeat: onRepeat && onRepeat.bind(null, 2)
    });
    const timelines = [];
    const circleStrokeWidth = Math.ceil((prevSize * CIRCLE_STROKE_WIDTH) / 100);

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < COUNT; j++) {
        const isLast = j >= COUNT - 1;

        const timeline = new TimelineMax({
          delay: i * 0.5,
          onComplete: onComplete && isLast && onComplete.bind(null, i),
          onStart: onStart && isLast && onStart.bind(null, i),
          onRepeat: onRepeat && isLast && onRepeat.bind(null, i)
        });

        const x = center + radiuses[0] * Math.cos(j * angle);
        const y = center + radiuses[0] * Math.sin(j * angle);

        const target = TARGETS[i][j];

        const start = { x2: x, y2: y };
        const end = { x1: x, y1: y };

        timeline
          .fromTo(
            target,
            1,
            { attr: { x2: center, y2: center } },
            { attr: start, ease }
          )
          .fromTo(
            target,
            1,
            { attr: { x1: center, y1: center } },
            { attr: end, ease },
            "-=0.9"
          );

        timelines.push(timeline);
      }
    }

    timeline
      .fromTo(
        circleRef.current,
        1,
        { attr: { r: 0 } },
        { attr: { r: radiuses[1] }, ease }
      )
      .fromTo(
        circleRef.current,
        1,
        { attr: { "stroke-width": circleStrokeWidth } },
        { attr: { "stroke-width": 0 }, ease },
        "-=0.9"
      )
      .fromTo(
        circleRef.current,
        0.6,
        { attr: { opacity: 1 } },
        { attr: { opacity: 0 }, ease },
        "-=0.3"
      );

    timelines.push(timeline);

    TIME_LINE = new TimelineMax({
      delay: prevDelay,
      repeat: prevRepeat,
      repeatDelay: prevRepeatDelay
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
    setPrevSize(size);
    setPrevDelay(delay);
    setPrevRepeatDelay(repeatDelay);
    setPrevRepeat(repeat);
  }, [size, delay, repeatDelay, repeat]);

  useEffect(() => {
    explode();
  }, [explode]);

  useEffect(() => {
    TIME_LINE.kill();
    explode();
  });

  return (
    <svg style={style} width={prevSize} height={prevSize}>
      <>
        {[...Array(2)].map((_, i) => {
          TARGETS[i] = [];

          return (
            <Fragment key={i}>
              {[...Array(COUNT)].map((_, j) => (
                <line
                  x1={center}
                  y1={center}
                  x2={center}
                  y2={center}
                  ref={el => (TARGETS[i][j] = el)}
                  key={j}
                  strokeWidth={lineStrokeWidth}
                  stroke={color}
                />
              ))}
            </Fragment>
          );
        })}
      </>
      <circle
        cx={center}
        cy={center}
        r={0}
        strokeWidth={circleStrokeWidth}
        stroke={color}
        fill="none"
        ref={circleRef}
      />
    </svg>
  );
}
