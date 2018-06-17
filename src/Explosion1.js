import React, { Component, Fragment } from "react";
import { TimelineMax, Power4 } from "gsap";

class Explosion extends Component {
    state = { size: 400, delay: 0, repeatDelay: 0, repeat: 0 };

    size = this.props.size;

    timeline = null;
    lines = [];
    count = 16;
    radius = 47.5;
    strokeWidth = 0.5;

    durations = [0.6, 1];

    static getDerivedStateFromProps({size, delay, repeatDelay, repeat}, prevState) {
        if (size !== prevState.size               ||
            delay !== prevState.delay             ||
            repeatDelay !== prevState.repeatDelay ||
            repeat !== prevState.repeat
        ) return { size, delay, repeatDelay, repeat };

        return null;
    }

    componentDidMount() {
        this.explode();
    }

    componentDidUpdate() {
        this.timeline.kill();
        this.explode();
    }

    explode() {
        const { size, repeat, delay, repeatDelay } = this.state;
        const ease = Power4.easeOut;
        const angle = Math.PI / 8;
        const radius = size * this.radius / 100;
        const durations = this.durations;
        const { onComplete, onStart, onRepeat } = this.props;
        const center = size / 2;
        const timelines = [];

        this.timeline = new TimelineMax({
            repeat, delay, repeatDelay, onComplete, onStart, onRepeat
        });

        for (let i = 0; i < this.count; i++) {
            const x = center + radius * Math.cos(i * angle);
            const y = center + radius * Math.sin(i * angle);
            const target = this.lines[i];
            const start = { x2: x, y2: y };
            const end = { x1: x, y1: y };

            const timeline = new TimelineMax();

            timeline
                .fromTo(
                    target,
                    durations[0],
                    { attr: { x2: center, y2: center } },
                    { attr: start, ease }
                )
                .fromTo(
                    target,
                    durations[1],
                    { attr: {x1: center, y1: center} },
                    { attr: end, ease },
                    `-=${durations[0]}`
                );

            timelines.push(timeline);
        }

        this.timeline.add(timelines);
    }

    render() {
        const size = this.state.size;
        const {color="white", style} = this.props;
        const center = size / 2;
        const strokeWidth = Math.ceil(size * this.strokeWidth / 100);

        return (
            <svg width={size} height={size} style={style}>
                <Fragment>
                    {[...Array(this.count)].map((_, i) =>
                        <line
                            x1={center}
                            y1={center}
                            x2={center}
                            y2={center}
                            ref={(el) => this.lines[i] = el}
                            key={i}
                            strokeWidth={strokeWidth}
                            stroke={color}
                        />
                    )}
                </Fragment>
            </svg>
        );
    }
}

export default Explosion;