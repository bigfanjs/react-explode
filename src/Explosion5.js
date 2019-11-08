import React, { useState, useCallback, useEffect } from "react";
import { TimelineMax, Power4 } from "gsap";

const SQUARE = [];
const STROKE_WIDTH = 2.5;

let TIME_LINE = null;

export default function Explosion5({
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
  const sizes = [size * 0.58, size * 0.3, size * 0.3, size * 0.1, size * 0.1];
  const halfs = [sizes[0] / 2, sizes[1] / 2, sizes[3] / 2];
  const front = center - halfs[0];
  const back = center + halfs[0];
  const positions = [
    { x: center, y: center },
    { x: center, y: back },
    { x: center, y: front },
    { x: front, y: front },
    { x: back, y: back }
  ];

  const strokeWidth = Math.ceil((prevSize * STROKE_WIDTH) / 100);
  const explode = useCallback(() => {
    const ease = Power4.easeOut;
    const center = prevSize / 2;
    const sizes = [
      prevSize * 0.58,
      prevSize * 0.3,
      prevSize * 0.3,
      prevSize * 0.1,
      prevSize * 0.1
    ];
    const halfs = [sizes[0] / 2, sizes[1] / 2, sizes[3] / 2];
    const front = center - halfs[0];
    const back = center + halfs[0];
    const positions = {
      start: [
        { x: center, y: center },
        { x: center, y: back },
        { x: center, y: front },
        { x: front, y: front },
        { x: back, y: back }
      ],
      end: [
        { x: front, y: front },
        { x: center - halfs[1], y: back - halfs[1] },
        { x: center - halfs[1], y: front - halfs[1] },
        { x: front - halfs[2], y: front - halfs[2] },
        { x: back - halfs[2], y: back - halfs[2] }
      ]
    };
    const timelines = [];

    const delays = [0, 0.3, 0.3, 0.5, 0.5];

    for (let i = 0; i < SQUARE.length; i++) {
      const square = SQUARE[i];
      const size = sizes[i];
      const start = positions.start[i];
      const end = positions.end[i];
      const delay = delays[i];
      const timeline = new TimelineMax({
        delay,
        onStart: i === 0 && onStart,
        onComplete: i === 0 && onComplete,
        onRepeat: i === 0 && onRepeat
      });

      timeline
        .fromTo(
          square,
          1,
          { attr: { x: start.x, y: start.y, width: 0, height: 0 }, ease },
          { attr: { x: end.x, y: end.y, width: size, height: size }, ease }
        )
        .fromTo(
          square,
          1,
          { attr: { "stroke-width": strokeWidth }, ease },
          { attr: { "stroke-width": 0 }, ease },
          "-=0.9"
        );

      timelines.push(timeline);
    }

    TIME_LINE = new TimelineMax({
      delay: prevDelay,
      repeat: prevRepeat,
      repeatDelay: prevRepeatDelay
    });

    TIME_LINE.add(timelines);
  }, [
    prevSize,
    prevRepeat,
    prevDelay,
    prevRepeatDelay,
    onComplete,
    onStart,
    onRepeat,
    strokeWidth
  ]);

  useEffect(() => {
    setPrevSize(size);
    setPrevDelay(delay);
    setPrevRepeatDelay(repeatDelay);
    setPrevRepeat(repeat);
  }, [size, delay, repeatDelay, repeat]);

  useEffect(() => {
    explode();
  }, [explode]);

  useEffect(() => {
    TIME_LINE.kill();
    explode();
  });

  console.log("render");

  return (
    <svg width={prevSize} height={prevSize} style={style}>
      {[...Array(5)].map((_, i) => {
        const { x, y } = positions[i];

        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={0}
            height={0}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            ref={el => (SQUARE[i] = el)}
            style={{
              transform: "rotate(-50deg)",
              transformOrigin: `${center}px ${center}px`
            }}
          />
        );
      })}
    </svg>
  );
}
