import React, { Component, Fragment } from "react";
import { TweenMax, TimelineMax, Power4 } from "gsap";

class Explosion extends Component {
    size = this.props.size;
    center = this.size / 2;

    radius = 47.5;
    strokeWidth = 1;

    componentDidMount() {
        const { repeat = 0, repeatDelay = 0, delay = 0, onStart, onRepeat, onComplete } = this.props;
        const ease = Power4.easeOut;
        const radius = this.size * this.radius / 100;
        const strokeWidth = Math.ceil(this.size * this.strokeWidth / 100);

        const timeline = new TimelineMax({
            repeat,
            repeatDelay,
            onStart: onStart,
            onComplete: onComplete,
            onRepeat: onRepeat
        });

        timeline
            .to(this.circle, 1, { attr: { r: radius }, ease })
            .to(this.circle, 0.8, { attr: { "stroke-width": 0 }, ease }, "-=0.5")
            .set(this.circle, { attr: { "stroke-width": strokeWidth } }, "-=1");
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