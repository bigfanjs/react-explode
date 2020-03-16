import { Power4 } from "gsap";
import { useCallback, useMemo } from "react";

const durations = [0.1, 0.5, 0.3, 0.1];

export default function useGSAPAnimateStroke({ length, totalLength, speed }) {
  const speeds = useMemo(() => durations.map(duration => speed * duration), [
    speed
  ]);

  return useCallback(
    ({ timeline, elem, strokeWidth }) => {
      timeline.set(elem, {
        attr: {
          "stroke-dasharray": `0 ${totalLength}`,
          "stroke-dashoffset": 0,
          "stroke-width": 0
        }
      });

      timeline.fromTo(
        elem,
        speeds[1],
        {
          attr: {
            "stroke-width": 0,
            "stroke-dasharray": `0 ${totalLength}`,
            "stroke-dashoffset": 0
          }
        },
        {
          attr: {
            "stroke-dasharray": `${length} ${totalLength - length}`,
            "stroke-dashoffset": -20,
            "stroke-width": strokeWidth
          },
          ease: Power4.easeIn
        }
      );

      timeline.to(elem, speeds[2], {
        attr: {
          "stroke-dasharray": `0 ${totalLength}`,
          "stroke-dashoffset": totalLength * -1
        },
        ease: Power4.easeOut
      });

      timeline.to(
        elem,
        speeds[3],
        { attr: { "stroke-width": 0 }, ease: Power4.easeInOut },
        "-=0.3"
      );
    },
    [length, speeds, totalLength]
  );
}
