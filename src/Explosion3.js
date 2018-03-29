import React, { Component, Fragment } from "react";
import { TweenLite, Power4 } from "gsap";

import "./Explosion2.css";

class Explosion extends Component {
    targets = [];

    componentDidMount() {
        const { delay = 0, duration, count, radius } = this.props;
        const angle = Math.PI / (count / 2);
        const ease = Power4.easeOut;
        const origin = radius;

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < count; j++) {
                const x = origin + radius * Math.cos(j * angle);
                const y = origin + radius * Math.sin(j * angle);
                const target = this.targets[i][j];
                const start = { x2: x, y2: y };
                const end = { x1: x, y1: y };
                const d = delay + (i >= 1 ? 0.5 : 0);

                TweenLite.to(target, duration, { attr: start, delay: d, ease });
                TweenLite.to(target, duration * 1.9, { attr: end, delay: d, ease });
            }
        }

        TweenLite.to(this.circle, duration * 2, { attr: { r: radius / 2 }, delay: 0.3, ease });
        TweenLite.to(this.circle, duration * 2, { attr: { "stroke-width": 0 }, delay: duration, ease });
    }

    render() {
        const { radius, style, count, className } = this.props;
        const size = radius * 2;

        return (
            <svg style={style} width={size} height={size}>
                <Fragment>
                    {[...Array(2)].map((_, i) => {
                        this.targets[i] = [];

                        return (
                            <Fragment key={i}>
                                {[...Array(count)].map((_, j) =>
                                    <line
                                        x1={radius}
                                        y1={radius}
                                        x2={radius}
                                        y2={radius}
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
                    cx={radius}
                    cy={radius}
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