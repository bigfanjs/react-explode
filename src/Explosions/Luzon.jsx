import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  createRef,
  useMemo
} from "react";
import gsap, { Power4 } from "gsap";
import ZigzagSine, { length as zigzagSineLength } from "../Icons/ZigzagSine";
import HeartLine, { length as heartLineLength } from "../Icons/HeartLine";
import Circle from "../Icons/Circle";
import SineWave, { length as sineWaveLength } from "../Icons/SineWave";

const CIRCLE_SIZE = 40;
const ZIGZAG_SIZE = 80;
const ZIGZAG_STROKE_WIDTH = 0.24;
const CIRCLE_STROKE_WIDTH = 0.35;
const HEART_LINE_SIZE = 50;
const HEART_LINE_STROKE_WIDTHS = [0.25, 0.1];
let TIME_LINE;

export default function Luzon({
  size,
  delay,
  repeatDelay,
  repeat,
  style,
  onComplete,
  onStart,
  onRepeat
}) {
  const circleRefs = useRef([...Array(2)].map(() => createRef()));
  const waveRefs = useRef([...Array(4)].map(() => createRef()));
  const zigzagRefs = useRef([...Array(3)].map(() => createRef()));
  const heartLineRefs = useRef([...Array(4)].map(() => createRef()));

  const [prevSize, setPrevSize] = useState(400);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const zigzagStrokeWidth = useMemo(
    () => (prevSize * ZIGZAG_STROKE_WIDTH) / 100,
    [prevSize]
  );
  const HeartLineStrokeWidths = useMemo(
    () => HEART_LINE_STROKE_WIDTHS.map(sw => (prevSize * sw) / 100),
    [prevSize]
  );

  const animateZigzag = useCallback(() => {
    const timelines = [];

    zigzagRefs.current.forEach((ref, i) => {
      const timeline = gsap.timeline({ delay: 0.04 * i });

      timeline.set(ref.current, {
        attr: {
          "stroke-dasharray": `0 ${zigzagSineLength}`,
          "stroke-dashoffset": 0,
          "stroke-width": 0
        }
      });

      timeline.to(ref.current, 0.2, {
        attr: { "stroke-width": zigzagStrokeWidth }
      });

      timeline.to(
        ref.current,
        {
          keyframes: [
            {
              attr: {
                "stroke-dasharray": `50 ${zigzagSineLength - 50}`,
                "stroke-dashoffset": -20
              },
              duration: 0.4
            },
            {
              attr: {
                "stroke-dasharray": `0 ${zigzagSineLength}`,
                "stroke-dashoffset": zigzagSineLength * -1
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
  }, [zigzagStrokeWidth]);

  const animateCircle = useCallback(() => {
    const timelines = [];
    const strokeWidth = (prevSize * CIRCLE_STROKE_WIDTH) / 100;

    circleRefs.current.forEach((ref, i) => {
      if (i === 1) {
        const timeline = gsap.timeline();

        timeline.set(ref.current, {
          scale: 0,
          opacity: 1,
          attr: { "stroke-width": 20 }
        });
        timeline.fromTo(
          ref.current,
          0.7,
          { scale: 0, transformOrigin: "center", attr: { "stroke-width": 20 } },
          {
            scale: 1,
            attr: { "stroke-width": strokeWidth },
            ease: Power4.easeInOut
          }
        );
        timeline.to(
          ref.current,
          0.7,
          {
            scale: 0.7,
            transformOrigin: "center",
            attr: { "stroke-width": 0 },
            opacity: 0,
            ease: Power4.easeInOut
          },
          "-=0.1"
        );

        timelines.push(timeline);
      } else {
        const timeline = gsap.timeline({ delay: 0.45 });

        timeline.set(ref.current, { attr: { "stroke-width": 20 }, scale: 0 });
        timeline.set(ref.current, { opacity: 1 });
        timeline.fromTo(
          ref.current,
          0.8,
          { scale: 0, transformOrigin: "center" },
          { scale: 0.8, ease: Power4.easeInOut }
        );
        timeline.to(
          ref.current,
          1,
          { scale: 1.1, attr: { "stroke-width": 0 }, ease: Power4.easeInOut },
          "-=0.8"
        );
        timeline.fromTo(
          ref.current,
          0.3,
          { opacity: 1 },
          { opacity: 0, ease: Power4.easeInOut },
          "-=0.3"
        );

        timelines.push(timeline);
      }
    });

    return timelines;
  }, [prevSize]);

  const animateSineWaves = useCallback(() => {
    const timelines = [];

    waveRefs.current.forEach(ref => {
      const timeline = gsap.timeline();

      timeline.set(ref.current, {
        attr: {
          "stroke-dasharray": `0 ${sineWaveLength}`,
          "stroke-dashoffset": 0
        }
      });

      timeline.to(ref.current, {
        keyframes: [
          {
            attr: {
              "stroke-dasharray": `100 ${sineWaveLength - 100}`,
              "stroke-dashoffset": -20
            },
            duration: 0.4
          },
          {
            attr: {
              "stroke-dasharray": `0 ${sineWaveLength}`,
              "stroke-dashoffset": sineWaveLength * -1
            },
            duration: 0.6
          }
        ],
        ease: Power4.easeInOut
      });

      timelines.push(timeline);
    });

    return timelines;
  }, []);

  const animateHeartLines = useCallback(() => {
    const timelines = [];

    heartLineRefs.current.forEach((ref, i) => {
      const timeline = gsap.timeline({ delay: (i % 2) * 0.05 });

      timeline.set(ref.current, {
        attr: {
          "stroke-dasharray": `0 ${heartLineLength}`,
          "stroke-dashoffset": 0
        }
      });

      timeline.fromTo(
        ref.current,
        0.6,
        {
          attr: {
            "stroke-dasharray": `0 ${heartLineLength}`,
            "stroke-dashoffset": 0
          }
        },
        {
          attr: {
            "stroke-dasharray": `80 ${heartLineLength - 80}`,
            "stroke-dashoffset": -20
          },
          ease: Power4.easeIn
        }
      );
      timeline.to(ref.current, 0.5, {
        attr: {
          "stroke-dasharray": `0 ${heartLineLength}`,
          "stroke-dashoffset": heartLineLength * -1
        },
        ease: Power4.easeOut
      });

      timelines.push(timeline);
    });

    return timelines;
  }, []);

  const explode = useCallback(() => {
    const zizagTimelines = animateZigzag();
    const circleTimelines = animateCircle();
    const sineWavesTimelines = animateSineWaves();
    const heartLinesTimelines = animateHeartLines();

    TIME_LINE = gsap.timeline({
      repeat: prevRepeat,
      delay: prevDelay,
      repeatDelay: prevRepeatDelay,
      onStart,
      onComplete,
      onRepeat
    });

    TIME_LINE.add(zizagTimelines, 0);
    TIME_LINE.add(circleTimelines, 0.1);
    TIME_LINE.add(sineWavesTimelines, 0.6);
    TIME_LINE.add(heartLinesTimelines, 0.6);
  }, [
    prevRepeat,
    prevDelay,
    prevRepeatDelay,
    onComplete,
    onStart,
    onRepeat,
    animateZigzag,
    animateCircle,
    animateSineWaves,
    animateHeartLines
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

  // const circleSize = useMemo(() => (CIRCLE_SIZE * 100) / prevSize, [prevSize]);

  return (
    <div
      style={{
        width: prevSize,
        height: prevSize,
        border: "1px solid #fff",
        ...style
      }}
    >
      {zigzagRefs.current.map((ref, i) => (
        <ZigzagSine
          key={i}
          shapeRef={ref}
          width={`${ZIGZAG_SIZE}%`}
          height={`${ZIGZAG_SIZE}%`}
          strokeWidth="0"
          dasharray={`0 ${zigzagSineLength}`}
          color="#fed766"
          style={{
            position: "absolute",
            top: `${50 + 6 * i - (2 * 6) / 2}%`,
            left: "50%",
            transform: "translate(-50%, -50%)"
          }}
        />
      ))}
      {heartLineRefs.current.map((ref, i) => (
        <HeartLine
          key={i}
          shapeRef={ref}
          strokeWidth={HeartLineStrokeWidths[i % 2]}
          width={`${HEART_LINE_SIZE}%`}
          height={`${HEART_LINE_SIZE}%`}
          dasharray={`0 ${heartLineLength}`}
          color={["#fe4a49", "#2ab7ca"][i % 2]}
          style={{
            position: "absolute",
            top: "32.5%",
            left: "50%",
            transformOrigin: "3% 32.5%",
            transform: `
                rotate(${Math.floor(i / 2) * 180 - 3 * i}deg)
            `
          }}
        />
      ))}
      {waveRefs.current.map((ref, i) => (
        <SineWave
          key={i}
          shapeRef={ref}
          color="#fed766"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transformOrigin: "0 0",
            transform: `rotate(${Math.floor(i / 2) * 180 -
              (2 * 10) / 2 +
              (i % 2) * 10}deg)`
          }}
          dasharray={`0 ${sineWaveLength}`}
        />
      ))}
      {circleRefs.current.map((ref, i) => (
        <Circle
          key={i}
          shapeRef={ref}
          radius="15%"
          width={prevSize}
          height={prevSize}
          color={["#2ab7ca", "#fe4a49"][i]}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }}
        />
      ))}
    </div>
  );
}
