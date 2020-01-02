import React, { forwardRef } from "react";

function Square(
  {
    width = 10,
    height = 10,
    strokeWidth = 1,
    strokeDasharray = 40,
    strokeDashoffset = 0,
    color = "#fff",
    rectRef,
    style = {}
  },
  ref
) {
  return (
    <svg width={width} height={height} style={style} ref={ref}>
      <rect
        x={0}
        y={0}
        width="100%"
        height="100%"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        fill="none"
        ref={rectRef}
      />
    </svg>
  );
}

export default forwardRef(Square);
