import React, { Fragment, Component } from "react";
import { TimelineMax, Power4 } from "gsap";

class Explosion extends Component {
    size = this.props.size;
    center = this.size / 2;

    zigzags = [];
    crosses = [];
    circles = [];

    radiuses = [47.5, 25];

    crossSize = 20;
    zigzagWidth = 10;
    zigzagHight = 20;

    strokeWidth = 1;

    shapes = { zigzag: null, cross: null };

    componentDidMount() {
        const ease = Power4.easeOut;
        const radiuses = this.radiuses.map((radius) => this.size * radius / 100);
        const tlgroup1 = [];
        const tlgroup2 = [];

        for (let i = 0; i < 20; i++) {
            const timeline = new TimelineMax();

            const zigzag = this.zigzags[i];
            const cross = this.crosses[i];

            const cos = Math.cos((Math.PI / 10) * i);
            const sin = Math.sin((Math.PI / 10) * i);

            if (i < 12) {
                const cos = Math.cos((Math.PI / 6) * i);
                const sin = Math.sin((Math.PI / 6) * i);

                timeline.to(zigzag, 2, { x: radiuses[0] * cos, y: radiuses[0] * sin, ease });
                timeline.to(zigzag, 3, { rotation: 360, scale: 0, transformOrigin: "50% 50%", ease }, 0);
            }
            timeline.to(cross, 2, { x: radiuses[1] * cos, y: radiuses[1] * sin, ease }, 0);
            timeline.to(cross, 3, { rotation: 360, scale: 0, transformOrigin: "50% 50%", ease }, 0);

            tlgroup1.push(timeline);
            if (i < 2) {
                const timeline = new TimelineMax({ delay: 0.5 * i });
                const circle = this.circles[i];

                timeline.to(circle, 2.5, { attr: { r: radiuses[0] }, ease });
                timeline.to(circle, 2, { opacity: 0, ease }, "-=2");

                tlgroup2.push(timeline);
            }
        }

        const { repeat = 0, repeatDelay = 0, delay = 0, onStart, onComplete, onRepeat } = this.props;
        const timeline = new TimelineMax({ repeat, repeatDelay, delay, onStart, onComplete, onRepeat });

        timeline.add(tlgroup1, 0);
        timeline.add(tlgroup2, 0);
    }

    componentWillMount() {
        const zigzag = this.drawZigzag();
        const cross = this.drawCross();

        this.shapes.zigzag = zigzag;
        this.shapes.cross = cross;
    }

    drawZigzag = () => {
        const center = this.center;
        const zigzags = 7;
        const width = this.size * this.zigzagWidth / 100;
        const halfWidth = width / 2;
        const height = this.size * this.zigzagHight / 100;
        const halfHeight = height / 2;
        const step = height / (zigzags - 1);

        let data = [];

        for (let i = 0; i < zigzags; i++) {
            i == 0 && data.push({ type: "M", points: [center + halfWidth, center - halfHeight] });
            i > 0 && data.push({ type: "L", points: [center + (i % 2 ? -1 : 1) * halfWidth, center + (i * step) - halfHeight] });
        }

        const zigzag = this.createPathData(data);

        return zigzag;
    }

    drawCross = () => {
        const center = this.center;
        const crossSize = this.size * this.crossSize / 100;
        const half = crossSize / 2;

        const cross = `
            M ${center - half} ${center}
            L ${center + half} ${center}
            M ${center} ${center - half}
            L ${center} ${center + half}
        `;

        return cross;
    }

    createPathData = (data) => (
        data.reduce((string, { type, points }) => {
            return string + `${type}${points[0]} ${points[1]} `;
        }, "")
    )

    render() {
        const size = this.size;
        const { zigzag, cross } = this.shapes;
        const strokeWidth = Math.ceil(this.size * this.strokeWidth / 100);

        return (
            <svg width={size} height={size} version="1.1">
                {[...Array(20)].map((_, i) => (
                    <Fragment key={i}>
                        {i < 12 &&
                            <path
                                d={zigzag}
                                strokeWidth={strokeWidth}
                                stroke="rgb(255, 147, 234)"
                                fill="none"
                                ref={(el) => { this.zigzags[i] = el }}
                            />
                        }
                        <path
                            d={cross}
                            strokeWidth={strokeWidth}
                            stroke="rgb(1, 204, 245)"
                            fill="none"
                            ref={(el) => { this.crosses[i] = el }}
                        />
                        {i < 2 &&
                            <circle
                                cx={this.center}
                                cy={this.center}
                                r="0"
                                fill="none"
                                stroke="rgb(255, 208, 3)"
                                strokeWidth={strokeWidth}
                                ref={(el) => this.circles[i] = el}
                            />
                        }
                    </Fragment>
                ))}
            </svg>
        );
    }
}

export default Explosion;