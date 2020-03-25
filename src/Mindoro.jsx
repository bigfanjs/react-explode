import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  createRef,
  useMemo
} from "react";
import gsap, { Power4, Expo } from "gsap";

import Seahouse, { length as seahouseTotalLength } from "./Icons/Seahorse";
import Hexagon from "./Icons/Hexagon";
import SineWave, { length as sineWaveTotalLength } from "./Icons/SineWave";
import Triangle from "./Icons/Triangle";
import useGSAPAnimateStroke from "./hooks/useGSAPAnimateStroke";

let TIME_LINE;

const SINE_WAVE_LENGTH = 30;
const HEXAGON_WIDTH = 30;
const HEXAGON_HEIGHT = 32;
const SINE_WAVE_WIDTHS = [37.5, 50];
const HEXAGON_STROKE_WIDTH = 10;
const SINE_WAVE_STROKE_WIDTHS = [1.5, 2.5];
const angle = (2 * Math.PI) / 3;
const TRIANGLE_RADIUS = 30;
const TRIANGLE_SIZE = 6;

export default function Mindoro({
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
  const hexagonRef = useRef();
  const seahouseRefs = useRef([...Array(4)].map(() => createRef()));
  const sinewavesRefs = useRef([...Array(8)].map(() => createRef()));
  const triangleRefs = useRef(
    [...Array(3)].map(() => ({ svg: createRef(), shape: createRef() }))
  );

  const [prevSize, setPrevSize] = useState(size);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const hexagonStrokeWidth = (HEXAGON_STROKE_WIDTH * 100) / 400;
  const SineWavelength = useMemo(() => (SINE_WAVE_LENGTH * prevSize) / 100, [
    prevSize
  ]);
  const animateSineWaveStroke = useGSAPAnimateStroke({
    length: SineWavelength,
    totalLength: sineWaveTotalLength,
    speed: 1.1
  });

  const animateSeahorseStroke = useGSAPAnimateStroke({
    length: 40,
    totalLength: seahouseTotalLength,
    speed: 1.2
  });

  const animateSeahorse = useCallback(() => {
    const timelines = [];

    seahouseRefs.current.forEach(ref => {
      const timeline = gsap.timeline();

      animateSeahorseStroke({ elem: ref.current, strokeWidth: 1, timeline });

      timelines.push(timeline);
    });

    return timelines;
  }, [animateSeahorseStroke]);

  const animateHexagon = useCallback(() => {
    const timeline = gsap.timeline();

    timeline.fromTo(
      hexagonRef.current,
      1,
      {
        scale: 0,
        rotate: 10,
        transformOrigin: "center",
        attr: { "stroke-width": 40 }
      },
      {
        scale: 1,
        rotate: 70,
        attr: { "stroke-width": 0 },
        transformOrigin: "center",
        ease: Power4.easeInOut
      }
    );
    timeline.fromTo(
      hexagonRef.current,
      0.3,
      { opacity: 1 },
      { opacity: 0, ease: Power4.easeInOut },
      "-=0.1"
    );

    return timeline;
  }, []);

  const animateSineWave = useCallback(() => {
    const timelines = [];

    sinewavesRefs.current.forEach((ref, i) => {
      const timeline = gsap.timeline();

      animateSineWaveStroke({
        elem: ref.current,
        strokeWidth: SINE_WAVE_STROKE_WIDTHS[i % 2],
        timeline
      });

      timelines.push(timeline);
    });

    return timelines;
  }, [animateSineWaveStroke]);

  const animateTriangles = useCallback(() => {
    const timelines = [];
    const radius = (prevSize * TRIANGLE_RADIUS) / 100;

    triangleRefs.current.forEach(({ svg, shape }, i) => {
      const timeline = gsap.timeline();
      const cos = Math.cos(angle * i);
      const sin = Math.sin(angle * i);
      const size = ((TRIANGLE_SIZE / 2) * prevSize) / 100;

      timeline.fromTo(
        svg.current,
        1,
        { x: -size, y: -size },
        {
          x: `${-size + radius * cos}`,
          y: `${-size + radius * sin}`,
          ease: Expo.easeOut
        }
      );
      timeline.fromTo(
        shape.current,
        1,
        { scale: 0, transformOrigin: "center" },
        { scale: 1, ease: Expo.easeOut },
        "<"
      );
      timeline.fromTo(
        svg.current,
        1,
        { rotation: 0 },
        {
          rotation: 300 * (i % 2 ? 1 : -1),
          transformOrigin: "50% 50%",
          ease: Power4.easeOut
        },
        "-=1"
      );
      timeline.fromTo(
        shape.current,
        0.8,
        { attr: { "stroke-width": 15 } },
        { attr: { "stroke-width": 0 }, ease: Power4.easeOut },
        "-=0.9"
      );
      timeline.fromTo(
        shape.current,
        0.3,
        { opacity: 1 },
        { opacity: 0, ease: Power4.easeOut },
        "-=0.1"
      );

      timelines.push(timeline);
    }, []);

    return timelines;
  }, [prevSize]);

  const explode = useCallback(() => {
    const seahorseTimelines = animateSeahorse();
    const hexagonTimeline = animateHexagon();
    const sineWaveTimelines = animateSineWave();
    const trianglesTimelines = animateTriangles();

    TIME_LINE = gsap.timeline({
      repeat: prevRepeat,
      delay: prevDelay,
      repeatDelay: prevRepeatDelay,
      onStart,
      onComplete,
      onRepeat
    });

    TIME_LINE.add(seahorseTimelines, 0);
    TIME_LINE.add(hexagonTimeline, 0.3);
    TIME_LINE.add(sineWaveTimelines, 0.5);
    TIME_LINE.add(trianglesTimelines, 0.75);
  }, [
    prevRepeat,
    prevDelay,
    prevRepeatDelay,
    onComplete,
    onStart,
    onRepeat,
    animateSeahorse,
    animateHexagon,
    animateSineWave,
    animateTriangles
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
      style={{ width: size, height: size, position: "relative", ...style }}
    >
      {seahouseRefs.current.map((ref, i) => (
        <Seahouse
          key={i}
          shapeRef={ref}
          color="#fed766"
          style={{
            position: "absolute",
            width: prevSize * 0.6,
            height: prevSize * 0.6,
            left: "50%",
            top: "50%",
            transform: `translate(-23%, -23%) rotate(${90 * i}deg)`,
            transformOrigin: "23% 23%"
          }}
        />
      ))}
      {Array.from(Array(2)).map((_, i) =>
        Array.from(Array(4)).map((_, j) => (
          <SineWave
            key={j + 4 * i}
            width={`${SINE_WAVE_WIDTHS[j % 2]}%`}
            strokeWidth={0}
            shapeRef={sinewavesRefs.current[j + 4 * i]}
            dasharray={`0 ${sineWaveTotalLength}`}
            color="#2ab7ca"
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: `
                rotate(${j * 10 + Math.floor(j / 2) * 30 - 30 + 180 * i}deg)`,
              transformOrigin: "0 0"
            }}
          />
        ))
      )}
      {triangleRefs.current.map(({ svg, shape }, i) => (
        <Triangle
          key={i}
          width={`${TRIANGLE_SIZE}%`}
          height={`${TRIANGLE_SIZE}%`}
          ref={svg}
          shapeRef={shape}
          color="#88d8b0"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `
              translate(-50%, -50%)
              rotate(${((angle * 180) / Math.PI) * i - 30}deg)`
          }}
          border
        />
      ))}
      <Hexagon
        width={`${HEXAGON_WIDTH}%`}
        height={`${HEXAGON_HEIGHT}%`}
        strokeWidth={hexagonStrokeWidth}
        shapeRef={hexagonRef}
        color="#fe4a49"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%) rotate(10deg)"
        }}
      />
    </div>
  );
}
