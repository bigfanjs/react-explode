import React, { forwardRef } from "react";

function Pentagon(
  { width = 60, height = 60, strokeWidth = 1, color = "#fff", style = {} },
  ref
) {
  return (
    <svg
      version="1.1"
      id
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 60"
      ref={ref}
      width={width}
      height={height}
      style={style}
    >
      <polyline
        points="3.85,2.07 55.76,30 4.29,57.69"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export default forwardRef(Pentagon);
