import React, { Component, Fragment } from "react";
import { TweenLite, Power4 } from "gsap";

class Explosion extends Component {
    size = this.props.size;
    center = this.size / 2;

    lines = [];
    count = 16;
    radius = 47.5;
    strokeWidth = 0.5;

    componentDidMount() {
        const ease = Power4.easeOut;
        const radius = this.size * this.radius / 100;

        for (let i = 0; i < this.count; i++) {
            const angle = Math.PI / 8;

            const x = this.center + radius * Math.cos(i * angle);
            const y = this.center + radius * Math.sin(i * angle);

            const target = this.lines[i];

            const start = { x2: x, y2: y };
            const end = { x1: x, y1: y };

            TweenLite.to(target, 0.6, { attr: start, ease });
            TweenLite.to(target, 1, { attr: end, ease });
        }
    }

    render() {
        const { size, style } = this.props;
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
                                stroke="white"
                            />
                        )
                    })}
                </Fragment>
            </svg>
        );
    }
}

export default Explosion;