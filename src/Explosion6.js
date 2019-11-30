import React, { useState, useEffect, useCallback, Fragment } from "react";
import Shape from "./Icons/Shape";
import Circle from "./Icons/Circle";
import { TimelineMax, Power4 } from "gsap";

const SHAPES = [];
const CIRCLES = [];
const DEGREE = 360;
const RATIO = 25;
const SHAPE_WIDTH = 82.5;
const SHAPE_HEIGHT = 7.5;
const CIRCLE_SIZE = 13;
const ORIGINS = [
  [400, 50],
  [400, 100],
  [-300, 50]
];

let TIME_LINE = null;

export default function Explosion6({
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
  const [prevSize, setPrevSize] = useState(200);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);
  const strokeWidth = Math.ceil((prevSize * 0.5) / 100);

  const animateBubbles = useCallback(() => {
    const ease = Power4.easeOut;
    const timelines = [];

    for (let i = 0; i < CIRCLES.length; i++) {
      const circle = CIRCLES[i];
      const origin = ORIGINS[i];
      const timeline = new TimelineMax({ delay: (i + 1) / 5 });

      timeline.set(circle, {
        rotation: 0,
        opacity: 1,
        scale: 0.3,
        transformOrigin: "center",
        x: 0,
        y: 0
      });
      timeline.fromTo(
        circle,
        1.5,
        {
          rotation: 0,
          opacity: 1,
          scale: 0,
          x: `${origin[0] * -1}%`,
          y: `${origin[1] * -1}%`,
          ease
        },
        {
          rotation: 120,
          scale: 1,
          transformOrigin: `${origin[0]}% ${origin[1]}%`,
          ease
        }
      );
      timeline.to(circle, 0.5, { opacity: 0 }, "-=0.8");

      timelines.push(timeline);
    }

    return timelines;
  }, []);

  const animateShape = useCallback(() => {
    const ease = Power4.easeOut;
    const timelines = [];

    for (let i = 0; i < SHAPES.length; i++) {
      const shape = SHAPES[i];
      const degree = i % 2 == 0 ? DEGREE + RATIO : -(DEGREE - RATIO);
      const rotation = degree * ((i + 1) / 4);
      const timeline = new TimelineMax();

      timeline.set(shape, { x: "-45%", y: "-50%" });
      timeline.from(shape, 1.5, {
        scale: 0,
        rotation: 0,
        transformOrigin: "45% 50%",
        ease
      });
      timeline.to(shape, 0.9, { scale: 1, rotation, ease }, "-=1.5");
      timeline.to(shape, 0.5, { scale: 0, ease });

      timelines.push(timeline);
    }

    return timelines;
  }, []);

  useEffect(() => {
    if (TIME_LINE) TIME_LINE.kill();
  });

  useEffect(() => {
    setPrevSize(size);
    setPrevDelay(delay);
    setPrevRepeatDelay(repeatDelay);
    setPrevRepeat(repeat);
  }, [size, delay, repeatDelay, repeat]);

  useEffect(() => {
    TIME_LINE = new TimelineMax({
      delay: prevDelay,
      repeat: prevRepeat,
      repeatDelay: prevRepeatDelay,
      onStart,
      onComplete,
      onRepeat
    });

    TIME_LINE.add(animateShape(), 0);
    TIME_LINE.add(animateBubbles(), "-=2");
  }, [
    prevDelay,
    prevSize,
    prevRepeat,
    prevRepeatDelay,
    onStart,
    onComplete,
    onRepeat,
    animateShape,
    animateBubbles
  ]);

  return (
    <div
      style={{
        width: prevSize,
        height: prevSize,
        position: "relative",
        ...style
      }}
    >
      {[...Array(4)].map((_, i) => {
        return (
          <Fragment key={i}>
            <Shape
              innerRef={el => (SHAPES[i] = el)}
              strokeWidth={strokeWidth}
              fill={color}
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-45%, -50%)",
                transformOrigin: "45% 50%",
                position: "absolute",
                width: `${SHAPE_WIDTH}%`,
                height: `${SHAPE_HEIGHT}%`
              }}
            />
            {i <= 2 && (
              <Circle
                innerRef={el => (CIRCLES[i] = el)}
                stroke={color}
                strokeWidth={strokeWidth}
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) scale(0)",
                  transformOrigin: "50% 50%",
                  position: "absolute",
                  width: `${CIRCLE_SIZE}%`,
                  height: `${CIRCLE_SIZE}%`
                }}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
