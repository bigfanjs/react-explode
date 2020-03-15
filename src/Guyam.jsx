import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo
} from "react";
import gsap, { Power4 } from "gsap";

const STROKE_WIDTH = 2;

let TIME_LINE = null;

export default function Guyam({
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
  const circleRef = useRef();

  const [prevSize, setPrevSize] = useState(size);
  const [prevDelay, setPrevDelay] = useState(0);
  const [prevRepeatDelay, setPrevRepeatDelay] = useState(0);
  const [prevRepeat, setPrevRepeat] = useState(0);

  const center = useMemo(() => prevSize / 2, [prevSize]);
  const strokeWidth = useMemo(
    () => Math.ceil((prevSize * STROKE_WIDTH) / 100),
    [prevSize]
  );

  const explode = useCallback(() => {
    const ease = Power4.easeOut;

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
      1,
      { scale: 0, transformOrigin: "center" },
      { scale: 1, ease }
    );
    TIME_LINE.fromTo(
      circleRef.current,
      0.8,
      { attr: { "stroke-width": strokeWidth, opacity: 1 }, ease },
      { attr: { "stroke-width": 0, opacity: 0 }, ease },
      "-=0.5"
    ).set(circleRef.current, { attr: { "stroke-width": strokeWidth } }, "-=1");
  }, [
    prevRepeat,
    prevDelay,
    prevRepeatDelay,
    onComplete,
    onStart,
    onRepeat,
    strokeWidth
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
    <svg width={prevSize} height={prevSize} style={style}>
      <circle
        cx={center}
        cy={center}
        r="47%"
        strokeWidth={strokeWidth}
        stroke={color}
        fill="none"
        ref={circleRef}
      />
    </svg>
  );
}
