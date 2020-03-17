import { Power1, Power4 } from "gsap";
import { useCallback, useMemo } from "react";

const durations = [0.05, 0.3, 0.6, 0.05];

export default function useGSAPAnimateStroke({ length, totalLength, speed }) {
  const speeds = useMemo(() => durations.map(duration => speed * duration), [
    speed
  ]);

  return useCallback(
    ({ timeline, elem, strokeWidth }) => {
      timeline.set(elem, {
        attr: {
          "stroke-dasharray": `0 ${totalLength}`,
          "stroke-dashoffset": 0
        }
      });

      timeline.fromTo(
        elem,
        speeds[0],
        { attr: { "stroke-width": 0 } },
        { attr: { "stroke-width": strokeWidth } }
      );

      timeline.to(
        elem,
        {
          keyframes: [
            {
              attr: {
                "stroke-dasharray": `${length} ${totalLength - length}`,
                "stroke-dashoffset": -20
              },
              duration: speeds[1],
              ease: Power4.easeIn
            },
            {
              attr: {
                "stroke-dasharray": `0 ${totalLength}`,
                "stroke-dashoffset": totalLength * -1
              },
              duration: speeds[2],
              ease: Power4.easeOut
            }
          ]
        },
        "<"
      );

      timeline.to(
        elem,
        speeds[3],
        { attr: { "stroke-width": 0 } },
        `-=${(speeds[1] + speeds[2]) * 0.3}`
      );
    },
    [length, speeds, totalLength]
  );
}
