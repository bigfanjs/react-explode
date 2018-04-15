import React, { Component, Fragment } from "react";
import { TweenLite, Power4 } from "gsap";

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
        const { delay = 0 } = this.props;
        const duration = 0.5;
        const ease = Power4.easeOut;
        const radius = this.size * this.radius / 100;

        for (let i = 0; i < 2; i++) {
            const angle = Math.PI / (this.counts[i] / 2);

            for (let j = 0; j < this.counts[i]; j++) {
                const x = this.center + radius * Math.cos(j * angle);
                const y = this.center + radius * Math.sin(j * angle);

                const target = this.targets[i][j];

                const start = { x2: x, y2: y };
                const end = { x1: x, y1: y };

                const d = delay + (i >= 1 ? 0.9 : 0);

                TweenLite.to(target, duration, { attr: start, delay: d, ease });
                TweenLite.to(target, duration * 1.9, { attr: end, delay: d, ease });
            }
        }

        for (let i = 0; i < this.circles.length; i++) {
            const circle = this.circles[i];
            const el = circle.el;
            const radius = this.size * circle.radius / 100;

            TweenLite.to(el, duration * 2, { attr: { r: radius / 2 }, delay: (i + 1) * 0.2, ease });
            TweenLite.to(el, duration * 2.5, { attr: { "stroke-width": 0 }, delay: (i + 1) * 0.2, ease });
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