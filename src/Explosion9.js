import React, { Component, Fragment } from "react";
import { TweenLite, Power4 } from "gsap";

class Explosion extends Component {
    lines = [];
    squares = [];
    circles = [];

    squareSize = 25;
    strokeWidth = 0.5;
    dists = [47.4, 35, 42.5];
    radius = 3.5;
    diff = 7.5;

    count = 10;
    size = this.props.size;
    center = this.size / 2;

    componentDidMount() {
        const dists = this.dists.map((dist) => this.size * dist / 100);
        const diff = this.size * this.diff / 100;

        const angle = Math.PI / 5;
        const ease = Power4.easeOut;

        const offsetX = Math.cos(Math.PI / 10);
        const offsetY = Math.sin(Math.PI / 10);

        const transformOrigin = "50% 50%";

        for (let i = 0; i < this.lines.length; i++) {
            const line = this.lines[i];

            const x = Math.cos(i * angle);
            const y = Math.sin(i * angle);

            const space = (Math.floor(i / this.count) + 1) * diff;

            const linex = this.center + offsetX + (dists[0] - space) * x;
            const liney = this.center + offsetY + (dists[0] - space) * y;

            const start = { x2: linex, y2: liney };
            const end = { x1: linex, y1: liney };

            const delay = Math.floor(i / this.count) * 0.2;

            TweenLite.to(line, 0.7, { attr: start, delay, ease });
            TweenLite.to(line, 1.3, { attr: end, delay, ease });

            if (i < this.count) {
                const square = this.squares[i];
                const circle = this.circles[i];

                // animate square
                TweenLite.fromTo(square, 1, { rotation: i * 35, transformOrigin }, { rotation: "+=360", delay: 0.1, ease });
                TweenLite.to(square, 1, { x: offsetX + dists[1] * x, y: offsetY + dists[1] * y, delay: 0.1, ease });
                TweenLite.from(square, 1, { scale: 0, delay: 0.1, ease });
                TweenLite.to(square, 1, { opacity: 0, delay: 0.6, ease });

                // animate circle
                TweenLite.to(circle, 1, { x: offsetX + dists[2] * x, y: offsetY + dists[2] * y, delay: 0.3, ease });
                TweenLite.from(circle, 1, { scale: 0, transformOrigin, ease });
                TweenLite.to(circle, 1, { scale: 0, transformOrigin, delay: 0.7, ease });
            }
        }
    }

    render() {
        const size = this.size;
        const center = this.center;

        return (
            <svg style={{ border: "1px solid" }} width={size} height={size} version="1.1">
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
                <circle cx={this.center} cy={this.center} r="2" />
            </svg>
        );
    }
}

export default Explosion;