import React, { Component, Fragment } from "react";
import { TweenLite, Power4 } from "gsap";

import "./Explosion2.css";

class Explosion extends Component {
    targets = [];
    counts = [7, 32];
    widths = [7, 2];
    circles = [
        { el: null, pos: [0, 0], radius: 100 },
        { el: null, pos: [22, -13], radius: 160 },
        { el: null, pos: [-22, -1], radius: 130 }
    ]

    componentDidMount() {
        const { delay = 0, radius = 100 } = this.props;
        const duration = 0.5;
        const ease = Power4.easeOut;

        for (let i = 0; i < 2; i++) {
            const angle = Math.PI / (this.counts[i] / 2);

            for (let j = 0; j < this.counts[i]; j++) {
                const x = radius + radius * Math.cos(j * angle);
                const y = radius + radius * Math.sin(j * angle);

                const target = this.targets[i][j];

                const start = { x2: x, y2: y };
                const end = { x1: x, y1: y };

                const d = delay + (i >= 1 ? 0.9 : 0);

                TweenLite.to(target, duration, { attr: start, delay: d, ease });
                TweenLite.to(target, duration * 1.9, { attr: end, delay: d, ease });
            }
        }

        for (let i = 0; i < this.circles.length; i++) {
            const { el, radius } = this.circles[i];

            TweenLite.to(el, duration * 2, { attr: { r: radius / 2 }, delay: (i + 1) * 0.2, ease });
            TweenLite.to(el, duration * 2.5, { attr: { "stroke-width": 0 }, delay: (i + 1) * 0.2, ease });
        }
    }

    render() {
        const radius = this.props.radius;
        const size = radius * 2;

        return (
            <svg width={size} height={size}>
                <Fragment>
                    {[...Array(2)].map((_, i) => {
                        this.targets[i] = [];

                        return (
                            <Fragment key={i}>
                                {[...Array(this.counts[i])].map((_, j) =>
                                    <line
                                        x1={radius}
                                        y1={radius}
                                        x2={radius}
                                        y2={radius}
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
                        const x = position[0];
                        const y = position[1];

                        return (
                            <circle
                                style={{ transform: `translate(${x}%, ${y}%)` }}
                                key={i}
                                cx={radius}
                                cy={radius}
                                r={0}
                                strokeWidth="4"
                                stroke="white"
                                fill="none"
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