import React, { forwardRef } from "react";

export const length = 86;

function Stick(
  {
    color = "#fff",
    width = 35,
    height = 60,
    strokeWidth = 1,
    shapeRef,
    dasharray,
    style
  },
  ref
) {
  return (
    <svg
      viewBox="0 0 35 60"
      width={width}
      height={height}
      style={style}
      ref={ref}
    >
      <path
        ref={shapeRef}
        strokeWidth={strokeWidth}
        stroke={color}
        fill="none"
        strokeDasharray={dasharray}
        d="M17.2,56.9c0,0,10.8,0.9,13.4-1.9c3.7-3.9,4.1-28.5,2-35.2C29.4,10.1,1,3.4,1,3.4"
      />
    </svg>
  );
}

export default forwardRef(Stick);
