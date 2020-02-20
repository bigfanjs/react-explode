import React, { forwardRef } from "react";

function CurveLine(
  { color = "#fff", width = 60, height = 60, strokeWidth = 1, strokeDasharray },
  ref
) {
  return (
    <svg viewBox="0 0 60 60" width={width} height={height}>
      <path
        ref={ref}
        stroke={color}
        fill="none"
        d="M0,41.22c0,0,1.4-24.89,15.57-20.44c19.01,5.97,11.34,35.69-3.45,28.74c-15.64-7.35,4.49-31.29,18.5-32.15 c16.08-0.99,26.91,16.73,23.42,24.03c-4.49,9.4-17.72,7.61-21.35-0.52C26.14,26.22,60,14.42,60,14.42"
        strokeDasharray={strokeDasharray}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default forwardRef(CurveLine);
