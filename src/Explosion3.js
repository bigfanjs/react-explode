import React, { Component, Fragment } from "react";
import { TimelineMax, Power4 } from "gsap";

class Explosion extends Component {
    state = { size: 400, delay: 0, repeatDelay: 0, repeat: 0 };
    targets = [[]];

    size = this.props.size;
    center = this.size / 2;

    radiuses = [47.4, 24];

    circleStrokeWidth = 2;
    lineStrokeWidth = 1;

    count = 16;

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
        const { size, delay, repeat, repeatDelay } = this.state;
        const { onStart, onComplete, onRepeat } = this.props;
        const angle = Math.PI / (this.count / 2);
        const ease = Power4.easeOut;
        const radiuses = this.radiuses.map((radius) => size * radius / 100);
        const center = size / 2;
        const timeline = new TimelineMax({
            delay: 0.35,
            onComplete: onComplete && onComplete.bind(null, 2),
            onStart: onStart && onStart.bind(null, 2),
            onRepeat: onRepeat && onRepeat.bind(null, 2)
        });
        const timelines = [];
        const circleStrokeWidth = Math.ceil(size * this.circleStrokeWidth / 100);

        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < this.count; j++) {
                const isLast = j >= this.count - 1;

                const timeline = new TimelineMax({
                    delay: i * 0.5,
                    onComplete: onComplete && isLast && onComplete.bind(null, i),
                    onStart: onStart && isLast && onStart.bind(null, i),
                    onRepeat: onRepeat && isLast && onRepeat.bind(null, i)
                });

                const x = center + radiuses[0] * Math.cos(j * angle);
                const y = center + radiuses[0] * Math.sin(j * angle);

                const target = this.targets[i][j];

                const start = { x2: x, y2: y };
                const end = { x1: x, y1: y };

                timeline
                    .fromTo(
                        target,
                        1,
                        { attr: { x2: center, y2: center } },
                        { attr: start, ease }
                    )
                    .fromTo(
                        target,
                        1,
                        { attr: { x1: center, y1: center } },
                        { attr: end, ease },
                        "-=0.9"
                    );

                timelines.push(timeline);
            }
        }

        timeline
            .fromTo(this.circle, 1, { attr: { r: 0 } }, { attr: { r: radiuses[1] }, ease })
            .fromTo(
                this.circle,
                1,
                { attr: { "stroke-width": circleStrokeWidth } },
                { attr: { "stroke-width": 0 }, ease },
                "-=0.9"
            );

        timelines.push(timeline);

        this.timeline = new TimelineMax({ delay, repeat, repeatDelay });
        this.timeline.add(timelines);
    }

    render() {
        const size = this.state.size;
        const center = size / 2;
        const { style, color = "white" } = this.props;

        const circleStrokeWidth = Math.ceil(size * this.circleStrokeWidth / 100);
        const lineStrokeWidth = Math.ceil(size * this.lineStrokeWidth / 100);

        return (
            <svg style={style} width={size} height={size}>
                <Fragment>
                    {[...Array(2)].map((_, i) => {
                        this.targets[i] = [];

                        return (
                            <Fragment key={i}>
                                {[...Array(this.count)].map((_, j) =>
                                    <line
                                        x1={center}
                                        y1={center}
                                        x2={center}
                                        y2={center}
                                        ref={(el) => this.targets[i][j] = el}
                                        key={j}
                                        strokeWidth={lineStrokeWidth}
                                        stroke={color} />
                                )}
                            </Fragment>
                        );
                    })}
                </Fragment>
                <circle
                    cx={center}
                    cy={center}
                    r={0}
                    strokeWidth={circleStrokeWidth}
                    stroke={color}
                    fill="none"
                    ref={(el) => this.circle = el}
                />
            </svg>
        );
    }
}

export default Explosion;