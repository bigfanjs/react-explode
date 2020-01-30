import React, { forwardRef } from "react";

function Star(
  {
    width = 25,
    height = 10,
    strokeWidth = 1,
    strokeDasharray = "177 2",
    strokeDashoffset = 88,
    color = "#fff",
    style = {},
    starPolygonRef
  },
  ref
) {
  return (
    <svg
      version="1.1"
      viewBox="0 0 255 240"
      width={width}
      height={height}
      ref={ref}
      style={style}
    >
      <polygon
        strokeWidth={strokeWidth}
        stroke={color}
        ref={starPolygonRef}
        fill="none"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={strokeDashoffset}
        points="127,8 157,93 247,93 177,148 202,233 127,183 52,233 77,148 7,93 97,93 "
      />
    </svg>
  );
}

export default forwardRef(Star);
