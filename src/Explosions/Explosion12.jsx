import React, { useState, useEffect, useCallback, useRef } from "react";
import gsap, { Power4 } from "gsap";

const RADIUS = 45;
const STROKE_WIDTH = 2;

let TIME_LINE = null;

export default function Explosion12({
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
  const circleRef = useRef();

  const center = size / 2;
  const strokeWidth = Math.ceil((size * STROKE_WIDTH) / 100);

  const explode = useCallback(() => {
    const ease = Power4.easeOut;
    const radius = (prevSize * RADIUS) / 100;
    const strokeWidth = Math.ceil((prevSize * STROKE_WIDTH) / 100);

    TIME_LINE = gsap.timeline({
      repeat: prevRepeat,
      repeatDelay: prevRepeatDelay,
      delay: prevDelay,
      onStart: onStart,
      onComplete: onComplete,
      onRepeat: onRepeat
    });

    TIME_LINE.fromTo(
      circleRef.current,
      0.8,
      { attr: { r: 0 } },
      { attr: { r: radius }, ease }
    )
      .fromTo(
        circleRef.current,
        0.8,
        { attr: { "stroke-width": strokeWidth }, opacity: 1, ease },
        { attr: { "stroke-width": 0 }, opacity: 0, ease },
        "-=0.4"
      )
      .set(circleRef.current, { attr: { "stroke-width": strokeWidth } }, "-=1");
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
    <svg width={size} height={size} style={style}>
      <filter id="displacementFilter">
        <feTurbulence
          type="turbulence"
          baseFrequency="0.03"
          numOctaves="3"
          result="turbulence"
        />
        <feDisplacementMap
          in2="turbulence"
          in="SourceGraphic"
          scale="30"
          xChannelSelector="G"
          yChannelSelector="B"
        />
      </filter>
      <circle
        cx={center}
        cy={center}
        r={0}
        strokeWidth={strokeWidth}
        stroke={color}
        fill="none"
        ref={circleRef}
        style={{ filter: "url(#displacementFilter)" }}
      />
    </svg>
  );
}
