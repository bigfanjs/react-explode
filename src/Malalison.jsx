import React, { useState, useEffect, useCallback } from "react";
import gsap, { Circ } from "gsap";

const PATHS = [];
const DEGREE = (90 * Math.PI) / 180;
const INIT_EXPLOSION = 4;
const GAP = 7;
const STROKE_WIDTH = 0.5;

let TIMELINE = null;

export default function Malalison({
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

  const center = prevSize / 2;

  const explode = useCallback(() => {
    const center = prevSize / 2;
    const ease = Circ.easeInOut;
    const offset = INIT_EXPLOSION * 2;

    const timelines = [];

    for (let i = 0; i < PATHS.length; i++) {
      const path = PATHS[i];
      const j = Math.floor((i - offset) / INIT_EXPLOSION + 1);
      const length = center - (i >= offset ? center * (j / 15) : 0);
      const degree = (i < INIT_EXPLOSION ? 0 : DEGREE / 2) + DEGREE * i;
      const xPercent = Math.cos(degree);
      const yPercent = Math.sin(degree);
      const xOffset = (i < INIT_EXPLOSION ? GAP : 0) * Math.cos(DEGREE * i);
      const yOffset = (i < INIT_EXPLOSION ? GAP : 0) * Math.sin(DEGREE * i);
      const X = center + length * xPercent;
      const Y = center + length * yPercent;
      const timeline = gsap.timeline({
        delay: i < INIT_EXPLOSION ? 0 : 0.2
      });

      timeline.fromTo(
        path,
        0.7,
        { attr: { x2: center, y2: center }, ease },
        { attr: { x2: X, y2: Y }, ease }
      );
      timeline.fromTo(
        path,
        0.7,
        { attr: { x1: center + xOffset, y1: center + yOffset }, ease },
        { attr: { x1: X, y1: Y }, ease },
        "-=0.5"
      );

      if (i >= offset) {
        const transformOrigin = `${xPercent >= 0 ? 0 : 100}% ${
          yPercent >= 0 ? 0 : 100
        }%`;

        timeline.fromTo(
          path,
          0.5,
          { rotation: 0 },
          { rotation: 90 * (j / 10), transformOrigin, ease },
          "-=0.7"
        );
      }

      timelines.push(timeline);
    }

    TIMELINE = gsap.timeline({
      delay: prevDelay,
      repeat: prevRepeat,
      repeatDelay: prevRepeatDelay,
      onStart,
      onComplete,
      onRepeat
    });

    TIMELINE.add(timelines);
  }, [
    prevSize,
    prevDelay,
    prevRepeat,
    prevRepeatDelay,
    onStart,
    onComplete,
    onRepeat
  ]);

  useEffect(() => {
    if (TIMELINE) TIMELINE.kill();
  });

  useEffect(() => {
    setPrevSize(size);
    setPrevDelay(delay);
    setPrevRepeatDelay(repeatDelay);
    setPrevRepeat(repeat);
  }, [size, delay, repeatDelay, repeat]);

  useEffect(() => {
    explode();
  }, [explode]);

  return (
    <svg width={prevSize} height={prevSize} style={style}>
      {[...Array(64)].map((_, i) => (
        <line
          key={i}
          x1={center + (i < INIT_EXPLOSION ? GAP : 0) * Math.cos(DEGREE * i)}
          y1={center + (i < INIT_EXPLOSION ? GAP : 0) * Math.sin(DEGREE * i)}
          x2={center}
          y2={center}
          stroke={color}
          strokeWidth={Math.ceil((prevSize * STROKE_WIDTH) / 100)}
          ref={el => (PATHS[i] = el)}
        />
      ))}
    </svg>
  );
}
