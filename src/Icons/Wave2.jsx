import React, { forwardRef } from "react";

export const length = 86;

function Wave2(
  {
    width = 60,
    height = 29,
    color = "#fff",
    style,
    strokeWidth = 1,
    dasharray,
    shapeRef
  },
  ref
) {
  return (
    <svg
      viewBox="0 0 60 29"
      width={width}
      height={height}
      style={style}
      ref={ref}
    >
      <path
        ref={shapeRef}
        stroke={color}
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={dasharray}
        d="M58.9,4.7c0,0,1.8,6.4-3.1,8C43.8,16.5,25-4,12.7,1.6C3.2,6,1.1,28.7,1.1,28.7"
      />
    </svg>
  );
}

export default forwardRef(Wave2);
