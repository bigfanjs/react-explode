import React, { Component, Fragment } from "react";
import { TweenLite, Power4, TimelineMax } from "gsap";

class Explosion extends Component {
    lines = [];
    squares = [];
    circles = [];

    squareSize = 25;
    strokeWidth = 0.5;
    dists = [47.4, 35, 42.5];
    circleRadius = 3.5;
    diff = 7.5;

    count = 10;
    size = this.props.size;
    center = this.size / 2;

    componentDidMount() {
        const dists = this.dists.map((dist) => this.size * dist / 100);
        const diff = this.size * this.diff / 100;

        const tlgroup1 = [];
        const tlgroup2 = [];

        const angle = Math.PI / 5;
        const ease = Power4.easeOut;

        const offsetX = Math.cos(Math.PI / 10);
        const offsetY = Math.sin(Math.PI / 10);

        const transformOrigin = "50% 50%";

        for (let i = 0; i < this.lines.length; i++) {
            const timeline = new TimelineMax({ delay: Math.floor(i / this.count) * 0.2 });
            const line = this.lines[i];

            const x = Math.cos(i * angle);
            const y = Math.sin(i * angle);

            const space = (Math.floor(i / this.count) + 1) * diff;

            const linex = this.center + offsetX + (dists[0] - space) * x;
            const liney = this.center + offsetY + (dists[0] - space) * y;

            const start = { x2: linex, y2: liney };
            const end = { x1: linex, y1: liney };

            timeline.to(line, 0.7, { attr: start, ease });
            timeline.to(line, 1.3, { attr: end, ease }, "-=0.7");
            timeline.to(line, 0.5, { opacity: 0 }, "-=0.5");

            tlgroup1.push(timeline);
            if (i < this.count) {
                const timeline = new TimelineMax();

                const square = this.squares[i];
                const circle = this.circles[i];

                // animate square
                timeline.fromTo(square, 1.5, { rotation: i * 35, transformOrigin }, { rotation: "+=360", ease });
                timeline.add("start", "-=1.5");
                timeline.to(square, 1.5, { x: offsetX + dists[1] * x, y: offsetY + dists[1] * y, ease }, "start");
                timeline.from(square, 1.5, { scale: 0, ease }, "start");
                timeline.to(square, 1, { opacity: 0, ease }, "start+=0.8");

                // animate circle
                timeline.to(circle, 1.5, { x: offsetX + dists[2] * x, y: offsetY + dists[2] * y, ease }, "start+=0.3");
                timeline.from(circle, 1.5, { scale: 0, transformOrigin, ease }, "start+=0.3");
                timeline.to(circle, 1.5, { scale: 0, transformOrigin, ease }, "-=0.9");

                tlgroup2.push(timeline);
            }
        }

        const { repeat = 0, repeatDelay = 0, delay = 0, onStart, onComplete, onRepeat } = this.props;
        const tl = new TimelineMax({ repeat, repeatDelay, delay, onStart, onComplete, onRepeat });

        tl.add(tlgroup1, 0);
        tl.add(tlgroup2, 0);
    }

    render() {
        const size = this.size;
        const center = this.center;

        return (
            <svg width={size} height={size} version="1.1">
                <Fragment>
                    {[...Array(this.count * 3)].map((_, i) => {
                        return (
                            <Fragment key={i}>
                                <line
                                    x1={center}
                                    y1={center}
                                    x2={center}
                                    y2={center}
                                    ref={(el) => this.lines[i] = el}
                                    key={i}
                                    strokeLinecap="round"
                                    strokeWidth={Math.ceil(this.size * (this.strokeWidth * 2) / 100)}
                                    stroke="white"
                                />
                                {(i < this.count) &&
                                    <Fragment>
                                        <rect
                                            x={center - this.size * this.squareSize / 100 / 2}
                                            y={center - this.size * this.squareSize / 100 / 2}
                                            width={this.size * this.squareSize / 100}
                                            height={this.size * this.squareSize / 100}
                                            ref={(el) => this.squares[i] = el}
                                            stroke="white"
                                            strokeWidth={Math.ceil(this.size * this.strokeWidth / 100)}
                                            fill="none"
                                        />
                                        <circle
                                            cx={center}
                                            cy={center}
                                            r={this.size * this.circleRadius / 100}
                                            ref={(el) => this.circles[i] = el}
                                            stroke="white"
                                            strokeWidth={Math.ceil(this.size * this.strokeWidth / 100)}
                                            fill="none"
                                        />
                                    </Fragment>
                                }
                            </Fragment>
                        )
                    })}
                </Fragment>
            </svg>
        );
    }
}

export default Explosion;