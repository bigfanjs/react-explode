import React, {
  useState,
  useRef,
  useEffect,
  createRef,
  useCallback,
  useMemo
} from "react";
import gsap, { Power4 } from "gsap";
import SineWave, { length as SineWaveLength } from "./Icons/SineWave";
import Circle from "./Icons/Circle";
import Stick, { length as StickLength } from "./Icons/Stick";

// animation configs:
let TIME_LINE;
const SINE_WAVE_WIDTHS = [35, 42.5];
const SINE_WAVE_HEIGHT = 3.75;
const INIT_RADIUS = 6;
const STICK_WIDTH = 8.75;
const STICK_HEIGHT = 15;
const STICK_RADIUS = 12.5;
const STROKE_WIDTH = 0.5;
const LINE_STROKE_WIDTH = 1.5;
const SINE_WAVE_STROKE_WIDTHS = [1, 2];
const LINE_X = 2;

export default function Negros({
  size,
  delay,
  repeatDelay,
  repeat,
  style,
  onComplete,
  onStart,
  onRepeat
}) {
  const lineRef = useRef();
  const circlesRefs = useRef([...Array(1)].map(() => createRef()));
  const sinewavesRefs = useRef([...Array(8)].map(() => createRef()));
  const sticksRefs = useRef(
    [...Array(9)].map(() => ({ svg: createRef(), shape: createRef() }))
  );

  const [prevSize, setPrevSize] = useState(size);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const angle = Math.PI / 2;
  const stickAngle = (2 * Math.PI) / 9;
  const prefixAngle = Math.PI / 4;
  const sineWaveStrokeWidths = SINE_WAVE_STROKE_WIDTHS.map(strokewidth =>
    Math.min((strokewidth * prevSize) / 100, 2)
  );
  const lineStrokeWidth = useMemo(() => (LINE_STROKE_WIDTH * prevSize) / 100, [
    prevSize
  ]);

  const animateLine = useCallback(() => {
    const timeline = gsap.timeline({ repeat: 1, yoyo: true });
    const lineX = (LINE_X * prevSize) / 100;

    timeline.set(lineRef.current, { attr: { "stroke-width": 0 } });
    timeline.fromTo(
      lineRef.current,
      0.2,
      { attr: { "stroke-width": 0 } },
      { attr: { "stroke-width": lineStrokeWidth } }
    );
    timeline.fromTo(
      lineRef.current,
      0.3,
      { attr: { x2: lineX } },
      { attr: { x2: prevSize - lineX }, ease: Power4.easeIn },
      "<"
    );
    timeline.fromTo(
      lineRef.current,
      0.3,
      { attr: { x1: lineX } },
      { attr: { x1: prevSize - lineX }, ease: Power4.easeOut }
    );
    timeline.to(
      lineRef.current,
      0.3,
      { attr: { "stroke-width": 0 }, ease: Power4.easeInOut },
      "-=0.3"
    );

    return timeline;
  }, [prevSize, lineStrokeWidth]);

  const animateSticks = useCallback(() => {
    const timelines = [];
    const width = ((STICK_WIDTH / 2) * prevSize) / 100;
    const height = ((STICK_HEIGHT / 2) * prevSize) / 100;
    const radius = (STICK_RADIUS * prevSize) / 100;

    sticksRefs.current.forEach(({ svg, shape }, i) => {
      const timeline = gsap.timeline();
      const x = Math.cos(i * stickAngle);
      const y = Math.sin(i * stickAngle);

      timeline.set(shape.current, {
        attr: {
          "stroke-dasharray": `0 ${StickLength}`,
          "stroke-dashoffset": 0,
          "stroke-width": 0
        }
      });

      timeline.fromTo(
        svg.current,
        1,
        { x: -width, y: -height },
        {
          x: radius * x - width,
          y: radius * y - height,
          ease: Power4.easeInOut
        }
      );
      timeline.to(shape.current, 0.2, { attr: { "stroke-width": 1 } }, "<");
      timeline.to(
        shape.current,
        {
          keyframes: [
            {
              attr: {
                "stroke-dasharray": `30 ${StickLength - 30}`,
                "stroke-dashoffset": -20
              },
              duration: 0.5
            },
            {
              attr: {
                "stroke-dasharray": `0 ${StickLength}`,
                "stroke-dashoffset": StickLength * -1
              },
              duration: 0.7
            }
          ],
          ease: Power4.easeInOut
        },
        "-=0.2"
      );
      timeline.to(
        shape.current,
        0.3,
        {
          attr: { "stroke-width": 0 },
          ease: Power4.easeInOut
        },
        "-=0.3"
      );

      timelines.push(timeline);
    }, []);

    return timelines;
  }, [prevSize, stickAngle]);

  const animateCircles = useCallback(() => {
    const timelines = [];
    const strokeWidth = (prevSize * STROKE_WIDTH) / 100;

    circlesRefs.current.forEach(ref => {
      const timeline = gsap.timeline({ repeat: 1, repeatDelay: 0 });

      timeline.set(ref.current, {
        attr: { "stroke-width": 15, opacity: 1 }
      });
      timeline.fromTo(
        ref.current,
        0.7,
        { attr: { r: 0, "stroke-width": 15 } },
        {
          attr: { r: "45%", "stroke-width": strokeWidth },
          ease: Power4.easeOut
        }
      );
      timeline.to(
        ref.current,
        0.7,
        {
          attr: { "stroke-width": 0 },
          ease: Power4.easeOut
        },
        "-=0.7"
      );
      timeline.fromTo(
        ref.current,
        0.7,
        { opacity: 1 },
        { opacity: 0 },
        "-=0.6"
      );

      timelines.push(timeline);
    });

    return timelines;
  }, [prevSize]);

  const animateSinewaves = useCallback(() => {
    const timelines = [];

    sinewavesRefs.current.forEach((ref, i) => {
      const timeline = gsap.timeline({ delay: 0.05 * (i % 2) });

      timeline.set(ref.current, {
        attr: {
          "stroke-dasharray": `0 ${SineWaveLength}`,
          "stroke-dashoffset": 0,
          "stroke-width": 0
        }
      });

      timeline.to(ref.current, 0.2, {
        attr: { "stroke-width": sineWaveStrokeWidths[i % 2] }
      });

      timeline.to(
        ref.current,
        {
          keyframes: [
            {
              attr: {
                "stroke-dasharray": `100 ${SineWaveLength - 100}`,
                "stroke-dashoffset": -20
              },
              duration: 0.4
            },
            {
              attr: {
                "stroke-dasharray": `0 ${SineWaveLength}`,
                "stroke-dashoffset": SineWaveLength * -1
              },
              duration: 0.6
            }
          ],
          ease: Power4.easeInOut
        },
        "-=0.2"
      );

      timeline.to(
        ref.current,
        0.3,
        {
          attr: { "stroke-width": 0 },
          ease: Power4.easeInOut
        },
        "-=0.3"
      );

      timelines.push(timeline);
    });

    return timelines;
  }, [sineWaveStrokeWidths]);

  const explode = useCallback(() => {
    const lineTimeline = animateLine();
    const sticksTimelines = animateSticks();
    const circlesTimelines = animateCircles();
    const sinewavesTimelines = animateSinewaves();

    TIME_LINE = gsap.timeline({
      repeat: prevRepeat,
      delay: prevDelay,
      repeatDelay: prevRepeatDelay,
      onStart,
      onComplete,
      onRepeat
    });

    TIME_LINE.add(lineTimeline, 0);
    TIME_LINE.add(sinewavesTimelines, "-=1.3");
    TIME_LINE.add(circlesTimelines, 0.2);
    TIME_LINE.add(sticksTimelines, "-=2.1");
  }, [
    prevRepeat,
    prevDelay,
    prevRepeatDelay,
    onComplete,
    onStart,
    onRepeat,
    animateLine,
    animateSticks,
    animateCircles,
    animateSinewaves
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
      {circlesRefs.current.map((ref, i) => (
        <Circle
          key={i}
          shapeRef={ref}
          width="35%"
          height="35%"
          color="#fe4a49"
          style={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
            top: "50%",
            left: "50%"
          }}
        />
      ))}
      {Array.from(Array(4)).map((_, i) =>
        Array.from(Array(2)).map((_, j) => (
          <SineWave
            key={j + 2 * i}
            width={`${SINE_WAVE_WIDTHS[j % 2]}%`}
            height={`${SINE_WAVE_HEIGHT}%`}
            strokeWidth={SINE_WAVE_STROKE_WIDTHS[j % 2]}
            shapeRef={sinewavesRefs.current[j + 2 * i]}
            dasharray={`0 ${SineWaveLength}`}
            color="#2ab7ca"
            style={{
              position: "absolute",
              left: `${50 + INIT_RADIUS * Math.cos(i * angle - prefixAngle)}%`,
              top: `${50 +
                INIT_RADIUS * Math.sin(i * angle - prefixAngle) +
                j * 2.5}%`,
              transform: `
                  rotate(${Math.floor(i / 2) * 180}deg)`,
              transformOrigin: "0 0"
            }}
          />
        ))
      )}
      {sticksRefs.current.map(({ svg, shape }, i) => (
        <Stick
          key={i}
          ref={svg}
          shapeRef={shape}
          width={`${STICK_WIDTH}%`}
          height={`${STICK_HEIGHT}%`}
          dasharray={`0 ${StickLength}`}
          color="#fe4a49"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `
              translate(-50%, -50%)
              rotate(${40 * i + 110}deg)
            `,
            transformOrigin: "center"
          }}
        />
      ))}
      <svg width={prevSize} height={prevSize}>
        <line
          ref={lineRef}
          x1={`${LINE_X}%`}
          y1="50%"
          x2={`${LINE_X}%`}
          y2="50%"
          stroke="#fed766"
          strokeLinecap="round"
          strokeWidth={0}
        />
      </svg>
    </div>
  );
}
