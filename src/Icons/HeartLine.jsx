import React from "react";

export const length = 182.9;

export default function HeartLine({
  width = 60,
  height = 60,
  style,
  shapeRef,
  color = "#fff",
  strokeWidth = 1,
  dasharray
}) {
  return (
    <svg viewBox="0 0 60 60" width={width} height={height} style={style}>
      <path
        ref={shapeRef}
        stroke={color}
        strokeDasharray={dasharray}
        strokeWidth={strokeWidth}
        fill="none"
        d="M1.9,19.8c0,0,4.1-4.5,9.4-1.4c4.1,2.4,13.1,12,21.2,14.6c13.8,4.4,25.4-7.8,18.8-14.1
	c-7.2-6.8-19.6,7.7-14.8,6.2c6.7-2,9.4-15.8,2.7-18.7c-8.5-3.7-13.1,6.2-11.7,16.9c0.9,6.4,2.9,11.4,7,14.6
	c6.3,4.9,18.9,2.8,21.9,9.8c1.1,2.7,0.1,5.5,0.1,5.5"
      />
    </svg>
  );
}
