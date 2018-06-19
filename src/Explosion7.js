import React, { Component } from "react";
import { TimelineMax, Circ } from "gsap";

class Explosion extends Component {
    state = { size: 400, delay: 0, repeatDelay: 0, repeat: 0 };
    paths = [];
    degree = 90 * Math.PI / 180;
    initExplosion = 4;
    gap = 7;
    strokeWidth = 0.5;
    timeline = null;

    static getDerivedStateFromProps({ size, delay, repeatDelay, repeat }, prevState) {
        if (size !== prevState.size               ||
            delay !== prevState.delay             ||
            repeatDelay !== prevState.repeatDelay ||
            repeat !== prevState.repeat
        ) return { size, delay, repeatDelay, repeat };

        return null;
    }

    shouldComponentUpdate({ size, delay, repeatDelay, repeat }) {
        const state = this.state;

        return (
            size !== state.size               ||
            delay !== state.delay             ||
            repeatDelay !== state.repeatDelay ||
            repeat !== state.repeat
        );
    }

    componentDidMount() {
        this.explode();
    }

    componentDidUpdate() {
        this.timeline.kill();
        this.explode();
    }

    explode = () => {
        const size = this.state.size;
        const center = size / 2;
        const ease = Circ.easeInOut;
        const offset = this.initExplosion * 2;
        const { delay, repeat, repeatDelay, onStart, onComplete, onRepeat } = this.props;
        const timelines = [];
        
        for (let i = 0; i < this.paths.length; i++) {
            const path = this.paths[i];
            const j = Math.floor(((i - offset) / this.initExplosion) + 1);
            const length = center - (i >= offset ? center * (j / 15) : 0);
            const degree = (i < this.initExplosion ? 0 : this.degree / 2) + this.degree * i;
            const xPercent = Math.cos(degree);
            const yPercent = Math.sin(degree);
            const xOffset = (i < this.initExplosion ? this.gap : 0) * Math.cos(this.degree * i);
            const yOffset = (i < this.initExplosion ? this.gap : 0) * Math.sin(this.degree * i);
            const X = center + length * xPercent;
            const Y = center + length * yPercent;
            const timeline = new TimelineMax({ delay: i < this.initExplosion ? 0 : 0.2 });

            timeline.fromTo(
                path,
                0.7,
                { attr: { x2: center, y2: center }, ease },
                { attr: { x2: X, y2: Y }, ease }
            );
            timeline.fromTo(
                path,
                0.7,
                { attr: { x1: center + xOffset, y1: center + yOffset }, ease },
                { attr: { x1: X, y1: Y }, ease },
                "-=0.5"
            );

            if (i >= offset) {
                const transformOrigin = `${xPercent >= 0 ? 0 : 100}% ${yPercent >= 0 ? 0 : 100}%`;

                timeline.fromTo(path, 0.5, { rotation: 0 }, { rotation: 90 * (j / 10), transformOrigin, ease }, "-=0.7");
            }

            timelines.push(timeline);
        }

        this.timeline = new TimelineMax({ delay, repeat, repeatDelay, onStart, onComplete, onRepeat });
        this.timeline.add(timelines);
    }

    render() {
        const size = this.state.size;
        const { color ="white", style } = this.props;
        const center = size / 2;

        return (
            <svg width={size} height={size} style={style}>
                {[...Array(64)].map((_, i) => (
                    <line
                        key={i}
                        x1={center + (i < this.initExplosion ? this.gap : 0) * Math.cos(this.degree * i)}
                        y1={center + (i < this.initExplosion ? this.gap : 0) * Math.sin(this.degree * i)}
                        x2={center}
                        y2={center}
                        stroke={color}
                        strokeWidth={Math.ceil(size * this.strokeWidth / 100)}
                        ref={(el) => this.paths[i] = el}
                    />
                ))}
            </svg>
        );
    }
}

export default Explosion;