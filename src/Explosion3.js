import React, { Component, Fragment } from "react";
import { TimelineMax, Power4 } from "gsap";

class Explosion extends Component {
    targets = [[]];

    size = this.props.size;
    center = this.size / 2;

    radiuses = [47.4, 24];

    count = 16;

    componentDidMount() {
        const { delay = 0, repeat = 0, repeatDelay = 0, onStart, onComplete, onRepeat } = this.props;
        const angle = Math.PI / (this.count / 2);
        const ease = Power4.easeOut;
        const radiuses = this.radiuses.map((radius) => this.size * radius / 100);
        const timeline = new TimelineMax({
            repeat, repeatDelay,
            delay: delay + 0.35,
            onComplete: onComplete && onComplete.bind(null, 2),
            onStart: onStart && onStart.bind(null, 2),
            onRepeat: onRepeat && onRepeat.bind(null, 2)
        });

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < this.count; j++) {
                const isLast = j >= this.count - 1;

                const timeline = new TimelineMax({
                    repeat, repeatDelay,
                    delay: delay + i * 0.5,
                    onComplete: onComplete && isLast && onComplete.bind(null, i),
                    onStart: onStart && isLast && onStart.bind(null, i),
                    onRepeat: onRepeat && isLast && onRepeat.bind(null, i)
                });

                const x = this.center + radiuses[0] * Math.cos(j * angle);
                const y = this.center + radiuses[0] * Math.sin(j * angle);

                const target = this.targets[i][j];

                const start = { x2: x, y2: y };
                const end = { x1: x, y1: y };

                timeline.to(target, 1, { attr: start, ease })
                timeline.to(target, 1, { attr: end, ease }, "-=0.9");
            }
        }

        timeline.to(this.circle, 1, { attr: { r: radiuses[1] }, ease });
        timeline.to(this.circle, 1, { attr: { "stroke-width": 0 }, ease }, "-=0.9");
    }

    render() {
        const size = this.size;
        const center = this.center;

        return (
            <svg width={size} height={size}>
                <Fragment>
                    {[...Array(2)].map((_, i) => {
                        this.targets[i] = [];

                        return (
                            <Fragment key={i}>
                                {[...Array(this.count)].map((_, j) =>
                                    <line
                                        x1={center}
                                        y1={center}
                                        x2={center}
                                        y2={center}
                                        ref={(el) => this.targets[i][j] = el}
                                        key={j}
                                        strokeWidth="2"
                                        stroke="white" />
                                )}
                            </Fragment>
                        );
                    })}
                </Fragment>
                <circle
                    cx={center}
                    cy={center}
                    r={0}
                    strokeWidth="4"
                    stroke="white"
                    fill="none"
                    ref={(el) => this.circle = el}
                />
            </svg>
        );
    }
}

export default Explosion;