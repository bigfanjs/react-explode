import React, { useState, useCallback, useEffect } from "react";
import { TimelineMax, Power4 } from "gsap";

const LINES = [];
const STROKE_WIDTH = 0.7;
const DISTS = [47.4, 50, 42.5];
const DIFF = 4;
const COUNT = 10;

let TIMELINE = null;

export default function Explosion9({
  size = 400,
  delay,
  repeatDelay,
  repeat,
  style,
  color = "white",
  onComplete,
  onStart,
  onRepeat
}) {
  const [prevSize, setPrevSize] = useState(size);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const center = prevSize / 2;

  const explode = useCallback(() => {
    const dists = DISTS.map(dist => (prevSize * dist) / 100);
    const diff = (prevSize * DIFF) / 100;

    const tlgroup1 = [];

    const angle = Math.PI / 5;
    const ease = Power4.easeOut;

    const offsetX = Math.cos(Math.PI / 10);
    const offsetY = Math.sin(Math.PI / 10);

    for (let i = 0; i < LINES.length; i++) {
      const timeline = new TimelineMax({
        delay: Math.floor(i / COUNT) * 0.2
      });
      const line = LINES[i];

      const x = Math.cos(i * angle);
      const y = Math.sin(i * angle);

      const space = (Math.floor(i / COUNT) + 1) * diff;

      const linex = center + offsetX + (dists[0] - space) * x;
      const liney = center + offsetY + (dists[0] - space) * y;

      const start = { x2: linex, y2: liney };
      const end = { x1: linex, y1: liney };

      timeline.fromTo(
        line,
        0.7,
        { attr: { x2: center, y2: center } },
        { attr: start, ease }
      );
      timeline.fromTo(
        line,
        1.3,
        { attr: { x1: center, y1: center } },
        { attr: end, ease },
        "-=0.7"
      );
      timeline.fromTo(
        line,
        0.3,
        { strokeWidth: Math.ceil((prevSize * (STROKE_WIDTH * 2)) / 100) },
        { strokeWidth: 0 },
        `-=${[0.7, 0.6, 0.5][Math.floor(i / COUNT)]}`
      );

      tlgroup1.push(timeline);
    }

    TIMELINE = new TimelineMax({
      repeat: prevRepeat,
      repeatDelay: prevRepeatDelay,
      delay: prevDelay,
      onStart,
      onComplete,
      onRepeat
    });

    TIMELINE.add(tlgroup1, 0);
  }, [
    center,
    prevDelay,
    prevRepeatDelay,
    onStart,
    onComplete,
    onRepeat,
    prevSize,
    prevRepeat
  ]);

  useEffect(() => {
    if (TIMELINE) TIMELINE.kill();
  });

  useEffect(() => {
    explode();
  }, [explode]);

  useEffect(() => {
    setPrevSize(size);
    setPrevDelay(delay);
    setPrevRepeatDelay(repeatDelay);
    setPrevRepeat(repeat);
  }, [size, delay, repeatDelay, repeat]);

  return (
    <svg width={prevSize} height={prevSize} style={style}>
      <>
        {[...Array(COUNT * 3)].map((_, i) => {
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center}
              y2={center}
              ref={el => (LINES[i] = el)}
              strokeLinecap="round"
              strokeWidth={Math.ceil((prevSize * (STROKE_WIDTH * 2)) / 100)}
              stroke={color}
            />
          );
        })}
      </>
    </svg>
  );
}
