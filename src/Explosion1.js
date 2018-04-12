import React, { Component, Fragment } from "react";
import { TweenMax, Power4 } from "gsap";

class Explosion extends Component {
    size = this.props.size;
    center = this.size / 2;

    lines = [];
    count = 16;
    radius = 47.5;
    strokeWidth = 0.5;

    durations = [0.6, 1];

    componentDidMount() {
        const ease = Power4.easeOut;
        const angle = Math.PI / 8;
        const radius = this.size * this.radius / 100;
        const durations = this.durations;
        const timeleft = durations[1] - durations[0];
        const { delay = 0, repeat = 0, repeatDelay = 0, onComplete, onStart } = this.props;

        for (let i = 0; i < this.count; i++) {
            const x = this.center + radius * Math.cos(i * angle);
            const y = this.center + radius * Math.sin(i * angle);

            const target = this.lines[i];

            const start = { x2: x, y2: y };
            const end = { x1: x, y1: y };

            TweenMax.to(target, durations[0],
                {
                    attr: start,
                    ease, repeat, delay,
                    repeatDelay: repeatDelay + timeleft
                }
            );
            TweenMax.to(target, durations[1],
                {
                    ease, repeat, delay,
                    attr: end,
                    repeatDelay,
                    onComplete: onComplete && i >= this.count - 1 && onComplete,
                    onStart: onStart && i >= this.count - 1 && onStart
                }
            );
        }
    }

    render() {
        const { size, style, color = "white" } = this.props;
        const center = this.center;
        const strokeWidth = Math.ceil(this.size * this.strokeWidth / 100);

        return (
            <svg width={size} height={size} version="1.1">
                <Fragment>
                    {[...Array(this.count)].map((_, i) => {
                        return (
                            <line
                                x1={center}
                                y1={center}
                                x2={center}
                                y2={center}
                                ref={(el) => this.lines[i] = el}
                                key={i}
                                strokeWidth={strokeWidth}
                                stroke={color}
                            />
                        )
                    })}
                </Fragment>
            </svg>
        );
    }
}

export default Explosion;