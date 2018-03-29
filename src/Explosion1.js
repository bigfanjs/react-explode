import React, { Component, Fragment } from "react";
import { TweenLite, Power4 } from "gsap";

class Explosion extends Component {
    targets = [];

    componentDidMount() {
        const { delay, duration, count, radius } = this.props;
        const angle = Math.PI / (count / 2);
        const ease = Power4.easeOut;
        const origin = radius;

        for (let i = 0; i < count; i++) {
            const x = origin + radius * Math.cos(i * angle);
            const y = origin + radius * Math.sin(i * angle);

            const target = this.targets[i];

            const start = { x2: x, y2: y };
            const end = { x1: x, y1: y };

            TweenLite.to(target, duration, { attr: start, delay, ease });
            TweenLite.to(target, duration * 1.9, { attr: end, delay, ease });
        }
    }

    render() {
        const { radius, style, count, className="" } = this.props;
        const size = radius * 2;

        return (
            <svg className={className} style={style} width={size} height={size}>
                <Fragment>
                    {[...Array(count)].map((_, i) => {
                        return (
                            <line
                                x1={radius}
                                y1={radius}
                                x2={radius}
                                y2={radius}
                                ref={(el) => this.targets[i] = el}
                                key={i}
                                strokeWidth="2"
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