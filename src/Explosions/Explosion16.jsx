import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  createRef
} from "react";
import gsap, { Power4 } from "gsap";
import CurveLine from "../Icons/CurveLine";
import Circle from "../Icons/Circle";
import Square from "../Icons/Square";
import Triangle from "../Icons/Triangle";

let TIME_LINE = null;
const RADIUSES = [9, 10, 11, 12];
const CIRCLE_SIZE = 10;
const SHAPE_SIZE = 5;
const STROKE_WIDTH = 0.5;

const shapes = [Square, Triangle, Circle, Triangle];

export default function Explosion16({
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
  const curveLiveRef = useRef();
  const circleRef = useRef();
  const shapesRefs = useRef([...Array(4)].map(() => createRef()));
  const squareRefs = useRef([...Array(3)].map(() => createRef()));

  const [prevSize, setPrevSize] = useState(400);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const explode = useCallback(() => {
    const shapesTimlines = [];
    const squaresTimlines = [];
    const timeline = gsap.timeline();
    const strokeWidth = (prevSize * STROKE_WIDTH) / 100;

    timeline.set(curveLiveRef.current, {
      attr: {
        "stroke-dasharray": "0 228",
        "stroke-dashoffset": 0,
        "stroke-width": 0
      }
    });
    timeline.to(curveLiveRef.current, 0.3, {
      attr: { "stroke-width": 1 }
    });
    timeline.to(
      curveLiveRef.current,
      {
        keyframes: [
          {
            attr: {
              "stroke-dasharray": "60 168",
              "stroke-dashoffset": -40
            },
            duration: 1
          },
          {
            attr: { "stroke-dasharray": "0 227", "stroke-dashoffset": -227 },
            duration: 0.5
          }
        ],
        ease: Power4.easeInOut
      },
      "-=0.3"
    );
    timeline.to(
      curveLiveRef.current,
      0.6,
      {
        attr: { "stroke-width": 0 },
        ease: Power4.easeInOut
      },
      "-=0.4"
    );

    // animate shapes
    shapesRefs.current.forEach((ref, i) => {
      const timeline = gsap.timeline({ delay: i * 0.08 });
      const cos = Math.cos((Math.PI / 2) * i);
      const sin = Math.sin((Math.PI / 2) * i);
      const size = ((SHAPE_SIZE / 2) * prevSize) / 100;
      const radiuses = RADIUSES.map(radius => (prevSize * radius) / 100);

      timeline.fromTo(
        ref.current,
        0.5,
        { x: -size, y: -size, scale: 0 },
        {
          x: `${-size + radiuses[i] * cos}`,
          y: `${-size + radiuses[i] * sin}`,
          scale: 1,
          ease: Power4.easeOut
        }
      );
      timeline.fromTo(
        ref.current,
        0.5,
        { rotation: 0 },
        {
          rotation: 200,
          transformOrigin: "50% 50%",
          ease: Power4.easeOut
        },
        "-=0.4"
      );
      timeline.fromTo(
        ref.current,
        0.4,
        { opacity: 1 },
        { opacity: 0, ease: Power4.easeOut },
        "-=0.4"
      );

      shapesTimlines.push(timeline);
    });

    // animate sqaures
    squareRefs.current.forEach((ref, i) => {
      const timeline = gsap.timeline({ delay: i * 0.05 });
      const cos = Math.cos(((2 * Math.PI) / 3) * i);
      const sin = Math.sin(((2 * Math.PI) / 3) * i);
      const size = ((SHAPE_SIZE / 2) * prevSize) / 100;
      const radiuses = RADIUSES.map(radius => (prevSize * radius) / 100);

      timeline.fromTo(
        ref.current,
        0.7,
        { x: -size, y: -size, scale: 0 },
        {
          x: `${-size + radiuses[i] * cos}`,
          y: `${-size + radiuses[i] * sin}`,
          scale: 1,
          ease: Power4.easeOut
        }
      );
      timeline.fromTo(
        ref.current,
        0.5,
        { rotation: 0 },
        {
          rotation: 200,
          transformOrigin: "50% 50%",
          ease: Power4.easeOut
        },
        "-=0.6"
      );
      timeline.fromTo(
        ref.current,
        0.3,
        { opacity: 1 },
        { opacity: 0, ease: Power4.easeOut },
        "-=0.4"
      );

      squaresTimlines.push(timeline);
    });

    const circleTimeline = gsap.timeline();

    circleTimeline.set(circleRef.current, {
      attr: { "stroke-width": 15 }
    });
    circleTimeline.fromTo(
      circleRef.current,
      0.5,
      { attr: { r: 0, "stroke-width": 15 } },
      {
        attr: { r: "45%", "stroke-width": strokeWidth },
        ease: Power4.easeOut
      }
    );
    circleTimeline.to(
      circleRef.current,
      0.5,
      {
        attr: { "stroke-width": 0 },
        ease: Power4.easeOut
      },
      "-=0.5"
    );
    circleTimeline.to(
      circleRef.current,
      0.5,
      {
        opacity: 0
      },
      "-=0.4"
    );

    TIME_LINE = gsap.timeline({
      repeat: prevRepeat,
      delay: prevDelay,
      repeatDelay: prevRepeatDelay,
      onStart,
      onComplete,
      onRepeat
    });

    TIME_LINE.add(timeline);
    TIME_LINE.add(shapesTimlines, 0.55);
    TIME_LINE.add(squaresTimlines, 0.9);
    TIME_LINE.add(circleTimeline, 1.2);
  }, [
    prevRepeat,
    prevDelay,
    prevRepeatDelay,
    onComplete,
    onStart,
    onRepeat,
    prevSize
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

  // const circlesRadius = (CIRCLES_RADIUS * prevSize) / 100;

  return (
    <div style={{ width: size, height: size, ...style }}>
      <CurveLine
        width={prevSize}
        height={prevSize}
        ref={curveLiveRef}
        strokeDasharray="0 228"
        strokeWidth={1}
        color="#fed766"
      />
      {shapes.map((Shape, i) => (
        <Shape
          key={i}
          ref={shapesRefs.current[i]}
          width={`${SHAPE_SIZE - SHAPE_SIZE * i * 0.1}%`}
          height={`${SHAPE_SIZE - SHAPE_SIZE * i * 0.1}%`}
          strokeWidth={4}
          style={{
            position: "absolute",
            left: "25%",
            top: "40%",
            transform: "translate(-50%, -50%)"
          }}
          color={["#88d8b0", "#ffeead", "#ff6f69", "#ffcc5c"][i]}
          border
        />
      ))}
      {squareRefs.current.map((ref, i) => (
        <Square
          key={i}
          ref={ref}
          width={`${SHAPE_SIZE - SHAPE_SIZE * i * 0.1}%`}
          height={`${SHAPE_SIZE - SHAPE_SIZE * i * 0.1}%`}
          strokeWidth={4}
          color={["#88d8b0", "#ffeead", "#ff6f69"][i]}
          style={{
            position: "absolute",
            left: "74%",
            top: "36%",
            transform: "translate(-50%, -50%)"
          }}
        />
      ))}
      <Circle
        circleRef={circleRef}
        width={`${CIRCLE_SIZE}%`}
        height={`${CIRCLE_SIZE}%`}
        radius={0}
        strokeWidth={2.5}
        style={{
          position: "absolute",
          left: "99%",
          top: "24.5%",
          transform: "translate(-50%, -50%)"
        }}
      />
    </div>
  );
}
