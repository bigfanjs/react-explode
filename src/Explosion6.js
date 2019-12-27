import React, { useState, useEffect, useCallback, Fragment } from "react";
import Shape from "./Icons/Shape";
import Circle from "./Icons/Circle";
import gsap, { Power1, Power4 } from "gsap";

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
      const timeline = gsap.timeline({ delay: (i + 1) / 5 });

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
      timeline.fromTo(circle, 0.5, { opacity: 1 }, { opacity: 0 }, "-=0.8");

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
      const timeline = gsap.timeline();

      timeline.set(shape, { x: "-45%", y: "-50%" });
      timeline.fromTo(
        shape,
        0.9,
        {
          scale: 0,
          rotation: 0,
          transformOrigin: "45% 50%"
        },
        { scale: 1, rotation, ease }
      );
      timeline.to(shape, 1, { scale: 0.9, ease: Power1.easeIn });
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
    TIME_LINE = gsap.timeline({
      delay: prevDelay,
      repeat: prevRepeat,
      repeatDelay: prevRepeatDelay,
      onStart,
      onComplete,
      onRepeat
    });

    TIME_LINE.add(animateShape(), 0);
    TIME_LINE.add(animateBubbles(), "-=2.3");
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
                ref={el => (CIRCLES[i] = el)}
                stroke={color}
                strokeWidth={strokeWidth}
                width={`${CIRCLE_SIZE}%`}
                height={`${CIRCLE_SIZE}%`}
                radius="24"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  transformOrigin: "50% 50%",
                  position: "absolute"
                }}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
