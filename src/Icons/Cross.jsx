import React, { forwardRef } from "react";

function Cross({ width = 70, height = 70, style }, ref) {
  return (
    <svg
      ref={ref}
      viewBox="0 0 70 70"
      width={width}
      height={height}
      style={style}
    >
      <line
        fill="none"
        stroke="#1FE2FF"
        strokeWidth="6"
        strokeMiterlimit="10"
        x1="0.48"
        y1="35"
        x2="69.13"
        y2="35"
      />
      <line
        fill="none"
        stroke="#1FE2FF"
        strokeWidth="6"
        strokeMiterlimit="10"
        x1="34.8"
        y1="0.82"
        x2="34.8"
        y2="69.27"
      />
    </svg>
  );
}

export default forwardRef(Cross);
