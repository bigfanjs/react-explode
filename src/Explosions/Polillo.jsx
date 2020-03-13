import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
  createRef
} from "react";
import gsap, { Power4 } from "gsap";
import ZigZag from "../Icons/ZigZag";
import Cross from "../Icons/Cross";
import Circle from "../Icons/Circle";

const RADIUSES = [47, 30];
const CROSS_SIZE = 17;
const ZIGZAG_WIDTH = 10;
const ZIGZAG_HEIGHT = 20;
const STROKE_WIDTH = 0.1;

let TIME_LINE = null;

export default function Polillo({
  size = 400,
  delay,
  repeatDelay,
  repeat,
  style,
  onComplete,
  onStart,
  onRepeat
}) {
  const zigzagRefs = useRef([...Array(9)].map(() => createRef()));
  const crossRefs = useRef([...Array(9)].map(() => createRef()));
  const circleRefs = useRef([...Array(2)].map(() => createRef()));

  const [prevSize, setPrevSize] = useState(size);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const strokeWidth = (prevSize * STROKE_WIDTH) / 100;
  const radiuses = useMemo(
    () => RADIUSES.map(radius => (prevSize * radius) / 100),
    [prevSize]
  );
  const crossSize = useMemo(() => ((CROSS_SIZE / 2) * prevSize) / 100, [
    prevSize
  ]);
  const angle = 2 * (Math.PI / 9);

  const animateZigzags = useCallback(() => {
    const timelines = [];

    zigzagRefs.current.forEach((ref, i) => {
      const timeline = gsap.timeline();
      const cos = Math.cos(2 * (Math.PI / 9) * i);
      const sin = Math.sin(2 * (Math.PI / 9) * i);
      const x = ((ZIGZAG_WIDTH / 2) * prevSize) / 100;
      const y = ((ZIGZAG_HEIGHT / 2) * prevSize) / 100;

      timeline.fromTo(
        ref.current,
        1,
        { x: -x, y: -y },
        {
          x: `${-x + radiuses[0] * cos}`,
          y: `${-y + radiuses[0] * sin}`,
          ease: Power4.easeOut
        }
      );
      timeline.fromTo(
        ref.current,
        2,
        { rotation: 0, scale: 1 },
        {
          rotation: 360,
          scale: 0,
          transformOrigin: "50% 50%",
          ease: Power4.easeOut
        },
        0
      );

      timelines.push(timeline);
    }, []);

    return timelines;
  }, [prevSize, radiuses]);

  const animateCrosses = useCallback(() => {
    const timelines = [];

    crossRefs.current.forEach((ref, i) => {
      const timeline = gsap.timeline();
      const cos = Math.cos(angle * i);
      const sin = Math.sin(angle * i);

      timeline.fromTo(
        ref.current,
        1,
        { x: -crossSize, y: -crossSize },
        {
          x: -crossSize + radiuses[1] * cos,
          y: -crossSize + radiuses[1] * sin,
          ease: Power4.easeOut
        },
        "<"
      );

      timeline.fromTo(
        ref.current,
        2,
        { rotation: 0, scale: 1 },
        {
          rotation: 360,
          scale: 0,
          transformOrigin: "50% 50%",
          ease: Power4.easeOut
        },
        "<"
      );

      timelines.push(timeline);
    });

    return timelines;
  }, [radiuses, crossSize, angle]);

  const animateCircles = useCallback(() => {
    const timelines = [];

    circleRefs.current.forEach((ref, i) => {
      const timeline = gsap.timeline({ delay: 0.3 * i });

      timeline.set(ref.current, { attr: { "stroke-width": 1 } });
      timeline.fromTo(
        ref.current,
        1,
        { scale: 0, transformOrigin: "center" },
        { scale: 1, ease: Power4.easeOut }
      );
      timeline.fromTo(
        ref.current,
        0.3,
        { attr: { "stroke-width": 1 }, transformOrigin: "center" },
        { attr: { "stroke-width": 0 }, ease: Power4.easeOut },
        "-=0.6"
      );
      timeline.fromTo(
        ref.current,
        1,
        { opacity: 1 },
        { opacity: 0, ease: Power4.easeOut },
        "-=0.3"
      );

      timelines.push(timeline);
    });

    return timelines;
  }, []);

  const explode = useCallback(() => {
    const zigzagsTimelines = animateZigzags();
    const crossesTimelines = animateCrosses();
    const circlesTimelines = animateCircles();

    TIME_LINE = gsap.timeline({
      repeat: prevRepeat,
      delay: prevDelay,
      repeatDelay: prevRepeatDelay,
      onStart,
      onComplete,
      onRepeat
    });

    TIME_LINE.add(zigzagsTimelines, 0);
    TIME_LINE.add(crossesTimelines, 0);
    TIME_LINE.add(circlesTimelines, 0.1);
  }, [
    onComplete,
    onStart,
    onRepeat,
    prevDelay,
    prevRepeat,
    prevRepeatDelay,
    animateZigzags,
    animateCrosses,
    animateCircles
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
    <div style={{ width: prevSize, height: prevSize, ...style }}>
      {zigzagRefs.current.map((ref, i) => (
        <ZigZag
          key={i}
          color="#fe4a49"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${ZIGZAG_WIDTH}%`,
            height: `${ZIGZAG_HEIGHT}%`
          }}
          ref={ref}
        />
      ))}
      {crossRefs.current.map((ref, i) => (
        <Cross
          key={i}
          ref={ref}
          color="#2ab7ca"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${CROSS_SIZE}%`,
            height: `${CROSS_SIZE}%`
          }}
        />
      ))}
      {circleRefs.current.map((ref, i) => (
        <Circle
          key={i}
          radius="40%"
          fill="none"
          color="#fed766"
          strokeWidth={strokeWidth}
          style={{ position: "absolute", width: "100%", height: "100%" }}
          shapeRef={ref}
        />
      ))}
    </div>
  );
}
