import React, { forwardRef } from "react";

function Triangle(
  {
    width = 10,
    height = 10,
    strokeWidth = 0,
    color = "#fff",
    points,
    polygonRef,
    style = {}
  },
  ref
) {
  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      viewBox="0 0 60 60"
      style={style}
    >
      <polygon
        ref={polygonRef}
        points={points}
        fill={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export default forwardRef(Triangle);
