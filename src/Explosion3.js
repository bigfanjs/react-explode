import React, { Component, Fragment } from "react";
import { TweenLite, Power4 } from "gsap";

import "./Explosion2.css";

class Explosion extends Component {
    targets = [[]];

    size = this.props.size;
    center = this.size / 2;

    radiuses = [47.4, 24];

    count = 16;

    componentDidMount() {
        const { delay = 0 } = this.props;
        const angle = Math.PI / (this.count / 2);
        const ease = Power4.easeOut;
        const radiuses = this.radiuses.map((radius) => this.size * radius / 100);

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < this.count; j++) {
                const x = this.center + radiuses[0] * Math.cos(j * angle);
                const y = this.center + radiuses[0] * Math.sin(j * angle);

                const target = this.targets[i][j];

                const start = { x2: x, y2: y };
                const end = { x1: x, y1: y };

                const d = delay + (i >= 1 ? 0.5 : 0);

                TweenLite.to(target, 0.8, { attr: start, delay: d, ease });
                TweenLite.to(target, 1.3, { attr: end, delay: d, ease });
            }
        }

        TweenLite.to(this.circle, 0.5, { attr: { r: radiuses[1] }, delay: 0.3, ease });
        TweenLite.to(this.circle, 0.5, { attr: { "stroke-width": 0 }, delay: 0.5, ease });
    }

    render() {
        const size = this.size;
        const center = this.center;

        return (
            <svg style={{ border: "1px solid" }} width={size} height={size}>
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
                <circle cx={200} cy={200} r="2" />
            </svg>
        );
    }
}

export default Explosion;