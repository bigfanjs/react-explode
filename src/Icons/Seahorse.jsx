import React from "react";

export const length = 87.5;

export default function Seahouse({
  width = 51,
  height = 52,
  color = "#fff",
  shapeRef,
  style
}) {
  return (
    <svg viewBox="0 0 51.5 52.5" width={width} height={height} style={style}>
      <path
        ref={shapeRef}
        stroke={color}
        fill="none"
        d="M50.5,52.5c1.7-16.3-6.1-32.1-27-28.5c-11,1.9-16.7-0.7-20.7-7.8C0,11.2,1.1,0.5,1.1,0.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
