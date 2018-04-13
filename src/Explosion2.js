import React, { Component, Fragment } from "react";
import { TweenLite, Power4 } from "gsap";

class Explosion extends Component {
    size = this.props.size;
    center = this.size / 2;

    radius = 47.5;
    strokeWidth = 1;

    componentDidMount() {
        const { delay = 0 } = this.props;
        const ease = Power4.easeOut;
        const radius = this.size * this.radius / 100;

        TweenLite.to(this.circle, 1, { attr: { r: radius }, ease });
        TweenLite.to(this.circle, 0.8, { attr: { "stroke-width": 0 }, delay: 0.5, ease });
    }

    render() {
        const size = this.size;
        const center = this.center;
        const { style } = this.props;
        const strokeWidth = Math.ceil(size * this.strokeWidth / 100);

        return (
            <svg width={size} height={size}>
                <circle
                    cx={center}
                    cy={center}
                    r={0}
                    strokeWidth={strokeWidth}
                    stroke="white"
                    fill="none"
                    ref={(el) => this.circle = el}
                />
            </svg>
        );
    }
}

export default Explosion;