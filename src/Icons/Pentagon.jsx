import React, { forwardRef } from "react";

function Pentagon(
  {
    width = 10,
    height = 10,
    strokeWidth = 1,
    strokeDasharray = 40,
    strokeDashoffset = 0,
    color = "#fff",
    polygonRef,
    style = {}
  },
  ref
) {
  return (
    <svg
      viewBox="0 0 588 560"
      style={style}
      width={width}
      height={height}
      ref={ref}
    >
      <polygon
        ref={polygonRef}
        strokeWidth={strokeWidth}
        stroke={color}
        strokeDashoffset={strokeDashoffset}
        strokeDasharray={strokeDasharray}
        fill="none"
        points="113.99,3.02 473.99,3 585.25,345.38 294.01,557 2.75,345.4"
      />
    </svg>
  );
}

export default forwardRef(Pentagon);
