import React, { forwardRef } from "react";

function Triangle(
  {
    width = 10,
    height = 10,
    strokeWidth = 1,
    color = "#fff",
    points = "0,0 60,30 0,60 0,30",
    polygonRef,
    border = false,
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
        fill={border ? "none" : color}
        stroke={border ? color : "none"}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export default forwardRef(Triangle);
