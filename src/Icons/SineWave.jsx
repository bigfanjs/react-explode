import React, { forwardRef } from "react";

export const length = 205;

function SineWave({
  color = "#fff",
  width = 200,
  height = 15,
  strokeWidth = 1,
  shapeRef,
  dasharray,
  style
}) {
  return (
    <svg viewBox="0 0 200 15" width={width} height={height} style={style}>
      <path
        d="M0,0.8c33.21,0,33.21,13.53,66.42,13.53c33.21,0,33.21-13.53,66.42-13.53s33.21,13.53,66.42,13.53"
        stroke={color}
        strokeWidth={strokeWidth}
        ref={shapeRef}
        strokeDasharray={dasharray}
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default forwardRef(SineWave);
