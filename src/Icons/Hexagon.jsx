import React, { forwardRef } from "react";

function Hexagon(
  { width = 47, height = 54, border = true, style, shapeRef, color = "#fff" },
  ref
) {
  return (
    <svg
      viewBox="0 0 47.24 54.88"
      width={width}
      height={height}
      style={style}
      ref={ref}
    >
      <polygon
        points="45.68,40.79 23.53,53.93 1.42,40.74 1.45,14.41 23.6,1.27 45.72,14.46 "
        stroke={border ? color : "none"}
        fill={border ? "none" : color}
        ref={shapeRef}
      />
    </svg>
  );
}

export default forwardRef(Hexagon);
