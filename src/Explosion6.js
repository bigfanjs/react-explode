import React, { Component, Fragment } from "react";
import { TimelineLite, Power4, TweenLite, Power1 } from "gsap";

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
        this.animateShape();
        this.animateBubbles();
    }

    animateBubbles = () => {
        const size = this.props.size;
        const ease = Power4.easeOut;
        const origins = [
            [300, 50],
            [300, 0],
            [-200, 50]
        ];

        for (let i = 0; i < this.circles.length; i++) {
            const circle = this.circles[i];
            const origin = origins[i];

            TweenLite.from(circle, 1, { scale: 0, transformOrigin: "center", delay: (i + 1) / 10, ease });
            TweenLite.to(circle, 1.5, { rotation: 120, transformOrigin: `${origin[0]}% ${origin[1]}%`, ease, delay: 0.15 * (i + 1) });
            TweenLite.to(circle, 0.2, { "stroke-width": 0, delay: 0.7 + 0.15 * (i + 1) });
        }
    }

    animateShape = () => {
        const ease = Power4.easeOut;
        const size = this.props.size;
        const left = (size * this.left) / 100;
        const sliced = (size * this.sliced) / 100;

        for (let i = 0; i < this.paths.length; i++) {
            const path = this.paths[i];
            const percent = ((sliced * 100) / (size - (left * 2))) / 2;
            const transformOrigin = `${50 + percent}% 50%`;
            const degree = i % 2 == 0 ? (this.degree + this.ratio) : -(this.degree - this.ratio);
            const rotation = degree * ((i + 1) / 4);

            const scaleTimeLine = new TimelineLite();
            const rotationTimeLine = new TimelineLite();

            scaleTimeLine.from(path, 1, { scale: 0, transformOrigin, ease });
            rotationTimeLine
                .to(path, 0.9, { rotation, ease })
                .to(path, 0.5, { scale: 0, ease });
        }
    }

    render() {
        const size = this.props.size;
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

        return (
            <svg width={size} height={size}>
                {[...Array(4)].map((_, i) => {
                    return (
                        <Fragment key={i}>
                            <path
                                ref={(el) => this.paths[i] = el}
                                d={shape}
                                stroke="white"
                                strokeWidth={(size * 0.5) / 100}
                                fill="white"
                            />
                            {i <= 2 &&
                                <circle
                                    cx={this.center}
                                    cy={this.center}
                                    r={size * this.radius / 100}
                                    ref={(el) => this.circles[i] = el}
                                    stroke="white"
                                    strokeWidth={(size * 0.5) / 100}
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