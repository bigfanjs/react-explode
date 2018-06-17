import React, { Component, Fragment } from "react";
import { TimelineMax, Power4, TweenLite, Power1 } from "gsap";

class Explosion extends Component {
    paths = [];
    circles = [];
    left = 2.5;
    height = 3.75;
    sliced = 10;
    center = this.props.size / 2;
    degree = 360;
    ratio = 25;
    radius = 6.5;

    componentDidMount() {
        const { delay = 0, repeat = 0, repeatDelay = 0, onStart, onComplete, onRepeat } = this.props;
        const tl = new TimelineMax({ delay, repeat, repeatDelay, onStart, onComplete, onRepeat });

        tl.add(this.animateShape(), 0);
        tl.add(this.animateBubbles(), "-=2");
    }

    animateBubbles = () => {
        const size = this.props.size;
        const ease = Power4.easeOut;
        const origins = [
            [300, 50],
            [300, 0],
            [-200, 50]
        ];
        const timelines = [];

        for (let i = 0; i < this.circles.length; i++) {
            const circle = this.circles[i];
            const origin = origins[i];
            const timeline = new TimelineMax({ delay: (i + 1) / 5 });

            timeline.from(circle, 1, { scale: 0, transformOrigin: "center", ease });
            timeline.to(circle, 1.5, { rotation: 120, transformOrigin: `${origin[0]}% ${origin[1]}%`, ease }, "-=0.9");
            timeline.to(circle, 0.5, { opacity: 0 }, "-=1");

            timelines.push(timeline);
        }

        return timelines;
    }

    animateShape = () => {
        const ease = Power4.easeOut;
        const size = this.props.size;
        const left = (size * this.left) / 100;
        const sliced = (size * this.sliced) / 100;
        const timelines = [];

        for (let i = 0; i < this.paths.length; i++) {
            const path = this.paths[i];
            const percent = ((sliced * 100) / (size - (left * 2))) / 2;
            const transformOrigin = `${50 + percent}% 50%`;
            const degree = i % 2 == 0 ? (this.degree + this.ratio) : -(this.degree - this.ratio);
            const rotation = degree * ((i + 1) / 4);

            const timeline = new TimelineMax();

            timeline.from(path, 1.5, { scale: 0, transformOrigin, ease });
            timeline.to(path, 0.9, { rotation, ease }, "-=1.5");
            timeline.to(path, 0.5, { scale: 0, ease });

            timelines.push(timeline);
        }

        return timelines;
    }

    render() {
        const {size, style} = this.props;
        const height = (size * this.height) / 100
        const left = (size * this.left) / 100;
        const sliced = (size * this.sliced) / 100;
        const top = this.center - height;
        const bottom = this.center + height;
        const right = size - left - sliced;
        const shape = `
            M ${left}   ${top}
            L ${this.center} ${this.center}
            L ${right}  ${bottom}
            L ${right}  ${top}
            L ${this.center} ${this.center}
            L ${left}   ${bottom}
        `;
        const strokeWidth = Math.ceil(size * 0.5 / 100);

        return (
            <svg width={size} height={size} style={style}>
                {[...Array(4)].map((_, i) => {
                    return (
                        <Fragment key={i}>
                            <path
                                ref={(el) => this.paths[i] = el}
                                d={shape}
                                stroke="white"
                                strokeWidth={strokeWidth}
                                fill="white"
                            />
                            {i <= 2 &&
                                <circle
                                    cx={this.center}
                                    cy={this.center}
                                    r={size * this.radius / 100}
                                    ref={(el) => this.circles[i] = el}
                                    stroke="white"
                                    strokeWidth={strokeWidth}
                                    fill="none"
                                />
                            }
                        </Fragment>
                    )
                })}
            </svg>
        );
    }
}

export default Explosion;