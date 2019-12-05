import React from "react";

export default function Wave({
  width = 200,
  height = 15,
  color = "#fff",
  style = {},
  innerRef
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 15"
      width={width}
      height={height}
      style={style}
    >
      <path
        ref={innerRef}
        stroke={color}
        fill="none"
        d="M200,1.5c-6.89,0-6.89,12-13.79,12c-6.89,0-6.89-12-13.79-12c-6.89,0-6.89,12-13.79,12
	c-6.89,0-6.89-12-13.79-12c-6.89,0-6.89,12-13.79,12c-6.89,0-6.89-12-13.79-12c-6.89,0-6.89,12-13.79,12c-6.89,0-6.89-12-13.79-12
	c-6.89,0-6.89,12-13.79,12c-6.89,0-6.89-12-13.78-12c-6.89,0-6.89,12-13.79,12c-6.9,0-6.9-12-13.79-12c-6.89,0-6.89,12-13.79,12
	c-6.9,0-6.9-12-13.8-12C3.51,1.5,0,7.5,0,7.5"
      />
    </svg>
  );
}
