import React, { Component, Fragment } from "react";
import { TimelineMax, Power4 } from "gsap";

class Explosion extends Component {
    state = { size: 400, delay: 0, repeatDelay: 0, repeat: 0 };
    timeline = null;
    targets = [];
    counts = [7, 32];
    widths = [1.75, 0.5];
    radius = 47.5;
    circleStroke = 1;
    circles = [
        { el: null, pos: [50, 50], radius: 25 },
        { el: null, pos: [68, 46], radius: 40 },
        { el: null, pos: [30, 60], radius: 32.5 }
    ]

    static getDerivedStateFromProps({size, delay, repeatDelay, repeat}, prevState) {
        if (size !== prevState.size               ||
            delay !== prevState.delay             ||
            repeatDelay !== prevState.repeatDelay ||
            repeat !== prevState.repeat) {
                return { size, delay, repeatDelay, repeat };
            }

        return null;
    }

    componentDidMount() {
        this.expldoe();
    }

    componentDidUpdate() {
        this.timeline.kill();
        this.expldoe();
    }

    expldoe = () => {
        const { size, delay, repeat, repeatDelay } = this.state;
        const { onStart, onComplete, onRepeat} = this.props;
        const ease = Power4.easeOut;
        const radius = size * this.radius / 100;
        const center = size / 2;
        const circleStroke = Math.ceil(size * this.circleStroke / 100);

        const timelines = [];

        this.timeline = new TimelineMax({ repeat, repeatDelay, delay });

        for (let i = 0; i < 2; i++) {
            const angle = Math.PI / (this.counts[i] / 2);

            for (let j = 0; j < this.counts[i]; j++) {
                const isLast = j >= this.counts[i] - 1;
                const timeline = new TimelineMax({
                    delay: (i >= 1 ? 0 : 0.15),
                    onComplete: onComplete && isLast && onComplete.bind(null, i),
                    onStart: onStart && isLast && onStart.bind(null, i),
                    onRepeat: onRepeat && isLast && onRepeat.bind(null, i)
                });
                const x = center + radius * Math.cos(j * angle);
                const y = center + radius * Math.sin(j * angle);

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
                        { attr: end, ease }, "-=0.9"
                    );

                timelines.push(timeline);
            }
        }

        for (let i = 0; i < this.circles.length; i++) {
            const circle = this.circles[i];
            const el = circle.el;
            const radius = size * circle.radius / 100;
            const timeline = new TimelineMax({
                delay: (i + 1) * 0.20,
                onComplete: onComplete && onComplete.bind(null, 2 + i),
                onStart: onStart && onStart.bind(null, 2 + i),
                onRepeat: onRepeat && onRepeat.bind(null, 2 + 1)
            });

            timeline
                .fromTo(el, 1, { attr: { r: 0 } }, { attr: { r: radius / 2 }, ease })
                .fromTo(
                    el,
                    1,
                    { attr: { "stroke-width": circleStroke } },
                    { attr: { "stroke-width": 0 }, ease },
                    "-=0.9"
                );

            timelines.push(timeline);
        }

        this.timeline.add(timelines);
    }

    render() {
        const size = this.state.size;
        const center = size / 2;
        const { style, color = "white" } = this.props;
        const circleStroke = Math.ceil(size * this.circleStroke / 100);

        return (
            <svg style={style} width={size} height={size}>
                <Fragment>
                    {[...Array(2)].map((_, i) => {
                        const width = Math.ceil(size * this.widths[i] / 100);
                        this.targets[i] = [];

                        return (
                            <Fragment key={i}>
                                {[...Array(this.counts[i])].map((_, j) =>
                                    <line
                                        x1={center}
                                        y1={center}
                                        x2={center}
                                        y2={center}
                                        ref={(el) => this.targets[i][j] = el}
                                        key={j}
                                        strokeWidth={width}
                                        stroke={color}
                                    />
                                )}
                            </Fragment>
                        );
                    })}
                </Fragment>
                <Fragment>
                    {[...Array(3)].map((_, i) => {
                        const position = this.circles[i].pos;
                        const x = size * position[0] / 100;
                        const y = size * position[1] / 100;

                        return (
                            <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r={0}
                                strokeWidth={circleStroke}
                                fill="none"
                                stroke={color}
                                ref={(el) => this.circles[i].el = el}
                            />
                        );
                    })}
                </Fragment>
            </svg>
        );
    }
}

export default Explosion;