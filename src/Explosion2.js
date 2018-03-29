import React, { Component, Fragment } from "react";
import { TweenLite, Power4 } from "gsap";

import "./Explosion2.css";

class Explosion extends Component {
    targets = [];

    componentDidMount() {
        const { duration, delay = 0, radius } = this.props;
        const ease = Power4.easeOut;

        TweenLite.to(this.circle, duration, { attr: { r: radius }, delay, ease });
        TweenLite.to(this.circle, duration / 2, { attr: { "stroke-width": 0 }, delay: duration / 2, ease });
    }

    render() {
        const { radius, style, width, className="" } = this.props;
        const size = radius * 2 + width;
        const origin = size / 2;

        return (
            <svg className={className} style={style} width={size} height={size}>
                <circle
                    cx={origin}
                    cy={origin}
                    r={0}
                    strokeWidth={width}
                    stroke="white"
                    fill="none"
                    ref={(el) => this.circle = el}
                />
            </svg>
        );
    }
}

export default Explosion;