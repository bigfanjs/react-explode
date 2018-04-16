import React, { Component } from "react";
import { TimelineMax, Circ } from "gsap";

class Explosion extends Component {
    paths = [];
    center = this.props.size / 2;
    degree = 90 * Math.PI / 180;
    initExplosion = 4;
    gap = 7;
    strokeWidth = 0.5;

    componentDidMount() {
        const ease = Circ.easeInOut;
        const offset = this.initExplosion * 2;
        const { delay, repeat, repeatDelay, onStart, onComplete, onRepeat } = this.props;
        const timelines = [];

        for (let i = 0; i < this.paths.length; i++) {
            const path = this.paths[i];
            const j = Math.floor(((i - offset) / this.initExplosion) + 1);
            const length = this.center - (i >= offset ? this.center * (j / 15) : 0);
            const degree = (i < this.initExplosion ? 0 : this.degree / 2) + this.degree * i;
            const xPercent = Math.cos(degree);
            const yPercent = Math.sin(degree);
            const X = this.center + length * xPercent;
            const Y = this.center + length * yPercent;
            const timeline = new TimelineMax({ delay: i < this.initExplosion ? 0 : 0.2 });

            timeline.to(path, 0.7, { attr: { x2: X, y2: Y }, ease });
            timeline.to(path, 0.7, { attr: { x1: X, y1: Y }, ease }, "-=0.5");

            if (i >= offset) {
                const transformOrigin = `${xPercent >= 0 ? 0 : 100}% ${yPercent >= 0 ? 0 : 100}%`;

                timeline.to(path, 0.5, { rotation: 90 * (j / 10), transformOrigin, ease }, "-=0.7");
            }

            timelines.push(timeline);
        }

        const timeline = new TimelineMax({ delay, repeat, repeatDelay, onStart, onComplete, onRepeat });
        timeline.add(timelines);
    }

    render() {
        const size = this.props.size;

        return (
            <svg width={size} height={size}>
                {[...Array(64)].map((_, i) => (
                    <line
                        key={i}
                        x1={this.center + (i < this.initExplosion ? this.gap : 0) * Math.cos(this.degree * i)}
                        y1={this.center + (i < this.initExplosion ? this.gap : 0) * Math.sin(this.degree * i)}
                        x2={this.center}
                        y2={this.center}
                        stroke="white"
                        strokeWidth={Math.ceil(size * this.strokeWidth / 100)}
                        ref={(el) => this.paths[i] = el}
                    />
                ))}
            </svg>
        );
    }
}

export default Explosion;