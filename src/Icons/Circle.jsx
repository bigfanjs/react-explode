import React, { forwardRef } from "react";

function Circle(
  {
    width = 52,
    height = 52,
    shapeRef,
    strokeWidth = 1,
    radius = "45%",
    color = "#fff",
    strokeDasharray,
    strokeLinecap,
    style
  },
  ref
) {
  return (
    <svg
      version="1.1"
      viewBox="0 0 52 52"
      width={width}
      height={height}
      style={style}
      ref={ref}
    >
      <circle
        ref={shapeRef}
        cx="26"
        cy="26"
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinecap={strokeLinecap}
        fill="none"
      />
    </svg>
  );
}

export default forwardRef(Circle);
