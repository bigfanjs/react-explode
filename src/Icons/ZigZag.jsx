import React, { forwardRef } from "react";

function ZigZag({ width = 40, height = 80, style }, ref) {
  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      style={style}
      viewBox="0 0 40 80"
    >
      <polyline
        fill="none"
        stroke="#ff93ea"
        strokeWidth="4"
        strokeMiterlimit="10"
        points="34.26,2.41 5.35,14.99 34.26,27.56 5.35,40.14 34.26,52.71 5.35,65.29 34.26,77.88 	"
      />
    </svg>
  );
}

export default forwardRef(ZigZag);
