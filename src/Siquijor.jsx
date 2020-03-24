import React, { Fragment, useState, useEffect, useCallback } from "react";
import gsap, { Power4 } from "gsap";

const TARGETS = [];
const COUNTS = [7, 32];
const WIDTHS = [1.75, 0.5];
const RADIUS = 47.5;
const CIRCLE_STROKE = 1;
const CIRCLES = [
  { el: null, pos: [50, 50], radius: 25 },
  { el: null, pos: [68, 46], radius: 40 },
  { el: null, pos: [30, 60], radius: 32.5 }
];

let TIME_LINE = null;

export default function Siquijor({
  size,
  delay,
  repeatDelay,
  repeat,
  style,
  color = "white",
  onComplete,
  onStart,
  onRepeat,
  className
}) {
  const [prevSize, setPrevSize] = useState(size);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const circleStroke = Math.ceil((prevSize * CIRCLE_STROKE) / 100);
  const center = prevSize / 2;

  const explode = useCallback(() => {
    const ease = Power4.easeOut;
    const radius = (prevSize * RADIUS) / 100;

    const timelines = [];

    TIME_LINE = gsap.timeline({
      repeat: prevRepeat,
      repeatDelay: prevRepeatDelay,
      delay: prevDelay
    });

    for (let i = 0; i < 2; i++) {
      const angle = Math.PI / (COUNTS[i] / 2);

      for (let j = 0; j < COUNTS[i]; j++) {
        const isLast = j >= COUNTS[i] - 1;
        const timeline = gsap.timeline({
          delay: i >= 1 ? 0 : 0.15,
          onComplete: onComplete && isLast && onComplete.bind(null, i),
          onStart: onStart && isLast && onStart.bind(null, i),
          onRepeat: onRepeat && isLast && onRepeat.bind(null, i)
        });
        const x = center + radius * Math.cos(j * angle);
        const y = center + radius * Math.sin(j * angle);

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

      for (let i = 0; i < CIRCLES.length; i++) {
        const circle = CIRCLES[i];
        const el = circle.el;
        const radius = (prevSize * circle.radius) / 100;
        const timeline = gsap.timeline({
          delay: (i + 1) * 0.2,
          onComplete: onComplete && onComplete.bind(null, 2 + i),
          onStart: onStart && onStart.bind(null, 2 + i),
          onRepeat: onRepeat && onRepeat.bind(null, 2 + 1)
        });

        timeline
          .fromTo(el, 1, { attr: { r: 0 } }, { attr: { r: radius / 2 }, ease })
          .fromTo(
            el,
            1,
            { attr: { "stroke-width": circleStroke } },
            { attr: { "stroke-width": 0 }, ease },
            "-=0.9"
          )
          .fromTo(
            el,
            0.6,
            { attr: { opacity: 1 } },
            { attr: { opacity: 0 }, ease },
            "-=0.5"
          );

        timelines.push(timeline);
      }
      TIME_LINE.add(timelines, 0);
    }
  }, [
    prevSize,
    prevRepeat,
    prevDelay,
    prevRepeatDelay,
    onComplete,
    onStart,
    onRepeat,
    center,
    circleStroke
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
    <svg
      style={{ ...style, position: "relative" }}
      width={prevSize}
      height={prevSize}
      className={className}
    >
      <>
        {[...Array(2)].map((_, i) => {
          const width = Math.ceil((prevSize * WIDTHS[i]) / 100);
          TARGETS[i] = [];

          return (
            <Fragment key={i}>
              {[...Array(COUNTS[i])].map((_, j) => (
                <line
                  x1={center}
                  y1={center}
                  x2={center}
                  y2={center}
                  ref={el => (TARGETS[i][j] = el)}
                  key={j}
                  strokeWidth={width}
                  stroke={color}
                />
              ))}
            </Fragment>
          );
        })}
      </>
      <>
        {[...Array(3)].map((_, i) => {
          const position = CIRCLES[i].pos;
          const x = (prevSize * position[0]) / 100;
          const y = (prevSize * position[1]) / 100;

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={0}
              strokeWidth={circleStroke}
              fill="none"
              stroke={color}
              ref={el => (CIRCLES[i].el = el)}
            />
          );
        })}
      </>
    </svg>
  );
}
