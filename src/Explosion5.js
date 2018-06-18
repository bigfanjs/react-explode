import React, { Component } from "react";
import { TimelineMax, Power4 } from "gsap";

class Explosion extends Component {
    constructor(props) {
        super(props);

        this.state = { size: 400, delay: 0, repeatDelay: 0, repeat: 0 };

        this.timeline = null;
        this.squares = [];
        this.strokeWidth = 2.5;
    }

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
        const ease = Power4.easeOut;
        const { size, delay, repeat, repeatDelay } = this.state;
        const { onStart, onComplete, onRepeat } = this.props;
        const center = size / 2;
        const sizes = [
            size * 0.58,
            size * 0.3,
            size * 0.3,
            size * 0.1,
            size * 0.1
        ];
        const halfs = [sizes[0] / 2, sizes[1] / 2, sizes[3] / 2];
        const front = center - halfs[0];
        const back = center + halfs[0];
        const positions = {
            start: [
                { x: center, y: center },
                { x: center, y: back },
                { x: center, y: front },
                { x: front, y: front },
                { x: back, y: back }
            ],
            end: [
                { x: front, y: front },
                { x: center - halfs[1], y: back - halfs[1] },
                { x: center - halfs[1], y: front - halfs[1] },
                { x: front - halfs[2], y: front - halfs[2] },
                { x: back - halfs[2], y: back - halfs[2] }
            ]
        };
        const timelines = [];

        const delays = [0, 0.3, 0.3, 0.5, 0.5];
        const strokeWidth = Math.ceil(size * this.strokeWidth / 100);

        for (let i = 0; i < this.squares.length; i++) {
            const square = this.squares[i];
            const size = sizes[i];
            const start = positions.start[i];
            const end = positions.end[i];
            const delay = delays[i];
            const timeline = new TimelineMax({
                delay,
                onStart: i === 0 && onStart,
                onComplete: i === 0 && onComplete,
                onRepeat: i === 0 && onRepeat
            });

            timeline
                .fromTo(
                    square,
                    1,
                    { attr: { x: start.x, y: start.y, width: 0, height: 0 }, ease },
                    { attr: { x: end.x, y: end.y, width: size, height: size }, ease }
                )
                .fromTo(
                    square,
                    1,
                    { attr: { "stroke-width": strokeWidth }, ease },
                    { attr: { "stroke-width": 0 }, ease },
                    "-=0.9"
                );

                timelines.push(timeline);
        }

        this.timeline = new TimelineMax({ delay, repeat, repeatDelay });
        this.timeline.add(timelines);
    };

    render() {
        const size = this.state.size;
        const style = this.props.style;
        const center = size / 2;
        const sizes = [
            size * 0.58,
            size * 0.3,
            size * 0.3,
            size * 0.1,
            size * 0.1
        ];
        const halfs = [sizes[0] / 2, sizes[1] / 2, sizes[3] / 2];
        const front = center - halfs[0];
        const back = center + halfs[0];
        const strokeWidth = Math.ceil(size * this.strokeWidth / 100);
        const positions = [
            { x: center, y: center },
            { x: center, y: back },
            { x: center, y: front },
            { x: front, y: front },
            { x: back, y: back }
        ];

        return (
            <svg width={size} height={size} style={style}>
                {[...Array(5)].map((_, i) => {
                    const { x, y } = positions[i];

                    return (
                        <rect
                            key={i}
                            x={x}
                            y={y}
                            width={0}
                            height={0}
                            stroke="white"
                            strokeWidth={strokeWidth}
                            fill="none"
                            ref={(el) => this.squares[i] = el}
                            style={{ transform: "rotate(-50deg)", transformOrigin: `${center}px ${center}px` }}
                        />
                    );
                })}
            </svg>
        );
    }
}

export default Explosion;