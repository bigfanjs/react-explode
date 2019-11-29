import React from "react";

export default function Circle({
  width = 52,
  height = 52,
  innerRef,
  stroke = "white",
  strokeWidth,
  style
}) {
  return (
    <svg
      version="1.1"
      viewBox="0 0 52 52"
      width={width}
      height={height}
      ref={innerRef}
      style={style}
    >
      <circle
        cx="26"
        cy="26"
        r="24"
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
      />
    </svg>
  );
}
