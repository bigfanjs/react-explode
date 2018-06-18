import React, { Component } from "react";
import { TimelineMax, Power4 } from "gsap";

class Explosion extends Component {
    state = { size: 400, delay: 0, repeatDelay: 0, repeat: 0 };

    timeline = null;
    radius = 47.5;
    strokeWidth = 1;

    static getDerivedStateFromProps({ size, delay, repeatDelay, repeat }, prevState) {
        if (size !== prevState.size               ||
            delay !== prevState.delay             ||
            repeatDelay !== prevState.repeatDelay ||
            repeat !== prevState.repeat
        ) return { size, delay, repeatDelay, repeat };

        return null;
    }

    componentDidMount() {
        this.explode();
    }

    componentDidUpdate() {
        this.timeline.kill();
        this.explode();
    }

    explode = () => {
        const { size, repeat, repeatDelay, delay } = this.state;
        const { onStart, onRepeat, onComplete } = this.props;
        const ease = Power4.easeOut;
        const radius = size * this.radius / 100;
        const strokeWidth = Math.ceil(size * this.strokeWidth / 100);

        this.timeline = new TimelineMax({
            repeat,
            repeatDelay,
            delay,
            onStart: onStart,
            onComplete: onComplete,
            onRepeat: onRepeat
        });

        this.timeline
            .fromTo(this.circle, 1, { attr: { r: 0 }}, { attr: { r: radius }, ease })
            .fromTo(
                this.circle,
                0.8,
                { attr: { "stroke-width": strokeWidth }, ease },
                { attr: { "stroke-width": 0 }, ease },
                "-=0.5"
            )
            .set(this.circle, { attr: { "stroke-width": strokeWidth } }, "-=1");
    }

    render() {
        const size = this.state.size;
        const center = size / 2;
        const { style, color = "white" } = this.props;
        const strokeWidth = Math.ceil(size * this.strokeWidth / 100);

        return (
            <svg width={size} height={size} style={style}>
                <circle
                    cx={center}
                    cy={center}
                    r={0}
                    strokeWidth={strokeWidth}
                    stroke={color}
                    fill="none"
                    ref={(el) => this.circle = el}
                />
            </svg>
        );
    }
}

export default Explosion;