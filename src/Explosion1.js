import React, { useState, useEffect, useCallback } from "react";
import gsap, { Power4 } from "gsap";

const STROKE_WIDTH = 0.5;
const RADIUS = 47.5;
const COUNT = 16;
const DURATIONS = [0.6, 1];
const LINES = [];

let TIME_LINE = null;

export default function Explosion1({
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
  const [prevSize, setPrevSize] = useState(400);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const center = size / 2;
  const strokeWidth = Math.ceil((size * STROKE_WIDTH) / 100);

  const explode = useCallback(() => {
    const ease = Power4.easeOut;
    const angle = Math.PI / 8;
    const radius = (prevSize * RADIUS) / 100;
    const durations = DURATIONS;
    const center = prevSize / 2;
    const timelines = [];

    TIME_LINE = gsap.timeline({
      repeat: prevRepeat,
      delay: prevDelay,
      repeatDelay: prevRepeatDelay,
      onComplete,
      onStart,
      onRepeat
    });

    for (let i = 0; i < COUNT; i++) {
      const x = center + radius * Math.cos(i * angle);
      const y = center + radius * Math.sin(i * angle);
      const target = LINES[i];
      const start = { x2: x, y2: y };
      const end = { x1: x, y1: y };

      const timeline = gsap.timeline();

      timeline
        .fromTo(
          target,
          durations[0],
          { attr: { x2: center, y2: center } },
          { attr: start, ease }
        )
        .fromTo(
          target,
          durations[1],
          { attr: { x1: center, y1: center } },
          { attr: end, ease },
          `-=${durations[0]}`
        );

      timelines.push(timeline);
    }

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
    explode();
  }, [explode]);

  useEffect(() => {
    TIME_LINE.kill();
    explode();
  });

  useEffect(() => {
    setPrevSize(size);
    setPrevDelay(delay);
    setPrevRepeatDelay(repeatDelay);
    setPrevRepeat(repeat);
  }, [size, delay, repeatDelay, repeat]);

  return (
    <svg width={size} height={size} style={style}>
      <>
        {[...Array(COUNT)].map((_, i) => (
          <line
            x1={center}
            y1={center}
            x2={center}
            y2={center}
            ref={el => (LINES[i] = el)}
            key={i}
            strokeWidth={strokeWidth}
            stroke={color}
          />
        ))}
      </>
    </svg>
  );
}
