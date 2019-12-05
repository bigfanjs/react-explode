import React, { useState, useEffect, useCallback } from "react";
import { TimelineMax, Power2 } from "gsap";
import Wave from "./Icons/Wave";

const COUNT = 8;
const PATHS = [];
const WAVE_WIDTH = 50;
const WAVE_HEIGHT = 3.75;

let TIMELINE = null;

export default function Exploion8({
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

  const center = prevSize / 2;

  const explode = useCallback(() => {
    const timelines = [];

    for (let i = 0; i < COUNT; i++) {
      const target = PATHS[i];

      const timeline = new TimelineMax();

      timeline.set(target, { attr: { "stroke-dashoffset": 279 } });
      timeline.fromTo(
        target,
        1,
        { attr: { "stroke-dasharray": "279 279" } },
        { attr: { "stroke-dasharray": "0 279" }, ease: Power2.easeInOut }
      );

      timelines.push(timeline);
    }

    TIMELINE = new TimelineMax({
      repeat: prevRepeat,
      delay: prevDelay,
      repeatDelay: prevRepeatDelay,
      onComplete,
      onStart,
      onRepeat
    });

    TIMELINE.add(timelines);
  }, [onRepeat, onStart, onComplete, prevRepeat, prevDelay, prevRepeatDelay]);

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

  useEffect(() => {
    explode();
  });

  return (
    <div style={{ width: prevSize, height: prevSize, ...style }}>
      {Array.from(Array(COUNT)).map((_, i) => {
        return (
          <Wave
            key={i}
            innerRef={el => (PATHS[i] = el)}
            color={color}
            width={`${WAVE_WIDTH}%`}
            height={`${WAVE_HEIGHT}%`}
            style={{
              position: "absolute",
              left: center,
              top: center,
              transform: `translateY(-50%) rotate(${45 * i}deg)`,
              transformOrigin: "left center",
              strokeWidth: 2
            }}
          />
        );
      })}
    </div>
  );
}
