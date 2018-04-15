import React, { Component, Fragment } from "react";
import { TimelineMax, Power4 } from "gsap";

class Explosion extends Component {
    size = this.props.size;
    center = this.size / 2;
    targets = [];
    counts = [7, 32];
    widths = [7, 2];
    radius = 47.5;
    circles = [
        { el: null, pos: [50, 50], radius: 25 },
        { el: null, pos: [68, 46], radius: 40 },
        { el: null, pos: [30, 60], radius: 32.5 }
    ]

    componentDidMount() {
        const { delay = 0, repeat = 0, repeatDelay = 0, onStart, onComplete, onRepeat } = this.props;
        const duration = 0.5;
        const ease = Power4.easeOut;
        const radius = this.size * this.radius / 100;

        for (let i = 0; i < 2; i++) {
            const angle = Math.PI / (this.counts[i] / 2);

            for (let j = 0; j < this.counts[i]; j++) {
                const isLast = j >= this.counts[i] - 1;
                const tl = new TimelineMax({
                    repeat, repeatDelay,
                    delay: delay + (i >= 1 ? 0.9 : 0),
                    onComplete: onComplete && isLast && onComplete.bind(null, i),
                    onStart: onStart && isLast && onStart.bind(null, i),
                    onRepeat: onRepeat && isLast && onRepeat.bind(null, i)
                });
                const x = this.center + radius * Math.cos(j * angle);
                const y = this.center + radius * Math.sin(j * angle);

                const target = this.targets[i][j];

                const start = { x2: x, y2: y };
                const end = { x1: x, y1: y };

                tl.to(target, 1, { attr: start, ease });
                tl.to(target, 1, { attr: end, ease }, "-=0.9");
            }
        }

        for (let i = 0; i < this.circles.length; i++) {
            const circle = this.circles[i];
            const el = circle.el;
            const radius = this.size * circle.radius / 100;
            const tl = new TimelineMax({
                repeat, repeatDelay,
                delay: delay + (i + 1) * 0.2,
                onComplete: onComplete && onComplete.bind(null, 2 + i),
                onStart: onStart && onStart.bind(null, 2 + i),
                onRepeat: onRepeat && onRepeat.bind(null, 2 + 1)
            });

            tl.to(el, 1, { attr: { r: radius / 2 }, ease });
            tl.to(el, 1, { attr: { "stroke-width": 0 }, ease }, "-=0.9");
        }
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
                                {[...Array(this.counts[i])].map((_, j) =>
                                    <line
                                        x1={center}
                                        y1={center}
                                        x2={center}
                                        y2={center}
                                        ref={(el) => this.targets[i][j] = el}
                                        key={j}
                                        strokeWidth={this.widths[i]}
                                        stroke="white" />
                                )}
                            </Fragment>
                        );
                    })}
                </Fragment>
                <Fragment>
                    {[...Array(3)].map((_, i) => {
                        const position = this.circles[i].pos;
                        const x = size * position[0] / 100;
                        const y = size * position[1] / 100;

                        return (
                            <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r={0}
                                strokeWidth="4"
                                fill="none"
                                stroke="white"
                                ref={(el) => this.circles[i].el = el}
                            />
                        );
                    })}
                </Fragment>
            </svg>
        );
    }
}

export default Explosion;