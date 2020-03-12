import React from "react";

export const length = 82;

export default function ZigzagSine({
  width = 60,
  height = 17,
  style,
  shapeRef,
  color = "#fff",
  strokeWidth = 1,
  dasharray
}) {
  return (
    <svg viewBox="0 0 60 17" width={width} height={height} style={style}>
      <path
        ref={shapeRef}
        stroke={color}
        strokeDasharray={dasharray}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M59.1,1.5l-14.6,14L30,1.5l-14.6,14L0.9,1.5"
      />
    </svg>
  );
}
