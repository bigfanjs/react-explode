import React from "react";

export default function Shape({
  width = 330,
  height = 30,
  strokeWidth,
  innerRef,
  style
}) {
  return (
    <svg
      version="1.1"
      viewBox="0 0 340 30"
      width={width}
      height={height}
      ref={innerRef}
      style={style}
    >
      <polygon
        points="0,0 151.5,14.5 0,30 "
        fill="white"
        strokeWidth={strokeWidth}
      />
      <polygon
        points="340,0 340,30 151.5,14.5 "
        fill="white"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}
