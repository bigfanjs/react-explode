import React, { useState, Fragment, useEffect, useCallback } from "react";
import gsap, { Power4 } from "gsap";
import ZigZag from "../Icons/ZigZag";
import Cross from "../Icons/Cross";
import Circle from "../Icons/Circle";

const ZIGZAGS = [];
const CROSSES = [];
const CIRCLES = [];
const RADIUSES = [47, 30];
const CROSS_SIZE = 17;
const ZIGZAG_WIDTH = 10;
const ZIGZAG_HEIGHT = 20;
const STROKE_WIDTH = 0.1;

let TIMELINE = null;

export default function Explosion10({
  size = 400,
  delay,
  repeatDelay,
  repeat,
  style,
  onComplete,
  onStart,
  onRepeat
}) {
  const [prevSize, setPrevSize] = useState(size);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const strokeWidth = (prevSize * STROKE_WIDTH) / 100;

  const explode = useCallback(() => {
    const ease = Power4.easeOut;
    const radiuses = RADIUSES.map(radius => (prevSize * radius) / 100);
    const tlgroup1 = [];
    const tlgroup2 = [];

    for (let i = 0; i < 20; i++) {
      const timeline = gsap.timeline();

      const zigzag = ZIGZAGS[i];
      const cross = CROSSES[i];

      const cos = Math.cos((Math.PI / 10) * i);
      const sin = Math.sin((Math.PI / 10) * i);
      const size = ((CROSS_SIZE / 2) * prevSize) / 100;

      if (i < 12) {
        const cos = Math.cos((Math.PI / 6) * i);
        const sin = Math.sin((Math.PI / 6) * i);
        const x = ((ZIGZAG_WIDTH / 2) * prevSize) / 100;
        const y = ((ZIGZAG_HEIGHT / 2) * prevSize) / 100;

        timeline.fromTo(
          zigzag,
          2,
          { x: -x, y: -y },
          {
            x: `${-x + radiuses[0] * cos}`,
            y: `${-y + radiuses[0] * sin}`,
            ease
          }
        );
        timeline.fromTo(
          zigzag,
          3,
          { rotation: 0, scale: 1 },
          { rotation: 360, scale: 0, transformOrigin: "50% 50%", ease },
          0
        );
      }

      timeline.fromTo(
        cross,
        2,
        { x: -size, y: -size },
        {
          x: -size + radiuses[1] * cos,
          y: -size + radiuses[1] * sin,
          ease
        },
        0
      );

      timeline.fromTo(
        cross,
        3,
        { rotation: 0, scale: 1 },
        { rotation: 360, scale: 0, transformOrigin: "50% 50%", ease },
        0
      );

      tlgroup1.push(timeline);

      if (i < 2) {
        const timeline = gsap.timeline({ delay: 0.5 * i });
        const circle = CIRCLES[i];

        timeline.fromTo(
          circle,
          2,
          { attr: { r: 0 } },
          { attr: { r: 22 }, ease }
        );
        timeline.fromTo(
          circle,
          1,
          { opacity: 1 },
          { opacity: 0, ease },
          "-=1.5"
        );

        tlgroup2.push(timeline);
      }
    }

    TIMELINE = gsap.timeline({
      repeat: prevRepeat,
      repeatDelay: prevRepeatDelay,
      delay: prevDelay,
      onStart,
      onComplete,
      onRepeat
    });

    TIMELINE.add(tlgroup1, 0);
    TIMELINE.add(tlgroup2, 0.2);
  }, [
    onComplete,
    onStart,
    onRepeat,
    prevDelay,
    prevRepeat,
    prevSize,
    prevRepeatDelay
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
    <div style={{ width: prevSize, height: prevSize, ...style }}>
      {[...Array(20)].map((_, i) => (
        <Fragment key={i}>
          {i < 12 && (
            <ZigZag
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: `${ZIGZAG_WIDTH}%`,
                height: `${ZIGZAG_HEIGHT}%`
              }}
              ref={el => (ZIGZAGS[i] = el)}
            />
          )}
          <Cross
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: `${CROSS_SIZE}%`,
              height: `${CROSS_SIZE}%`
            }}
            ref={el => (CROSSES[i] = el)}
          />
          {i < 2 && (
            <Circle
              radius="0"
              fill="none"
              color="rgb(255, 208, 3)"
              strokeWidth={strokeWidth}
              style={{ position: "absolute", width: "100%", height: "100%" }}
              circleRef={el => (CIRCLES[i] = el)}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}
